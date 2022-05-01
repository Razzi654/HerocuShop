import express from "express";
import expressValidator from 'express-validator';
import CryptoJS from 'crypto-js'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import nodeCron from "node-cron";
import { User, Section, Subsection, Product, Order } from './schemasDB.js'
import { config } from './configServer.js'
const { Router } = express;
const { check, validationResult } = expressValidator;
export const routes = Router()
export { checkAccessToken }

let sesionData = []
//Чищення копій токенів на сервері кожні 24 години
nodeCron.schedule('* * */23 * *', () => {
    console.log('Чищення сесійних даних кожні 24 години')
    sesionData = []
})
//Генерація токена
function generateAccessToken(id) {
    let roles = '';
    const payload = { id, roles}
    if(id == "626d692ea82e1b44fa86e844"){payload.roles = "ADMIN"}
    else{payload.roles = "USER"}
    return jwt.sign(payload, config.secretKey, { expiresIn: '5m' })
}
//Додавання токена в масив сесій або перевірка його на валідність (CHECK/ADD-method)
function checkAccessToken(accessToken, method) {
    if (method == 'CHECK') {
        if (sesionData.includes(accessToken)) {
            if (jwt.decode(accessToken).exp - Math.trunc(Date.now() / 100_000) > 0) { return true }
            else {
                sesionData.splice(sesionData.indexOf(accessToken), 1)
                return false
            }
        } else return false
    }
    if (method == 'ADD') {
        if (!sesionData.includes(accessToken)) { sesionData.push(accessToken) }
    }
}
//Генерація директорії-/секція/підсекція/продукт/картинка
function generateProductDirectory(sectionName, subsectionName, productName) {
    let directoryUrl;
    if (sectionName && !subsectionName && !productName) {
        directoryUrl = 'frontend/source/sections/' + sectionName
    }
    if (sectionName && subsectionName && !productName) {
        directoryUrl = 'frontend/source/sections/' + sectionName + '/' + subsectionName
    }
    if (sectionName && subsectionName && productName) {
        directoryUrl = 'frontend/source/sections/' + sectionName + '/' + subsectionName+ '/' + productName
    }
    return directoryUrl
}
//Авторизація та реєстрація
routes.post('/HomePage/Auth', [
    check('email', 'Некорректный email').isEmail().normalizeEmail(),
    check('password', 'Некорректная длинна пороля, минимум 6').isLength({ min: 6 })
], async (req, res) => {
    try {
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.send(JSON.stringify("validation"))
            res.status(200)
        }

        function hashPass(pass, key) { return CryptoJS.HmacSHA512(pass, key).toString(CryptoJS.enc.Hex) }

        if (req.body.formMethod == "LOGIN") {
            if (await User.findOne({ userEmail: req.body.email })) {
                let condidate = await User.find({ userEmail: req.body.email })
                if (condidate[0].userPassword == hashPass(req.body.password, config.secretKey) && condidate[0].userEmail == req.body.email) {
                    let token = generateAccessToken(condidate[0]._id)
                    checkAccessToken(token, 'ADD')

                    res.send(JSON.stringify(token))
                } else { res.send(JSON.stringify("log1")) }
            } else { res.send(JSON.stringify("log2")) }
        }
        if (req.body.formMethod == "REGISTRATION") {
            if (!await User.findOne({ userEmail: req.body.email })) {
                let user = new User({ userEmail: req.body.email, userPassword: hashPass(req.body.password, config.secretKey).toString(CryptoJS.enc.Hex), personalData: '', telephoneNumber: '' })
                await user.save()
                res.send(JSON.stringify("reg1"))
                res.status(201)
            } else {
                res.send(JSON.stringify("reg2"))
                res.status(200)
            }
        }

    }

    catch (error) { console.log(error.stack) }

})
//Додавання продукту до бд
let dataFromInsert
let productKey
routes.post('/addProduct', async (req, res) => {
    try {
        if (!productKey) {
            productKey = true
            if (req.body.sectionName && req.body.subsectionName && req.body.productName && req.body.productDescription && req.body.productAmount && req.body.productPrice) {
                dataFromInsert = req.body
            }
        }
        else {
            productKey = false
            if (req.files && dataFromInsert) {
                //--------------------Створення секцій та підсекцій у бд якщо вони не існують
                if (!await Section.findOne({ Name: dataFromInsert.sectionName })) {
                    let section = new Section({ Name: dataFromInsert.sectionName })
                    await section.save()
                    fs.mkdir(generateProductDirectory(section._id), err => {
                        if (err)
                            throw err;
                    })
                }
                if (!await Subsection.findOne({ Name: dataFromInsert.subsectionName })) {
                    let section = await Section.findOne({ Name: dataFromInsert.sectionName })
                    let subsection = new Subsection({ Name: dataFromInsert.subsectionName, sectionName: dataFromInsert.sectionName, sectionID: section._id, Photo: 'PhotoURL' })
                    await subsection.save()
                    fs.mkdir(generateProductDirectory(subsection._id, subsection._id), err => {
                        if (err)
                            throw err;
                    })
                }
                //------------------------------Створення продукту----------------------------
                if (dataFromInsert) {
                    //-------------------Створення папки товару та додавання фотографії---------------
                    let subsection = await Subsection.findOne({ Name: dataFromInsert.subsectionName })
                    let date = new Date().getTime()
                    let product = new Product({
                        secName: subsection.sectionName,
                        secID: subsection.sectionID,
                        subName: subsection.Name,
                        subID: subsection._id,
                        Name: dataFromInsert.productName,
                        Description: dataFromInsert.productDescription,
                        Photo: [],
                        BoughtTimes: 0,
                        Amount: parseInt(dataFromInsert.productAmount),
                        Price: parseInt(dataFromInsert.productPrice),
                        DateOfReceipt: date,
                    })
                    let productURL = generateProductDirectory(subsection._id, subsection._id, product._id)

                    fs.mkdir(productURL, err => {
                        if (err)
                            throw err;
                    })

                    if (Array.isArray(req.files.productImg)) {
                        req.files.productImg.forEach(file => {
                            file.mv(productURL + '/' + file.name);
                            product.Photo.push(productURL + '/' + file.name)
                        })
                    } else if (req.files && req.files.productImg) {
                        product.Photo.push(productURL + '/' + req.files.productImg.name)
                    }

                    
                    await Subsection.updateOne({Name: dataFromInsert.subsectionName},{$set:{Photo:product.Photo[0]}})
                    await product.save()
                }

                dataFromInsert = 0
                res.redirect(`/addProduct/?sessionID=${req.body.token}`)
            }
            else {
                console.log('Фото або дані не отримані')
                res.redirect(`/addProduct/?sessionID=${req.body.token}`)
            }
        }
    }
    catch (error) { console.log(error.stack) }
})
//Запити на отримання даних (Товари головної сторінки/Каталог/"Кошик")
routes.post('/getData', async (req, res) => {
    try {
        switch (req.body.method) {
            case 'GetDataForHomePage': {
                let dataFromServer
                let response = []
                for (let i = 0; i < req.body.sectionsRequirement.length; i++) {
                    let subsectionData = { subsectionsNames: '', products: [] }
                    switch (req.body.sectionsRequirement[i]) {
                        case "NewArrivals": {
                            if (req.body.sectionsName[i] != 'AllProducts') { dataFromServer = await Product.find({ subName: req.body.sectionsName[i] }).sort({ DateOfReceipt: req.body.sort }) }
                            else { dataFromServer = await Product.find().sort({ DateOfReceipt: req.body.sort }) }
                        } break
                        case "MostPopular": {
                            if (req.body.sectionsName[i] != 'AllProducts') { dataFromServer = await Product.find({ subName: req.body.sectionsName[i] }).sort({ Comments: req.body.sort }) }
                            else { dataFromServer = await Product.find().sort({ Comments: req.body.sort }) }
                        } break
                        case "ByPrice": {
                            if (req.body.sectionsName[i] != 'AllProducts') { dataFromServer = await Product.find({ subName: req.body.sectionsName[i] }).sort({ Price: req.body.sort }) }
                            else { dataFromServer = await Product.find().sort({ Price: req.body.sort }) }
                        } break
                        case "ByRating": {
                            if (req.body.sectionsName[i] != 'AllProducts') {
                                dataFromServer = await Product.find({ subName: req.body.sectionsName[i] }).sort({ "Comments.score": req.body.sort })
                            } else { dataFromServer = await Product.find().sort({ "Comments.score": req.body.sort }) }
                        } break
                    }
                    for (let k = 0; k < Math.min(req.body.amountItems, dataFromServer.length); k++) {
                        subsectionData.products[k] = { Name: dataFromServer[k].Name, Price: dataFromServer[k].Price, Amount: dataFromServer[k].Amount, Photo: dataFromServer[k].Photo, productID: dataFromServer[k]._id }
                    }
                    subsectionData.subsectionsNames = req.body.sectionsName[i]
                    response[i] = subsectionData
                } res.send(JSON.stringify(response))
            } break
            case "GetDataForBanners": {
                res.send(JSON.stringify(fs.readdirSync('frontend/common/static/img/banners')))
            } break
            case "GetDataForCatalog": {
                let response = []
                let sections = await Section.find()
                let subsections = await Subsection.find()
                for (let i = 0; i < sections.length; i++) {
                    let secObj = { secId: '', secName: '', subObj: [''] }
                    secObj.secId = sections[i]._id
                    secObj.secName = sections[i].Name
                    let key = 0
                    for (let k = 0; k < subsections.length; k++) {
                        if (sections[i]._id == subsections[k].sectionID) {
                            secObj.subObj[key] = { subId: subsections[k]._id, subName: subsections[k].Name }
                            key += 1
                        }
                    } response[i] = secObj
                } res.send(JSON.stringify(response))
            } break
            case "GetDataForCatalogPage": {
                let answer = []
                let dataDB
                switch (req.body.data.method) {
                    case "Section": {
                        dataDB = await Subsection.find({ sectionID: req.body.data.id })
                        for (let i = 0; i < dataDB.length; i++) {
                            answer[i] = {
                                subID: dataDB[i]._id,
                                Name: dataDB[i].Name,
                                Photo: dataDB[i].Photo,
                            }
                        }
                    } break;
                    case "Subsection": {
                        dataDB = await Product.find({ subID: req.body.data.id })
                        for (let i = 0; i < dataDB.length; i++) {
                            answer[i] = {
                                productID: dataDB[i]._id,
                                Name: dataDB[i].Name,
                                Photo: dataDB[i].Photo[0],
                                Amount: dataDB[i].Amount,
                                Price: dataDB[i].Price,
                                DateOfReceipt: dataDB[i].DateOfReceipt,
                                Score: dataDB[i].Comments.map(c => c.score)
                            }
                        }
                    } break;
                }
                res.send(JSON.stringify(answer))
            } break
            case "GetDataForProductPage": {
                res.send(JSON.stringify(await Product.findOne({ _id: req.body.productID })))
            } break
            case "SearchMenu": {
                let answer = []
                let data = await Product.aggregate([
                    {
                        '$search': {
                            'index': 'ProductsSort',
                            'text': {
                                'query': req.body.searchQuery,
                                'path': {
                                    'wildcard': '*'
                                }
                            }
                        }
                    }
                ])
                if (data) {
                    for (let i = 0; i < data.length; i++) {
                        answer[i] = {
                            productID: data[i]._id,
                            Name: data[i].Name,
                            Photo: data[i].Photo[0],
                            Amount: data[i].Amount,
                            Price: data[i].Price,
                            DateOfReceipt: data[i].DateOfReceipt,
                            Score: data[i].Comments.map(c => c.score)
                        }
                    }
                }
                res.send(JSON.stringify(answer))
            } break
            case "GetDataForProfile": {
                let profileData = {
                    isAuth: checkAccessToken(req.body.token, 'CHECK'),
                    roles: "",
                    personalData: { userID: '', FIO: '', Email: '', Telephone: '', Adress: [] },
                    orderList: [],
                }

                if (checkAccessToken(req.body.token, 'CHECK')) {
                    let data = await User.findOne({ _id: jwt.decode(req.body.token).id })
                    profileData.roles = jwt.decode(req.body.token).roles
                    profileData.personalData = { userID: data._id, FIO: data.personalData, Email: data.userEmail, Telephone: data.telephoneNumber, Adress: data.deliveryAddress }
                    profileData.orderList = await Order.find({ UserID: jwt.decode(req.body.token).id })
                }
                res.send(JSON.stringify(profileData))
            } break
            case "isAuth": {
                let isAuth = false
                let userID = ''
                if (checkAccessToken(req.body.token, 'CHECK')) {
                    isAuth = true
                    userID = jwt.decode(req.body.token).id
                } res.send(JSON.stringify({ userID, isAuth }))
            } break

        }
    }
    catch (error) { console.log(error.stack) }
})
routes.post('/user/request', async (req, res) => {
    try {
        switch (req.body.method) {
            case "Logout": {
                if (checkAccessToken(req.body.token, 'CHECK')) {
                    sesionData.splice(sesionData.indexOf(req.body.token), 1)
                    res.send(JSON.stringify('true'))
                } else {
                    res.send(JSON.stringify('false'))
                }
            } break
            case "SetProfileData": {
                const { token } = req.body;
                if (checkAccessToken(token, 'CHECK')) {
                    const { values } = req.body.data;
                    const decoded = jwt.decode(token);

                    switch (req.body.data.name) {
                        case "profileData":
                            if (await User.find({ userEmail: values.email })) {
                                await User.updateOne(
                                    { _id: decoded.id },
                                    { $set: { personalData: values.username, telephoneNumber: values.phone } }
                                )
                            } else {
                                await User.updateOne(
                                    { _id: decoded.id },
                                    { $set: { personalData: values.username, telephoneNumber: values.phone, userEmail: values.email } }
                                )
                            }

                            res.send(JSON.stringify('true'))
                            break;

                        case "deliveryAddressData":
                            await User.updateOne({ _id: decoded.id }, { $set: { deliveryAddress: values } })
                            break;
                        default:
                            break;
                    }
                } else { res.send(JSON.stringify('false')) }
            } break
            case "PushComment": {
                if (checkAccessToken(req.body.token, 'CHECK')) {
                    let answer = Object.assign({}, req.body.data);
                    delete answer.productId
                    let user = await User.findOne({ _id: jwt.decode(req.body.token).id })
                    answer.username = user.personalData
                    let product = await Product.findOne({ _id: req.body.data.productId })
                    product.Comments.push(answer)
                    await Product.updateOne({ _id: req.body.data.productId }, { $set: { Comments: product.Comments } })
                    res.send(JSON.stringify("CommentAdded"));
                } else { res.send(JSON.stringify("CommentNotAdded")); }
            } break
            case "OrderPayment": {
                if (checkAccessToken(req.body.token, 'CHECK')) {
                    let order = new Order({ UserID: jwt.decode(req.body.token).id, Price: req.body.data.price, Status: "Ordered", DateOfOrder: Date.now(), Products: req.body.data.products })
                    await order.save()
                    res.send(JSON.stringify("OrderSuccess"))
                } else {
                    res.send(JSON.stringify("OrderDecline"))
                }
            } break

            case "4": {

            } break
            //Шаблоны 
        }


    }
    catch (error) { console.log(error.stack) }
})

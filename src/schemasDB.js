import mongoose from "mongoose";
const{Schema, model} = mongoose



//Схема Пользователя
const schemaUser = Schema({
userEmail:{ type: String, required: true, unique: true },
userPassword:{ type: String, required: true, unique: false },
personalData:{ type: String, required: false, unique: false },
telephoneNumber:{ type: String, required: false, unique: false },
deliveryAddress:{ type: Array, required: false, unique: false },
shoppingCart:{ type: Array, required: false, unique: false }
})
const User = model('User',schemaUser)
//Схема Секции
const schemaSection = Schema({
    Name:{ type: String, required: true, unique: true },
    })
const Section = model('Section',schemaSection)
//Схема Подсекции
const schemaSubsection = Schema({
    sectionName:{ type: String, required: true, unique: false },
    sectionID:{ type: String, required: true, unique: false },
    Name:{ type: String, required: true, unique: true },
    Photo:{ type: String, required: true, unique: false },
    })
const Subsection = model('Subsection',schemaSubsection)    
//Схема Товара
const schemaProduct = Schema({
    secName:{ type: String, required: true, unique: false },
    secID:{ type: String, required: true, unique: false },
    subName:{ type: String, required: true, unique: false },
    subID:{ type: String, required: true, unique: false },
    Name:{ type: String, required: true, unique: false },
    Description:{ type: String, required: true, unique: false },
    Photo:{ type: Array, required: true, unique: false },
    Comments:{ type: Array, required: false, unique: false },
    BoughtTimes:{ type: Number, required: false, unique: false },
    Amount:{ type: Number, required: true, unique: false },
    Price:{ type: Number, required: true, unique: false },
    DateOfReceipt:{ type: Number, required: true, unique: false },
    })
const Product = model('Product',schemaProduct)
//Схема Заказа
const schemaOrder = Schema({
    UserID:{ type: String, required: true, unique: false },
    Price:{ type: Number, required: true, unique: false },
    Status:{ type: String, required: true, unique: false },
    DateOfOrder:{ type: Number, required: true, unique: false },
    Products:{ type: Array, required: true, unique: false },
    })
const Order = model('Order',schemaOrder)    

//Экспорт схем
export {schemaUser,User}
export {schemaSection,Section}
export {schemaSubsection,Subsection}
export {schemaProduct,Product}
export {schemaOrder,Order}
import * as utils from "../../common/static/js/utilFunctions.mjs";

(function () {
    /**
     * 
     * @param {any[]} data 
     */
    const buildInsertPage = (data) => {
        data = data || [];
        const insertProduct = () => {
            let sectionNameField = "sectionName";
            let subsectionNameField = "subsectionName";
            let productNameField = "productName";
            let productDescrField = "productDescription";
            let productAmountField = "productAmount";
            let productPriceField = "productPrice";
            let productImgField = "productImg";

            let productImgPath = "/frontend/source/product/";

            const product = {};

            const selectSection = d3.select("#select-section").attr("list", "section-names");
            const selectSubsection = d3.select("#select-subsection").attr("list", "subsection-names");

            const sectionNamesDatalist = d3.select("#section-names");
            const subSectionNamesDatalist = d3.select("#subsection-names");

            sectionNamesDatalist
                .selectAll("option")
                .data(data)
                .join(
                    enter => enter.append("option").attr("value", section => section.secName),
                    update => update.attr("value", section => section.secName),
                    exit => exit.remove()
                );

            selectSection.on("change", () => {
                product[sectionNameField] = selectSection.property("value");
                const { subObj } = data.find(section => section.secName.includes(product[sectionNameField])) || { subObj: [] };

                subSectionNamesDatalist
                    .selectAll("option")
                    .data(subObj)
                    .join(
                        enter => enter.append("option").attr("value", subsection => subsection.subName),
                        update => update.attr("value", subsection => subsection.subName),
                        exit => exit.remove()
                    );
            });

            selectSubsection.on("change", () => {
                product[subsectionNameField] = selectSubsection.property("value");
            });


            const productNameInput = d3.select("#product-name");
            productNameInput.on("input", () => {
                product[productNameField] = productNameInput.property("value");
            });

            const productDescrInput = d3.select("#product-descr");
            productDescrInput.on("input", () => {
                product[productDescrField] = productDescrInput.property("value");
            });

            const productAmountInput = d3.select("#product-amount");
            productAmountInput.on("input", () => {
                product[productAmountField] = productAmountInput.property("value");
            });

            const productPriceInput = d3.select("#product-price");
            productPriceInput.on("input", () => {
                product[productPriceField] = productPriceInput.property("value");
            });


            const productImgInput = d3.select("#product-img");
            productImgInput.on("input", () => {
                console.log(productImgInput.node().files);
                product[productImgField] = productImgPath + productImgInput.node().files[0].name;
            });


            const submitBtn = d3.select("#submit-btn");
            const form = d3.select("#add-product")//.attr("action", `/addProduct/?sessionID=${utils.AccessToken.get()}`);
            submitBtn.on("click", () => {
                if (!form.node().checkValidity()) {
                    return;
                }
                
                if (!product[sectionNameField]) {
                    product[sectionNameField] = data.at(0).secName;
                }

                if (!product[subsectionNameField]) {
                    product[subsectionNameField] = data.at(0).subObj.at(0).subName;
                }

                product["token"] = utils.AccessToken.get();

                const url = '/addProduct'
                const fetchData = {
                    method: 'POST',
                    body: JSON.stringify(product),
                    headers: { "Content-type": "application/json;charset=utf-8" }
                }

                console.log(product);

                fetch(url, fetchData)
                    .then(response => response.json())
                    .then(data => {
                        
                        alert(data);
                        utils.redirect("_this")
                    });
            });
        };



        insertProduct();
    };


    const getDataUrl = "/getData";
    const fetchData = {
        method: 'POST',
        body: JSON.stringify({ method: "GetDataForCatalog" }),
        headers: { "Content-type": "application/json;charset=utf-8" }
    };

    fetch(getDataUrl, fetchData)
        .then(response => response.json())
        .catch(err => console.log(err.stack))
        .then(data => {
            buildInsertPage(data);
        });




}());
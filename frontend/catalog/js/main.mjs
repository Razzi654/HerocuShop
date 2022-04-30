import * as utils from "../../common/static/js/utilFunctions.mjs";

const sortName = {
    DateDesc: "Від нових до старих",
    DateAsc: "Від старих до нових",
    ScoreDesc: "Високі оцінки",
    ScoreAsc: "Низькі оцінки",
};



(function () {
    /**
     * 
     * @param {{subID: string, Photo: string, Name: string}} catalog 
     * @returns {string} image url
     */
    const getCatalogImg = (catalog) => utils.correctImgPath(catalog.Photo);

    /**
     * 
     * @param {{subID: string, Photo: string, Name: string}} catalog 
     * @returns {string} catalog name
     */
    const getCatalogName = (catalog) => catalog.Name;

    /**
     * 
     * @returns {number} header height
     */
    const getHeaderHeight = () => utils.getElementHeight(d3.select("header nav"));


    /**
     * 
     * @param {{sectionName: string, data: {subID: string, Photo: string, Name: string}[]}} sectionData
     */
    const buildCatalogPage = (sectionData) => {
        const { sectionName, data } = sectionData;

        const main = d3.select("main");
        const container = main.select("section div.container");

        d3.select("body").style("background-color", "#f2f6fb");
        d3.select(".carousel").style("margin-top", 0);

        const pageTitle = d3.select("main")
            .append("div")
            .classed("container", true)
            .style("margin-top", `calc(${getHeaderHeight()}px + 1.5rem)`)
            .style("margin-bottom", "1.6rem")
            .style("background-color", "#f2f6fb")
            .lower()
            .append("h1")
            .classed("page-title text-lg-start text-center", true)
            .text(sectionName);

        const row = container
            .append("div")
            .classed("row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3 justify-content-center", true);

        const catalogCards = utils.createSelection(row, data, "div", ".catalog-card").classed("col catalog-card", true);

        const catalogCard = catalogCards
            .append("div")
            .classed("card shadow-sm product-card", true)
            .style("cursor", "pointer")
            .on("mouseover", utils.shadowLg)
            .on("mouseout", utils.shadowSm)
            .on("click", (_, subsection) => {
                utils.getCatalogData("Subsection", subsection.subID)
                    .then(data => {
                        const subsectionData = {
                            data: data,
                            subsectionName: subsection.Name
                        };
                        utils.SubsectionData.set(subsectionData);
                        utils.SectionData.remove();
                        utils.redirect("/catalog");
                    });
            });

        const imgContainer = catalogCard
            .append("div")
            .classed("img-container flex-col-c-m", true)
            .style("height", "14rem")
            .style("padding", "1.5rem 1rem");

        imgContainer
            .append("img")
            .classed("catalog-img", true)
            .attr("src", getCatalogImg)
            .style("max-width", "100%")
            .style("max-height", "100%");

        catalogCard
            .append("div")
            .classed("card-body", true)
            .append("h4")
            .classed("catalog-title card-header text-center flex-c-m", true)
            .style("font-size", "1.2rem")
            .style("height", "4rem")
            .style("vertical-align", "middle")
            .text(getCatalogName);
    };



    const notAvailableColor = "#d50000";
    const availableColor = "#0b7226";
    const lowAmountColor = "#bb6308";
    const lowAmountTrashold = 10;

    /**
     * 
     * @param {{Amount: number, Name: string, Photo: string[], Price: number}} product
     * @returns {boolean}
     */
    const lowAmount = (product) => product.Amount <= lowAmountTrashold && product.Amount >= 1;

    /**
     * 
     * @param {{Amount: number, Name: string, Photo: string[], Price: number}} product
     * @returns {boolean}
     */
    const available = (product) => product.Amount > 0;

    /**
     * 
     * @param {{Amount: number, Name: string, Photo: string[], Price: number}} product
     * @returns {string}
     */
    const getAvailabilityColor = (product) => {
        return lowAmount(product)
            ? lowAmountColor
            : available(product) ? availableColor : notAvailableColor;
    };

    /**
     * 
     * @param {{Amount: number, Name: string, Photo: string[], Price: number}} product
     * @returns {string}
     */
    const getAvailabilityText = (product) => {
        return lowAmount(product)
            ? "Закінчується"
            : available(product) ? "Є в наявності" : "Немає в наявності"
    };

    /**
     * 
     * @param {{Amount: number, Name: string, Photo: string[], Price: number}} product
     * @returns {string}
     */
    const getProductPrice = (product) => utils.spaceSeparatedNum(product.Price) + utils.moneySymbol;

    /**
     * 
     * @param {{Amount: number, Name: string, Photo: string[], Price: number}} product 
     * @returns {string}
     */
    const getProductPhotoSrc = (product) => utils.correctImgPath(product.Photo);

    /**
     * 
     * @param {{Amount: number, Name: string, Photo: string[], Price: number}} product 
     * @returns {string}
     */
    const getProductId = (product) => product.productID;

    /**
     * 
     * @param {{Amount: number, Name: string, Photo: string[], Price: number}} product 
     * @returns {string}
     */
    const getProductName = (product) => product.Name;

    /**
     * 
     * @param {{Amount: number, Name: string, Photo: string[], Price: number}} product 
     * @returns {Date}
     */
    const getProductDate = (product) => new Date(product.DateOfReceipt);

    /**
     * 
     * @param {{Amount: number, Name: string, Photo: string[], Price: number}} product 
     * @returns {number}
     */
    const getProductDateMs = (product) => product.DateOfReceipt;

    /**
     * 
     * @param {{Amount: number, Name: string, Photo: string[], Price: number}} product 
     * @returns {number}
     */
    const getProductScore = (product) => d3.mean(product.Score) || 0;



    /**
     * @param {{subsectionName: string, data: {productID: string, Photo: string, Name: string, Price: number, Amount: number, DateOfReceipt: number, Score: number[]}[]}} subsectionData
     * @returns {void}
     */
    const buildHomePage = (subsectionData) => {
        const { subsectionName, data } = subsectionData;

        data.forEach(product => product.totalScore = getProductScore(product));

        const root = d3.select("main section");
        const body = root.select("div.container");

        d3.select("body").style("background-color", "#f2f6fb");
        d3.select(".carousel").style("margin-top", 0);

        const pageTitle = d3.select("main")
            .append("div")
            .classed("container", true)
            .style("margin-top", `calc(${getHeaderHeight()}px + 1.5rem)`)
            .style("margin-bottom", "1.6rem")
            .style("background-color", "#f2f6fb")
            .lower()
            .append("h1")
            .classed("page-title text-lg-start text-center", true)
            .text(subsectionName);

        const reviewsBtns = body
            .append("div")
            .classed("reviews-btn flex-wrap", true)
            .append("div")
            .classed("reviews-btn-left", true)
            .style("padding-bottom", "3rem");

        const dropdown = reviewsBtns
            .append("div")
            .classed("dropdown-style", true)
            .append("div")
            .classed("dropdown dropdown-white", true);

        const select = dropdown
            .append("select")
            .classed("main-btn primary-btn-border form-select", true)
            .style("width", "fit-content")
            .style("padding-right", "2.2rem");

        select.append("option").attr("value", "DateDesc").text(sortName["DateDesc"]);
        select.append("option").attr("value", "DateAsc").text(sortName["DateAsc"]);
        select.append("option").attr("value", "ScoreDesc").text(sortName["ScoreDesc"]);
        select.append("option").attr("value", "ScoreAsc").text(sortName["ScoreAsc"]);

        const row = body
            .append("div")
            .classed("row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3", true);

        data.sort((a, b) => b.DateOfReceipt - a.DateOfReceipt);

        select.on("change", () => {
            const value = select.property("value");

            utils.clear(row);

            switch (value) {
                case "DateDesc":
                    data.sort((a, b) => b.DateOfReceipt - a.DateOfReceipt);
                    break;
                case "DateAsc":
                    data.sort((a, b) => a.DateOfReceipt - b.DateOfReceipt);
                    break;
                case "ScoreDesc":
                    data.sort((a, b) => b.totalScore - a.totalScore);
                    break;
                case "ScoreAsc":
                    data.sort((a, b) => a.totalScore - b.totalScore);
                    break;
                default:
                    break;
            }

            products();
        });

        const products = () => {
            const column = utils.createSelection(row, data, "div", ".col").classed("col", true);
            const productCard = column
                .append("div")
                .classed("card shadow-sm product-card", true)
                .on("mouseover", utils.shadowLg)
                .on("mouseout", utils.shadowSm);


            const productScore = productCard
                .append("div")
                .classed("product-score flex-l-m", true)
                .style("padding-top", "1.5rem")
                .style("padding-left", "1rem")
                .style("padding-right", "1rem");

            productScore
                .append("i")
                .classed("fa fa-star", true)
                .attr("aria-hidden", true)
                .style("padding-right", "0.2rem")
                .style("color", "#ffa900")
                .style("font-size", "1.2rem");

            productScore
                .append("span")
                .text(product => product.totalScore);


            const productImgDiv = productCard
                .append("div")
                .classed("product-img-container flex-col-c-m", true)
                .style("height", "18rem")
                .style("padding", "1.5rem 1rem");

            productImgDiv
                .append("img")
                .classed("product-img", true)
                .attr("src", getProductPhotoSrc)
                .style("max-width", "100%")
                .style("max-height", "100%");

            productImgDiv.datum(getProductId);

            productCard.append("h4").classed("product-title card-header text-center", true).text(getProductName);

            const productCardBody = productCard.append("div").classed("card-body text-right", true);

            productCardBody
                .append("p")
                .classed("card-text product-price", true)
                .text(getProductPrice);

            const cardBottomBlock = productCardBody.append("div").classed("d-flex justify-content-between align-items-center mt-3 mb-1", true);

            const toastContainer = root.select(".toast-container");
            const toast = root.select(".toast").style("width", "250px");

            cardBottomBlock
                .append("button")
                .classed("main-btn secondary-1-btn flex-row flex-c-m", true)
                .style("font-size", "0.65rem")
                .style("line-height", "1.2")
                .style("height", "2.1rem")
                .style("background-color", "#bd476d")
                .text("Купить")
                .on("click", (_, data) => {
                    const { productID } = data;

                    const shoppingCart = utils.ShoppingCart.get() || [];
                    const productFound = shoppingCart.some(item => item.id === productID);

                    shoppingCart.forEach(item => {
                        if (item.id === productID) {
                            item.itemsAmount++;
                        }
                    });

                    if (!productFound) {
                        shoppingCart.push({
                            id: data.productID,
                            name: data.Name,
                            price: data.Price,
                            img: data.Photo,
                            itemsAmount: 1
                        });
                    }

                    utils.ShoppingCart.set(shoppingCart);

                    const newToast = toastContainer.append(() => toast.clone(true).node()).style("width", "250px");
                    new bootstrap.Toast(newToast.node()).show();
                    setTimeout(() => newToast.remove(), 5000);
                });

            cardBottomBlock.append("span").classed("is-available", true).style("color", getAvailabilityColor).text(getAvailabilityText);

            productImgDiv
                .style("cursor", "pointer")
                .on("click", (_, productID) => {
                    utils.ProductId.set(productID);
                    utils.redirect('/productPage/?id=' + productID, '_blank');
                });

            column.order();
        };

        products();
    };

    document.addEventListener("DOMContentLoaded", () => {
        const sectionData = utils.SectionData.get();
        const subsectionData = utils.SubsectionData.get();

        if (sectionData) {
            buildCatalogPage(sectionData);
        } else if (subsectionData) {
            buildHomePage(subsectionData);
        } else {
            location.assign("/");
        }
    });

})()
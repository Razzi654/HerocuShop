import * as utils from "../../common/static/js/utilFunctions.mjs";

const sortName = {
    MostPopularDesc: "Найпопулярніші",
    MostPopularAsc: "Найнепопулярніші",
    ByPriceDesc: "Від дорогих до дешевих",
    ByPriceAsc: "Від дешевих до дорогих",
    ByRatingDesc: "Високі оцінки",
    ByRatingAsc: "Низькі оцінки",
};

let sectionsRequirement = ["NewArrivals", "ByPrice", "MostPopular", "MostPopular", "MostPopular"];
const sectionsName = ["AllProducts", "Ноутбуки", "Смартфони", "Планшети", "Комп'ютери, сервери"];

(function () {
    const notAvailableColor = "#d50000";
    const availableColor = "#0b7226";
    const lowAmountColor = "#bb6308";
    const productCount = 10;
    const lowAmountTrashold = 10;
    const allproductsReplace = { "AllProducts": "Нові надходження" };

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
    const getProductPhotoSrc = (product) => product.Photo[0] && product.Photo[0].slice(product.Photo[0].indexOf("/"));

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

    const getSectionProducts = (section) => section.products;

    const getSubsectionNames = (section) => section.subsectionsNames.replace("AllProducts", allproductsReplace["AllProducts"]);

    /**
     * @param {Object} data
     * @param {{_id: string, Amount: number, Name: string, Photo: string[], Price: number}[]} data.products
     * @param {string} data.subsectionsNames
     * @returns {void}
     */
    const buildHomePage = (data) => {
        const root = d3.select("main section");
        const body = root.select("div.container");
        const productSections = utils.createSelection(body, data, "div", ".product-section").classed("product-section", true);



        const sectionTitleBlock = productSections.append("div").classed("row row-cols-1 row-cols-sm-2 g-3", true);

        sectionTitleBlock
            .append("h3")
            .classed("section-title", true)
            .text(getSubsectionNames);

            

        const row = productSections
            .append("div")
            .classed("row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3", true);

        const column = utils.createSelection(row, getSectionProducts, "div", ".col").classed("col", true);
        const productCard = column
            .append("div")
            .classed("card shadow-sm product-card", true)
            .on("mouseover", utils.shadowLg)
            .on("mouseout", utils.shadowSm);

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
        const toast = toastContainer.select(".toast").style("width", "250px");

        cardBottomBlock
            .append("button")
            .classed("main-btn secondary-1-btn flex-row flex-c-m", true)
            .style("font-size", "0.65rem")
            .style("line-height", "1.2")
            .style("height", "2.1rem")
            .style("background-color", "#bd476d")
            .text("Придбати")
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
                        img: data.Photo[0],
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
    };

    document.addEventListener("DOMContentLoaded", () => {
        utils.SectionData.remove();
        utils.SubsectionData.remove();
        utils.getHomePageData(sectionsRequirement, sectionsName, -1).then(buildHomePage);
    });

})()
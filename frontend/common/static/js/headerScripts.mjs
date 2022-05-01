import * as utils from "./utilFunctions.mjs";

const pageNames = {
    authWindow: {
        reg: {
            title: "Реєстрація",
            btnText: "Зареєструватись",
            footerTxt1: "Вже є акаунт?",
            footerTxt2: "Увійти"
        },
        login: {
            title: "Вхід",
            btnText: "Увійти",
            footerTxt1: "Створити акаунт?",
            footerTxt2: "Зареєструватись"
        }
    },
    shoppingCart: {
        empty: "Кошик порожній",
        emptyText: "Перегляньте пропозиції на головній сторінці, скористайтесь каталогом або пошуком",
        shippingCost: "Вартість доставки",
        totalPrice: "Загальна сума",
        totalPayable: "Усього до оплати",
        columns: ["Продукт", "Кількість", "Ціна", "Дія"],
        continueShoppingBtn: "Продовжити покупки",
        payNowBtn: "Оплата",
    },
    search: {
        result: "Результати пошуку"
    },
    aboutUs: {
        title: "Про нас"
    },
    contacts: {
        title: "Контактні дані",
        address: "Київ, Україна",
        email: "hello@company.com",
        phone: "+3561 3455 2344",
        contactUsTitle: "Зв'яжіться з нами з будь-якого питання",
        contactUsSubtitle: "Ми на зв'язку 24/7",
    },
    alerts: {
        reg1: () => alert("Ви успішно зареєстровані"),
        reg2: () => alert("Користувач із таким E-mail вже зареєстрований"),
        login1: () => alert("Невірний E-mail або пароль"),
        login2: () => alert("Користувач з таким E-mail не зареєстрований у системі"),
        validationFail: () => alert("Невірно введені дані, перевірте правильність заповнення полів"),
        orderSuccess: () => alert("Успіх! Замовлення успішно додано"),
        orderDecline: () => alert("Помилка! При додаванні замовлення сталася помилка. Можливо, ви не авторизовані"),
    }
};

const shippingCost = 100;

const shownWindow = {
    authWindow: false,
    catalogFatMenu: false,
    shoppingCart: false,
    contacts: false,
    aboutUs: false,
};

let currentWindow = "login";

document.addEventListener("DOMContentLoaded", function (event) {
    const header = d3.select("header");

    
    const accountItem = header.select(".account-item");
    const popupContainer = header.select(".popup-container");
    const authWindow = popupContainer.select(".auth-window");
    const signUpLink = authWindow.select(".sign-up-link");
    
    const contactsLink = header.select(".navbar-nav .nav-link.contacts");
    const aboutUs = header.select(".navbar-nav .nav-link.about-us");
    const aboutInfoWindow = popupContainer.select(".about-info-window");

    const fatMenuBtn = header.select(".fat-menu-btn");
    const fatMenuWindow = header.select(".fat-menu-window");

    const shoppingCartItem = header.select(".shopping-cart-item");
    const shoppingCartWindow = header.select(".shopping-cart-window");

    const formBtn = authWindow.select(".container-login100-form-btn .login100-form-btn");
    const formTitle = authWindow.select(".login100-form .login100-form-title");
    const footerText1 = authWindow.select(".footer-text .txt1");
    const footerText2 = authWindow.select(".footer-text .txt2");

    const fillAuthWindow = (title, btnText, footerTxt1, footerTxt2) => {
        formTitle.text(title);
        formBtn.text(btnText);
        footerText1.text(footerTxt1);
        footerText2.text(footerTxt2);
    };

    const toggleCatalogWindow = () => {
        popupContainer.classed("d-none", shownWindow.catalogFatMenu);
        fatMenuWindow.classed("d-none", shownWindow.catalogFatMenu);

        shownWindow.catalogFatMenu = !shownWindow.catalogFatMenu;

        if (!shownWindow.catalogFatMenu) {
            utils.clear(fatMenuWindow.select(".fat-menu"));
        }
    };

    const toggleAuthWindow = () => {
        popupContainer.classed("d-none", shownWindow.authWindow);
        authWindow.classed("d-none", shownWindow.authWindow);
        shownWindow.authWindow = !shownWindow.authWindow;
    };

    const toggleShoppingCartWindow = () => {
        popupContainer.classed("d-none", shownWindow.shoppingCart);
        shoppingCartWindow.classed("d-none", shownWindow.shoppingCart);
        shownWindow.shoppingCart = !shownWindow.shoppingCart;
    };

    const toggleContactsWindow = () => {
        popupContainer.classed("d-none", shownWindow.contacts);
        aboutInfoWindow.classed("d-none", shownWindow.contacts);
        shownWindow.contacts = !shownWindow.contacts;
    };

    const toggleAboutUsWindow = () => {
        popupContainer.classed("d-none", shownWindow.aboutUs);
        aboutInfoWindow.classed("d-none", shownWindow.contacts);
        shownWindow.aboutUs = !shownWindow.aboutUs;
    };


    const closeShoppingCartWindow = () => {
        shownWindow.shoppingCart = false;
        shoppingCartWindow.classed("d-none", true);
    };

    const closeAuthWindow = () => {
        shownWindow.authWindow = false;
        authWindow.classed("d-none", true);
    };

    const closeCatalogWindow = () => {
        shownWindow.catalogFatMenu = false;
        fatMenuWindow.classed("d-none", true);
        utils.clear(fatMenuWindow.select(".fat-menu"));
    };
    
    const closeContactsWindow = () => {
        shownWindow.contacts = false;
        aboutInfoWindow.classed("d-none", true);
        utils.clear(aboutInfoWindow.select(".wrap-menu"));
        const limiter = aboutInfoWindow.select(".limiter");
        const wrapMenu = limiter.select(".wrap-menu");
        limiter.style("height", null);
        wrapMenu.style("min-height", null);
    };

    const closeAboutUsWindow = () => {
        shownWindow.aboutUs = false;
        aboutInfoWindow.classed("d-none", true);
        utils.clear(aboutInfoWindow.select(".wrap-menu"));
        const limiter = aboutInfoWindow.select(".limiter");
        const wrapMenu = limiter.select(".wrap-menu");
        limiter.style("height", null);
        wrapMenu.style("min-height", null);
    };




    const carouselItems = () => {
        utils.getBannerData().then(bannerData => {
            const carouselId = "#myCarousel";

            const main = d3.select("main");
            const carousel = main.select(carouselId);

            const carouselIndicators = carousel.select(".carousel-indicators");
            const carouselInner = carousel.select(".carousel-inner");

            const createCarouselItem = (parent) => {
                const carouselItem = parent.classed("carousel-item", true).classed("active", (_, i) => i === 0);

                const addBackgroundSvg = () => {
                    const svg = carouselItem
                        .append("svg")
                        .classed("bd-placeholder-img", true)
                        .attr("xmlns", "http://www.w3.org/2000/svg")
                        .attr("preserveAspectRatio", "xMidYMid slice")
                        .attr("aria-hidden", true)
                        .attr("focusable", false)
                        .attr("width", "100%")
                        .attr("height", "100%");

                    svg
                        .append("rect")
                        .attr("width", "100%")
                        .attr("height", "100%")
                        .attr("fill", "#3d8ec6");
                };

                const addBanner = () => {
                    const banner = carouselItem
                        .append("div")
                        .classed("banner", true);

                    const img = banner
                        .append("img")
                        .attr("src", banner => `/common/static/img/banners/${banner}`)
                        .attr("loading", "lazy")
                        .style("height", "100%");

                    banner.style("height", `${utils.getElementWidth(carouselItem) / 3}px`);
                    carouselItem.style("height", `${utils.getElementWidth(carouselItem) / 3}px`);
                };

                const addCarouselIndicator = () => {
                    const data = new Array(carouselItem.size()).fill(null);

                    utils.createSelection(carouselIndicators, data, "button")
                        .classed("active", (_, i) => i === 0)
                        .attr("type", "button")
                        .attr("data-bs-target", carouselId)
                        .attr("data-bs-slide-to", (_, i) => i)
                        .attr("aria-label", (_, i) => `Slide ${i + 1}`);
                };

                addBackgroundSvg();
                addBanner();
                addCarouselIndicator();
            };

            utils.createSelection(carouselInner, bannerData, "div").call(createCarouselItem);
        });
    };



    /**
     * 
     * @param {d3.Selection<HTMLDivElement, any, HTMLElement, any>} fatMenuWindow
     * @param {{secId: string, secName: string, subObj: {subId: string, subName: string}[]}[]} data
     */
    const fillCatalogWindow = (fatMenuWindow, data) => {
        const container = fatMenuWindow.select(".fat-menu")
            .style("height", "100%")
            .append("div")
            .classed("row row-cols-1 row-cols-md-2", true)
            .style("height", "100%");

        const sectionsContainer = container
            .append("div")
            .classed("sections-container col border-end border-2", true)
            .style("height", "100%");

        const subsectionsContainer = container
            .append("div")
            .classed("sections-container col", true)
            .style("height", "100%");

        const sectionName = (section) => section.secName;
        const subsections = (section) => section.subObj;
        const subsectionName = (subsection) => subsection.subName;

        const sections = utils.createSelection(sectionsContainer, data, "div")
            .classed("section pos-relative border-bottom border-1", true)
            .style("cursor", "pointer")
            .style("padding", "1rem 0.5rem")
            .style("transition", "all .3s ease")
            .text(sectionName);

        sections.on("click", function (event, section) {
            
            utils.getCatalogData("Section", section.secId)
                .then(data => {
                    const sectionData = {
                        data: data,
                        sectionName: section.secName
                    };
                    utils.SectionData.set(sectionData);
                    utils.SubsectionData.remove();
                    utils.redirect("/catalog");
                });
        });

        sections.on("mouseenter", function (event, section) {
            sections.style("background-color", "#fff");
            d3.select(this).style("background-color", "ivory");

            utils.createSelection(subsectionsContainer, subsections(section), "div")
                .classed("subsection pos-relative border-bottom border-1", true)
                .style("cursor", "pointer")
                .style("padding", "1rem 0.5rem")
                .text(subsectionName)
                .on("click", function (event, subsection) {
                    utils.getCatalogData("Subsection", subsection.subId)
                        .then(data => {
                            const subsectionData = {
                                data: data,
                                subsectionName: subsection.subName
                            };
                            utils.SubsectionData.set(subsectionData);
                            utils.SectionData.remove();
                            utils.redirect("/catalog");
                        });
                });
        });
    };

    /**
     * 
     * @param {d3.Selection<HTMLDivElement, any, HTMLElement, any>} shoppingCartWindow
     * @param {{id: string, img, string, itemsAmount: number, name: string, price: number}[]} products
     */
    const fillShoppingCartWindow = (shoppingCartWindow, products) => {
        const root = shoppingCartWindow.select(".limiter .wrap-menu");
        utils.clear(root);

        const shoppingCart = root
            .append("div")
            .classed("shopping-cart table-responsive", true)
            .style("height", "90%")
            .style("overflow", "hidden")
            .style("min-width", "51rem");

        const emptyCart = () => {
            shoppingCart.classed("flex-col flex-sa-m", true);

            const emptyImg = () => {
                const imgFile = "/common/static/img/empty-shopping-cart.png";
                const picture = shoppingCart.append("picture");

                const source = (minWidth, scale) => {
                    picture
                        .append("source")
                        .attr("media", `(min-width: ${minWidth}px)`)
                        .attr("srcset", `${imgFile} ${scale}x`)
                        .attr("type", "image/png")
                };

                source(960, 1.75);
                source(768, 2);
                source(480, 2.25);
                source(200, 3);

                picture.append("img").attr("src", imgFile).attr("alt", pageNames.shoppingCart.empty);
            };

            const emptyText = () => {
                const textContainer = shoppingCart.append("div");
                const text = (text, small = false) => {
                    textContainer
                        .append("div")
                        .classed(small ? "empty-cart-text-small text-center text-muted" : "empty-cart-text text-center", true)
                        .text(text);
                };

                text(pageNames.shoppingCart.empty);
                text(pageNames.shoppingCart.emptyText, true);
            };

            emptyImg();
            emptyText();
        };

        const filledCart = () => {
            shoppingCart.classed("flex-col flex-sa-m", false);

            const getTotalPrice = (data) => data.reduce(
                (totalPrice, curProduct) => curProduct && curProduct.price
                    ? totalPrice + curProduct.price * curProduct.itemsAmount
                    : 0,
                0
            );

            const getTotalPriceObj = (totalPrice) => [
                { value: pageNames.shoppingCart.shippingCost, price: shippingCost },
                { value: pageNames.shoppingCart.totalPrice, price: totalPrice },
                { value: pageNames.shoppingCart.totalPayable, price: totalPrice + shippingCost },
            ];

            const price = (product) => utils.spaceSeparatedNum(product.price) + utils.moneySymbol;

            let totalPrice = getTotalPrice(products);

            const table = () => {
                const tableWrapper = shoppingCart
                    .append("div")
                    .classed("mb-1", true)
                    .style("max-height", "100%")
                    .style("overflow-y", "auto");

                const checkoutTable = tableWrapper.append("div").classed("checkout-table", true);
                const table = checkoutTable.append("table").classed("table", true);

                const { columns } = pageNames.shoppingCart;

                const thead = () => {
                    const thead = table.append("thead");
                    utils.createSelection(thead, columns, "th").attr("class", col => col.toLowerCase()).text(col => col);
                };

                const tbody = () => {
                    const tbody = table.append("tbody");
                    const tr = utils.createSelection(tbody, products, "tr");

                    columns.map((column) => {
                        const td = tr.append("td");

                        td.append((product) => {
                            switch (column) {
                                case columns.at(0):
                                    const productCart = d3.create("div").classed("product-cart row d-flex", true);
                                    const productThumb = productCart.append("div").classed("product-thumb col-2 flex-c", true);
                                    productThumb.append("img").attr("src", utils.correctImgPath(product.img));

                                    const productContent = productCart.append("div").classed("product-content col-auto media-body flex-col-l-m", true);
                                    productContent.append("h5").classed("title", true).append("a").attr("href", "#").text(product.name);
                                    productContent.append("span").text(product.id);

                                    return productCart.node();
                                case columns.at(1):
                                    const productQuantity = d3.create("div").classed("product-quantity d-inline-flex", true);
                                    const sub = productQuantity.append("button").classed("sub", true).attr("id", "sub");
                                    sub.append("i").classed("fa fa-minus", true).attr("aria-hidden", "true");

                                    const quantity = productQuantity.append("input").attr("type", "text").attr("value", product.itemsAmount);

                                    const add = productQuantity.append("button").classed("add", true).attr("id", "add");
                                    add.append("i").classed("fa fa-plus", true).attr("aria-hidden", "true");

                                    sub.on("click", () => {
                                        const value = parseInt(quantity.property("value"));
                                        if (value > 1) {
                                            quantity.property("value", value - 1);

                                            totalPrice -= product.price;

                                            checkoutCouponTotal(getTotalPriceObj(totalPrice));
                                        }
                                    });
                                    add.on("click", () => {
                                        const value = parseInt(quantity.property("value"));
                                        if (value < 999) {
                                            quantity.property("value", value + 1);

                                            totalPrice += product.price;

                                            checkoutCouponTotal(getTotalPriceObj(totalPrice));
                                        }
                                    });

                                    return productQuantity.node();
                                case columns.at(2):
                                    return d3.create("p").classed("price", true).text(price(product)).node();
                                case columns.at(3):
                                    const action = d3.create("ul").classed("action", true);

                                    const deleteAction = action
                                        .append("li")
                                        .style("cursor", "pointer")
                                        .append("a")
                                        .classed("delete", true);

                                    deleteAction
                                        .append("i")
                                        .classed("fa fa-trash", true)
                                        .attr("aria-hidden", "true");

                                    deleteAction.on("click", () => {
                                        products.splice(products.findIndex(v => v.id === product.id), 1);
                                        utils.ShoppingCart.set(products);
                                        fillShoppingCartWindow(shoppingCartWindow, products);
                                    });

                                    return action.node();
                                default:
                                    return;
                            }
                        });
                    });
                };

                thead();
                tbody();
            };


            /**
             * 
             * @param {{value: string; price: any;}[]} total 
             */
            const checkoutCouponTotal = (total) => {
                shoppingCart.select(".checkout-coupon-total").remove();

                const couponTotal = shoppingCart
                    .insert("div", "div.checkout-btn")
                    .classed("row row-cols-1 row-cols-md-2", true)
                    .classed("checkout-coupon-total checkout-coupon-total-2 justify-content-between", true);

                const checkoutCoupon = () => {
                    const checkoutCoupon = couponTotal.append("div").classed("checkout-coupon col", true);
                };

                const checkoutTotal = () => {
                    const checkoutTotal = couponTotal
                        .append("div")
                        .classed("checkout-total col-auto", true);

                    const singleTotal = utils.createSelection(checkoutTotal, total, "div").classed("single-total row row-cols-1 row-cols-md-2", true);


                    singleTotal.append("div").classed("value col-auto", true).text(total => total.value);
                    singleTotal.append("div").classed("price col-auto", true).text(price);


                    checkoutTotal.select("div.single-total:last-child").classed("total-payable", true);
                };

                checkoutCoupon();
                checkoutTotal();
            };

            const checkoutButtons = () => {
                const checkoutBtn = shoppingCart
                    .append("div")
                    .classed("checkout-btn d-flex justify-content-between", true);

                const singleBtn = (text, primary = false) => {
                    checkoutBtn
                        .append("div")
                        .classed("single-btn", true)
                        .append("a")
                        .classed(primary ? "main-btn primary-btn" : "main-btn primary-btn-border", true)
                        .text(text)
                        .on("click", () => {
                            if (primary) {
                                utils.sendOrderData({price: totalPrice + shippingCost, products: products})
                                    .then(response => {
                                        switch (response) {
                                            case "OrderSuccess":
                                                pageNames.alerts.orderSuccess();
                                                break;
                                            case "OrderDecline":
                                                pageNames.alerts.orderDecline();
                                                break;
                                            default:
                                                break;
                                        }
                                    });
                                utils.ShoppingCart.remove();
                            } else {
                                toggleShoppingCartWindow();
                                utils.clear(root);
                            }
                        });
                };

                singleBtn(pageNames.shoppingCart.continueShoppingBtn);
                singleBtn(pageNames.shoppingCart.payNowBtn, true);
            };

            table();
            checkoutCouponTotal(getTotalPriceObj(totalPrice));
            checkoutButtons();
        };

        if (products && products.length) {
            filledCart();
        } else {
            emptyCart();
        }

    };


    const search = () => {
        const searchArea = header.select(".search-area");
        const searchInput = searchArea.select("input");
        const searchBtn = searchArea.select("button");

        searchArea.on("submit", (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            const searchQuery = utils.escapeString(searchInput.property("value"));
            utils.getSearchData(searchQuery).then(data => {
                const subsectionData = {
                    data: data,
                    subsectionName: `${pageNames.search.result}: "${searchQuery}"`
                };
                utils.SubsectionData.set(subsectionData);
                utils.SectionData.remove();
                utils.redirect("/catalog");
            });
        })
    };


    const fillInfoWindow = () => {
        const limiter = aboutInfoWindow.select(".limiter");
        const wrapMenu = limiter.select(".wrap-menu");

        const title = wrapMenu.append("h2").classed("mb-5", true);
        const contactStyle = wrapMenu.append("div");
        
        if (shownWindow.aboutUs) {
            limiter.style("height", "60vh");
            wrapMenu.style("min-height", "24rem");
            contactStyle
                .classed("contact-style-2 about-us row row-cols-1 row-cols-sm-2", true)
                // .style("max-height", "21rem")
                .style("overflow-y", "auto");

            title.text(pageNames.aboutUs.title);

            contactStyle.append("div")
                .classed("lh-lg mb-3 col-12 col-sm-6", true)
                .text(`
                Ми є одним з лідерів ринку з продажу цифрової та побутової техніки. Наша мета змінити життя людей, 
                зробивши простим доступ до величезної кількості якісних та недорогих товарів, надаючи найкращий сервіс.
            `);
            contactStyle.append("div")
                .classed("lh-lg col-12 col-sm-6", true)
                .text(`
                Наші клієнти – у центрі всього, що ми робимо, довіра – головне. Ми будуємо довгострокові відносини,
                У всьому, чим займаємось, прагнемо бути експертами, відкриті для пропозицій та покращень.
            `);

            contactStyle.append("div")
                .classed("lh-lg mb-1 col-12", true)
                .style("margin-top", "0.5rem")
                .text(`
                Навколо нас люди, з якими приємно працювати та досягати амбітних цілей, ми намагаємось наймати однодумців.
            `);
            

        } else if (shownWindow.contacts) {
            title.text(pageNames.contacts.title);
            limiter.style("height", "60vh");
            wrapMenu.style("min-height", "34rem");
            contactStyle.classed("contacts contact-style-2", true);
            
            const contactInfo = contactStyle.append("ul").classed("contact-info", true);

            const singleContactInfo = (classed, text) => {
                const singleContactInfo = contactInfo.append("li").append("div").classed("single-contact-info d-flex", true);
                const icon = singleContactInfo.append("div").classed("contact-info-icon", true);
                icon.append("i").classed(`fa ${classed}`, true).attr("aria-hidden", true);

                const content = singleContactInfo.append("div").classed("contact-info-content media-body", true);
                content.append("p").text(text);
            };

            singleContactInfo("fa-map-marker", pageNames.contacts.address);
            singleContactInfo("fa-envelope", pageNames.contacts.email);
            singleContactInfo("fa-phone", pageNames.contacts.phone);

            contactStyle.append("h5").classed("title", true).text(pageNames.contacts.contactUsTitle);
            contactStyle.append("p").classed("paragraph-small sub-title", true).text(pageNames.contacts.contactUsSubtitle);
        };
    };

    const onClickItems = () => {
        accountItem.on("click", (event) => {
            event.preventDefault();
            utils.isUserAuthorized().then(data => {
                if (data.isAuth) {
                    utils.redirect('/userPage/?sessionID=' + utils.AccessToken.get());
                } else {
                    toggleAuthWindow();
                }
                closeShoppingCartWindow();
                closeCatalogWindow();
                closeContactsWindow();
                closeAboutUsWindow();
            })
        });
    
        signUpLink.on("click", (event) => {
            event.preventDefault();
    
            currentWindow = currentWindow === "registration" ? "login" : "registration";
    
            const { login, reg } = pageNames.authWindow;
    
            if (currentWindow === "login") {
                fillAuthWindow(login.title, login.btnText, login.footerTxt1, login.footerTxt2);
            } else if (currentWindow === "registration") {
                fillAuthWindow(reg.title, reg.btnText, reg.footerTxt1, reg.footerTxt2);
            }
        });
    
        formBtn.on("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
    
            const email = authWindow.select("#userEmail").node().value;
            const password = authWindow.select("#userPassword").node().value;

            const { validationFail, reg1, reg2, login1, login2 } = pageNames.alerts;
    
            if (utils.correctEmail(email) && utils.correctPassword(password)) {
                const formMethod = currentWindow.toUpperCase();
                const requestData = { email, password, formMethod };
                utils.authenticate(requestData).then(data => {
                    switch (data) {
                        case 'validation':
                            validationFail();
                            break;
                        case 'reg1':
                            reg1();
                            break;
                        case 'reg2':
                            reg2();
                            break;
                        case 'log1':
                            login1();
                            break;
                        case 'log2':
                            login2();
                            break;
                        default:
                            utils.AccessToken.set(data);
                            utils.redirect("_this");
                            break;
                    }
                });
            } else {
                validationFail();
            }
        });

        fatMenuBtn.on("click", (event) => {
            event.preventDefault();
    
            if (!shownWindow.catalogFatMenu) {
                utils.getCatalogMenuData().then(data => {
                    fillCatalogWindow(fatMenuWindow, data);
                });
            }
    
            closeShoppingCartWindow();
            closeAuthWindow();
            closeContactsWindow();
            closeAboutUsWindow();
            toggleCatalogWindow();
        });
        
        shoppingCartItem.on("click", (event) => {
            event.preventDefault();
            
            fillShoppingCartWindow(shoppingCartWindow, utils.ShoppingCart.get());
    
            closeAuthWindow();
            closeCatalogWindow();
            closeContactsWindow();
            closeAboutUsWindow();
            toggleShoppingCartWindow();
    
        });

        aboutUs.on("click", (event) => {
            event.preventDefault();
            
            closeAuthWindow();
            closeCatalogWindow();
            closeContactsWindow();
            closeShoppingCartWindow();

            toggleAboutUsWindow();
            fillInfoWindow();
        });

        contactsLink.on("click", (event) => {
            event.preventDefault();

            
            closeAuthWindow();
            closeCatalogWindow();
            closeShoppingCartWindow();
            closeAboutUsWindow();

            toggleContactsWindow();
            fillInfoWindow();
        });
    };

    search();
    onClickItems();
    carouselItems();
});

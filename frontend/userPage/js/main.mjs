import * as utils from "../../common/static/js/utilFunctions.mjs";

const pageNames = {
    pageTitle: {
        orderList: "Список замовлень",
        profile: "Особисті дані",
        addProduct: "Додати продукт",
        signOut: "Вихід",
    },
    sections: {
        profile: {
            title: "Особисті дані користувача",
            field1: {
                displayName: "ПІБ користувача",
                placeholder: "Введіть ПІБ користувача"
            },
            field2: {
                displayName: "E-mail",
                placeholder: "Введіть електронну пошту"
            },
            field3: {
                displayName: "Телефон",
                placeholder: "Введіть номер телефону"
            },
        },
        deliveryAddress: {
            title: "Адреса доставки",
            addressDisplayName: "Адреса №",
            addressPlaceholder: {
                country: "Країна",
                region: "Регіон/Область",
                city: "Місто",
                street: "Вулиця",
                houseNum: "Номер будинку",
                entranceNum: "Номер під'їзду",
                apartmentNum: "Номер квартири"
            },
            emptyAddress: {
                country: "",
                region: "",
                city: "",
                street: "",
                houseNum: "",
                entranceNum: "",
                apartmentNum: ""
            }
        },
    }
};

(function () {
    'use strict'

    const pageHeader = d3.select("header nav");
    const pageWrapper = d3.select("div.wrapper");
    const aside = d3.select("aside");
    const contentSection = d3.select("#content");
    const root = contentSection.append("div").classed("p-5", true);
    const pageTitle = root.append("h1").classed("page-title", true);

    /**
     * 
     * @param {{id: number, productCount: number, dateTime: number, totalPrice: number, status: string}} orderListData 
     * @returns {d3.Selection<HTMLDivElement, any, HTMLElement, any>}
     */
    const orderListSection = (orderListData) => {
        const orderListSection = root.append("div").classed("order-list-section d-none", true);

        const productCountTitle = (order) => {
            const count = order.Products.length;
            let title = `${count}`;
            if (count === 1) {
                title += " продукт";
            } else if (count > 1 && count < 5) {
                title += " продукти";
            } else {
                title += " продуктів";
            }
            return title;
        };

        const progressClass = (order) => `single-progress-bar-horizontal ${order.Status.toLowerCase()}`;
        const orderId = (order) => `Замовлення №${order._id}`;
        const dateTitle = (order) => new Date(order.DateOfOrder).toLocaleString();
        const orderStatus = (order) => order.Status;
        const orderPrice = (order) => `${order.Price}${utils.moneySymbol}`;

        const block = orderListSection
            .append("div")
            .classed("row justify-content-center", true)
            .append("div")
            .classed("col-lg-9", true);

        const singleOrder = utils.createSelection(block, orderListData, "div", ".single-order")
            .classed("single-order", true)
            .style("background-color", "#fffaf1");
            
        const title = singleOrder.append("h4").classed("order-id", true).text(orderId);

        const orderMeta = singleOrder.append("ul").classed("order-meta", true);
        orderMeta.append("li").append("a").classed("product", true).text(productCountTitle);
        orderMeta.append("li").append("a").classed("date", true).text(dateTitle);

        const progress = singleOrder.append("div").attr("class", progressClass);
        progress.append("div").classed("progress-text", true).append("p").text(orderStatus);
        progress.append("div").classed("progress-bar-inner", true).append("div").classed("bar-inner", true).append("div").classed("progress-horizontal", true);

        singleOrder.append("span").classed("order-price", true).text(orderPrice);

        return orderListSection;
    };

    /**
     * 
     * @param {{Adress: any[], Email: string, FIO: string, Telephone: string, userID: string}} personalData
     * @returns {d3.Selection<HTMLDivElement, any, HTMLElement, any>} profile section
     */
    const profileSection = (personalData) => {
        const profileSection = root.append("div").classed("profile profile-section d-none", true); // TODO: d-none

        const buildForm = (form, fields, buildInput, titleButtonTypes, profileTitleText) => {
            let editable = false;
            const formBody = form.append("div").classed("profile-body", true);

            const toggleEditability = (inputs, submitRow, canEdit) => {
                editable = canEdit;

                inputs.classed("form-control-plaintext", !editable).classed("form-control", editable);
                inputs.property("readOnly", !editable);

                submitRow.classed("d-none", !editable);
            };

            const profileTitle = () => {
                const profileTitle = formBody.append("div").classed("profile-title flex-row flex-sb-m", true);
                const title = profileTitle.append("h5").classed("title", true).text(profileTitleText);

                const buttonsGroup = profileTitle.append("div").classed("buttons-group flex-sb", true).style("width", "fit-content");

                titleButtonTypes.forEach(type => {
                    switch (type) {
                        case "edit":
                            const editBtn = buttonsGroup
                                .append("button")
                                .classed("edit-button", true)
                                .style("font-size", "1.2rem");

                            const editIcon = editBtn.append("i").classed("fa fa-pencil-square-o", true).attr("aria-hidden", true);

                            editBtn.on("click", () => {
                                const profileDetails = formBody.select(".profile-details");
                                const inputs = profileDetails.selectAll("input");
                                const submitRow = profileDetails.select(".submit-row");
                                toggleEditability(inputs, submitRow, !editable);
                            });
                            break;
                        case "add":
                            const addBtn = buttonsGroup
                                .append("button")
                                .classed("add-button", true)
                                .style("font-size", "1.2rem")
                                .style("padding-left", "1rem");

                            const addIcon = addBtn.append("i").classed("fa fa-plus-square-o", true).attr("aria-hidden", true);

                            addBtn.on("click", () => {
                                form.remove();

                                const { emptyAddress } = pageNames.sections.deliveryAddress;

                                personalData.Adress.push(emptyAddress);

                                deliveryAddressForm();

                                const profileDetails = profileSection.select(".delivery-address-form .profile-details");
                                const inputs = profileDetails.selectAll("input");
                                const submitRow = profileDetails.select(".submit-row");

                                toggleEditability(inputs, submitRow, true);
                            });
                            break;
                        default:
                            break;
                    }
                });
            };

            const profileDetails = () => {
                const profileDetails = formBody.append("form").classed("profile-details needs-validation", true);
                profileDetails.on("submit", (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    profileDetails.classed("was-validated", false);
                });
                profileDetails.node().noValidate = true;

                const fetchData = {
                    name: form.attr("name"),
                    values: null
                };

                const detailsItem = () => {
                    const detailsItem = utils.createSelection(profileDetails, fields, "div", ":not(.submit-row)")
                        .classed("single-details-item", true);
                        
                    const row = detailsItem
                        .append("div")
                        .classed("row flex-row flex-l-m", true);

                    const detailsTitle = () => {
                        const detailsTitle = row.append("div").classed("details-title col-12 col-lg-2", true).style("max-width", "10rem");
                        detailsTitle.append("h6").classed("title", true).text(field => `${field.displayName}:`);
                    };

                    const detailsContent = () => {
                        const detailsContent = row.append("div").classed("col-12 col-lg-10 details-content media-body has-validation", true);
                        buildInput(detailsContent)
                    };

                    detailsTitle();
                    detailsContent();
                };

                const submitRow = () => {
                    const submitRow = profileDetails.append("div").classed("row submit-row single-details-item d-none", true);
                    const col = submitRow.append("div").classed("col flex-row justify-content-end", true);

                    const submitBtn = col
                        .append("button").classed("main-btn primary-btn", true)
                        .style("height", "93%")
                        .on("click", (event) => {
                            event.preventDefault();
                            event.stopPropagation();

                            profileDetails.classed("was-validated", false);

                            const singleDataItems = profileDetails.selectAll(".single-details-item:not(.submit-row)");
                            const inputs = singleDataItems.selectAll("input");
                            switch (fetchData.name) {
                                case "profileData":
                                    fetchData.values = {};
                                    inputs.nodes().forEach((v, i) => {
                                        fetchData.values[v.name] = utils.escapeString(v.value.trim());
                                    });
                                    break;
                                case "deliveryAddressData":
                                    fetchData.values = [];
                                    singleDataItems.each((_, i, items) => {
                                        const inputs = d3.select(items[i]).selectAll("input");

                                        fetchData.values.push(
                                            inputs.nodes().reduce((prevVal, curVal) => {
                                                prevVal[curVal.name] = curVal.value;
                                                return prevVal;
                                            }, {})
                                        );
                                    });
                                    break;
                                default:
                                    break;
                            }

                            toggleEditability(singleDataItems.selectAll("input"), submitRow, false);
                            utils.sendProfileData(fetchData).then(data => console.log(data));
                        });

                    submitBtn.append("i").classed("bx bx-check", true);
                };

                detailsItem();
                submitRow();
            };

            profileTitle();
            profileDetails();
        };


        const profileForm = () => {
            const { field1, field2, field3, title } = pageNames.sections.profile;
            const { FIO, Email, Telephone } = personalData;

            const fieldObj = (name, displayName, type, text, placeholder) => {
                return { name, displayName, type, value: { text, placeholder } };
            };

            const fields = [
                fieldObj("username", field1.displayName, "text", FIO, field1.placeholder),
                fieldObj("email", field2.displayName, "email", Email, field2.placeholder),
                fieldObj("phone", field3.displayName, "tel", Telephone, field3.placeholder)
            ];

            const form = profileSection.append("div")
                .classed("profile-form", true)
                .attr("name", "profileData");

            const buildInput = (detailsContent) => {
                const input = detailsContent
                    .append("input")
                    .classed("form-control-plaintext", true)
                    .attr("name", field => field.name)
                    .attr("type", field => field.type)
                    .attr("placeholder", field => field.value.placeholder)
                    .attr("value", field => field.value.text)
                    .style("font-size", "1rem");

                input.node().required = true;
                input.node().readOnly = true;

                return input;
            };

            buildForm(form, fields, buildInput, ["edit"], title);
        };


        const deliveryAddressForm = () => {
            const { addressPlaceholder, addressDisplayName, title } = pageNames.sections.deliveryAddress;

            const fields = personalData.Adress.map((address, i) => {
                return {
                    name: "address",
                    displayName: addressDisplayName + (i + 1),
                    value: Object.keys(address).map(key => {
                        return { name: key, text: address[key], placeholder: addressPlaceholder[key] };
                    })
                };
            });

            const form = profileSection.append("div")
                .classed("delivery-address-form m-t-20", true)
                .attr("name", "deliveryAddressData");

            const buildInput = (detailsContent) => {
                const row = detailsContent.append("div").classed("row", true);

                const col = utils.createSelection(row, field => field.value, "div", ".col-auto")
                    .classed("col-auto col-xl-3 m-t-7", true);

                const label = col
                    .append("label")
                    // .classed("bg-dark bg-gradient w-100", true)
                    .attr("for", value => value.name)
                    .style("font-size", "0.8rem")
                    // .style("color", "#fff")
                    // .style("padding", "3px 6px")
                    .text(value => value.placeholder);

                const input = col
                    .append("input")
                    .classed("form-control-plaintext", true)
                    .attr("id", value => value.name)
                    .attr("name", value => value.name)
                    .attr("type", "text")
                    .attr("placeholder", value => value.placeholder)
                    .attr("value", value => value.text)
                    .style("font-size", "1.05rem");


                input.each((_, i, g) => {
                    g[i].required = true;
                    g[i].readOnly = true;
                });

                detailsContent.nodes().forEach(node => {
                    const detailsItem = d3.select(node.parentElement.parentElement);
                    detailsItem
                        .append("div")
                        .classed("col-lg-1 delete-action", true)
                        .style("cursor", "pointer")
                        .style("max-width", "3rem")
                        .style("font-size", "1.3rem")
                        .append("i")
                        .classed("fa fa-trash", true)
                        .attr("aria-hidden", "true")
                        .style("color", "red")
                        .on("click", () => {
                            detailsItem.remove();

                            const fetchData = {
                                name: form.attr("name"),
                                values: []
                            };

                            form
                                .selectAll(".single-details-item:not(.submit-row)")
                                .each((_, i, items) => {
                                    const inputs = d3.select(items[i]).selectAll("input").nodes();

                                    fetchData.values.push(
                                        inputs.reduce((prevVal, curVal) => {
                                            prevVal[curVal.name] = curVal.value;
                                            return prevVal;
                                        }, {})
                                    );
                                });

                            utils.sendProfileData(fetchData).then(data => console.log(data));
                        });
                });


                return input;
            };

            buildForm(form, fields, buildInput, ["edit", "add"], title);
        };

        profileForm();
        deliveryAddressForm();

        return profileSection;
    };

    /**
     * 
     * @param {{d3.Selection<HTMLDivElement, any, HTMLElement, any>}[]} sections 
     */
    const sidebar = (sections, roles) => {
        const { orderList, profile, addProduct } = pageNames.pageTitle;

        const getUsername = () => root.select("input[name=username]").property("value");
        const getEmail = () => root.select("input[name=email]").property("value");

        const logoText = () => {
            const username = getUsername();

            if (username && username.length) {
                const [, name, patronymic] = username.toUpperCase().split(" ");
                return `${name[0]}${patronymic[0]}`;
            }

            const email = getEmail();
            const [user, domain] = email.toUpperCase().split("@");
            return `${user[0]}${domain[0]}`;
        };

        const sidebar = aside
            .append("nav")
            .classed("pos-fixed", true)
            .attr("id", "sidebar");

        const logo = () => {
            const sidebarHeader = sidebar.append("h2").classed("logo", true);
            sidebarHeader.append("span").text(logoText());
            sidebarHeader.append("div").classed("subtitle", true).text(getEmail());
        };

        const toggleView = (name = "order-list") => {
            sections.forEach(section => section.classed("d-none", true));

            switch (name) {
                case "order-list":
                    pageTitle.text(orderList);
                    root.select("div.order-list-section").classed("d-none", false);
                    break;
                case "profile-data":
                    pageTitle.text(profile);
                    root.select("div.profile-section").classed("d-none", false);
                    break;
                case "sign-out":
                    utils.logout();
                    utils.redirect("/");
                    break;
                default:
                    break;
            }
        };

        const navLinks = () => {
            const { orderList, profile, signOut } = pageNames.pageTitle;

            const linkContainer = sidebar
                .append("div")
                .classed("flex-col-sb", true)
                .style("height", `calc(100vh - ${utils.getElementHeight(pageHeader) + utils.getElementHeight(sidebar.select(".logo"))}px)`);

            const ul = linkContainer.append("ul").classed("list-unstyled components mb-3 mt-3", true);

            const navLink = (type, name, text, isActive) => {
                const li = ul
                    .append("li")
                    .classed("active", isActive)
                    .attr("name", name)
                    .style("cursor", "pointer")
                    .style("position", "relative");

                const a = li.append("a");

                a.append("div").classed(`bx bx-${type} nav-icon`, true);
                a.append("span").classed("nav-link-name", true).text(text);

                a.on("click", (event) => {
                    event.preventDefault();
                    ul.selectAll("li").classed("active", false);
                    li.classed("active", true);
                    li.select("a::before").style("height", `${utils.getElementHeight(a)}px`);

                    toggleView(name);
                });

                return li;
            };

            const logoutLink = (name) => {
                const ul = linkContainer.append("ul").classed("list-unstyled components mb-1 mt-3", true);

                const li = ul
                    .append("li")
                    .attr("name", name)
                    .style("cursor", "pointer");

                const a = li.append("a");

                a.append("div").classed(`bx bx-log-out-circle nav-icon`, true);
                a.append("span").classed("nav-link-name", true).text(signOut);

                a.on("click", (event) => {
                    event.preventDefault();
                    toggleView(name);
                });

                return li;
            };

            navLink("spreadsheet", "order-list", orderList, true);
            navLink("user", "profile-data", profile, false);

            if (roles === "ADMIN") {
                navLink("list-plus", "add-product", addProduct, false)
                .on("click", () => {
                    utils.redirect('/addProduct/?sessionID=' + utils.AccessToken.get());
                });
            }
            
            logoutLink("sign-out");
        };

        const sidebarCollapse = () => {
            const btn = contentSection
                .append("button")
                .classed("btn btn-dark border-0 m-1 pos-fixed", true)
                .attr("type", "button")
                .attr("id", "sidebarCollapse")
                .on('click', () => {
                    const isActive = sidebar.classed("sidebar-active");
                    sidebar.classed("sidebar-active", !isActive);
                    aside.classed("sidebar-active", !isActive);
                });

            btn.lower();
            btn.append("i").classed("fa fa-bars", true).attr("aria-hidden", true);
            btn.append("span").classed("sr-only", true).text("Toggle Menu");
        };

        logo();
        sidebarCollapse();
        navLinks();
        toggleView();
    };


    document.addEventListener("DOMContentLoaded", function () {
        utils.getProfileData().then(data => {
            if (data.isAuth) {
                pageWrapper.style("margin-top", `${utils.getElementHeight(pageHeader)}px`)

                const orderList = orderListSection(data.orderList);
                const profile = profileSection(data.personalData);

                sidebar([orderList, profile], data.roles);
            } else {
                location.assign('/');
            }
        });
    });
})();

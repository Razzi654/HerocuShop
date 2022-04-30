export const moneySymbol = "₴";



// ================= Some utils

/**
 * 
 * @param {d3.Selection<any, any, any, any>} parent 
 * @param {any[]} data 
 * @param {keyof ElementTagNameMap} appendElement 
 * @param {string} selectorAddition 
 * @returns {d3.Selection<ElementTagNameMap, any, any, any>}
 */
export const createSelection = (parent, data, appendElement, selectorAddition) => {
    const selection = parent
        .selectAll(appendElement + (selectorAddition || ""))
        .data(data);

    selection
        .exit()
        .remove();

    const selectionMerged = selection
        .enter()
        .append(appendElement)
        .merge(selection);

    return selectionMerged;
};

/**
 * 
 * @param {d3.Selection<any, any, any, any>} selection
 */
export const clear = (selection) => {
    if (selection) {
        selection.selectAll("*").remove();
    }
};

/**
 * 
 * @param {d3.Selection<any, any, any, any>} element
 * @returns {[number, number]}
 */
export const getElementSizes = (element) => {
    const rect = element.node().getBoundingClientRect();
    return element.empty() ? [0, 0] : [rect.width, rect.height];
};

/**
 * 
 * @param {d3.Selection<any, any, any, any>} element
 * @returns {number}
 */
export const getElementWidth = (element) => {
    return element.empty() ? 0 : element.node().getBoundingClientRect().width;
};

/**
 * 
 * @param {d3.Selection<any, any, any, any>} element
 * @returns {number}
 */
export const getElementHeight = (element) => {
    return element.empty() ? 0 : element.node().getBoundingClientRect().height;
};

/**
 * 
 * @param {number} num 
 * @param {string} separator 
 * @returns {string}
 */
export const separateNumbers = (num, separator) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

/**
 * 
 * @param {number} num 
 * @returns {string}
 */
export const spaceSeparatedNum = (num) => {
    return separateNumbers(num, " ");
}

/**
 * 
 * @param {string | "_this" } url
 * @param {"_blank" | "_self"} urlTarget 
 */
export const redirect = (url, urlTarget = "_self") => {
    if (window.location.href.includes(url) || url === "_this") {
        window.location.reload();
    } else {
        window.open(url, urlTarget);
    }
}

/**
 * 
 * @param {Object} first 
 * @param {Object} second 
 * @returns {boolean}
 */
export const areObjectsSame = (first, second) => {
    const firstValues = Object.values(first);
    const secondValues = Object.values(second);

    if (firstValues.length !== secondValues.length) {
        return false;
    }

    return firstValues
        .map((value, i) => value === secondValues.at(i))
        .reduce((prev, cur) => prev && cur, true);
};


export function insertToArray(array, insertData, atIndex) {
    return array
        .slice(0, atIndex)
        .concat(insertData)
        .concat(array.slice(atIndex));
}



/**
 * 
 * @param {d3.Selection<any>} parent 
 * @param {boolean} shadowSm 
 * @param {boolean} shadowLg 
 * @returns {d3.Selection<any>}
 */
const enableShadow = (parent, shadowSm, shadowLg) => parent.classed("shadow-sm", shadowSm).classed("shadow-lg", shadowLg);
export const shadowLg = function () { d3.select(this).call(enableShadow, false, true); }
export const shadowSm = function () { d3.select(this).call(enableShadow, true, false); }













// ================= Hooks

/**
 * 
 * @returns {Promise<any>} parsed data from JSON
 */
export const getHomePageData = async (sectionsRequirement, sectionsName, sort) => {
    const url = "/getData";
    const getData = {
        method: "GetDataForHomePage",
        sectionsRequirement: sectionsRequirement,
        sectionsName: sectionsName,
        sort: sort,
        amountItems: 10
    };
    const fetchData = {
        method: "POST",
        body: JSON.stringify(getData),
        headers: { "Content-type": "application/json;charset=utf-8" }
    };
    return fetch(url, fetchData)
        .then(response => response.json())
        .catch(err => console.log(err.stack));
}

/**
 * 
 * @returns {Promise<any>} parsed data from JSON
 */
export const getBannerData = async () => {
    const url = "/getData";
    const fetchData = {
        method: "POST",
        body: JSON.stringify({method: "GetDataForBanners"}),
        headers: { "Content-type": "application/json;charset=utf-8" }
    };
    return fetch(url, fetchData)
        .then(response => response.json())
        .catch(err => console.log(err.stack));
}

/**
 * 
 * @returns {Promise<any>} parsed data from JSON
 */
export const isUserAuthorized = async () => {
    const url = '/getData';
    const fetchData = {
        method: 'POST',
        body: JSON.stringify({ method: "isAuth", token: AccessToken.get() }),
        headers: { "Content-type": "application/json;charset=utf-8" }
    };
    return fetch(url, fetchData)
        .then(response => response.json())
        .catch(err => console.log(err.stack));
}

/**
 * 
 * @returns {Promise<any>} parsed data from JSON
 */
export const getProfileData = async () => {
    const url = '/getData';
    const fetchData = {
        method: 'POST',
        body: JSON.stringify({ method: "GetDataForProfile", token: AccessToken.get() }),
        headers: { "Content-type": "application/json;charset=utf-8" }
    };
    return fetch(url, fetchData)
        .then(response => response.json())
        .catch(err => console.log(err.stack));
}

/**
 * 
 * @returns {Promise<any>} parsed data from JSON
 */
export const getCatalogMenuData = async () => {
    const url = '/getData';
    const fetchData = {
        method: 'POST',
        body: JSON.stringify({ method: "GetDataForCatalog" }),
        headers: { "Content-type": "application/json;charset=utf-8" }
    };
    return fetch(url, fetchData)
        .then(response => response.json())
        .catch(err => console.log(err.stack));
}

/**
 * 
 * @returns {Promise<any>} parsed data from JSON
 */
export const authenticate = async (requestData) => {
    const url = '/HomePage/Auth';
    const fetchData = {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: { "Content-type": "application/json;charset=utf-8" }
    };
    return fetch(url, fetchData)
        .then(response => response.json())
        .catch(err => console.log(err.stack));
}

/**
 * 
 * @returns {Promise<any>} parsed data from JSON
 */
export const logout = async () => {
    const url = '/user/request';
    const fetchData = {
        method: 'POST',
        body: JSON.stringify({ method: "Logout", token: AccessToken.get() }),
        headers: { "Content-type": "application/json;charset=utf-8" }
    };
    return fetch(url, fetchData)
        .then(response => response.json())
        .catch(err => console.log(err.stack));
}

/**
 * 
 * @returns {Promise<any>} parsed data from JSON
 */
export const sendProfileData = async (data) => {
    const url = '/user/request';
    const fetchData = {
        method: 'POST',
        body: JSON.stringify({ method: "SetProfileData", token: AccessToken.get(), data: data }),
        headers: { "Content-type": "application/json;charset=utf-8" }
    };
    return fetch(url, fetchData)
        .then(response => response.json())
        .catch(err => console.log(err.stack));
};

/**
 * 
 * @returns {Promise<any>}
 */
export const sendCommentData = async (data) => {
    const url = '/user/request';
    const fetchData = {
        method: 'POST',
        body: JSON.stringify({ method: "PushComment", token: AccessToken.get(), data: data }),
        headers: { "Content-type": "application/json;charset=utf-8" }
    };
    return fetch(url, fetchData)
        .then(response => response.json())
        .catch(err => console.log(err.stack));
};

export const getProductData = async () => {
    const getDataUrl = "/getData";
    const fetchData = {
        method: "POST",
        body: JSON.stringify({ method: 'GetDataForProductPage', productID: ProductId.get() }),
        headers: { "Content-type": "application/json;charset=utf-8" }
    };
    return fetch(getDataUrl, fetchData)
        .then(response => response.json())
        .catch(err => console.log(err.stack));
};

/**
 * 
 * @param {string} method 
 * @param {string} id 
 * @returns 
 */
export const getCatalogData = async (method, id) => {
    const getDataUrl = "/getData";
    const fetchData = {
        method: "POST",
        body: JSON.stringify({ method: 'GetDataForCatalogPage', data: { method, id } }),
        headers: { "Content-type": "application/json;charset=utf-8" }
    };
    return fetch(getDataUrl, fetchData)
        .then(response => response.json())
        .catch(err => console.log(err.stack));
};

/**
 * 
 * @param {string} searchQuery 
 * @returns 
 */
export const getSearchData = async (searchQuery) => {
    const getDataUrl = "/getData";
    const fetchData = {
        method: "POST",
        body: JSON.stringify({ method: 'SearchMenu', searchQuery}),
        headers: { "Content-type": "application/json;charset=utf-8" }
    };
    return fetch(getDataUrl, fetchData)
        .then(response => response.json())
        .catch(err => console.log(err.stack));
};

/**
 * 
 * @returns {Promise<any>} parsed data from JSON
 */
 export const sendOrderData = async (data) => {
    const url = '/user/request';
    const fetchData = {
        method: 'POST',
        body: JSON.stringify({ method: "OrderPayment", token: AccessToken.get(), data: data }),
        headers: { "Content-type": "application/json;charset=utf-8" }
    };
    return fetch(url, fetchData)
        .then(response => response.json())
        .catch(err => console.log(err.stack));
};






const escapeStringRegEx = /[\-\[\]\/\{\}\(\)\*\+\?\\\^\$\|]/g;
const emailCheckRegEx = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/;
const passwdCheckRegEx = /(?=.*[0-9])(?=.*[a-z])[0-9a-z]{6,}/g;

/**
 * 
 * @param {string} str 
 * @returns {string} Escaped string
 */
export const escapeString = (str) => str.replace(escapeStringRegEx, "\\$&");

/**
 * 
 * @param {string} str 
 * @returns {boolean}
 */
export const correctEmail = (str) => emailCheckRegEx.test(str);

/**
 * 
 * @param {string} str 
 * @returns {boolean}
 */
export const correctPassword = (str) => passwdCheckRegEx.test(str);

/**
 * 
 * @param {string} imgPath 
 * @returns 
 */
export const correctImgPath = (imgPath) => imgPath.replace("frontend", "");







// ================= Local storage access

export const ProductId = {
    set: (productID) => localStorage.setItem('productID', productID),
    get: () => localStorage.getItem('productID'),
    remove: () => localStorage.removeItem('productID')
};

export const AccessToken = {
    set: (data) => localStorage.setItem('AccessToken', data),
    get: (remove = false) => {
        const data = localStorage.getItem("AccessToken");
        if (remove) {
            localStorage.removeItem("AccessToken");
        }
        return data;
    },
    remove: () => localStorage.removeItem("AccessToken")
};

export const ProfileData = {
    set: (data) => localStorage.setItem("profileData", JSON.stringify(data)),
    get: (remove = false) => {
        const data = localStorage.getItem("profileData");
        if (remove) {
            localStorage.removeItem("profileData");
        }
        return JSON.parse(data);
    }
};

export const ShoppingCart = {
    set: (data) => localStorage.setItem("ShoppingCart", JSON.stringify(data)),
    /**
     * 
     * @param {boolean} remove 
     * @returns {{id: string, img, string, itemsAmount: number, name: string, price: number}[]} data
     */
    get: (remove = false) => {
        const data = localStorage.getItem("ShoppingCart");
        if (remove) {
            localStorage.removeItem("ShoppingCart");
        }
        return JSON.parse(data);
    },
    remove: () => localStorage.removeItem("ShoppingCart")
};

export const SectionData = {
    set: (data) => localStorage.setItem("SectionData", JSON.stringify(data)),
    /**
     * 
     * @param {boolean} remove
     * @returns {{sectionName: string, data: {subID: string, Photo: string, Name: string}[]}} data
     */
    get: (remove = false) => {
        const data = localStorage.getItem("SectionData");
        if (remove) {
            localStorage.removeItem("SectionData");
        }
        return JSON.parse(data);
    },
    remove: () => localStorage.removeItem("SectionData")
};

export const SubsectionData = {
    set: (data) => localStorage.setItem("SubsectionData", JSON.stringify(data)),
    /**
     * 
     * @param {boolean} remove 
     * @returns {{subsectionName: string, data: {productID: string, Photo: string, Name: string, Price: number, Amount: number, DateOfReceipt: number, Score: number[]}[]}} data
     */
    get: (remove = false) => {
        const data = localStorage.getItem("SubsectionData");
        if (remove) {
            localStorage.removeItem("SubsectionData");
        }
        return JSON.parse(data);
    },
    remove: () => localStorage.removeItem("SubsectionData")
};

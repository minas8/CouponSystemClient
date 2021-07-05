// Global settings
class Globals {
    public dialogTitles = {
        deleteItem: "Are you sure you want to delete"
    };
}

// DEV Settings
class DevelopmentGlobals extends Globals {
    private serverName = "localhost";
    private serverPort = "8080";
    private uriHead = `http://${this.serverName}:${this.serverPort}`;
    private uriHeadApi = `http://${this.serverName}:${this.serverPort}/api`;
    public urls = {
        admin: {
            companies: `${this.uriHeadApi}/u-admin/companies/`,
            company: `${this.uriHeadApi}/u-admin/company/`,
            customers: `${this.uriHeadApi}/u-admin/customers/`,
            customer: `${this.uriHeadApi}/u-admin/customer/`
        },
        company: {
            details: `${this.uriHeadApi}/u-company`,
            coupon: `${this.uriHeadApi}/u-company/coupon/`,
            coupons: `${this.uriHeadApi}/u-company/coupons/`,
            couponsByCategory: `${this.uriHeadApi}/u-company/coupons-by-category/`,
            couponsByMaxPrice: `${this.uriHeadApi}/u-company/coupons-up-to-price/`
        },
        customer: {
            details: `${this.uriHeadApi}/u-customer`,
            coupon: `${this.uriHeadApi}/u-customer/coupon/`,
            purchaseCoupon: `${this.uriHeadApi}/u-customer/coupon/`,
            coupons: `${this.uriHeadApi}/u-customer/coupons/`,
            couponsByCategory: `${this.uriHeadApi}/u-customer/coupons-by-category/`,
            couponsByMaxPrice: `${this.uriHeadApi}/u-customer/coupons-up-to-price/`,
            couponsCanPurchase: `${this.uriHeadApi}/u-customer/coupons-can-purchase/`,
            couponsAboutToExpire: `${this.uriHeadApi}/u-customer/coupons-about-to-expire/`
        },
        images: `${this.uriHead}/images/`,
        login: `${this.uriHead}/auth/login`
    }
}

// Prod Settings
class ProductionGlobals extends Globals {
    private serverName = "https://coupons3-server.herokuapp.com";
    private uriHead = `${this.serverName}`;
    private uriHeadApi = `${this.serverName}/api`;
    public urls = {
        admin: {
            companies: `${this.uriHeadApi}/u-admin/companies/`,
            company: `${this.uriHeadApi}/u-admin/company/`,
            customers: `${this.uriHeadApi}/u-admin/customers/`,
            customer: `${this.uriHeadApi}/u-admin/customer/`
        },
        company: {
            details: `${this.uriHeadApi}/u-company`,
            coupon: `${this.uriHeadApi}/u-company/coupon/`,
            coupons: `${this.uriHeadApi}/u-company/coupons/`,
            couponsByCategory: `${this.uriHeadApi}/u-company/coupons-by-category/`,
            couponsByMaxPrice: `${this.uriHeadApi}/u-company/coupons-up-to-price/`
        },
        customer: {
            details: `${this.uriHeadApi}/u-customer`,
            coupon: `${this.uriHeadApi}/u-customer/coupon/`,
            purchaseCoupon: `${this.uriHeadApi}/u-customer/coupon/`,
            coupons: `${this.uriHeadApi}/u-customer/coupons/`,
            couponsByCategory: `${this.uriHeadApi}/u-customer/coupons-by-category/`,
            couponsByMaxPrice: `${this.uriHeadApi}/u-customer/coupons-up-to-price/`,
            couponsCanPurchase: `${this.uriHeadApi}/u-customer/coupons-can-purchase/`,
            couponsAboutToExpire: `${this.uriHeadApi}/u-customer/coupons-about-to-expire/`
        },
        images: `${this.uriHead}/images/`,
        login: `${this.uriHead}/auth/login`
    }
}

const globals = process.env.NODE_ENV === "development" ? new DevelopmentGlobals() : new ProductionGlobals();

export default globals;
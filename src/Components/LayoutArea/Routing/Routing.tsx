import { Redirect, Route, Switch } from "react-router-dom";
import AboutUs from "../../AboutArea/AboutUs/AboutUs";
import AdminRequired from "../../AuthArea/AdminRequired/AdminRequired";
import CompanyRequired from "../../AuthArea/CompanyRequired/CompanyRequired";
import CustomerRequired from "../../AuthArea/CustomerRequired/CustomerRequired";
import Login from "../../AuthArea/Login/Login";
import Logout from "../../AuthArea/Logout/Logout";
import AddCompany from "../../CompaniesArea/AddCompany/AddCompany";
import CompanyDetails from "../../CompaniesArea/CompanyDetails/CompanyDetails";
import CompanyList from "../../CompaniesArea/CompanyList/CompanyList";
import MyCompanyDetails from "../../CompaniesArea/MyCompanyDetails/MyCompanyDetails";
import UpdateCompany from "../../CompaniesArea/UpdateCompany/UpdateCompany";
import ContactUs from "../../ContactUsArea/ContactUs/ContactUs";
import AddCoupon from "../../CouponsArea/AddCoupon/AddCoupon";
import CompanyCouponList from "../../CouponsArea/CompanyCouponList/CompanyCouponList";
import CouponDetails from "../../CouponsArea/CouponDetails/CouponDetails";
import CustomerCouponList from "../../CouponsArea/CustomerCouponList/CustomerCouponList";
import UpdateCoupon from "../../CouponsArea/UpdateCoupon/UpdateCoupon";
import AddCustomer from "../../CustomersArea/AddCustomer/AddCustomer";
import CustomerDetails from "../../CustomersArea/CustomerDetails/CustomerDetails";
import CustomerList from "../../CustomersArea/CustomerList/CustomerList";
import MyCustomerDetails from "../../CustomersArea/MyCustomerDetails/MyCustomerDetails";
import UpdateCustomer from "../../CustomersArea/UpdateCustomer/UpdateCustomer";
import Home from "../../HomeArea/Home/Home";
import Page404 from "../../SharedArea/Page404/Page404";

function Routing(): JSX.Element {
    return (
        <div className="Routing">
            <Switch>
                <Route path="/home" component={Home} exact />

                {/* Company: */}
                <Route path="/company" component={CompanyRequired(MyCompanyDetails)} exact />
                <Route path="/company/coupons/update/:id" component={CompanyRequired(UpdateCoupon)} exact />
                <Route path="/company/coupons/add" component={CompanyRequired(AddCoupon)} exact />
                <Route path="/company/coupons/:id" component={CompanyRequired(CouponDetails)} exact />
                <Route path="/company/coupons" component={CompanyRequired(CompanyCouponList)} exact />

                {/* Customer: */}
                <Route path="/customer" component={CustomerRequired(MyCustomerDetails)} exact />
                <Route path="/customer/coupons/:id" component={CustomerRequired(CouponDetails)} exact />
                <Route path="/customer/coupons" component={CustomerRequired(CustomerCouponList)} exact />

                {/* Admin: */}
                <Route path="/companies/update/:id" component={AdminRequired(UpdateCompany)} exact />
                <Route path="/companies/add" component={AdminRequired(AddCompany)} exact />
                <Route path="/companies/:id" component={AdminRequired(CompanyDetails)} exact />
                <Route path="/companies" component={AdminRequired(CompanyList)} exact />

                <Route path="/customers/update/:id" component={AdminRequired(UpdateCustomer)} exact />
                <Route path="/customers/add" component={AdminRequired(AddCustomer)} exact />
                <Route path="/customers/:id" component={AdminRequired(CustomerDetails)} exact />
                <Route path="/customers" component={AdminRequired(CustomerList)} exact />

                {/* All: */}
                <Route path="/login" component={Login} exact />
                <Route path="/logout" component={Logout} exact />
                <Route path="/about" component={AboutUs} exact />
                <Route path="/contact-us" component={ContactUs} exact />

                <Redirect from="/" to="/home" exact />
                <Route component={Page404} /> {/* Must Be Last! */}
            </Switch>
        </div>
    );
}

export default Routing;
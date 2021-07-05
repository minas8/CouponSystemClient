import CouponModel from "./CouponModel";

class CompanyModel {
    public id: number;
    public name: string;
    public email: string;
    public password: string;
    public coupons: CouponModel[];
}

export default CompanyModel;
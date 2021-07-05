import { CategoryType } from "./CategoryType";

class CouponModel {
    public id: number;
    public category: CategoryType;
    public title: string;
    public description: string;
    public startDate: Date;
    public endDate: Date;
    public amount: number;
    public price: number;
    public image: string;
    public imageFile: FileList;
}

export default CouponModel;
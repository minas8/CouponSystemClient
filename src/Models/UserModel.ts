import { UserType } from "./UserType";

class UserModel {
    public id: number;
    public name: string;
    public email: string;
    public password: string;
    public userType: UserType;
    public token: string;
}

export default UserModel;

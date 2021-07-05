import { Component } from "react";
import { NavLink } from "react-router-dom";
import { Unsubscribe } from "redux";
import UserModel from "../../../Models/UserModel";
import { UserType } from "../../../Models/UserType";
import store from "../../../Redux/Store";
import "./Menu.css";

interface MenuState {
    user: UserModel;
}

class Menu extends Component<{}, MenuState> {

    private unsubscribeMenu: Unsubscribe;

    public constructor(props: {}) {
        super(props);
        this.state = { user: store.getState().authState.user };
    }

    public componentDidMount(): void {
        this.unsubscribeMenu = store.subscribe(() => {
            this.setState({ user: store.getState().authState.user });
        });
    }

    public render(): JSX.Element {
        const user = this.state.user;
        return (
            <div className="Menu">
                <nav>
                    <NavLink to="/home" exact>Home</NavLink>
                    {user?.userType === UserType.ADMIN &&
                        <>
                            <NavLink to="/companies" exact>Companies</NavLink>
                            <NavLink to="/customers" exact>Customers</NavLink>
                        </>
                    }
                    {user?.userType === UserType.COMPANY &&
                        <>
                            <NavLink to="/company" exact>My Details</NavLink>
                            <NavLink to="/company/coupons" exact>My Coupons</NavLink>
                        </>
                    }
                    {user?.userType === UserType.CUSTOMER &&
                        <>
                            <NavLink to="/customer" exact>My Details</NavLink>
                            <NavLink to="/customer/coupons" exact>Coupons</NavLink>
                        </>
                    }
                    <NavLink to="/about" exact>About</NavLink>
                    <NavLink to="/contact-us" exact>Contact Us</NavLink>
                </nav>
            </div>
        );
    }

    public componentWillUnmount(): void {
        this.unsubscribeMenu();
    }
}

export default Menu;
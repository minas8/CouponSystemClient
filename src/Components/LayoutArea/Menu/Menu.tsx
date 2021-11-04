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

interface MenuProps {
    closeMobileMenu?: () => void;
}

class Menu extends Component<MenuProps, MenuState> {

    private unsubscribeMenu: Unsubscribe;

    public constructor(props: MenuProps) {
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
        const closeMobileMenu = this.props.closeMobileMenu;
        return (
            <div className="Menu">
                <nav>
                    <NavLink to="/home" exact onClick={closeMobileMenu}>Home</NavLink>
                    {user && <div className="divider"></div>}
                    {user?.userType === UserType.ADMIN &&
                        <>
                            <NavLink to="/companies" exact onClick={closeMobileMenu}>Companies</NavLink>
                            <NavLink to="/customers" exact onClick={closeMobileMenu}>Customers</NavLink>
                        </>
                    }
                    {user?.userType === UserType.COMPANY &&
                        <>
                            <NavLink to="/company" exact onClick={closeMobileMenu}>My Details</NavLink>
                            <NavLink to="/company/coupons" exact onClick={closeMobileMenu}>My Coupons</NavLink>
                        </>
                    }
                    {user?.userType === UserType.CUSTOMER &&
                        <>
                            <NavLink to="/customer" exact onClick={closeMobileMenu}>My Details</NavLink>
                            <NavLink to="/customer/coupons" exact onClick={closeMobileMenu}>Coupons</NavLink>
                        </>
                    }
                    {user && <div className="divider"></div>}
                    <NavLink to="/about" exact onClick={closeMobileMenu}>About</NavLink>
                    <NavLink to="/contact-us" exact onClick={closeMobileMenu}>Contact Us</NavLink>
                </nav>
            </div>
        );
    }

    public componentWillUnmount(): void {
        this.unsubscribeMenu();
    }
}

export default Menu;
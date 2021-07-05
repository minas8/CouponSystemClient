import { Component } from "react";
import { NavLink } from "react-router-dom";
import { Unsubscribe } from "redux";
import UserModel from "../../../Models/UserModel";
import store from "../../../Redux/Store";
import "./AuthMenu.css";

interface AuthMenuState {
	user: UserModel;
}

class AuthMenu extends Component<{}, AuthMenuState> {

    private unsubscribe: Unsubscribe;

    public constructor(props: {}) {
        super(props);
        this.state = { user: store.getState().authState.user };
    }

    public componentDidMount(): void {
        this.unsubscribe = store.subscribe(() => {
            this.setState({ user: store.getState().authState.user })
        });
    }

    public render(): JSX.Element {
        const user = this.state.user;
        return (
            <div className="AuthMenu">
				{
                    this.state.user && <>
                        <span>Hello {user.name}</span>
                        <span> | </span>
                        <NavLink to="/logout">Logout</NavLink>
                    </>
                }
                {
                    !this.state.user && <>
                        <span>Hello Guest</span>
                        <span> | </span>
                        <NavLink to="/login">Login</NavLink>
                    </>
                }
            </div>
        );
    }

    public componentWillUnmount(): void {
        this.unsubscribe();
    }
}

export default AuthMenu;
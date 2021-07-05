import { History } from "history";
import { Component } from "react";
import { Unsubscribe } from "redux";
import UserModel from "../../../Models/UserModel";
import { UserType } from "../../../Models/UserType";
import store from "../../../Redux/Store";
import notify from "../../../Services/Notification";

// This function receives the Component that only admin user should access
function AdminRequired(ComposedComponent: any) {

    interface AdminAuthenticatedState {
        user: UserModel;
    }

    interface AdminAuthenticatedProps {
        history: History;
    }

    class AdminAuthenticated extends Component<AdminAuthenticatedProps, AdminAuthenticatedState> {

        private unsubscribeAdminAuthenticated: Unsubscribe;

        public constructor(props: AdminAuthenticatedProps) {
            super(props);
            this.state = { user: store.getState().authState.user };
        }

        componentWillMount() {
            this.unsubscribeAdminAuthenticated = store.subscribe(() => {
                this.setState({ user: store.getState().authState.user });
            });

            if (!this.state.user || this.state.user.userType !== UserType.ADMIN) {
                notify.error("You are not authorized to access this action!");
                this.props.history.push("/login");
            }
        }

        render() {
            return <ComposedComponent {...this.props} />;
        }

        public componentWillUnmount(): void {
            this.unsubscribeAdminAuthenticated();
        }
    }

    // Return the new Component that requires authorization
    return AdminAuthenticated;
}

export default AdminRequired;
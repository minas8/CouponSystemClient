import { History } from "history";
import { Component } from "react";
import { Unsubscribe } from "redux";
import UserModel from "../../../Models/UserModel";
import { UserType } from "../../../Models/UserType";
import store from "../../../Redux/Store";
import notify from "../../../Services/Notification";

// This function receives the Component that only customer user should access
function CustomerRequired(ComposedComponent: any) {

    interface CustomerAuthenticatedState {
        user: UserModel;
    }

    interface CustomerAuthenticatedProps {
        history: History;
    }

    class CustomerAuthenticated extends Component<CustomerAuthenticatedProps, CustomerAuthenticatedState> {

        private unsubscribeCustomerAuthenticated: Unsubscribe;

        public constructor(props: CustomerAuthenticatedProps) {
            super(props);
            this.state = { user: store.getState().authState.user };
        }

        componentWillMount() {
            this.unsubscribeCustomerAuthenticated = store.subscribe(() => {
                this.setState({ user: store.getState().authState.user });
            });

            if (!this.state.user || this.state.user.userType !== UserType.CUSTOMER) {
                notify.error("You are not authorized to access this action!");
                this.props.history.push("/login");
            }
        }

        render() {
            return <ComposedComponent {...this.props} />;
        }

        public componentWillUnmount(): void {
            this.unsubscribeCustomerAuthenticated();
        }
    }

    // Return the new Component that requires authorization
    return CustomerAuthenticated;
}

export default CustomerRequired;
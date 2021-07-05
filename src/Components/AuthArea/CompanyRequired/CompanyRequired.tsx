import { History } from "history";
import { Component } from "react";
import { Unsubscribe } from "redux";
import UserModel from "../../../Models/UserModel";
import { UserType } from "../../../Models/UserType";
import store from "../../../Redux/Store";
import notify from "../../../Services/Notification";

// This function receives the Component that only company user should access
function CompanyRequired(ComposedComponent: any) {

    interface CompanyAuthenticatedState {
        user: UserModel;
    }

    interface CompanyAuthenticatedProps {
        history: History;
    }

    class CompanyAuthenticated extends Component<CompanyAuthenticatedProps, CompanyAuthenticatedState> {

        private unsubscribeCompanyAuthenticated: Unsubscribe;

        public constructor(props: CompanyAuthenticatedProps) {
            super(props);
            this.state = { user: store.getState().authState.user };
        }

        componentWillMount() {
            this.unsubscribeCompanyAuthenticated = store.subscribe(() => {
                this.setState({ user: store.getState().authState.user });
            });

            if (!this.state.user || this.state.user.userType !== UserType.COMPANY) {
                notify.error("You are not authorized to access this action!");
                this.props.history.push("/login");
            }
        }

        render() {
            return <ComposedComponent {...this.props} />;
        }

        public componentWillUnmount(): void {
            this.unsubscribeCompanyAuthenticated();
        }
    }

    // Return the new Component that requires authorization
    return CompanyAuthenticated;
}

export default CompanyRequired;
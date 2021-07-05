import { History } from "history";
import { Component } from "react";
import { RouteComponentProps } from "react-router";
import CustomerModel from "../../../Models/CustomerModel";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notification";
import "./CustomerDetails.css";

interface RouteParam {
    id: string;
}

interface CustomerDetailsProps extends RouteComponentProps<RouteParam> {
    history: History;
}

interface CustomerDetailsState {
    customer: CustomerModel;
}

class CustomerDetails extends Component<CustomerDetailsProps, CustomerDetailsState> {

    public constructor(props: CustomerDetailsProps) {
        super(props);
        this.state = { customer: null };
    }

    public async componentDidMount() {
        try {
            const id = +this.props.match.params.id;
            let customer = store.getState().customersState.customers.find(c => c.id === id);
            if (customer) {
                this.setState({ customer });
            } else if (id > 0) {
                const response = await jwtAxios.get<CustomerModel>(`${globals.urls.admin.customer}/${id}`);
                customer = response.data;
                notify.success("Customer details were received!");
                this.setState({ customer });
            }
        } catch (err) {
            notify.error(err);
            if (err.response.data.status === 401) { // UNAUTHORIZED or Token Expired
                this.props.history.push("/logout");
            }
        }
    }

    public render(): JSX.Element {
        return (
            <div className="CustomerDetails">
                {this.state.customer &&
                    <>
                        <h2>Customer Details</h2>
                        <h3>First name: {this.state.customer.firstName}</h3>
                        <h3>Last name: {this.state.customer.lastName}</h3>
                        <h4>Email: {this.state.customer.email}</h4>
                        <h4>Password: {this.state.customer.password}</h4>
                        <br /><br />
                    </>
                }
            </div>
        );
    }
}

export default CustomerDetails;
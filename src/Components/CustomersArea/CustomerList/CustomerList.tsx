import { AddBox } from "@material-ui/icons";
import { History } from "history";
import { Component } from "react";
import { NavLink } from "react-router-dom";
import { Unsubscribe } from "redux";
import CustomerModel from "../../../Models/CustomerModel";
import { customersDownloadedAction } from "../../../Redux/CustomersState";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notification";
import CustomerCard from "../CustomerCard/CustomerCard";
import "./CustomerList.css";

interface CustomerListState {
    customers: CustomerModel[];
}

interface CustomerListProps {
    history: History;
}

class CustomerList extends Component<CustomerListProps, CustomerListState> {

    // 'isAlive' is to prevent 'setState' if the user is not authorized and is pushed to logout page
    private isAlive = true;
    private unsubscribeCustomerList: Unsubscribe;

    public constructor(props: CustomerListProps) {
        super(props);
        this.state = { customers: store.getState().customersState.customers };
    }

    public async componentDidMount() {
        this.unsubscribeCustomerList = store.subscribe(() => {
            this.setState({ customers: store.getState().customersState.customers });
        });

        try {
            // Sending JWT Token with interceptor:
            const response = await jwtAxios.get<CustomerModel[]>(globals.urls.admin.customers);
            if (!this.isAlive) return;

            store.dispatch(customersDownloadedAction(response.data));
            this.setState({ customers: response.data });
        } catch (err) {
            notify.error(err);

            if (err.response?.data?.status === 401) { // UNAUTHORIZED or Token Expired
                this.props.history.push("/logout");
            }
        }
    }

    public render(): JSX.Element {
        const customers = this.state.customers;
        return (
            <div className="CustomerList">
                {customers.length === 0 && <><p>No customers found in the system</p></>}
                {customers.length > 0 && <><p>{customers.length} customers found in the system:</p></>}

                <NavLink to="/customers/add" >
                    <AddBox />
                </NavLink>

                {customers.length > 0 && <div className="cus-list">{customers.map(c => <CustomerCard key={c.id} customer={c} />)}</div>}
            </div>
        );
    }

    public componentWillUnmount(): void {
        this.isAlive = false;
        this.unsubscribeCustomerList();
    }
}

export default CustomerList;
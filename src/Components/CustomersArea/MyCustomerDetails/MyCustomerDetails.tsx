import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import CustomerModel from "../../../Models/CustomerModel";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notification";
import "./MyCustomerDetails.css";

function MyCustomerDetails(): JSX.Element {

    const [customer, setCustomer] = useState(null);
    const history = useHistory();
    const [isAlive, setIsAlive] = useState(true);

    useEffect(() => {
        async function getCustomer() {
            try {
                const response = await jwtAxios.get<CustomerModel>(globals.urls.customer.details);
                if (!isAlive) return;
                setCustomer(response.data);
                notify.success("Customer details were received!");
            } catch (err) {
                notify.error(err);
                if (err.response.data.status === 401) {
                    history.push("/logout");
                }
            }
        };
        getCustomer();

        return (() => {
            setIsAlive(false);
        });
    }, [history, isAlive]);

    return (
        <div className="MyCustomerDetails">
            {customer &&
                <>
                    <h2>My Details</h2>
                    <h3>First name: {customer.firstName}</h3>
                    <h3>Last name: {customer.lastName}</h3>
                    <h4>Email: {customer.email}</h4>
                    <h4>Password: {customer.password}</h4>
                    <br /><br />
                </>
            }
        </div>
    );
}

export default MyCustomerDetails;
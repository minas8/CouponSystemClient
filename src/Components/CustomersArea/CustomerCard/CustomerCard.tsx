import { Delete, Edit } from "@material-ui/icons";
import { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import CustomerModel from "../../../Models/CustomerModel";
import { customerDeletedAction } from "../../../Redux/CustomersState";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notification";
import SimpleDialog from "../../SharedArea/SimpleDialog/SimpleDialog";
import "./CustomerCard.css";

interface CustomerCardProps {
    customer: CustomerModel
}

function CustomerCard(props: CustomerCardProps): JSX.Element {

    const customer = props.customer;
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");
    const history = useHistory();

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = (value: string) => {
        setOpen(false);
        setSelectedValue(value);

        value === "delete" && handleDelete();
    }

    const handleDelete = async () => {
        try {
            await jwtAxios.delete(`${globals.urls.admin.customer}${customer.id}`);
            store.dispatch(customerDeletedAction(customer.id));
            notify.success("Customer was deleted!");
        } catch (err) {
            notify.error(err);
            if (err.response.data.status === 401) { // UNAUTHORIZED or Token Expired
                history.push("/logout");
            }
        }
    }

    return (
        <div className="CustomerCard">
            <NavLink to={`/customers/${customer.id}`} title="Click for details">
                <h4>{customer.firstName} {customer.lastName}</h4>
                <span>Email: {customer.email}</span>
            </NavLink><br />
            <div className="buttons">
                <NavLink to={`/customers/update/${customer.id}`}>
                    <Edit />
                </NavLink>
                <NavLink to="#" onClick={handleClickOpen}>
                    <Delete />
                </NavLink>
            </div>

            <SimpleDialog
                title={`${globals.dialogTitles.deleteItem} ${customer.firstName} ${customer.lastName}?`}
                selectedValue={selectedValue}
                open={open} onClose={handleClose}
            />
        </div>
    );
}

export default CustomerCard;
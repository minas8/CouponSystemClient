import { Delete, Edit } from "@material-ui/icons";
import { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import CompanyModel from "../../../Models/CompanyModel";
import { companyDeletedAction } from "../../../Redux/CompaniesState";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notification";
import SimpleDialog from "../../SharedArea/SimpleDialog/SimpleDialog";
import "./CompanyCard.css";

interface CompanyCardProps {
    company: CompanyModel;
}

function CompanyCard(props: CompanyCardProps): JSX.Element {

    const company = props.company;
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
            await jwtAxios.delete(`${globals.urls.admin.company}${company.id}`);
            store.dispatch(companyDeletedAction(company.id));
            notify.success("Company has been deleted!");
        } catch (err) {
            notify.error(err);
            if (err.response?.data?.status === 401) { // UNAUTHORIZED or Token Expired
                history.push("/logout");
            }
        }
    }

    return (
        <div className="CompanyCard">
            <NavLink to={`/companies/${company.id}`} title="Click for details">
                <h4>{company.name}</h4>
                <span>Email: {company.email}</span>
            </NavLink><br />
            <div className="buttons">
                <NavLink to={`/companies/update/${company.id}`}>
                    <Edit />
                </NavLink>
                <NavLink to="#" onClick={handleClickOpen}>
                    <Delete />
                </NavLink>
            </div>

            <SimpleDialog
                title={`${globals.dialogTitles.deleteItem} ${company.name}?`}
                selectedValue={selectedValue}
                open={open} onClose={handleClose}
            />
        </div>
    );
}

export default CompanyCard;
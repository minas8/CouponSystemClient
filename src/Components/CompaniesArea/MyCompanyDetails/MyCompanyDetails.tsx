import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import CompanyModel from "../../../Models/CompanyModel";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notification";
import "./MyCompanyDetails.css";

function MyCompanyDetails(): JSX.Element {

    const [company, setCompany] = useState(null);
    const history = useHistory();
    const [isAlive, setIsAlive] = useState(true);

    useEffect(() => {
        async function getCompany() {
            try {
                const response = await jwtAxios.get<CompanyModel>(globals.urls.company.details);
                if (!isAlive) return;
                setCompany(response.data);
            } catch (err) {
                notify.error(err);
                if (err.response.data.status === 401) { // UNAUTHORIZED or Token Expired
                    history.push("/logout");
                }
            }
        };
        getCompany();

        return (() => {
            setIsAlive(false);
        });
    });

    return (
        <div className="MyCompanyDetails">
            {company &&
                <>
                    <h2>My Details</h2>
                    <h3> Name: {company.name}</h3>
                    <h4>Email: {company.email}</h4>
                    <h4>Password: {company.password}</h4>
                    <br /><br />
                </>
            }
        </div>
    );
}

export default MyCompanyDetails;
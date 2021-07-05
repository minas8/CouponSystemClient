import { Button, ButtonGroup, IconButton, InputAdornment, TextField, Typography } from "@material-ui/core";
import { ClearAll, Edit, Send, Visibility, VisibilityOff } from "@material-ui/icons";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import CompanyModel from "../../../Models/CompanyModel";
import { companyUpdatedAction } from "../../../Redux/CompaniesState";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notification";
import "./UpdateCompany.css";

interface AddCustomerState {
    showPassword: boolean;
}

function UpdateCompany(): JSX.Element {

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<CompanyModel>({
        mode: "all"
    });
    const history = useHistory();
    const [state, setState] = useState<AddCustomerState>({
        showPassword: false
    });

    const handleClickShowPassword = () => {
        setState({ ...state, showPassword: !state.showPassword });
    };

    const { id } = useParams<{ id: string }>();
    const [company] = useState(store.getState().companiesState.companies.find(c => c.id === +id));
    const companyInitial = { ...company };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        switch (name) {
            case "email":
                setValue("email", value);
                break;
            case "password":
                setValue("password", value);
                break;
        }
    }

    useEffect(() => {
        if (company) {
            setValue("id", company.id);
            setValue("name", company.name);
            setValue("email", company.email);
            setValue("password", company.password);
        }
    }, [company, setValue]);

    async function send(company: CompanyModel) {
        // check: if no changes performed => show a message to the user and do nothing
        if (!isCompanyDifferent(companyInitial, company)) {
            notify.error("No changes were made!");
            return;
        }

        try {
            const response = await jwtAxios.put<CompanyModel>(globals.urls.admin.company, company);
            store.dispatch(companyUpdatedAction(response.data));
            notify.success("Company has been updated!");
            history.push("/companies");
        } catch (err) {
            notify.error(err);
            if (err.response.data.status === 401) { // UNAUTHORIZED or Token Expired
                history.push("/logout");
            }
        }
    }

    function isCompanyDifferent(companyBefore: CompanyModel, company: CompanyModel) {
        let isDiff: boolean = false;

        // go over each entry of company (after changes)
        Object.entries(company).forEach(afterEntry => {

            // once isDiff is true => no need to check the rest of the entries
            if (isDiff) return;

            // get the same entry from the initial company object and compare them
            const beforeEntry = Object.entries(companyBefore).find(bEntry => afterEntry[0] === bEntry[0])

            if (!(afterEntry.toString() === beforeEntry.toString())) {
                isDiff = true;
            }
        });

        return isDiff;
    }

    return (
        <div className="UpdateCompany">
            <Typography variant="h4" className="Headline"><Edit /> Update Company</Typography>

            <form onSubmit={handleSubmit(send)}>
                {/* Company name should not be changed in the system therefore the field is disabled  */}
                <TextField label="Name" variant="outlined" className="mui-input"
                    {...register("name")}
                    defaultValue={company?.name}
                    disabled
                /><br /><br />

                <TextField label="Email" variant="outlined" className="mui-input"
                    type="email"
                    {...register("email", {
                        required: { value: true, message: "Missing email." },
                        pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, message: "Email is not valid." }
                    })}
                    defaultValue={company?.email}
                    inputProps={{ onChange: handleChange }}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                /><br /><br />

                <TextField label="Password" variant="outlined" className="mui-input"
                    {...register("password", {
                        required: { value: true, message: "Missing password." },
                        minLength: { value: 4, message: "Password too short, should be at least 4 characters." },
                        pattern: { value: /^[a-zA-Z0-9]+$/gi, message: "Use only the following characters: [a-zA-Z0-9]." }
                    })}
                    type={state.showPassword ? 'text' : 'password'}
                    defaultValue={company?.password}
                    InputProps={{
                        endAdornment:
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword} edge="end">
                                    {state.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>,
                        onChange: handleChange
                    }}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                /><br /><br />

                <ButtonGroup variant="contained">
                    <Button className="send" startIcon={<Send />}
                        type="submit">Update</Button>
                    <Button className="reset" startIcon={<ClearAll />}
                        type="reset">Reset</Button>
                </ButtonGroup>
            </form>
        </div>
    );
}

export default UpdateCompany;
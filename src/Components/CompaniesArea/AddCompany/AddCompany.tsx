import { Button, ButtonGroup, IconButton, InputAdornment, TextField, Typography } from "@material-ui/core";
import { AddBox, ClearAll, Send, Visibility, VisibilityOff } from "@material-ui/icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import CompanyModel from "../../../Models/CompanyModel";
import { companyAddedAction } from "../../../Redux/CompaniesState";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notification";
import "./AddCompany.css";

function AddCompany(): JSX.Element {

    const { register, handleSubmit, formState: { errors } } = useForm<CompanyModel>({
        mode: "all"
    });
    const history = useHistory();
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    async function send(company: CompanyModel) {
        try {
            const response = await jwtAxios.post<CompanyModel>(globals.urls.admin.company, company);            
            store.dispatch(companyAddedAction(response.data));
            notify.success("Company has been added!");
            history.push("/companies");
        } catch (err) {
            notify.error(err);
            if (err.response.data.status === 401) { // UNAUTHORIZED or Token Expired
                history.push("/logout");
            }
        }
    }

    return (
        <div className="AddCompany">
            <Typography variant="h4" className="Headline"> <AddBox /> Add Company</Typography>

            <form onSubmit={handleSubmit(send)}>
                <TextField label="name" variant="outlined" className="mui-input"
                    {...register("name", {
                        required: { value: true, message: "Missing first name." },
                        minLength: { value: 3, message: "First name too short." },
                        pattern: { value: /[^\W ]/g, message: "Use only alphanumeric & underscore characters and space." }
                    })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                /><br /><br />

                <TextField label="Email" variant="outlined" className="mui-input"
                    type="email"
                    {...register("email", {
                        required: { value: true, message: "Missing email." },
                        pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, message: "Email is not valid." }
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                /><br /><br />

                <TextField label="Password" name="password" variant="outlined" className="mui-input"
                    {...register("password", {
                        required: { value: true, message: "Missing password." },
                        minLength: { value: 4, message: "Password too short, should be at least 4 characters." },
                        pattern: { value: /^[a-zA-Z0-9]+$/gi, message: "Use only the following characters: [a-zA-Z0-9]." }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment:
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword} edge="end">
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>,
                    }}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                /><br /><br />

                <ButtonGroup variant="contained">
                    <Button className="send" startIcon={<Send />}
                        type="submit">Add</Button>
                    <Button className="reset" startIcon={<ClearAll />}
                        type="reset">Reset</Button>
                </ButtonGroup>
            </form>
        </div>
    );
}

export default AddCompany;
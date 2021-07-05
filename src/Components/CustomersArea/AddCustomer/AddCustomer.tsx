import { Button, ButtonGroup, IconButton, InputAdornment, TextField, Typography } from "@material-ui/core";
import { AddBox, ClearAll, Send, Visibility, VisibilityOff } from "@material-ui/icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import CustomerModel from "../../../Models/CustomerModel";
import { customerAddedAction } from "../../../Redux/CustomersState";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notification";
import "./AddCustomer.css";

function AddCustomer(): JSX.Element {

    const { register, handleSubmit, formState: { errors, isValid } } = useForm<CustomerModel>({
        mode: "all"
    });
    const history = useHistory();
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    async function send(customer: CustomerModel) {
        try {
            const response = await jwtAxios.post<CustomerModel>(globals.urls.admin.customer, customer);
            store.dispatch(customerAddedAction(response.data));
            notify.success("Customer has been added!");
            history.push("/customers");
        } catch (err) {
            notify.error(err);
            if (err.response.data.status === 401) { // UNAUTHORIZED or Token Expired
                history.push("/logout");
            }
        }
    }

    return (
        <div className="AddCustomer">
            <Typography variant="h4" className="Headline"> <AddBox /> Add Customer</Typography>

            <form onSubmit={handleSubmit(send)}>
                <TextField label="FirstName" variant="outlined" className="mui-input"
                    {...register("firstName", {
                        required: { value: true, message: "Missing first name." },
                        minLength: { value: 3, message: "First name too short." },
                        pattern: { value: /[^\W ]/g, message: "Use only alphanumeric & underscore characters and space." }
                    })}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                /><br /><br />

                <TextField label="LastName" variant="outlined" className="mui-input"
                    {...register("lastName", {
                        required: { value: true, message: "Missing last name." },
                        minLength: { value: 3, message: "Last name too short." },
                        pattern: { value: /[^\W ]/g, message: "Use only alphanumeric & underscore characters and space." }
                    })}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                /><br /><br />

                <TextField label="Email" variant="outlined" className="mui-input"
                    {...register("email", {
                        required: { value: true, message: "Missing email." },
                        pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, message: "Email is not valid." }
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                /><br /><br />

                <TextField label="Password" variant="outlined" className="mui-input"
                    {...register("password", {
                        required: { value: true, message: "Missing password." },
                        minLength: { value: 4, message: "Password too short, should be at least 4 characters." },
                        pattern: { value: /^[a-zA-Z0-9]+$/gi, message: "Use only the following characters: [a-zA-Z0-9]." }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment:
                            <InputAdornment position="end">
                                <IconButton aria-label="toggle password visibility"
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
                        type="submit" disabled={!isValid}>Add</Button>
                    <Button className="reset" startIcon={<ClearAll />}
                        type="reset">Reset</Button>
                </ButtonGroup>
            </form>
        </div>
    );
}

export default AddCustomer;
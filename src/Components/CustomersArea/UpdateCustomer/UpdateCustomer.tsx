import { Button, ButtonGroup, IconButton, InputAdornment, TextField, Typography } from "@material-ui/core";
import { ClearAll, Edit, Send, Visibility, VisibilityOff } from "@material-ui/icons";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import CustomerModel from "../../../Models/CustomerModel";
import { customerUpdatedAction } from "../../../Redux/CustomersState";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notification";
import "./UpdateCustomer.css";

interface AddCustomerState {
    showPassword: boolean;
}

function UpdateCustomer(): JSX.Element {

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<CustomerModel>({
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
    const [customer] = useState(store.getState().customersState.customers.find(c => c.id === +id));
    const customerInitial = { ...customer };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        switch (name) {
            case "firstName":
                setValue("firstName", value);
                break;
            case "lastName":
                setValue("lastName", value);
                break;
            case "email":
                setValue("email", value);
                break;
            case "password":
                setValue("password", value);
                break;
        }
    }

    useEffect(() => {
        if (customer) {
            setValue("id", customer.id);
            setValue("firstName", customer.firstName);
            setValue("lastName", customer.lastName);
            setValue("email", customer.email);
            setValue("password", customer.password);
        }
    }, [customer, setValue]);

    async function send(customer: CustomerModel) {
        // check: if no changes performed => show a message to the user and do nothing
        if (!isCustomerDifferent(customerInitial, customer)) {
            notify.error("No changes were made!");
            return;
        }

        try {
            const response = await jwtAxios.put<CustomerModel>(globals.urls.admin.customer, customer);
            store.dispatch(customerUpdatedAction(response.data));
            notify.success("The customer has been updated!");
            history.push("/customers");
        } catch (err) {
            notify.error(err);
            if (err.response.data.status === 401) { // UNAUTHORIZED or Token Expired
                history.push("/logout");
            }
        }
    }

    function isCustomerDifferent(customerBefore: CustomerModel, customer: CustomerModel) {
        let isDiff: boolean = false;

        // go over each entry of customer (after changes)
        Object.entries(customer).forEach(afterEntry => {

            // once isDiff is true => no need to check the rest of the entries
            if (isDiff) return;

            // get the same entry from the initial customer object and compare them
            const beforeEntry = Object.entries(customerBefore).find(bEntry => afterEntry[0] === bEntry[0])

            if (!(afterEntry.toString() === beforeEntry.toString())) {
                isDiff = true;
            }
        });

        return isDiff;
    }

    return (
        <div className="UpdateCustomer">
            <Typography variant="h4" className="Headline"><Edit /> Update Customer</Typography>

            <form onSubmit={handleSubmit(send)}>
                <TextField label="FirstName" variant="outlined" className="mui-input"
                    {...register("firstName", {
                        required: { value: true, message: "Missing first name." },
                        minLength: { value: 3, message: "First name too short." },
                        pattern: { value: /[^\W ]/g, message: "Use only alphanumeric, underscore and space characters." }
                    })}
                    defaultValue={customer?.firstName}
                    inputProps={{ onChange: handleChange }}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                /><br /><br />

                <TextField label="LastName" variant="outlined" className="mui-input"
                    {...register("lastName", {
                        required: { value: true, message: "Missing last name." },
                        minLength: { value: 3, message: "Last name too short." },
                        pattern: { value: /[^\W ]/g, message: "Use only alphanumeric, underscore and space characters." }
                    })}
                    defaultValue={customer?.lastName}
                    inputProps={{ onChange: handleChange }}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                /><br /><br />

                <TextField label="Email" variant="outlined" className="mui-input"
                    {...register("email", {
                        required: { value: true, message: "Missing email." },
                        pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, message: "Email is not valid." }
                    })}
                    defaultValue={customer?.email}
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
                    defaultValue={customer?.password}
                    type={state.showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment:
                            <InputAdornment position="end">
                                <IconButton aria-label="toggle password visibility"
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

export default UpdateCustomer;
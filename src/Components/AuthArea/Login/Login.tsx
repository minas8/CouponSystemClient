import { Button, ButtonGroup, IconButton, InputAdornment, TextField, Typography } from "@material-ui/core";
import { LockOpen, Send, Visibility, VisibilityOff } from "@material-ui/icons";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import CredentialsModel from "../../../Models/CredentialsModel";
import UserModel from "../../../Models/UserModel";
import { UserType } from "../../../Models/UserType";
import { loginAction } from "../../../Redux/AuthState";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import notify from "../../../Services/Notification";
import "./Login.css";

function Login(): JSX.Element {

    const history = useHistory();
    const { register, handleSubmit, formState: { errors, isValid } } = useForm<CredentialsModel>({
        mode: "all"
    });
    const [showPassword, setShowPassword] = useState(false);
    const [userType, setUserType] = useState("ChooseOne");

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserType(event.target.value);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    async function send(credentials: CredentialsModel) {
        try {
            const response = await axios.post<UserModel>(globals.urls.login, credentials);
            store.dispatch(loginAction(response.data));
            notify.success("You have been successfully logged in!")
            history.push("/home");
        } catch (err) {
            notify.error(err);
        }
    }

    return (
        <div className="Login">
            <Typography variant="h4" className="Headline"> <LockOpen /> Login</Typography>

            <form onSubmit={handleSubmit(send)}>
                <TextField label="Email" variant="outlined" className="mui-input"
                    type="email"
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
                        endAdornment: <InputAdornment position="end">
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

                <TextField name="userType" select className="mui-input"
                    label="Please select your user type" variant="outlined"
                    defaultValue={userType}
                    onChange={handleChange}
                    SelectProps={{ native: true }}
                    {...register('userType', {
                        required: { value: true, message: "User type is required." },
                        pattern: { value: /^((?!ChooseOne).)*$/, message: "Choose one of the options other than the first one." }
                    })}
                    error={!!errors.userType}
                    helperText={errors.userType?.message}
                >
                    <option value="ChooseOne">Choose</option>
                    {Object.values(UserType).map(val =>
                        <option key={val} value={val}>{val}</option>
                    )}
                </TextField><br /><br />

                <ButtonGroup variant="contained">
                    <Button className="login" startIcon={<Send />}
                        type="submit" disabled={!isValid}>Login</Button>
                </ButtonGroup>
            </form>
        </div>
    );
}

export default Login;
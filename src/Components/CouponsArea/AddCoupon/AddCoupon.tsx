import { Button, ButtonGroup, createStyles, FormControl, FormHelperText, InputAdornment, makeStyles, OutlinedInput, TextField, Theme, Typography } from "@material-ui/core";
import { AddBox, ClearAll, Send } from "@material-ui/icons";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { CategoryType } from "../../../Models/CategoryType";
import CouponModel from "../../../Models/CouponModel";
import { couponAddedAction } from "../../../Redux/CouponsState";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notification";
import util from "../../../Services/Util";
import "./AddCoupon.css";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        textField: {
            maxWidth: 250,
        },
        input: {
            backgroundColor: '#ffffff',
        }
    }),
);

function AddCoupon(): JSX.Element {

    const { register, handleSubmit, formState: { errors }, getValues } = useForm<CouponModel>({
        mode: 'all'
    });
    const history = useHistory();
    const classes = useStyles();

    const [category, setCategory] = useState("ChooseOne");

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCategory(event.target.value);
    };

    async function send(coupon: CouponModel) {
        try {
            const cFormData = new FormData();
            cFormData.append("title", coupon.title);
            cFormData.append("description", coupon.description);
            cFormData.append("category", coupon.category.toString());
            cFormData.append("startDate", coupon.startDate.toString());
            cFormData.append("endDate", coupon.endDate.toString());
            cFormData.append("amount", coupon.amount.toString());
            cFormData.append("price", coupon.price.toString());
            cFormData.append("imageFile", coupon.imageFile.item(0));

            const response = await jwtAxios.post<CouponModel>(globals.urls.company.coupon, cFormData);
            store.dispatch(couponAddedAction(response.data));
            notify.success("Coupon has been added!");
            history.push("/company/coupons");
        } catch (err) {
            notify.error(err);
            if (err.response?.data?.status === 401) { // UNAUTHORIZED or Token Expired
                history.push("/logout");
            }
        }
    }

    return (
        <div className="AddCoupon">
            <Typography variant="h4" className="Headline"><AddBox /> Add Coupon</Typography>

            <form onSubmit={handleSubmit(send)}>
                <div className="grid">
                    <TextField label="Title" variant="outlined" className={classes.textField}
                        {...register("title", {
                            required: { value: true, message: "Missing title." },
                            minLength: { value: 3, message: "Title too short." },
                            pattern: { value: /^[a-zA-Z0-9 !?$%)(+-]+$/g, message: "Use only [a-zA-Z0-9!?$%)(+-] and space." }
                        })}
                        InputProps={{ className: classes.input }}
                        error={!!errors.title}
                        helperText={errors.title?.message}
                    />

                    <TextField label="Description" variant="outlined" className={classes.textField}
                        type="textarea" multiline rows="3" rowsMax={4}
                        {...register("description", {
                            required: { value: true, message: "Missing description." },
                            pattern: { value: /^[\w!?$%., /%&\r\n)*(+-]+$/g, message: "Use only [a-zA-Z0-9!?$%., /%&)*(+-] and white spaces." }
                        })}
                        InputProps={{ className: classes.input }}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                    />

                    <div className="numbers">
                        <TextField label="Amount" variant="outlined" className={classes.textField}
                            type="number"
                            {...register("amount", {
                                required: { value: true, message: "Missing amount." },
                                pattern: { value: /^[1-9]\d*$/g, message: "Use only positive whole number." }
                            })}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ className: classes.input }}
                            error={!!errors.amount}
                            helperText={errors.amount?.message}
                        />
                        &nbsp;
                        <TextField label="Price" variant="outlined" className={classes.textField}
                            type="number"
                            {...register("price", {
                                required: { value: true, message: "Missing price." },
                                pattern: { value: /^[1-9]\d*\.?\d*$/g, message: "Use only positive numbers including decimals." }
                            })}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ className: classes.input }}
                            inputProps={{
                                step: 0.01,
                                min: 0,
                                startadornment: <InputAdornment position="start">$</InputAdornment>
                            }}
                            error={!!errors.price}
                            helperText={errors.price?.message}
                        />
                    </div>

                    <TextField name="category" select className={classes.textField}
                        label="Please select a category" variant="outlined"
                        onChange={handleChange}
                        SelectProps={{ native: true }}
                        {...register('category', {
                            required: { value: true, message: "Category is required." },
                            pattern: { value: /^((?!ChooseOne).)*$/, message: "Choose any of the options but the first." }
                        })}
                        InputProps={{ className: classes.input }}
                        defaultValue={category}
                        error={!!errors.category}
                        helperText={errors.category?.message}
                    >
                        <option value="ChooseOne">Choose</option>
                        {Object.values(CategoryType).map(val =>
                            <option key={val} value={val}>{util.capitalize(val)}</option>
                        )}
                    </TextField>

                    <div className="dates">
                        <TextField label="StartDate" variant="outlined" className={classes.textField}
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            {...register("startDate", {
                                required: { value: true, message: "Missing start date." },
                                validate: {
                                    cannotBeInThePast: (value) => {
                                        // get the end of the chosen day => this will allow us to choose today as the start date
                                        const date: Date = util.getEndOfDay(value);
                                        return Date.parse(date.toString()) >= Date.now() || "Start date cannot be in the past";
                                    },
                                    compareToEndDate: (value) => {
                                        const { endDate } = getValues();
                                        if (!endDate) { return true };
                                        // Validate the coupon's dates => Start date should precede end date:
                                        return Date.parse(value.toString()) <= Date.parse(endDate.toString()) || "The start date should precede the end date";
                                    }
                                }
                            })}
                            InputProps={{ className: classes.input }}
                            error={!!errors.startDate}
                            helperText={errors.startDate?.message}
                        /><br />

                        <TextField label="EndDate" variant="outlined" className={classes.textField}
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            {...register("endDate", {
                                required: { value: true, message: "Missing end date." },
                                validate: {
                                    cannotBeInThePast: (value) => {
                                        return Date.parse(value.toString()) >= Date.now() || "End date cannot be in the past";
                                    },
                                    compareToStartDate: (value) => {
                                        const { startDate } = getValues();
                                        if (!startDate) { return true };
                                        // Validate the coupon's dates => End date should come after the start date:
                                        return Date.parse(startDate.toString()) <= Date.parse(value.toString()) || "The end date should come after the start date";
                                    }
                                }
                            })}
                            InputProps={{ className: classes.input }}
                            error={!!errors.endDate}
                            helperText={errors.endDate?.message}
                        />
                    </div>

                    <FormControl variant="outlined" className={classes.textField}>
                        <OutlinedInput disabled className="mui-input" label="Image" />
                        <input className="MuiInputBase-input MuiOutlinedInput-input file-input"
                            type="file" name="image" accept="image/*"
                            {...register("imageFile", {
                                required: { value: true, message: "Missing image." }
                            })}
                        />
                        <FormHelperText>{errors.imageFile?.message}</FormHelperText>
                    </FormControl>
                </div><br />

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

export default AddCoupon;
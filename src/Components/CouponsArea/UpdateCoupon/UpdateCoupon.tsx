import { Button, ButtonGroup, createStyles, FormControl, FormHelperText, InputAdornment, makeStyles, OutlinedInput, TextField, Theme, Typography } from "@material-ui/core";
import { ClearAll, Edit, Send } from "@material-ui/icons";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import { CategoryType } from "../../../Models/CategoryType";
import CouponModel from "../../../Models/CouponModel";
import { couponUpdatedAction } from "../../../Redux/CouponsState";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notification";
import util from "../../../Services/Util";
import "./UpdateCoupon.css";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        textField: {
            maxWidth: 250
        },
        input: {
            backgroundColor: '#ffffff',
        }
    }),
);

function UpdateCoupon(): JSX.Element {

    const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm<CouponModel>({
        mode: "all"
    });
    const history = useHistory();
    const classes = useStyles();

    const { id } = useParams<{ id: string }>();
    const couponId: number = +id;
    const [coupon] = useState(
        store.getState().couponsState.coupons.find(c => c.id === couponId)
    );
    const couponInitial = { ...coupon };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        switch (name) {
            case "title":
                setValue("title", value);
                break;
            case "description":
                setValue("description", value);
                break;
            case "amount":
                setValue("amount", +value);
                break;
            case "price":
                setValue("price", +value);
                break;
            case "category":
                setValue("category", CategoryType[value as keyof typeof CategoryType]);
                break;
            case "startDate":
                setValue("startDate", new Date(value));
                break;
            case "endDate":
                setValue("endDate", new Date(value));
                break;
        }
    }

    useEffect(() => {
        if (coupon) {
            setValue("id", couponId);
            setValue("title", coupon.title);
            setValue("description", coupon.description);
            setValue("amount", coupon.amount);
            setValue("price", coupon.price);
            setValue("category", coupon.category);
            setValue("startDate", coupon.startDate);
            setValue("endDate", coupon.endDate);
            setValue("image", coupon.image);
        }
    }, [coupon, couponId, setValue]);

    async function send(coupon: CouponModel) {
        // check: if no changes performed => do nothing
        if (!isCouponDifferent(couponInitial, coupon)) {
            notify.error("No changes were made!");
            return;
        }

        try {
            const myFormData = new FormData();
            myFormData.append("id", coupon.id.toString());
            myFormData.append("title", coupon.title);
            myFormData.append("description", coupon.description);
            myFormData.append("category", coupon.category.toString());
            myFormData.append("startDate", coupon.startDate.toString());
            myFormData.append("endDate", coupon.endDate.toString());
            myFormData.append("amount", coupon.amount.toString());
            myFormData.append("price", coupon.price.toString());
            myFormData.append("image", coupon.image);

            // imageFile is not required for update => 
            // append to FormData only if there is a new file to upload
            if (coupon.imageFile.length > 0) {
                myFormData.append("imageFile", coupon.imageFile.item(0));
            }

            const response = await jwtAxios.put<CouponModel>(globals.urls.company.coupon, myFormData);
            store.dispatch(couponUpdatedAction(response.data));
            notify.success("Coupon has been updated!");
            history.push("/company/coupons");
        } catch (err) {
            notify.error(err);
            if (err.response?.data?.status === 401) { // UNAUTHORIZED or Token Expired
                history.push("/logout");
            }
        }
    }

    function isCouponDifferent(couponBefore: CouponModel, coupon: CouponModel) {
        let isDiff: boolean = false;

        // for each entry of coupon (after changes)
        Object.entries(coupon).forEach(afterEntry => {

            // once isDiff is true => no need to check the rest of the entries
            if (isDiff) return;

            // get the same entry from the initial company object and compare them
            const beforeEntry = Object.entries(couponBefore).find(bEntry => afterEntry[0] === bEntry[0])

            // if "imageFile" has a new file => the entries are different
            if (afterEntry[1] instanceof FileList) {
                if ((afterEntry[1] as FileList).length > 0) {
                    isDiff = true;
                }
            } else if (!(afterEntry.toString() === beforeEntry.toString())) {
                isDiff = true;
            }
        });
        return isDiff;
    }

    return (
        <div className="UpdateCoupon">
            <Typography variant="h4" className="Headline"> <Edit /> Update Coupon</Typography>

            <form onSubmit={handleSubmit(send)}>
                <div className="grid">
                    <div className="texts">
                        <TextField label="Title" variant="outlined" className={classes.textField}
                            {...register("title", {
                                required: { value: true, message: "Missing title." },
                                minLength: { value: 3, message: "Title too short." },
                                pattern: { value: /^[a-zA-Z0-9 !?$%)(+-]+$/g, message: "Use only [a-zA-Z0-9!?$%)(+-] and space." }
                            })}
                            InputProps={{ className: classes.input }}
                            inputProps={{ onChange: handleChange }}
                            defaultValue={coupon?.title}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                        /><br />

                        <TextField label="Description" variant="outlined" className={classes.textField}
                            type="textarea" multiline rows="3" rowsMax={4}
                            {...register("description", {
                                required: { value: true, message: "Missing description." },
                                pattern: { value: /^[\w!?$%., /%&\r\n)*(+-]+$/g, message: "Use only [a-zA-Z0-9!?$%., /%&)*(+-] and white spaces." }
                            })}
                            InputProps={{ className: classes.input }}
                            inputProps={{ onChange: handleChange }}
                            defaultValue={coupon?.description}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />
                    </div>

                    <div className="dates">
                        <TextField label="StartDate" variant="outlined" className={classes.textField}
                            type="date"
                            {...register("startDate", {
                                required: { value: true, message: "Missing start date." },
                                validate: {
                                    compareToEndDate: (value) => {
                                        const { endDate } = getValues();
                                        if (!endDate) { return true };
                                        // Validate the coupon's dates => Start date should precede end date:
                                        return Date.parse(value.toString()) <= Date.parse(endDate.toString()) || "The start date should precede the end date";
                                    }
                                }
                            })}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ className: classes.input }}
                            inputProps={{ onChange: handleChange }}
                            defaultValue={coupon?.startDate}
                            error={!!errors.startDate}
                            helperText={errors.startDate?.message}
                        /><br />

                        <TextField label="EndDate" variant="outlined" className={classes.textField}
                            type="date"
                            {...register("endDate", {
                                required: { value: true, message: "Missing end date." },
                                validate: {
                                    compareToStartDate: (value) => {
                                        const { startDate } = getValues();
                                        if (!startDate) { return true };
                                        // Validate the coupon's dates => End date should come after the start date:
                                        return Date.parse(startDate.toString()) <= Date.parse(value.toString()) || "The end date should come after the start date";
                                    }
                                }
                            })}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ className: classes.input }}
                            inputProps={{ onChange: handleChange }}
                            defaultValue={coupon?.endDate}
                            error={!!errors.endDate}
                            helperText={errors.endDate?.message}
                        />
                    </div>

                    <TextField name="category" select className={classes.textField}
                        label="Please select a category" variant="outlined"
                        {...register("category", {
                            required: { value: true, message: "Category is required." },
                            pattern: { value: /^((?!ChooseOne).)*$/, message: "Choose any of the options but the first." }
                        })}
                        SelectProps={{ native: true }}
                        InputProps={{ className: classes.input }}
                        inputProps={{ onChange: handleChange }}
                        defaultValue={coupon?.category}
                        error={!!errors.category}
                        helperText={errors.category?.message}
                    >
                        <option value="ChooseOne">Choose</option>
                        {Object.values(CategoryType).map(val =>
                            <option key={val} value={val}>{util.capitalize(val)}</option>
                        )}
                    </TextField>

                    <div className="numbers">
                        <TextField label="Amount" variant="outlined" className={classes.textField}
                            type="number"
                            {...register("amount", {
                                required: { value: true, message: "Missing amount." },
                                pattern: { value: /^[1-9]\d*$/g, message: "Use only positive whole number." }
                            })}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ className: classes.input }}
                            inputProps={{ onChange: handleChange }}
                            defaultValue={coupon?.amount}
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
                                startadornment: <InputAdornment position="start">$</InputAdornment>,
                                onChange: handleChange
                            }}
                            defaultValue={coupon?.price}
                            error={!!errors.price}
                            helperText={errors.price?.message}
                        />
                    </div>

                    <div className="files">
                        {coupon?.image &&
                            <>
                                <img className={classes.textField}
                                    src={coupon?.image}
                                    alt={coupon?.title} title={coupon?.title}
                                />
                                <br />
                            </>
                        }

                        {/* Image file is not required in the update form */}
                        <FormControl variant="outlined" className={classes.textField}>
                            <OutlinedInput disabled className="mui-input" label="Image" />
                            <input className="MuiInputBase-input MuiOutlinedInput-input file-input"
                                type="file" name="image" accept="image/*"
                                {...register("imageFile")}
                            />
                            <FormHelperText>{errors.imageFile?.message}</FormHelperText>
                        </FormControl>
                    </div>
                </div><br />

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

export default UpdateCoupon;
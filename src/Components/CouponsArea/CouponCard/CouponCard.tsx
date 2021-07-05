import { CardMedia } from "@material-ui/core";
import { Delete, Edit, ShoppingCart } from "@material-ui/icons";
import { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import CouponModel from "../../../Models/CouponModel";
import { UserType } from "../../../Models/UserType";
import { couponDeletedAction } from "../../../Redux/CouponsState";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notification";
import SimpleDialog from "../../SharedArea/SimpleDialog/SimpleDialog";
import "./CouponCard.css";

interface CouponCardProps {
    coupon: CouponModel;
    userType: UserType;
    showPurchase?: boolean;
    detailsURL: string;
}

function CouponCard(props: CouponCardProps): JSX.Element {

    const history = useHistory();
    const coupon = props.coupon;
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");

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
            await jwtAxios.delete(`${globals.urls.company.coupon}${coupon.id}`);
            store.dispatch(couponDeletedAction(coupon.id));
            notify.success("Coupon has been deleted!");
        } catch (err) {
            notify.error(err);
            if (err.response?.data?.status === 401) { // UNAUTHORIZED or Token Expired
                history.push("/logout");
            }
        }
    }

    const handlePurchase = async () => {
        try {
            await jwtAxios.put(`${globals.urls.customer.purchaseCoupon}${coupon.id}`);
            notify.success("Coupon has been successfully purchased! You can see it in 'My coupons'.");
        } catch (err) {
            notify.error(err);
            if (err.response?.data?.status === 401) { // UNAUTHORIZED or Token Expired
                history.push("/logout");
            }
        }
    }

    return (
        <div className="CouponCard">
            <NavLink to={props.detailsURL} title="Click for details">
                {coupon?.image &&
                    <CardMedia className="media"
                        image={coupon?.image}
                        title={coupon?.title}
                    />
                }
                <h4>{coupon?.title}</h4>
                <span>{coupon?.description}</span>
            </NavLink>
            {props.userType === UserType.COMPANY &&
                <div className="buttons">
                    <NavLink to={`/company/coupons/update/${coupon?.id}`}>
                        <Edit />
                    </NavLink>
                    <NavLink to="#" onClick={handleClickOpen}>
                        <Delete />
                    </NavLink>
                </div>
            }
            {props.showPurchase &&
                <div className="buttons">
                    <NavLink to="#" onClick={handlePurchase}>
                        <ShoppingCart />
                    </NavLink>
                </div>
            }

            <SimpleDialog
                title={`${globals.dialogTitles.deleteItem} '${coupon?.title}'?`}
                selectedValue={selectedValue}
                open={open} onClose={handleClose}
            />
        </div>
    );
}

export default CouponCard;
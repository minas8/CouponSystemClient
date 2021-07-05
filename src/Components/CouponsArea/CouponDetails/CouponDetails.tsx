import { History } from "history";
import { Component } from "react";
import { RouteComponentProps } from "react-router";
import CouponModel from "../../../Models/CouponModel";
import { UserType } from "../../../Models/UserType";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notification";
import util from "../../../Services/Util";
import "./CouponDetails.css";

interface RouteParam {
    id: string;
}

interface CouponDetailsProps extends RouteComponentProps<RouteParam> {
    history: History;
}

interface CouponDetailsState {
    coupon: CouponModel;
}

class CouponDetails extends Component<CouponDetailsProps, CouponDetailsState> {

    public constructor(props: CouponDetailsProps) {
        super(props);
        this.state = { coupon: null };
    }

    public async componentDidMount() {
        try {
            const id = +this.props.match.params.id;
            let coupon = store.getState().couponsState.coupons.find(c => c.id === id);
            if (coupon) {
                this.setState({ coupon });
            } else if (id > 0) {
                const userType = store.getState().authState.user.userType;

                let url: string = "";
                if (userType === UserType.COMPANY) url = globals.urls.company.coupon;
                if (userType === UserType.CUSTOMER) url = globals.urls.customer.coupon;

                const response = await jwtAxios.get<CouponModel>(`${url}/${id}`);
                coupon = response.data;
                notify.success("Coupon details were received!");
                this.setState({ coupon });
            }
        } catch (err) {
            notify.error(err);
            if (err.response.data.status === 401) { // UNAUTHORIZED or Token Expired
                this.props.history.push("/logout");
            }
        }
    }

    public render(): JSX.Element {
        const coupon = this.state.coupon;
        const dStart = coupon?.startDate ? util.getDateDisplay(coupon.startDate) : "";
        const dEnd = coupon?.endDate ? util.getDateDisplay(coupon.endDate) : "";
        return (
            <div className="CouponDetails">
                {coupon &&
                    <div className="box">
                        <div>
                            <img src={coupon?.image}
                                alt={coupon?.title} title={coupon?.title}
                            />
                        </div>
                        <div>
                            <h2>Coupon Details</h2>
                            <p>Title: <br />
                                <span className="title">{coupon?.title}</span>
                            </p>
                            <p>Description:<br />
                                <span className="bold-small">{coupon?.description}</span>
                            </p>
                            <p>Category: &nbsp;
                                <span className="bold-small">{coupon?.category}</span>
                            </p>
                            <p>Start date: &nbsp;
                                <span className="bold-small">{dStart}</span>
                            </p>
                            <p>End date: &nbsp;
                                <span className="bold-small">{dEnd}</span>
                            </p>
                            <p>Amount: &nbsp;
                                <span className="bold-small">{coupon?.amount}</span>
                            </p>
                            <p>Price: &nbsp;
                                <span className="bold-small">${coupon?.price}</span>
                            </p>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default CouponDetails;
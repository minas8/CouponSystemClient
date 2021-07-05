import { InputAdornment, TextField } from "@material-ui/core";
import { AddBox } from "@material-ui/icons";
import { History } from "history";
import { ChangeEvent, Component } from "react";
import { NavLink } from "react-router-dom";
import { Unsubscribe } from "redux";
import { CategoryType } from "../../../Models/CategoryType";
import CouponModel from "../../../Models/CouponModel";
import { UserType } from "../../../Models/UserType";
import { couponsDownloadedAction } from "../../../Redux/CouponsState";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notification";
import util from "../../../Services/Util";
import CouponCard from "../CouponCard/CouponCard";
import "./CompanyCouponList.css";

interface CompanyCouponListState {
    coupons: CouponModel[];
    filterBy: string;
    filterSelectedValue: string | number;
}

interface CompanyCouponListProps {
    history: History;
}

class CompanyCouponList extends Component<CompanyCouponListProps, CompanyCouponListState> {

    // 'isAlive' is to prevent 'setState' if the user is not authorized and is pushed to logout page
    private isAlive = true;
    private unsubscribeCompanyCouponList: Unsubscribe;

    public constructor(props: CompanyCouponListProps) {
        super(props);
        this.state = {
            coupons: store.getState().couponsState.coupons,
            filterBy: "All",
            filterSelectedValue: null
        };
    }

    public setFilterBy = (filterBy: string) => {
        this.setState({ filterBy });
    }

    public setFilterSelectedValue = (filterSelectedValue: string | number) => {
        this.setState({ filterSelectedValue });
    }

    public handleChangeFilter = (event: ChangeEvent<{ name?: string; value: any; }>) => {
        const { value } = event.target;
        switch (value) {
            case "price":
            case "All":
                this.setFilterBy(value);
                this.setFilterSelectedValue(null);
                break;
            default:
                this.setFilterBy("category");
                this.setFilterSelectedValue((value as string).toLowerCase());
                break;
        }
    }

    public handleChangeMaxPrice = (event: ChangeEvent<HTMLInputElement>) => {
        this.setFilterSelectedValue(+event.target.value);
    }

    public async componentDidMount() {
        this.unsubscribeCompanyCouponList = store.subscribe(() => {
            this.setState({ coupons: store.getState().couponsState.coupons });
        });

        try {
            const response = await jwtAxios.get<CouponModel[]>(globals.urls.company.coupons);
            if (!this.isAlive) return;

            store.dispatch(couponsDownloadedAction(response.data));
            this.setState({ coupons: response.data });
        } catch (err) {
            notify.error(err);
            if (err.response?.data?.status === 401) { // UNAUTHORIZED or Token Expired
                this.props.history.push("/logout");
            }
        }
    }

    public getCouponsForDisplay() {
        if (!this.state.coupons || this.state.coupons.length === 0) return [];
        if (this.state.filterBy === "All") return this.state.coupons;

        const coupons = this.state.coupons.filter(coupon => {
            const filterVal = this.state.filterSelectedValue;
            if (this.state.filterBy === "price") {
                return coupon.price <= (filterVal as number);
            } else {
                return coupon.category.toLowerCase().includes((filterVal as string).toLowerCase());
            }
        });
        return coupons;
    }

    public render(): JSX.Element {
        const coupons = this.getCouponsForDisplay();
        const filterVal = this.state.filterSelectedValue;
        const filterBy = this.state.filterBy;
        const category = "category";
        const price = "price";

        return (
            <div className="CompanyCouponList">
                {coupons?.length === 0 && <><p>No coupons found in the system
                    {filterBy === category && <span> for {`${filterVal} ${category}`}</span>}
                    {filterBy === price && <span> with up to ${`${filterVal ? filterVal : 0} ${price}`}</span>}
                </p></>}
                {coupons?.length > 0 && <><p>{coupons?.length} coupons found in the system:</p></>}

                <NavLink to="/company/coupons/add">
                    <AddBox />
                </NavLink>

                <TextField name="category" select className="mui-select"
                    label="Filter by category" variant="outlined"
                    SelectProps={{
                        native: true,
                        onChange: (e: ChangeEvent<{ name?: string; value: any; }>) => {
                            this.handleChangeFilter(e);
                        }
                    }}
                >
                    <option value="All">All</option>
                    {Object.values(CategoryType).map(val =>
                        <option key={val} value={val}>{util.capitalize(val)}</option>
                    )}
                    <option value="price">Price</option>
                </TextField>

                {filterBy === price &&
                    <>
                        &nbsp;
                        <TextField label="Max Price" variant="outlined" className="mui-select"
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                                step: 0.01,
                                min: 0,
                                startadornment: <InputAdornment position="start">$</InputAdornment>,
                                onChange: (e: ChangeEvent<HTMLInputElement>) => this.handleChangeMaxPrice(e),
                            }}
                        />
                    </>
                }<br /><br />

                {coupons?.length > 0 &&
                    <div className="coupon-list">
                        {coupons?.map(c =>
                            <CouponCard key={`co${c.id}`} coupon={c}
                                detailsURL={`/company/coupons/${c.id}`}
                                userType={UserType.COMPANY}
                            />)
                        }
                    </div>
                }
            </div>
        );
    }

    public componentWillUnmount(): void {
        this.isAlive = false;
        this.unsubscribeCompanyCouponList();
    }
}

export default CompanyCouponList;
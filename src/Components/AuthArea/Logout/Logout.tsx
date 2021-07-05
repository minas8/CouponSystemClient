import { useEffect } from "react";
import { useHistory } from "react-router";
import { logoutAction } from "../../../Redux/AuthState";
import store from "../../../Redux/Store";
import notify from "../../../Services/Notification";

function Logout(): JSX.Element {

    const history = useHistory();
    const clearStore = () => {
        store.getState().companiesState.companies = [];
        store.getState().customersState.customers = [];
        store.getState().couponsState.coupons = [];
    }

    useEffect(() => {
        store.dispatch(logoutAction());
        clearStore();
        notify.success("You are now logged out.");
        history.push("/home");
    });

    return null;
}

export default Logout;


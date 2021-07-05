import { AddBox } from "@material-ui/icons";
import { History } from "history";
import { Component } from "react";
import { NavLink } from "react-router-dom";
import { Unsubscribe } from "redux";
import CompanyModel from "../../../Models/CompanyModel";
import { companiesDownloadedAction } from "../../../Redux/CompaniesState";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notification";
import CompanyCard from "../CompanyCard/CompanyCard";
import "./CompanyList.css";

interface CompanyListState {
    companies: CompanyModel[];
}

interface CompanyListProps {
    history: History;
}

class CompanyList extends Component<CompanyListProps, CompanyListState> {

    // 'isAlive' is to prevent 'setState' if the user is not authorized and is pushed to logout page
    private isAlive = true;
    private unsubscribeCompanyList: Unsubscribe;

    public constructor(props: CompanyListProps) {
        super(props);
        this.state = { companies: store.getState().companiesState.companies };
    }

    public async componentDidMount() {
        this.unsubscribeCompanyList = store.subscribe(() => {
            this.setState({ companies: store.getState().companiesState.companies });
        });

        try {
            // Sending JWT Token with interceptor:
            const response = await jwtAxios.get<CompanyModel[]>(globals.urls.admin.companies);
            if (!this.isAlive) return;

            store.dispatch(companiesDownloadedAction(response.data));
            this.setState({ companies: response.data });
        } catch (err) {
            notify.error(err);

            if (err.response?.data?.status === 401) { // UNAUTHORIZED or Token Expired
                this.props.history.push("/logout");
            }
        }
    }

    public render(): JSX.Element {
        const companies = this.state.companies;
        return (
            <div className="CompanyList">
                {companies?.length === 0 && <p>No companies found in the system</p>}
                {companies?.length > 0 && <p>{companies?.length} companies found in the system:</p>}

                <NavLink to="/companies/add" >
                    <AddBox />
                </NavLink>

                {companies?.length > 0 && <div className="comp-list">{companies?.map(c => <CompanyCard key={c.id} company={c} />)}</div>}
            </div>
        );
    }

    public componentWillUnmount(): void {
        this.isAlive = false;
        this.unsubscribeCompanyList();
    }
}

export default CompanyList;
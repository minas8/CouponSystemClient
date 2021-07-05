import { History } from "history";
import { Component } from "react";
import { RouteComponentProps } from "react-router";
import CompanyModel from "../../../Models/CompanyModel";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notification";
import "./CompanyDetails.css";

interface RouteParam {
    id: string;
}

interface CompanyDetailsProps extends RouteComponentProps<RouteParam> {
    history: History;
}

interface CompanyDetailsState {
    company: CompanyModel;
}

class CompanyDetails extends Component<CompanyDetailsProps, CompanyDetailsState> {

    // 'isAlive' is to prevent 'setState' if the user is not authorized and is pushed to logout page
    private isAlive = true;

    public constructor(props: CompanyDetailsProps) {
        super(props);
        this.state = { company: null };
    }

    public async componentDidMount() {
        try {
            const id = +this.props.match.params.id;
            let company = store.getState().companiesState.companies.find(c => c.id === id);
            if (company) {
                this.setState({ company });
            } else if (id > 0) {
                const response = await jwtAxios.get<CompanyModel>(`${globals.urls.admin.company}/${id}`);
                if (!this.isAlive) return;

                company = response.data;
                notify.success("Company details were received!");
                this.setState({ company });
            }
        } catch (err) {
            notify.error(err);
            if (err.response.data.status === 401) { // UNAUTHORIZED or Token Expired
                this.props.history.push("/logout");
            }
        }
    }

    public render(): JSX.Element {
        return (
            <div className="CompanyDetails">
                {this.state.company &&
                    <>
                        <h2>Company Details</h2>
                        <h3>Name: {this.state.company.name}</h3>
                        <h4>Email: {this.state.company.email}</h4>
                        <h4>Password: {this.state.company.password}</h4>
                        <br /><br />
                    </>
                }
            </div>
        );
    }

    public componentWillUnmount(): void {
        this.isAlive = false;
    }
}

export default CompanyDetails;
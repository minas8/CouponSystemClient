import CompanyModel from "../Models/CompanyModel";

// Companies state:
export class CompaniesState {
    companies: CompanyModel[] = [];
}

// -------------------------------------------

// Companies Action Types:
export enum CompaniesActionType {
    CompaniesDownloaded = "CompaniesDownloaded",
    CompanyAdded = "CompanyAdded",
    CompanyUpdated = "CompanyUpdated",
    CompanyDeleted = "CompanyDeleted"
}

// -------------------------------------------

// Companies Action:
export interface CompaniesAction {
    type: CompaniesActionType,
    payload?: any;
}

// -------------------------------------------

// Companies Action Creators:
export function companiesDownloadedAction(companies: CompanyModel[]): CompaniesAction {
    return { type: CompaniesActionType.CompaniesDownloaded, payload: companies };
}

export function companyAddedAction(company: CompanyModel): CompaniesAction {
    return { type: CompaniesActionType.CompanyAdded, payload: company };
}

export function companyUpdatedAction(company: CompanyModel): CompaniesAction {
    return { type: CompaniesActionType.CompanyUpdated, payload: company };
}

export function companyDeletedAction(id: number): CompaniesAction {
    return { type: CompaniesActionType.CompanyDeleted, payload: id };
}

// -------------------------------------------

// Companies Reducer:
export function companiesReducer(currentState: CompaniesState = new CompaniesState(), action: CompaniesAction): CompaniesState {
    const newState = {...currentState};

    switch (action.type) {
        case CompaniesActionType.CompaniesDownloaded:
            newState.companies = action.payload;
            break;
        case CompaniesActionType.CompanyAdded:
            newState.companies.push(action.payload);
            break;
        case CompaniesActionType.CompanyUpdated:
            newState.companies.map(c => {
                if(c.id !== action.payload.id) {
                    // if NOT current updated item - keep it as-is
                    return c;
                }
                // Otherwise - return the updated item
                return {
                    ...c,
                    ...action.payload
                }
            });
            break;
        case CompaniesActionType.CompanyDeleted:
            let companies = newState.companies.slice();
            const idxDel = newState.companies.findIndex(c => c.id === action.payload.id);
            companies.splice(idxDel,1);
            newState.companies = companies;
            break;
    }
    return newState;
}
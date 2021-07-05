import CustomerModel from "../Models/CustomerModel";

// Customers state:
export class CustomersState {
    customers: CustomerModel[] = [];
}

// -------------------------------------------

// Customers Action Types:
export enum CustomersActionType {
    CustomersDownloaded = "CustomersDownloaded",
    CustomerAdded = "CustomerAdded",
    CustomerUpdated = "CustomerUpdated",
    CustomerDeleted = "CustomerDeleted"
}

// -------------------------------------------

// Customers Action:
export interface CustomersAction {
    type: CustomersActionType,
    payload?: any;
}

// -------------------------------------------

// Customers Action Creators:
export function customersDownloadedAction(customers: CustomerModel[]): CustomersAction {
    return { type: CustomersActionType.CustomersDownloaded, payload: customers };
}

export function customerAddedAction(customer: CustomerModel): CustomersAction {
    return { type: CustomersActionType.CustomerAdded, payload: customer };
}

export function customerUpdatedAction(customer: CustomerModel): CustomersAction {
    return { type: CustomersActionType.CustomerUpdated, payload: customer };
}

export function customerDeletedAction(id: number): CustomersAction {
    return { type: CustomersActionType.CustomerDeleted, payload: id };
}

// -------------------------------------------

// Customers Reducer:
export function customersReducer(currentState: CustomersState = new CustomersState(), action: CustomersAction): CustomersState {
    const newState = {...currentState};

    switch (action.type) {
        case CustomersActionType.CustomersDownloaded:
            newState.customers = action.payload;
            break;
        case CustomersActionType.CustomerAdded:
            newState.customers.push(action.payload);
            break;
        case CustomersActionType.CustomerUpdated:
            newState.customers.map(c => {
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
        case CustomersActionType.CustomerDeleted:
            let customers = newState.customers.slice();
            const idxDel = newState.customers.findIndex(c => c.id === action.payload.id);
            customers.splice(idxDel,1);
            newState.customers = customers;
            break;
    }
    return newState;
}
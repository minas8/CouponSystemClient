import { combineReducers, createStore } from "redux";
import { authReducer } from "./AuthState";
import { companiesReducer } from './CompaniesState';
import { couponsReducer } from "./CouponsState";
import { customersReducer } from './CustomersState';

// Multiple Reducers:
const reducers = combineReducers({ authState: authReducer, companiesState: companiesReducer, customersState: customersReducer, couponsState: couponsReducer })
const store = createStore(reducers);

export default store;
import UserModel from "../Models/UserModel";

// Auth state:
export class AuthState {
    public user: UserModel = null;
    public constructor() {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        
        if(storedUser) {
            this.user = storedUser;
        }
    }
}

// -------------------------------------------

// Auth Action Types:
export enum AuthActionType {
    Login = "Login",
    Logout = "Logout"
}

// -------------------------------------------

// Auth Action:
export interface AuthAction {
    type: AuthActionType,
    payload?: any; // optional - payload is NOT needed for Logout...
}

// -------------------------------------------

// Auth Action Creators:
export function loginAction(user: UserModel): AuthAction {
    return { type: AuthActionType.Login, payload: user };
}

export function logoutAction(): AuthAction {
    return { type: AuthActionType.Logout };
}

// -------------------------------------------

// Auth Reducer:
export function authReducer(currentState: AuthState = new AuthState(), action: AuthAction): AuthState {
    const newState = {...currentState};

    switch (action.type) {
        case AuthActionType.Login: // payload is the logged in user sent from the server
            newState.user = action.payload;
            localStorage.setItem("user", JSON.stringify(newState.user)); // save in localStorage
            break;
        case AuthActionType.Logout: // no payload required!        
            newState.user = null;
            localStorage.removeItem("user"); // remove from localStorage
            break;
    }

    return newState;
}
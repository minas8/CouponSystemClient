import CouponModel from "../Models/CouponModel";

// Coupons state:
export class CouponsState {
    coupons: CouponModel[] = [];
}

// -------------------------------------------

// Coupons Action Types:
export enum CouponsActionType {
    CouponsDownloaded = "CouponsDownloaded",
    CouponAdded = "CouponAdded",
    CouponUpdated = "CouponUpdated",
    CouponDeleted = "CouponDeleted"
}

// -------------------------------------------

// Coupons Action:
export interface CouponsAction {
    type: CouponsActionType,
    payload?: any;
}

// -------------------------------------------

// Coupons Action Creators:
export function couponsDownloadedAction(coupons: CouponModel[]): CouponsAction {
    return { type: CouponsActionType.CouponsDownloaded, payload: coupons };
}

export function couponAddedAction(coupon: CouponModel): CouponsAction {
    return { type: CouponsActionType.CouponAdded, payload: coupon };
}

export function couponUpdatedAction(coupon: CouponModel): CouponsAction {
    return { type: CouponsActionType.CouponUpdated, payload: coupon };
}

export function couponDeletedAction(id: number): CouponsAction {
    return { type: CouponsActionType.CouponDeleted, payload: id };
}

// -------------------------------------------

// Coupons Reducer:
export function couponsReducer(currentState: CouponsState = new CouponsState(), action: CouponsAction): CouponsState {
    const newState = {...currentState};

    switch (action.type) {
        case CouponsActionType.CouponsDownloaded:
            newState.coupons = action.payload;
            break;
        case CouponsActionType.CouponAdded:
            newState.coupons.push(action.payload);
            break;
        case CouponsActionType.CouponUpdated:
            newState.coupons.map(c => {
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
        case CouponsActionType.CouponDeleted:            
            let coupons = newState.coupons.slice();
            const idxDel = newState.coupons.findIndex(c => c.id === action.payload.id);
            coupons.splice(idxDel,1);
            newState.coupons = coupons;
            break;
    }
    return newState;
}
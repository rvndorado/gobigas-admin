export const FETCH_ORDER_LIST = orderList => {
    return {
        type: 'FETCH_ORDER_LIST',
        payload: orderList
    };
}

export const FETCH_PRODUCT_LIST = productList => {
    return {
        type: 'FETCH_PRODUCT_LIST',
        payload: productList
    };
}

export const ADD_ORDER_LIST_ITEM = orderItem => {
    return {
        type: 'ADD_ORDER_LIST_ITEM',
        payload: orderItem
    };
}



export const UPDATE_ORDER_ITEMS = orderItem => {
    return {
        type: 'UPDATE_ORDER_ITEMS',
        payload: orderItem
    };
}

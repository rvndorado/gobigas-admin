export const FETCH_STOCK_LIST = stockList => {
    return {
        type: 'FETCH_STOCK_LIST',
        payload: stockList
    };
}

export const FETCH_PRODUCT_ITEMS = productList => {
    return {
        type: 'FETCH_PRODUCT_ITEMS',
        payload: productList
    };
}


export const ADD_STOCK_LIST_ITEM = stockItem => {
    return {
        type: 'ADD_STOCK_LIST_ITEM',
        payload: stockItem
    };
}



export const SET_STOCK_LIST_UPDATE = stockItem => {
    return {
        type: 'SET_STOCK_LIST_UPDATE',
        payload: stockItem
    };
}

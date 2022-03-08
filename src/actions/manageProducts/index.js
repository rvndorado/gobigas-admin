export const FETCH_PRODUCT_LIST = productList  => {
    return {
        type: 'FETCH_PRODUCT_LIST',
        payload: productList
    };
}


export const ADD_NEW_PRODUCT = productItem => {
    return {
        type: 'ADD_NEW_PRODUCT',
        payload: productItem
    };
}


export const UPDATE_PRODUCT_ITEM = productItem => {
    return {
        type: 'UPDATE_PRODUCT_ITEM',
        payload: productItem
    };
}

export const ADD_NEW_PRODUCT_IMAGE = imageItem => {
    return {
        type: 'ADD_NEW_PRODUCT_IMAGE',
        payload: imageItem
    };
}

export const REMOVE_PRODUCT_IMAGE = () => {
    return {
        type: 'REMOVE_PRODUCT_IMAGE',
    };
}
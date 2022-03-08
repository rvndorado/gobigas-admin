export const FETCH_EXPENSE_LIST = expenseList => {
    return {
        type: 'FETCH_EXPENSE_LIST',
        payload: expenseList
    };
}

export const ADD_EXPENSE_LIST_ITEM = expenseItem => {
    return {
        type: 'ADD_EXPENSE_LIST_ITEM',
        payload: expenseItem
    };
}



export const SET_SELECTED_EXPENSE = expenseItem => {
    return {
        type: 'SET_SELECTED_EXPENSE',
        payload: expenseItem
    };
}

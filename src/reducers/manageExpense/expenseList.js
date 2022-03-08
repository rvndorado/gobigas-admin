const initialState = {
    list : [],
    columns : [
        {
            id: 'id',
            name: 'ID'
        },
        {
            id: 'entry_type',
            name: 'Entry Type'
        },
        {
            id: 'amount',
            name: 'Amount'
        },
        {
            id: 'date',
            name: 'Date',
            formatter: (cell) => cell.toDate().toDateString()
        },
        {
            id: 'description',
            name: 'Description'
        },
        {
            id: 'image',
            name: 'Image URL'
        },
        {
            id: 'action',
            name: 'Actions'
        }

    ],
}
const expenseList = (state = initialState, action) => {
    switch(action.type) {
        case 'FETCH_EXPENSE_LIST' : 
            return {
                ...state,
                list: action.payload
            }
        case 'ADD_EXPENSE_LIST_ITEM' :
            return {
                ...state,
                list: [action.payload, ...state.list]
            }
        case 'SET_SELECTED_EXPENSE' : 
            const expenseItem = action.payload;
            const expenseList = [...state.list];
            const index = expenseList.findIndex(item => {
                return item['id']=== expenseItem['id']
            });
            expenseList[index] = expenseItem;
            return {
                ...state,
                list: expenseList
            }
        default:
            return state
    }
}

export default expenseList;
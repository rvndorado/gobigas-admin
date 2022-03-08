const initialState = {
    list : [],
    columns : [
        {
            id: 'id',
            name: 'ID'
        },
        {
            id: 'product_id',
            name: 'Product ID'
        },
        {
            id: 'product_name',
            name: 'Product Name'
        },
        {
            id: 'kilograms',
            name: 'Kilograms'
        },
        {
            id: 'quantity',
            name: 'Stock Quantity'
        },
        {
            id: 'sold',
            name: 'Stock Sold'
        },
        {
            id: 'remaining',
            name: 'Stock Remaining'
        },
        {
            id: 'date',
            name: 'Date Created',
            formatter: (cell) => cell.toDate().toDateString()
        },
        {
            id: 'action',
            name: 'Actions'
        }

    ],
    productList: []
}
const stockList = (state = initialState, action) => {
    switch(action.type) {
        case 'FETCH_STOCK_LIST' : 
            return {
                ...state,
                list: action.payload
            }
        case 'FETCH_PRODUCT_ITEMS' :
            return {
                ...state,
                productList: action.payload
            }
        case 'ADD_STOCK_LIST_ITEM' :
            return {
                ...state,
                list: [action.payload, ...state.list]
            }
        case 'SET_STOCK_LIST_UPDATE' : 
            const stockItem = action.payload;
            const stockList = [...state.list];
            const index = stockList.findIndex(item => {
                return item['id']=== stockItem['id']
            });
            stockList[index] = stockItem;
            return {
                ...state,
                list: stockList
            }
        default:
            return state
    }
}

export default stockList;
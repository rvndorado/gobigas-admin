import { _ } from 'gridjs-react';
const initialState = {
    list : [],
    productList: [],
    columns : [
        {
            id: 'id',
            name: 'ID'
        },
        {
            id: 'name',
            name: 'Full Name'
        },
        {
            id: 'email',
            name: 'Email'
        },
        {
            id: 'contact_number',
            name: 'Contact Number'
        },
        {
            id: 'delivery_address',
            name: 'Delivery Address'
        },
        {
            id: 'date',
            name: 'Date',
            formatter: (cell) => cell.toDate().toDateString()
        },
        {
            id:'total_amount',
            name: 'Total Amount'
        },
        {
            id: 'status',
            name: 'Status'
        },
        {
            id: 'image',
            name: 'Image',
            formatter: (cell) => _(<a href={cell} target="_blank" rel="noopener noreferrer">Image URL</a>)
        },
        {
            id: 'items',
            name: 'Order Items'
        },
        {
            id: 'action',
            name: 'Actions'
        }

    ],
}
const orderList = (state = initialState, action) => {
    switch(action.type) {
        case 'FETCH_ORDER_LIST' : 
            return {
                ...state,
                list: action.payload
            }
        case 'FETCH_PRODUCT_LIST' : 
            return {
                ...state,
                productList: action.payload
            }
        case 'ADD_ORDER_LIST_ITEM' :
            return {
                ...state,
                list: [action.payload, ...state.list]
            }
        case 'UPDATE_ORDER_ITEMS' : 
            const orderItem = action.payload;
            const orderList = [...state.list];
            const index = orderList.findIndex(item => {
                return item['id']=== orderItem['id']
            });
            orderList[index] = orderItem;
            return {
                ...state,
                list: orderList
            }
        default:
            return state
    }
}

export default orderList;
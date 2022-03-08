const initialState = {
    list : [],
    imageList: [],
    columns : [
        {
            id: 'id',
            name: 'ID'
        },
        {
            id: 'product_name',
            name: 'Product Name'
        },
        {
            id: 'kilograms',
            name:'Kilograms'
        },
        {
            id: 'amount',
            name: 'Amount'
        },
        {
            id: 'online_fees',
            name: 'Online Fee'
        },
        {
            id: 'description',
            name: 'Description'
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
}


const addNewImage = (list, imageItem) => {
    const productList = list;
    const index = productList.findIndex(item => {
        return item['id']=== imageItem['id']
    });
    productList[index]['images'].push(imageItem['imageURL']);
    console.log(productList);
    return productList;
}

const productList = (state = initialState, action) => {
    switch(action.type) {
        case 'FETCH_PRODUCT_LIST' :
            return {
                ...state,
                list: action.payload
            }
        case 'ADD_NEW_PRODUCT' : 
            return {
                ...state,
                list: [action.payload, ...state.list]
            }
        case 'UPDATE_PRODUCT_ITEM' : 
            const productItem = action.payload;
            const productList = [...state.list];
            const index = productList.findIndex(item => {
                return item['id']=== productItem['id']
            });
            productList[index] = productItem;
            return {
                ...state,
                list: productList
            }
        case 'ADD_NEW_PRODUCT_IMAGE' : 
            return {
                ...state,
                list: addNewImage([...state.list], action.payload)
            }
        case 'REMOVE_PRODUCT_IMAGE' : 
            return {
                ...state,
                list: action.payload
            }
        default:
            return state
    }
}

export default productList;
const initialState = {
    list : [],
    columns : [
        {
            id: 'id',
            name: 'ID'
        },
        {
            id: 'email',
            name: 'Email'
        },
        {
            id: 'firstName',
            name: 'First Name'
        },
        {
            id: 'lastName',
            name: 'Last Name'
        },
        {
            id: 'createdBy',
            name: 'Created By'
        }

    ]
}
const adminList = (state = initialState, action) => {
    switch(action.type) {
        case 'FETCH_ADMIN_LIST' : 
            return {
                ...state,
                list: action.payload
            }
        default:
            return state
    }
}

export default adminList;
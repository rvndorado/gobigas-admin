import React, { Fragment } from 'react';
import AdminList from '../containers/manageUsers/adminList/adminList';
import CustomerList from '../containers/manageUsers/customerList/customerList';

const ManageUsers = () => {
    return(<Fragment>
        <div className="manageusers">
            <AdminList />
        </div>

    </Fragment>);
}

export default ManageUsers;

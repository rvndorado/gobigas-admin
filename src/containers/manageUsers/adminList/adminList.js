import React, { Fragment, useState, useEffect } from 'react';
import { Grid, _ } from 'gridjs-react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Modal from '../../../presentationals/modal/modal';
import ModalBody from './modalBody';
import firebase from '../../../firebase/firebase';
import {  useSelector, useDispatch } from 'react-redux';
import { FETCH_ADMIN_LIST } from '../../../actions/manageUsers/index';

import 'gridjs/dist/theme/mermaid.css';
import './adminList.scss';

const AdminList = () => {
    const [isOpen, setIsOpen] = useState(false);
    const adminList = useSelector(state => state.adminList.list);
    const columns = useSelector(state => state.adminList.columns);
    const dispatch = useDispatch();

    const getAdminUserList = async () => {
        const adminUserList = [];
        const adminUserListRef = firebase.firestore().collection('admin_users');
        const snapshot = await adminUserListRef.get();
        snapshot.forEach(doc => {
            adminUserList.push(Object.assign({ id: doc.id }, doc.data()));
        });
        dispatch(FETCH_ADMIN_LIST(adminUserList));
    }

    useEffect(() => {
        getAdminUserList();
    }, []);


    return(<Fragment>
        <Modal
            isOpen={isOpen}
            closeFn={() => setIsOpen(false)}
            title="Admin User Details"
            modalBody={<ModalBody />}
         />
        <div className="adminlist">
            <div className="adminlist__title">
                <Typography color="textPrimary" variant="h5">Admin List</Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setIsOpen(true)}> Add Admin</Button>
            </div>
            <div className="adminlist__table">
                <Grid 
                    data={adminList} 
                    columns={columns}
                    search={true}
                    pagination={{ enabled: true, limit: 10 }}
                />
            </div>
        </div>
    </Fragment>);
}

export default AdminList;


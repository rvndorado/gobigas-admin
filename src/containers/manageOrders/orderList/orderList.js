import React, { Fragment, useState, useEffect } from 'react';
import { Grid, _ } from 'gridjs-react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Modal from '../../../presentationals/modal/modal';
import ModalBody from './modalBody';
import ItemModalBody from './itemListBody';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import firebase from '../../../firebase/firebase';
import {  useSelector, useDispatch } from 'react-redux';
import { FETCH_ORDER_LIST, FETCH_PRODUCT_LIST } from '../../../actions/manageOrders/index';
import 'gridjs/dist/theme/mermaid.css';
import './orderList.scss';

const OrderList = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenOrderItems, setIsOpenOrderItems] = useState(false);
    const [action, setAction] = useState('add');
    const [docID, setDocID] = useState('0');
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const orderList = useSelector(state => state.orderList.list);
    const columns = useSelector(state => state.orderList.columns);
    const dispatch = useDispatch();

    const getOrderList = async () => {
        const orderList = [];
        const orderListRef = firebase.firestore().collection('order_list');
        const query = orderListRef.orderBy('date', 'desc');
        const snapshot = await query.get();
        snapshot.forEach(doc => {
            const data = doc.data();
            data.remaining = data.quantity - data.sold;
            orderList.push(
                Object.assign({ 
                        id: doc.id,
                        action: _(<Button variant="contained" onClick={() => openModal('edit', doc.id)} color="primary" startIcon={<EditIcon />}> Edit</Button>),
                        items: _(<Button variant="contained" onClick={() => openOrderItems(doc.id)} color="primary" startIcon={<EditIcon />}> Edit</Button>)
                    }, 
                data)
            );
        });
        dispatch(FETCH_ORDER_LIST(orderList));
        
    }

    const getProductList = async () => {
        const productList = [];
        const productListRef = firebase.firestore().collection('product_list');
        const snapshot = await productListRef.get();
        snapshot.forEach(doc => {
            const data = doc.data();
            productList.push(data);
        });
        dispatch(FETCH_PRODUCT_LIST(productList));
    }

    const openModal = (action, docID) => {
        setAction(action);
        setDocID(docID);
        setIsOpen(true);
    }

    const openOrderItems = (documentID) => {
        setIsOpenOrderItems(true);
        setDocID(documentID);
    }

    useEffect(() => {
        getOrderList();
        getProductList();
    }, []);

    return(<Fragment>
        <Snackbar open={openToast} autoHideDuration={3000} onClose={() => setOpenToast(false)}>
            <Alert onClose={() => setOpenToast(false)} severity="success">
                {toastMessage}
            </Alert>
        </Snackbar>
        <Modal
            isOpen={isOpen}
            closeFn={() => setIsOpen(false)}
            title="Order Details"
            modalBody={<ModalBody
                action={action}
                docID = {docID}
                closeFn={() => setIsOpen(false)}
                openFn={openModal}
                openOrderFn={openOrderItems}
                openToastFn={setOpenToast}
                toastFn={setToastMessage}
             />}
         />
        <Modal
            isOpen={isOpenOrderItems}
            closeFn={() => setIsOpenOrderItems(false)}
            title="Order Items"
            modalBody={<ItemModalBody
                docID = {docID}    
            />}
         />
        <div className="orderlist">
            <div className="orderlist__title">
                <Typography color="textPrimary" variant="h5">Order List</Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => openModal('add', 0)}> Add Order</Button>
            </div>
            <div className="orderlist__table">
                <Grid 
                    data={orderList} 
                    columns={columns}
                    search={true}
                    pagination={{ enabled: true, limit: 10 }}
                />
            </div>
        </div>
    </Fragment>);
}

export default OrderList;
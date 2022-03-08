import React, { Fragment, useState, useEffect } from 'react';
import { Grid, _ } from 'gridjs-react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Modal from '../../../presentationals/modal/modal';
import ModalBody from './modalBody';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import firebase from '../../../firebase/firebase';
import {  useSelector, useDispatch } from 'react-redux';
import { FETCH_STOCK_LIST, FETCH_PRODUCT_ITEMS } from '../../../actions/manageStocks/index';
import 'gridjs/dist/theme/mermaid.css';
import './stockList.scss';

const StockList = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [action, setAction] = useState('add');
    const [docID, setDocID] = useState('0');
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const stockList = useSelector(state => state.stockList.list);
    const columns = useSelector(state => state.stockList.columns);
    const dispatch = useDispatch();

    const getStockList = async () => {
        const stockList = [];
        const stockListRef = firebase.firestore().collection('stock_list');
        const snapshot = await stockListRef.get();
        snapshot.forEach(doc => {
            const data = doc.data();
            data.remaining = data.quantity - data.sold;
            stockList.push(
                Object.assign({ 
                        id: doc.id,
                        action: _(<Button variant="contained" onClick={() => openModal('edit', doc.id)} color="primary" startIcon={<EditIcon />}> Edit</Button>)
                    }, 
                data)
            );
        });
        dispatch(FETCH_STOCK_LIST(stockList));
        
    }

    const getProductList = async () => {
        const productList = [];
        const productListRef = firebase.firestore().collection('product_list');
        const snapshot = await productListRef.get();
        snapshot.forEach(doc => {
            const data = doc.data();
            productList.push({
                id: doc.id,
                product_name: data['product_name'],
                kilograms: data['kilograms']
            });
        });
        dispatch(FETCH_PRODUCT_ITEMS(productList));
    }

    const openModal = (action, docID) => {
        setAction(action);
        setDocID(docID);
        setIsOpen(true);
    }

    useEffect(() => {
        getStockList();
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
            title="Stock Details"
            modalBody={<ModalBody
                action={action}
                docID = {docID}
                closeFn={() => setIsOpen(false)}
                openFn={openModal}
                openToastFn={setOpenToast}
                toastFn={setToastMessage}
            />}
         />
        <div className="stocklist">
            <div className="stocklist__title">
                <Typography color="textPrimary" variant="h5">Stock List</Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => openModal('add', '0')}> Add Stocks</Button>
            </div>
            <div className="stocklist__table">
                <Grid 
                    data={stockList} 
                    columns={columns}
                    search={true}
                    pagination={{ enabled: true, limit: 10 }}
                />
            </div>
        </div>
    </Fragment>);
}

export default StockList;
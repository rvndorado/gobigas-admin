import React, { Fragment, useState, useEffect } from 'react';
import { Grid, _ } from 'gridjs-react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Modal from '../../../presentationals/modal/modal';
import ModalBody from './modalBody';
import ImageList from './imageList';
import {  useSelector, useDispatch } from 'react-redux';
import firebase from '../../../firebase/firebase';
import { FETCH_PRODUCT_LIST } from '../../../actions/manageProducts/index';
import 'gridjs/dist/theme/mermaid.css';
import './productList.scss';


const ProductList = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isImageListOpen, setIsImageListOpen] = useState(false);
    const [action, setAction] = useState('add');
    const [docID, setDocID] = useState('0');
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const productList = useSelector(state => state.productList.list);
    const columns = useSelector(state => state.productList.columns);
    const dispatch = useDispatch();

    const fetchProductList = async ()  => {
        const productList = [];
        const productListRef = firebase.firestore().collection('product_list');
        const query = productListRef.orderBy('date', 'desc');
        const snapshot = await query.get();
    
        snapshot.forEach(doc => {
            const data = doc.data();
            productList.push(
                Object.assign({ 
                        id: doc.id,
                        action: _(
                            <Fragment>
                                <Button 
                                    variant="contained" 
                                    onClick={() => openDetailsModal('edit', doc.id)} 
                                    color="primary" 
                                    startIcon={<EditIcon />}
                                    style={{ marginRight: '10px' }}
                                > Details
                                </Button>  
                                <Button 
                                    variant="contained" 
                                    onClick={() => openImageModal(doc.id)} 
                                    color="primary" 
                                    startIcon={<EditIcon />}
                                > Images
                                </Button> 
                            </Fragment>                                
                            )
                    }, 
                data)
            );
        });
        dispatch(FETCH_PRODUCT_LIST(productList));
    }

    const openDetailsModal = (action, docID) => {
        setAction(action);
        setDocID(docID);
        setIsOpen(true);
    }

    const openImageModal = (docID) => {
        setDocID(docID)
        setIsImageListOpen(true);
    }

    useEffect(() => {
        fetchProductList();
    }, [])



    return(<Fragment>
        <Snackbar open={openToast} autoHideDuration={3000} onClose={() => setOpenToast(false)}>
            <Alert onClose={() => setOpenToast(false)} severity="success">
                {toastMessage}
            </Alert>
        </Snackbar>
        <Modal
            isOpen={isOpen}
            closeFn={() => setIsOpen(false)}
            title="Product Details"
            modalBody={<ModalBody 
                action={action}
                docID = {docID}
                closeFn={() => setIsOpen(false)}
                openFn={openDetailsModal}
                openToastFn={setOpenToast}
                toastFn={setToastMessage}
                imageModal={openImageModal}
    
            />}
         />
        <Modal
            isOpen={isImageListOpen}
            closeFn={() => setIsImageListOpen(false)}
            title="Product Images"
            modalBody={<ImageList docID = {docID} />}
         />
        <div className="productlist">
            <div className="productlist__title">
                <Typography color="textPrimary" variant="h5">Product List</Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => openDetailsModal('add', 0)}> Add Product</Button>
            </div>
            <div className="productlist__table">
                <Grid 
                    data={productList} 
                    columns={columns}
                    search={true}
                    pagination={{ enabled: true, limit: 10 }}
                />
            </div>
        </div>
    </Fragment>);
}

export default ProductList;
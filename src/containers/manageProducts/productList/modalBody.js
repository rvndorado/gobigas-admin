import React, { Fragment, useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import Alert from '@material-ui/lab/Alert';
import firebase, { Timestamp } from '../../../firebase/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import {  useSelector, useDispatch } from 'react-redux';
import { _ } from 'gridjs-react';
import { ADD_NEW_PRODUCT, UPDATE_PRODUCT_ITEM } from '../../../actions/manageProducts/index';



const ModalBody = ({action, docID, closeFn, openFn, openToastFn, toastFn, imageModal}) => {

    const [productName, setProductName] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [kilograms, setKilograms] = useState(0);
    const [onlineFee, setOnlineFee] = useState(0);
    const [imageList, setImageList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { currentUser } = useAuth();
    const dispatch = useDispatch();

    const productList = useSelector(state => state.productList.list);

    const handleSubmit = async () => {
        try {
            setError('');
            setLoading(true);
            const data = {
                product_name: productName,
                amount: amount,
                description: description,
                kilograms: kilograms,
                online_fees: onlineFee,
                date: Timestamp.fromDate(new Date())
            }
            const productListRef = action === 'add' ? firebase.firestore().collection('product_list') : firebase.firestore().collection('product_list').doc(docID);
            if(action === 'add') {
                data.images= [];
                data.createdBy = currentUser.email;
                const response = await productListRef.add(data);
                data.id = response.id;
                data.action = generateTableButtons(response.id);
                dispatch(ADD_NEW_PRODUCT(data));
                toastFn('Product item added successfully');
                openToastFn(true);
            } else {
                data.lastUpdateBy = currentUser.email;
                data.images = imageList;
                await productListRef.update(data);
                data.id = docID;
                data.action = generateTableButtons(docID);
                dispatch(UPDATE_PRODUCT_ITEM(data));
                toastFn('Product item updated successfully');
                openToastFn(true);
            }
            closeFn();
        } catch(error) {
            setError('A problem has occured');
        }
        setLoading(false);
    }

    const generateTableButtons = (documentID) => {
        return _(
            <Fragment>
                <Button 
                    variant="contained" 
                    onClick={() => openFn('edit', documentID)} 
                    color="primary" 
                    startIcon={<EditIcon />}
                    style={{ marginRight: '10px' }}
                > Details
                </Button>  
                <Button 
                    variant="contained" 
                    onClick={() => imageModal(documentID)} 
                    color="primary" 
                    startIcon={<EditIcon />}
                > Images
                </Button> 
            </Fragment>                                
            )
    }

    useEffect(() => {
        if(action === 'edit') {
            const productItem = productList.filter(item => item.id.indexOf(docID) > -1);
            console.log(productItem);
            setProductName(productItem[0].product_name);
            setAmount(productItem[0].amount);
            setDescription(productItem[0].description);
            setImageList(productItem[0].images);
            setKilograms(productItem[0].kilograms);
            setOnlineFee(productItem[0].online_fees);
        }
    }, [])

    return(<Fragment>
        {error && <Alert severity="error">{error}</Alert>}
        <form autoComplete="off" onSubmit={(e) => e.preventDefault(handleSubmit())}>
            <TextField 
                required id="product_name" 
                label="Product Name" 
                placeholder="Product Name" 
                fullWidth 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
            />
            <TextField 
                required id="kilograms" 
                label="Kilograms" 
                placeholder="Kilograms" 
                fullWidth 
                value={kilograms}
                onChange={(e) => setKilograms(e.target.value)}
            />
            <TextField 
                required 
                id="amount" 
                type="number" 
                label="Amount" 
                placeholder="Amount" 
                fullWidth 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <TextField 
                required 
                id="onlineFee" 
                type="number" 
                label="Online Fees" 
                placeholder="Online Fees" 
                fullWidth 
                value={onlineFee}
                onChange={(e) => setOnlineFee(e.target.value)}
            />
            <TextField 
                required id="description" 
                label="Description" 
                multiline 
                rows="5" 
                placeholder="Description" 
                fullWidth 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <Button 
                variant="contained" 
                color="primary" 
                type="submit" 
                style={{ marginTop: '20px' }}
                disabled={loading}
            >
                Submit
            </Button>
        </form>
    </Fragment>);
}

export default ModalBody;
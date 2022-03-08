import React, { Fragment, useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import EditIcon from '@material-ui/icons/Edit';
import Alert from '@material-ui/lab/Alert';
import firebase, { Timestamp } from '../../../firebase/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import {  useSelector, useDispatch } from 'react-redux';
import { _ } from 'gridjs-react';
import { SET_STOCK_LIST_UPDATE, ADD_STOCK_LIST_ITEM } from '../../../actions/manageStocks/index';



const ModalBody = ({action, docID, closeFn, openFn, openToastFn, toastFn}) => {

    const [product, setProduct] = useState('');
    const [productName, setProductName] = useState('');
    const [kilograms, setKilograms] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [sold, setSold] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { currentUser } = useAuth();
    const dispatch = useDispatch();

    const stockList = useSelector(state => state.stockList.list);
    const productList = useSelector(state => state.stockList.productList);

    const handleSubmit = async () => {
        try {
            setError('');
            setLoading(true);
            const stockListRef = action === 'add' ? firebase.firestore().collection('stock_list') : firebase.firestore().collection('stock_list').doc(docID);
            const data = {
                product_id: product,
                product_name: productName,
                kilograms: kilograms,
                quantity: quantity,
                sold: sold,
                remaining: (quantity - sold),
                date: Timestamp.fromDate(new Date())
            }
            console.log(data);
            if(action === 'add') {
                data.createdBy = currentUser.email
                const response = await stockListRef.add(data);
                data.id = response.id;
                data.action = _(<Button variant="contained" onClick={() => openFn('edit', response.id)} color="primary" startIcon={<EditIcon />}> Edit</Button>)
                dispatch(ADD_STOCK_LIST_ITEM(data));
                toastFn('Expense item added successfully');
                openToastFn(true);
            } else {
                data.lastUpdateBy = currentUser.email
                await stockListRef.update(data);
                data.id = docID;
                data.action = _(<Button variant="contained" onClick={() => openFn('edit', docID)} color="primary" startIcon={<EditIcon />}> Edit</Button>)
                dispatch(SET_STOCK_LIST_UPDATE(data));
                toastFn('Expense item updated successfully');
                openToastFn(true);
            }
            closeFn();
        } catch(error) {
            setError('A problem has occured');
        }
        setLoading(false);
    }

    const handleProductChange = (event) => {
        const selectedProduct = productList.filter(product => product.id === event.target.value); 
        setProduct(event.target.value);
        setProductName(selectedProduct[0].product_name);
        setKilograms(selectedProduct[0].kilograms);
    }

    useEffect(() => {
        if(action === 'edit') {
            const stockItem = stockList.filter(item => item.id.indexOf(docID) > -1);
            const selectedProduct = productList.filter(product => product.id === stockItem[0]['product_id']); 
            setQuantity(stockItem[0]['quantity']);
            setProduct(stockItem[0]['product_id']);
            setSold(stockItem[0]['sold']);
            setProductName(selectedProduct[0].product_name);
            setKilograms(selectedProduct[0].kilograms);
        }
    }, [])

    return(<Fragment>
        {error && <Alert severity="error">{error}</Alert>}
        <br />
        <form autoComplete="off" onSubmit={(e) => e.preventDefault(handleSubmit())}>
            <FormControl fullWidth required>
                <InputLabel id="product-select-label">Product</InputLabel>
                <Select
                    labelId="product-select-label"
                    id="product-select"
                    value={product}
                    onChange={handleProductChange}
                >
                    {productList.map((product, index) => {
                        const productIndex = product + index.toString();
                        return(<MenuItem key={productIndex} value={product.id}>{product.product_name} ({product.kilograms}KG)</MenuItem>);
                    })}
                </Select>
            </FormControl>
            <TextField 
                required id="quantity" 
                type="number" 
                label="Stock Quantity" 
                placeholder="Stock Quantity" 
                fullWidth
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
            />
            <Button variant="contained" disabled={loading} color="primary" type="submit" style={{ marginTop: '20px' }}>Submit</Button>
        </form>
    </Fragment>);
}

export default ModalBody;
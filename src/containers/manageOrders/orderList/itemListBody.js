import React, { Fragment, useState, useEffect } from 'react';
import { Grid, _ } from 'gridjs-react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import firebase from '../../../firebase/firebase';
import { useSelector, useDispatch } from 'react-redux';


const ItemListBody = ({docID}) => {
    const columns = [
        {
            id: 'product_name',
            name: 'Product Name'
        },
        {
            id: 'kilograms',
            name: 'Kilograms'
        },
        {
            id: 'amount',
            name: 'Unit Price'
        },
        {
            id: 'quantity',
            name: 'Quantity'
        },
        {
            id: 'sub_total',
            name: 'Sub Total'
        }
    ]

    const orderList = useSelector(state => state.orderList.list);
    const productList = useSelector(state => state.orderList.productList);
    const [product, setProduct] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleSubmit = async () => {
        try {
            setError('');
            setLoading(true);
            
            const updateError =  await handleUpdateStocks();
            if(updateError) {
                setLoading(false);
                return;
            }
            const productItem = productList.filter(item => item.product_name.indexOf(product) > -1);
            const data = {
                product_name: product,
                quantity: quantity,
                amount: productItem[0].amount
            }
            let totalAmount = 0;
            const orderItem = orderList.filter(item => item.id.indexOf(docID) > -1);
            orderItem[0]['order_items'].push(data);
            const orderListRef = firebase.firestore().collection('order_list').doc(docID);
            orderItem[0]['order_items'].map(item => {
                return totalAmount += (item.amount * item.quantity);
            })
            orderItem[0]['total_amount'] = totalAmount;
            await orderListRef.update({
                order_items: orderItem[0]['order_items'],
                total_amount: totalAmount
            });
            setLoading(false);
            setToastMessage('Item added successfully');
            setOpenToast(true);
            setProduct('');
            setQuantity(0);
            fetchOrderItems();
        } catch(error) {
            setError('A problem has occured');
        }
    }
    const handleProductChange = (event) => {
        setProduct(event.target.value);
    }

    const fetchOrderItems = () => {
        const orderItem = orderList.filter(item => item.id.indexOf(docID) > -1);
        const orderItemList = [];
        if(orderItem[0]['order_items'] !== []) {
            orderItem[0]['order_items'].map((item, index) => {
                return orderItemList.push({
                    product_name: item.product_name,
                    quantity: item.quantity,
                    amount: item.amount,
                    sub_total: (item.amount * item.quantity),
                    kilograms: item.kilograms
                })
            });
        }
        setOrderItems(orderItemList);
    }

    const handleUpdateStocks = async () => {
        let hasError = false;
        try {
            const stockListRef = firebase.firestore().collection('stock_list');
            let updatedData = null;
            let updateDocID = 0;
            const query = stockListRef.where('product_name', '==', product).where('remaining', '>=', parseInt(quantity)).orderBy('remaining', 'asc').orderBy('date', 'asc').limit(1);
            const snapshot = await query.get();
            if (snapshot.empty === false) {
                snapshot.forEach(doc => {
                    const data = doc.data();
                    updateDocID = doc.id; 
                    updatedData = {
                        sold: parseInt(data.sold) + parseInt(quantity),
                        remaining: parseInt(data.remaining) - parseInt(quantity)
                    }
                });
                const stockListUpdateRef = firebase.firestore().collection('stock_list').doc(updateDocID);
                await stockListUpdateRef.update(updatedData);
            } else {
                setError('Insufficient stocks available for item');   
                hasError = true; 
            }
        } catch(error) {
            setError('A problem has occured');
        }
        return hasError;
    }

    useEffect(() => {
        fetchOrderItems();
    }, [])

    return(<Fragment>
        <Snackbar open={openToast} autoHideDuration={3000} onClose={() => setOpenToast(false)}>
            <Alert onClose={() => setOpenToast(false)} severity="success">
                {toastMessage}
            </Alert>
        </Snackbar>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid 
            data={orderItems} 
            columns={columns}
            search={false}
            pagination={{ enabled: true, limit: 5 }}
        />
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
                            const productKey = product.product_name + index;
                            return <MenuItem key={productKey} value={product.product_name}>{product.product_name}</MenuItem>
                        })}
                        
                    </Select>
            </FormControl>
            <TextField 
                required id="standard-required" 
                type="number" 
                label="Quantity" 
                placeholder="Quantity" 
                fullWidth 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
            />
            <Button variant="contained" disabled={loading} color="primary" type="submit" style={{ marginTop: '20px' }}>Add Item</Button>
        </form>
    </Fragment>);
}

export default ItemListBody;
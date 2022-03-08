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
import { useSelector, useDispatch } from 'react-redux';
import { uploadFile } from '../../../common/fileUpload';
import { _ } from 'gridjs-react';
import moment from 'moment';
import { UPDATE_ORDER_ITEMS, ADD_ORDER_LIST_ITEM } from '../../../actions/manageOrders/index';




const ModalBody = ({action, docID, closeFn, openFn, openOrderFn, openToastFn, toastFn}) => {

    const [orderStatus, setOrderStatus] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [date, setDate] = useState('');
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [orderItems, setOrderItems] = useState(null);
    const { currentUser } = useAuth();
    const dispatch = useDispatch();

    const orderList = useSelector(state => state.orderList.list);

    const handleSubmit = async () => {
        try {
            setError('');
            setLoading(true);
            let url = '';

            if(action === 'add' && file === null) {
                setError('Please attach a file to continue');
                setLoading(false);
                return;
            }

            if (file !== null) {
                url = await uploadFile(`order/${file.name}`, file, 'order');
                setImageUrl(url);
            }

            const orderListRef = action === 'add' ? firebase.firestore().collection('order_list') : firebase.firestore().collection('order_list').doc(docID);
            const data = {
                name: fullName,
                email: email,
                contact_number: contact,
                date: Timestamp.fromDate(new Date(date)),
                delivery_address: address,
                status: orderStatus,
            }
            if(url !== '') data.image = url;
            if (action === 'add') {
                data.order_items = [];
                data.total_amount = 0;
                data.createdBy = currentUser.email
                const response = await orderListRef.add(data);
                data.id = response.id;
                data.action = _(<Button variant="contained" onClick={() => openFn('edit', response.id)} color="primary" startIcon={<EditIcon />}> Edit</Button>)
                data.items = _(<Button variant="contained" onClick={() => openOrderFn(response.id)} color="primary" startIcon={<EditIcon />}> Edit</Button>)
                dispatch(ADD_ORDER_LIST_ITEM(data));
                toastFn('Order item added successfully');
                openToastFn(true);
            } else {    
                data.lastUpdateBy = currentUser.email;
                data.total_amount = totalAmount;
                data.order_items = orderItems;
                data.image = imageUrl
                await orderListRef.update(data);
                data.id = docID;
                data.action = _(<Button variant="contained" onClick={() => openFn('edit', docID)} color="primary" startIcon={<EditIcon />}> Edit</Button>)
                data.items = _(<Button variant="contained" onClick={() => openOrderFn(docID)} color="primary" startIcon={<EditIcon />}> Edit</Button>)
                dispatch(UPDATE_ORDER_ITEMS(data));
                toastFn('Order item updated successfully');
                openToastFn(true);
            }


            closeFn();
        } catch(error) {
            setError('A problem has occured');
        }
        setLoading(false);
    }

    const handleOrderStatusChange = (event) => {
        setOrderStatus(event.target.value);
    }

    const handleFileChange = (event) => {
        if (event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    }

    useEffect(() => {
        if(action === 'edit') {
            const orderItem = orderList.filter(item => item.id.indexOf(docID) > -1);
            setFullName(orderItem[0]['name']);
            setEmail(orderItem[0]['email']);
            setContact(orderItem[0]['contact_number']);
            setAddress(orderItem[0]['delivery_address']);
            setDate(moment(orderItem[0]['date'].toDate()).format('YYYY-MM-DD'));
            setOrderStatus(orderItem[0]['status']);
            setTotalAmount(orderItem[0]['total_amount']);
            setOrderItems(orderItem[0]['order_items']);
            setImageUrl(orderItem[0].image);
        }
    }, [])

    return(<Fragment>
       {error && <Alert severity="error">{error}</Alert>}
        <br />
        <form autoComplete="off" onSubmit={(e) => e.preventDefault(handleSubmit())}>
            <TextField 
                required id="fullName" 
                label="Full Name" 
                placeholder="Full Name" 
                fullWidth 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
            />
            <TextField 
                required id="email" 
                label="Email" 
                type="email"
                placeholder="Email" 
                fullWidth 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField 
                required id="contact" 
                label="Contact Number"
                type="tel" 
                placeholder="Contact Number" 
                fullWidth
                value={contact}
                onChange={(e) => setContact(e.target.value)}
            />
            <TextField 
                required id="delivery" 
                label="Delivery Address" 
                placeholder="Delivery Address" 
                fullWidth 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
            <br />
            <TextField 
                required id="date" 
                type="date" 
                label="Date of Purchase" 
                fullWidth 
                InputLabelProps={{
                    shrink: true,
                  }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <FormControl fullWidth required>
                <InputLabel id="order-select-label">Order Status</InputLabel>
                <Select
                    labelId="order-select-label"
                    id="order-select"
                    value={orderStatus}
                    onChange={handleOrderStatusChange}
                >
                    <MenuItem value={'Paid'}>Paid</MenuItem>
                    <MenuItem value={'For Delivery'}>For Delivery</MenuItem>
                    <MenuItem value={'Delivered'}>Delivered</MenuItem>
                </Select>
            </FormControl> 
            <br /><br />
            <input type="file" onChange={handleFileChange} />
            <br /> 
            <Button variant="contained" disabled={loading} color="primary" type="submit" style={{ marginTop: '20px' }}>Submit</Button>
        </form>
    </Fragment>);
}

export default ModalBody;
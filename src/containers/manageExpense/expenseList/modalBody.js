import React, { Fragment, useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Alert from '@material-ui/lab/Alert';
import firebase, { Timestamp } from '../../../firebase/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import {  useSelector, useDispatch } from 'react-redux';
import { uploadFile } from '../../../common/fileUpload';
import { _ } from 'gridjs-react';
import moment from 'moment';
import { ADD_EXPENSE_LIST_ITEM, SET_SELECTED_EXPENSE } from '../../../actions/manageExpense/index';






const ModalBody = ({action, docID, closeFn, openFn, openToastFn, toastFn}) => {

    const [entryType, setEntryType] = useState("");
    const [file, setFile] = useState(null);
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { currentUser } = useAuth();
    const dispatch = useDispatch();
    const expenseList = useSelector(state => state.expenseList.list);

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
                url = await uploadFile(`expense/${file.name}`, file, 'expense');
                setImageUrl(url);
            }
            const data = {
                entry_type: entryType,
                amount: amount,
                description: description,
                date: Timestamp.fromDate(new Date(date))
            }
            if(url !== '') data.image = url;
            const expenseListRef = action === 'add' ? firebase.firestore().collection('expense_list') : firebase.firestore().collection('expense_list').doc(docID);
            if(action === 'add') {
                data.createdBy = currentUser.email
                const response = await expenseListRef.add(data);
                data.id = response.id;
                data.action = _(<Button variant="contained" onClick={() => openFn('edit', response.id)} color="primary" startIcon={<EditIcon />}> Edit</Button>)
                data.image = _(<a href={data.image} target="_blank" rel="noopener noreferrer">Image URL</a>);
                dispatch(ADD_EXPENSE_LIST_ITEM(data));
                toastFn('Expense item added successfully');
                openToastFn(true);
            } else { 
                data.lastUpdateBy = currentUser.email;
                await expenseListRef.update(data);
                data.id = docID;
                data.action = _(<Button variant="contained" onClick={() => openFn('edit', docID)} color="primary" startIcon={<EditIcon />}> Edit</Button>)
                data.image = url === '' ? imageUrl : _(<a href={data.image} target="_blank" rel="noopener noreferrer">Image URL</a>);;
                dispatch(SET_SELECTED_EXPENSE(data));
                toastFn('Expense item updated successfully');
                openToastFn(true);
            }
            
            closeFn();
            
        } catch(error) {
            setError('A problem has occured');
        }

        setLoading(false);
    }

    const handleEntryChange = (event) => {
        setEntryType(event.target.value);
    }

    const handleFileChange = (event) => {
        if (event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    }

    useEffect(() => {
        if(action === 'edit') {
            const expenseItem = expenseList.filter(item => item.id.indexOf(docID) > -1);
            setDate(moment(expenseItem[0].date.toDate()).format('YYYY-MM-DD'));
            setEntryType(expenseItem[0].entry_type);
            setAmount(expenseItem[0].amount);
            setDescription(expenseItem[0].description);
            setImageUrl(expenseItem[0].image);
        }
        
    }, [])

    return(<Fragment>
        {error && <Alert severity="error">{error}</Alert>}
        <br />
        <form autoComplete="off" onSubmit={(e) => e.preventDefault(handleSubmit())}>
            <FormControl fullWidth required>
                <InputLabel id="entry-select-label">Entry Type</InputLabel>
                <Select
                    labelId="entry-select-label"
                    id="entry-select"
                    value={entryType}
                    onChange={handleEntryChange}
                >
                    <MenuItem value="Debit">Debit</MenuItem>
                    <MenuItem value="Credit">Credit</MenuItem>
                </Select>
            </FormControl>
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
                required id="standard-required" 
                type="date" 
                label="Date" 
                fullWidth 
                InputLabelProps={{
                    shrink: true,
                  }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <TextField 
                required 
                id="description" 
                label="Description" 
                placeholder="Description" 
                fullWidth 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <br /><br />
            <input type="file" onChange={handleFileChange} />
            <br />
            <Button variant="contained" disabled={loading} color="primary" type="submit" style={{ marginTop: '20px' }}>Submit</Button>
        </form>
    </Fragment>);
}

export default ModalBody;
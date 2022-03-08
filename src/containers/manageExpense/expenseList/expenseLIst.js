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
import { FETCH_EXPENSE_LIST } from '../../../actions/manageExpense/index';


import 'gridjs/dist/theme/mermaid.css';
import './expenseList.scss';


const ExpenseList = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [action, setAction] = useState('add');
    const [docID, setDocID] = useState('0');
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const expenseList = useSelector(state => state.expenseList.list);
    const columns = useSelector(state => state.expenseList.columns);
    const dispatch = useDispatch();

    const getExpenseList = async () => {
        const expenseList = [];
        const expenseListRef = firebase.firestore().collection('expense_list');
        const query = expenseListRef.orderBy('date', 'desc');
        const snapshot = await query.get();
        snapshot.forEach(doc => {
            const data = doc.data();
            data.image = _(<a href={data.image} target="_blank" rel="noopener noreferrer">Image URL</a>);
            expenseList.push(
                Object.assign({ 
                        id: doc.id,
                        action: _(<Button variant="contained" onClick={() => openModal('edit', doc.id)} color="primary" startIcon={<EditIcon />}> Edit</Button>)
                    }, 
                data)
            );
        });
        dispatch(FETCH_EXPENSE_LIST(expenseList));
    }

    const openModal = (action, docID) => {
        setAction(action);
        setDocID(docID);
        setIsOpen(true);
    }

    useEffect(() => {
        getExpenseList();
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
            title="Expense Details"
            modalBody={<ModalBody
                    action={action}
                    docID = {docID}
                    closeFn={() => setIsOpen(false)}
                    openFn={openModal}
                    openToastFn={setOpenToast}
                    toastFn={setToastMessage}
                 />}
         />
        <div className="expenselist">
            <div className="expenselist__title">
                <Typography color="textPrimary" variant="h5">Expense List</Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => openModal('add', '0')}> Add Expense</Button>
            </div>
            <div className="expenselist__table">
                <Grid 
                    data={expenseList} 
                    columns={columns}
                    search={true}
                    pagination={{ enabled: true, limit: 10 }}
                />
            </div>
        </div>
    </Fragment>);
}

export default ExpenseList;
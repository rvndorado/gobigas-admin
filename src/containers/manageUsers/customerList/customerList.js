import React, { Fragment, useState } from 'react';
import { Grid, _ } from 'gridjs-react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Modal from '../../../presentationals/modal/modal';
import ModalBody from './modalBody';
import 'gridjs/dist/theme/mermaid.css';
import './customerList.scss';

const CustomerList = () => {
    const dummyData = [
        ['1', 'Raven', 'Dorado', 'rvndorado@gmail.com', '"9QFL]dKh?RK8#De', _(<Button variant="contained" onClick={() => setIsOpen(true)} color="primary" startIcon={<EditIcon />}> Edit</Button>)], 
        ['2','Nichole', 'Torres', 'nchltrrs@gmail.com', '&bG&5L(2s^h6Yv*', _(<Button variant="contained" onClick={() => setIsOpen(true)} color="primary" startIcon={<EditIcon />}> Edit</Button>)]
    ];
    const [isOpen, setIsOpen] = useState(false);

    return(<Fragment>
        <Modal
            isOpen={isOpen}
            closeFn={() => setIsOpen(false)}
            title="User Details"
            modalBody={<ModalBody />}
         />
        <div className="customerlist">
            <div className="customerlist__title">
                <Typography color="textPrimary" variant="h5">Customer List</Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setIsOpen(true)}> Add User</Button>
            </div>
            <div className="customerlist__table">
                <Grid 
                    data={dummyData} 
                    columns={['ID', 'First Name', 'Last Name', 'E-Mail', 'Password', 'Actions']}
                    search={true}
                    pagination={{ enabled: true, limit: 10 }}
                />
            </div>
        </div>
    </Fragment>);
}

export default CustomerList;
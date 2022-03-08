import React, { Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


const ModalBody = () => {

    const handleSubmit = () => {
        console.log('submitted');
    }

    return(<Fragment>
        <form autoComplete="off" onSubmit={(e) => e.preventDefault(handleSubmit())}>
            <TextField required id="standard-required" type="email" label="E-Mail" placeholder="E-Mail" fullWidth />
            <TextField required id="standard-required" label="First Name" placeholder="First Name" fullWidth />
            <TextField required id="standard-required" label="Last Name" placeholder="Last Name" fullWidth />
            <TextField required id="standard-required" type="password" label="Password" placeholder="Password" fullWidth />
            <Button variant="contained" color="primary" type="submit" style={{ marginTop: '20px' }}>Submit</Button>
        </form>
    </Fragment>);
}

export default ModalBody;
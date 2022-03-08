import React, { Fragment, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { useAuth } from '../../contexts/AuthContext';
import { useHistory } from 'react-router-dom';


const ChangePassword = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const { updatePassword, logout } = useAuth();
    const history = useHistory();

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError('');
            if (password !== confirmPass) {
                password('Passwords do not match');

            } else {
                await updatePassword(password);
                setToastMessage('Password updated successfully');
                setOpenToast(true);
                await logout();
                history.push('/');
            }
        } catch(error) {
            console.log(error);
            setError('A problem has occured');
        }
        setLoading(false);
    }

    return(<Fragment>
        <Snackbar open={openToast} autoHideDuration={3000} onClose={() => setOpenToast(false)}>
            <Alert onClose={() => setOpenToast(false)} severity="success">
                {toastMessage}
            </Alert>
        </Snackbar>
        {error && <Alert severity="error">{error}</Alert>}
        <br />
        <form autoComplete="off" onSubmit={(e) => e.preventDefault(handleSubmit())}>
            <TextField 
                    required id="new_password" 
                    type="password" 
                    label="New Password" 
                    placeholder="New Password" 
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            <TextField 
                required id="confirm_password" 
                type="password" 
                label="Confirm Password" 
                placeholder="Confirm Password" 
                fullWidth
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
            />
            <Button variant="contained" disabled={loading} color="primary" type="submit" style={{ marginTop: '20px' }}>Submit</Button>
        </form>
    </Fragment>);
}

export default ChangePassword;
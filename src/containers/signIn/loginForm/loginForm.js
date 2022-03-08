import React, { Fragment, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { useHistory } from 'react-router-dom';
import firebase from '../../../firebase/firebase';


const LoginForm = () => {
    const { login } = useAuth();

    const [isOpen, setIsOpen] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const history = useHistory();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);

            const adminListRef = firebase.firestore().collection('admin_users').where('email', '==', email);
            const adminListSnapshot = await adminListRef.get();
            console.log('haha');
            if(adminListSnapshot.empty === false) {
              await login(email, password);
              history.push('/');
            } else {
              setError('Invalid credentials entered');
            }
        } catch {
            setError('Invalid credentials entered');
        }
        setLoading(false);
    }


    return (
      <Fragment>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="sm"
          className="modal"
          disableBackdropClick
          disableEscapeKeyDown
        >
          <DialogTitle id="alert-dialog-title">Sign In</DialogTitle>
          {error && <Alert severity="error">{error}</Alert>}
          <DialogContent>
            <form
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <TextField
                required
                id="email"
                label="Email"
                type="email"
                placeholder="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                required
                id="password"
                label="Password"
                type="password"
                placeholder="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                disabled={loading}
                style={{ marginTop: "30px", marginBottom: "30px" }}
              >
                Login
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
}

export default LoginForm;
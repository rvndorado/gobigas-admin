import React, { Fragment, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from '@material-ui/lab/Alert';
import  firebase from "../../../firebase/firebase";
import { useAuth } from '../../../contexts/AuthContext';

const ModalBody = () => {
  
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { createUser } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        setLoading(true);
        setError('');
        const adminUserListRef = firebase.firestore().collection('admin_users');
        const query = adminUserListRef.where('email', '==', email)
        const snapshot = await query.get();
        if (snapshot.empty) {
            if (password.length < 7) {
                setError('Password must be greater than 7 characters');
                setLoading(false);
                return;
            }
            const data = {
                email : email,
                firstName: firstName,
                lastName: lastName,
                createdBy: email,
                createdDate: new Date()
            }
            
            await adminUserListRef.add(data);
            await createUser(email, password);
            
            

        } else {
            setError('User already Exist');
        }
    } catch(error) {
        console.log(error);
        setError('A problem has occured');
    }
    setLoading(false);
    
  };

  return (
    <Fragment>
      {error && <Alert severity="error">{error}</Alert>}
      <br />
      <form
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField
          required
          id="standard-required"
          type="email"
          label="Email"
          placeholder="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          required
          id="standard-required"
          label="First Name"
          placeholder="First Name"
          fullWidth
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          required
          id="standard-required"
          label="Last Name"
          placeholder="Last Name"
          fullWidth
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          required
          id="standard-required"
          type="password"
          label="Password"
          placeholder="Password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginTop: "20px" }}
          disabled={loading}
        >
          Submit
        </Button>
      </form>
    </Fragment>
  );
};

export default ModalBody;

import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/firebase';

const AuthContext = React.createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    const login = (email, password) => {
        return auth.signInWithEmailAndPassword(email, password);
    }

    const logout = () => {
        return auth.signOut();
    }

    const createUser = (email, password) => {
        return auth.createUserWithEmailAndPassword(email, password).then(firebaseUser => {
            auth.signOut();
        })
    }

    const updatePassword = (password) => {
        return currentUser.updatePassword(password);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value ={
        currentUser,
        login,
        logout,
        createUser,
        updatePassword,
        
    }


    return(<div>
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    </div>);
}

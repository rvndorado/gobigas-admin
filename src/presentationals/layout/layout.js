import React, { Fragment } from 'react';
import Navigation from '../navigation/navigation';
import { BrowserRouter } from 'react-router-dom';
import Routing from '../../routing/routing';
import { AuthProvider } from '../../contexts/AuthContext';
import './layout.scss';

const layout = () => {
    return (<Fragment>
        <BrowserRouter>
            <AuthProvider>
                <Navigation />
                <main className="container">
                    <div className="container__body">
                        <Routing />
                    </div>
                </main>
            </AuthProvider>
        </BrowserRouter>
    </Fragment>);
}

export default layout;
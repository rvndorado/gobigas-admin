import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PrivateRoute from './privateRoute';
import Dashboard from '../pages/dashboard';
import SignIn from '../pages/signIn';
import ManageExpense from '../pages/manageExpense';
import ManageOrders from '../pages/manageOrders';
import ManageProducts from '../pages/manageProducts';
import ManageStocks from '../pages/manageStocks';
import ManageUsers from '../pages/manageUsers';

const Routing = () => {
    return(<Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute path="/expense" component={ManageExpense} />
            <PrivateRoute path="/orders" component={ManageOrders} />
            <PrivateRoute path="/products" component={ManageProducts} />
            <PrivateRoute path="/stocks" component={ManageStocks} />
            <PrivateRoute path="/users" component={ManageUsers} />
            <Route path="/login" component={SignIn} />
            <Route path="*">
                <Redirect to="/" />
            </Route>
        </Switch>);
}

export default Routing;
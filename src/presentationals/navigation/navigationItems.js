import React, { Fragment } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PaymentIcon from '@material-ui/icons/Payment';
import ReceiptIcon from '@material-ui/icons/Receipt';
import TurnedInIcon from '@material-ui/icons/TurnedIn';
import ListIcon from '@material-ui/icons/List';
import { Link } from 'react-router-dom';


const navigationItems = (props) => {
    return(<Fragment>
        <List>
            <Link to="/" className="navigation__link">
                <ListItem button onClick={() => props.toggleFn(false)}>
                    <ListItemIcon><DashboardIcon /></ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
            </Link>
            <Link to="/users" className="navigation__link">
                <ListItem button onClick={() => props.toggleFn(false)}>
                    <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                    <ListItemText primary="Manage Users" />
                </ListItem>
            </Link>
            <Link to="/expense" className="navigation__link">
                <ListItem button onClick={() => props.toggleFn(false)}>
                    <ListItemIcon><PaymentIcon /></ListItemIcon>
                    <ListItemText primary="Manage Expenses" />
                </ListItem>
            </Link>
            <Link to="/products" className="navigation__link">
                <ListItem button onClick={() => props.toggleFn(false)}>
                    <ListItemIcon><TurnedInIcon /></ListItemIcon>
                    <ListItemText primary="Manage Products" />
                </ListItem>
            </Link>
            <Link to="/stocks" className="navigation__link">
                <ListItem button onClick={() => props.toggleFn(false)}>
                    <ListItemIcon><ListIcon /></ListItemIcon>
                    <ListItemText primary="Manage Stocks" />
                </ListItem>
            </Link>
            <Link to="/orders" className="navigation__link">
                <ListItem button onClick={() => props.toggleFn(false)}>
                    <ListItemIcon><ReceiptIcon /></ListItemIcon>
                    <ListItemText primary="Manage Orders" />
                </ListItem>
            </Link>
        </List>
    </Fragment>);
}

export default navigationItems;
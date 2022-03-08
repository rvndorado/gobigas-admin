import React, { Fragment, useState } from 'react';
import NavigationItems from './navigationItems';
import './navigation.scss';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import ChangePassword from '../changePassword/changePassword';
import Modal from '../modal/modal';

import { useAuth } from '../../contexts/AuthContext';
import { useHistory } from 'react-router-dom';



const Navigation = () => {
    const { logout } = useAuth();
    const history = useHistory();

    const [isDrawerOpen, seIsDrawerOpen] = useState(false);
    const [userMenu, setUserMenu] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');
    

    const handleOpenUserMenu= (event) => {
        setUserMenu(event.currentTarget);
    }

    const handleCloseUserMenu = () => {
        setUserMenu(null);
    }

    const handleLogout = async () => {
        try {
            handleCloseUserMenu();
            await logout();
            history.push('/signin');
        }  catch { 
            setError('error');
        }
    }

    return(<Fragment>
       <Modal
            isOpen={isModalOpen}
            closeFn={() => setIsModalOpen(false)}
            title="Change Password"
            modalBody={<ChangePassword />}
         />
        <div className="navigation">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => seIsDrawerOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Drawer anchor="left" open={isDrawerOpen} onClose={() => seIsDrawerOpen(false)}>
                        <NavigationItems toggleFn={seIsDrawerOpen} />
                    </Drawer>

                    <Typography variant="h6" className="navigation__title">
                        GoBigas Admin
                    </Typography>
                    
                    <IconButton color="inherit" onClick={handleOpenUserMenu}>
                        <AccountCircleIcon />
                    </IconButton>
                    <Menu
                        id="usermenu"
                        anchorEl={userMenu}
                        keepMounted
                        getContentAnchorEl={null}
                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                        transformOrigin={{ vertical: "top", horizontal: "center" }}
                        open={Boolean(userMenu)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem onClick={() => setIsModalOpen(true)}>Change Password</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </div>

    </Fragment>);
}

export default Navigation;
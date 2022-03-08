import React, { Fragment } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import './modal.scss';


const Modal = ({ isOpen, closeFn, title, modalBody }) => {
    return(<Fragment>
        <Dialog
            open={isOpen}
            onClose={closeFn}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
            maxWidth="sm"
            className="modal"
        >
        <DialogTitle id="alert-dialog-title">
            <div className="modal__title">
                {title}
                <IconButton aria-label="close" onClick={closeFn}>
                    <CloseIcon />
                </IconButton>                
            </div>
        </DialogTitle>
        <DialogContent>{modalBody}</DialogContent>
        </Dialog>
    </Fragment>);
}

export default Modal;

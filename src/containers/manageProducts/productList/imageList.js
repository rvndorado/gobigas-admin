import React, { Fragment, useState, useEffect } from 'react';
import { Grid, _ } from 'gridjs-react';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {  useSelector, useDispatch } from 'react-redux';
import firebase from '../../../firebase/firebase';
import { uploadFile } from '../../../common/fileUpload';

const ItemListBody = ({ docID }) => {
    const columns = [
        {  id: 'image', name: 'Image URL' },
        {  id: 'action', name: 'Actions' }
    ]
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [images, setImages] = useState([]);
    const dispatch = useDispatch();

    const productList = useSelector(state => state.productList.list);

    const loadImages = () => {
        const productItem = productList.filter(item => item.id.indexOf(docID) > -1);
        const productImages = [];
        if (productItem[0].images !== []) {
            productItem[0].images.map((item, index) => {
                return productImages.push({
                    image: _(<a href={item} target="_blank" rel="noopener noreferrer">Image URL</a>),
                    action: _(<Button variant="contained" color="secondary" onClick={() => handleDeleteImage(index)} startIcon={<DeleteIcon />}> Delete</Button>)
                })
            })
        }
        setImages(productImages);
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError('');
            const imageList = productList.filter(item => item.id.indexOf(docID) > -1);
            const imageURL = await uploadFile(`products/${file.name}`, file, 'products');
            imageList[0]['images'].push(imageURL);
            const data = {
                images: imageList[0]['images']
            }
            const productListRef = firebase.firestore().collection('product_list').doc(docID);
            await productListRef.update(data);
            setFile(null);
            setToastMessage('Image added successfully');
            setOpenToast(true);
            loadImages();
        } catch(error) {
            setError('A problem has occured');
        }

        setLoading(false);

    }

    const handleFileChange = (event) => {
        if (event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    }

    const handleDeleteImage = async (index,) => {
        try {
            const imageList = productList.filter(item => item.id.indexOf(docID) > -1);
            imageList[0]['images'].splice(index, 1);
            const data = {
                images: imageList[0]['images']
            }
            const productListRef = firebase.firestore().collection('product_list').doc(docID);
            await productListRef.update(data);
            setToastMessage('Image deleted successfully');
            setOpenToast(true);
            loadImages();
        } catch(error) {
            setError('A problem has occured');
        }

    }

    useEffect(() => {
        loadImages();
    }, [])


    return(<Fragment>
        <Snackbar open={openToast} autoHideDuration={3000} onClose={() => setOpenToast(false)}>
            <Alert onClose={() => setOpenToast(false)} severity="success">
                {toastMessage}
            </Alert>
        </Snackbar>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid 
            data={images} 
            columns={columns}
            search={false}
            pagination={{ enabled: true, limit: 5 }}
        />
        <form autoComplete="off" onSubmit={(e) => e.preventDefault(handleSubmit())}>
             <br /><br />
            <input required type="file" onChange={handleFileChange} />
            <br />
            <Button variant="contained" disabled={loading} color="primary" type="submit" style={{ marginTop: '20px' }}>Add Item</Button>
        </form>
    </Fragment>);
}

export default ItemListBody
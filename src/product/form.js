import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import api from '../api';

const Form = ({
  open,
  handleClose,
  editMode,
  productData,
  onSubmitSuccess,
}) => {
  const [product, setProduct] = useState({
    name: '',
    category_id: '',
    type_id: '',
    price: '',
    unit: '',
    quantity: '',
    expiry_date: '',
    group_id: '',
  });

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  };

  const resetFormFields = () => {
    setProduct({
      name: '',
      category_id: '',
      type_id: '',
      price: '',
      unit: '',
      quantity: '',
      expiry_date: '',
      group_id: '',
    });
  };

  useEffect(() => {
    if (editMode && productData) {
      const formattedProductData = {
        ...productData,
        expiry_date: formatDate(productData.expiry_date),
      };
      setProduct(formattedProductData);
    } else {
      setProduct({
        name: '',
        category_id: '',
        type_id: '',
        price: '',
        unit: '',
        quantity: '',
        expiry_date: '',
        group_id: '',
      });
    }
  }, [editMode, productData]);

  useEffect(() => {
    api.get('/api/categories').then((response) => {
      setCategories(response.data);
    });
  }, []);

  useEffect(() => {
    if (product.category_id) {
      api
        .get(`/api/types?category_id=${product.category_id}`)
        .then((response) => {
          setTypes(response.data);
        });
    }
  }, [product.category_id]);

  const handleChange = (event) => {
    if (event.target.name === 'category_id') {
      setProduct({
        ...product,
        type_id: '',
        [event.target.name]: event.target.value,
      });
    } else {
      setProduct({
        ...product,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Presubmit Data:', product);
    if (editMode) {
      api
        .put(`/api/products/${productData.product_id}`, product)
        .then((response) => {
          onSubmitSuccess();
          handleClose();
          resetFormFields();
          console.log('Success Updated Data:', product);
        })
        .catch((error) => {
          console.error('Error while updating product:', error);
        });
    } else {
      api
        .post('/api/products', product)
        .then((response) => {
          onSubmitSuccess();
          handleClose();
          resetFormFields();
          console.log('Success Submit Data:', product);
        })
        .catch((error) => {
          console.error('Error while creating product:', error);
        });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        {editMode ? 'Edit Produk' : 'Tambah Produk'}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label='Nama Produk'
                name='name'
                value={product.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              {categories.length > 0 && (
                <FormControl fullWidth required>
                  <InputLabel htmlFor='category_id'>
                    Kategori
                  </InputLabel>
                  <Select
                    label='Kategori'
                    name='category_id'
                    value={product.category_id}
                    onChange={handleChange}
                    inputProps={{
                      id: 'category_id',
                    }}>
                    {categories.map((category) => (
                      <MenuItem
                        key={category.category_id}
                        value={category.category_id}>
                        {category.category_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {!product.category_id && (
                    <FormHelperText>
                      Silahkan pilih kategori terlebih dahulu
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            </Grid>
            <Grid item xs={12}>
              {types.length > 0 && (
                <FormControl
                  fullWidth
                  required
                  disabled={!product.category_id}>
                  <InputLabel htmlFor='type_id'>Jenis</InputLabel>
                  <Select
                    label='Jenis'
                    name='type_id'
                    value={product.type_id}
                    onChange={handleChange}
                    inputProps={{
                      id: 'type_id',
                    }}>
                    {types.map((type) => (
                      <MenuItem
                        key={type.type_id}
                        value={type.type_id}>
                        {type.type_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Harga'
                name='price'
                value={product.price}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Per'
                name='unit'
                value={product.unit}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Stok'
                name='quantity'
                value={product.quantity}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Kadaluarsa'
                type='date'
                name='expiry_date'
                value={product.expiry_date}
                onChange={handleChange}
                fullWidth
                margin='normal'
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={handleClose}>Batal</Button>
            <Button type='submit' color='primary' variant='contained'>
              {editMode ? 'Simpan' : 'Tambah'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Form;

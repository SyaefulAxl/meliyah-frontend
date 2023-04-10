import React, { useState } from 'react';
import {
  Grid,
  Typography,
  IconButton,
  Divider,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import api from '../api';

const formatPrice = (price) =>
  price
    ? `Rp. ${price
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        .replace(/\.00$/, '')}`
    : '';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
  return formattedDate;
};

const Row = ({
  product,
  isSmallScreen,
  handleOpenEditForm,
  toggleRowCollapse,
  isOpen,
}) => {
  const [totalPrice, setTotalPrice] = useState(0);

  const formattedPrice = formatPrice(product.price);
  const formattedTotalPrice = formatPrice(totalPrice);

  const handleToggleCollapse = () => {
    toggleRowCollapse(product.product_id);
  };

  const handleDelete = (id) => {
    api.delete(`/products/${id}`).then(() => {
      // refresh product list after delete
      window.location.reload();
    });
  };

  return (
    <Grid
      container
      alignItems='center'
      spacing={isSmallScreen ? 1 : 2}>
      {isSmallScreen ? (
        <>
          <Box mb={2} marginLeft='auto'>
            <Grid
              container
              alignItems='center'
              spacing={1}
              marginLeft='auto'
              marginTop='auto'>
              <Grid item xs={5}>
                <Typography>
                  <strong>Nama:</strong> {product.name}
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography>
                  <strong>Harga:</strong> {formattedPrice}
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  size='small'
                  color='primary'
                  onClick={() => handleOpenEditForm(product)}>
                  <EditIcon />
                </IconButton>
              </Grid>
              <Grid item xs={5}>
                <Typography>
                  <strong>Stok:</strong> {product.quantity}
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography>
                  <strong>Per:</strong> {product.unit}
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  size='small'
                  onClick={handleToggleCollapse}>
                  {isOpen ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )}
                </IconButton>
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  size='small'
                  color='secondary'
                  onClick={() => handleDelete(product.product_id)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
          </Box>
        </>
      ) : (
        <>
          <Grid item xs={2}>
            <Typography>{product.name}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>{product.category_name}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>{product.type_name}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>{product.price}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography>{product.unit}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography>{product.quantity}</Typography>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              size='small'
              color='primary'
              onClick={() => handleOpenEditForm(product)}>
              <EditIcon />
            </IconButton>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              size='small'
              color='secondary'
              onClick={() => handleDelete(product.product_id)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </>
      )}
      <Grid item xs={12}>
        <Collapse in={isOpen} timeout='auto' unmountOnExit>
          {' '}
          Masih dalam pembuatan
        </Collapse>
      </Grid>
    </Grid>
  );
};

export default Row;

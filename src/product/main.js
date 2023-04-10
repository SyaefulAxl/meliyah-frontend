import React, { useState, useEffect } from 'react';
import api from '../api';
import {
  Button,
  Typography,
  Box,
  TextField,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Filter from './filter';
import Row from './row';
import Form from './form';

const MainProduct = () => {
  const [products, setProducts] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Fetch all product details
    api.get('/api/products').then((response) => {
      setProducts(response.data);
    });
  }, []);

  // Add other states and handlers necessary for the provided return statement
  const [filterText, setFilterText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [productData, setProductData] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [openRows, setOpenRows] = useState({});

  const toggleRowCollapse = (id) => {
    setOpenRows((prevOpenRows) => {
      const newOpenRows = { ...prevOpenRows };
      newOpenRows[id] = !newOpenRows[id];
      return newOpenRows;
    });
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
  };

  const handleOpenAddForm = () => {
    setEditMode(false);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
  };

  const handleOpenEditForm = (product) => {
    setEditMode(true);
    setProductData(product);
    setFormOpen(true);
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
    setFilteredProducts(
      products.filter((product) =>
        product.name
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      )
    );
  };

  const refreshData = () => {
    api.get('/api/products').then((response) => {
      setProducts(response.data);
      setFilteredProducts(response.data);
    });
  };

  useEffect(() => {
    setFilteredProducts(
      products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(filterText.toLowerCase()) &&
          (categoryFilter === '' ||
            product.category_name.toLowerCase() === categoryFilter)
      )
    );
  }, [products, filterText, categoryFilter]);
  console.log('fetchdata:', products);

  // Add the provided return statement
  return (
    <div>
      <Button
        variant='contained'
        color='primary'
        onClick={handleOpenAddForm}>
        Tambah Produk
      </Button>
      <Typography variant='h4' component='h1'>
        Daftar Harga
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
        <Typography sx={{ flexGrow: 1 }}>Filter Produk:</Typography>
        <Filter onCategoryChange={handleCategoryChange} />
        <TextField
          id='filter'
          value={filterText}
          onChange={handleFilterChange}
          sx={{
            backgroundColor: 'white',
            color: 'black',
            marginLeft: 1,
            borderRadius: 1,
          }}
        />
      </Box>
      <Box sx={{ overflowX: 'auto' }}>
        <Paper>
          <Box p={1}>
            {isSmallScreen ? (
              <Grid container>
                {filteredProducts.map((product, index) => (
                  <Grid
                    item
                    xs={12}
                    key={`${product.product_id}-${product.name}`}>
                    <Row
                      key={product.product_id}
                      product={product}
                      isSmallScreen={isSmallScreen}
                      handleOpenEditForm={handleOpenEditForm}
                      toggleRowCollapse={toggleRowCollapse}
                      isOpen={openRows[product.product_id]}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container alignItems='center'>
                <Grid item xs={2}>
                  <Typography variant='subtitle1'>Nama</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant='subtitle1'>
                    Kategori
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant='subtitle1'>Jenis</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant='subtitle1'>Harga</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography variant='subtitle1'>Per</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography variant='subtitle1'>Stok</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography variant='subtitle1'>Edit</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography variant='subtitle1'>Hapus</Typography>
                </Grid>
                <Grid item xs={2}></Grid>
                {filteredProducts.map((product, index) => (
                  <Grid
                    item
                    xs={12}
                    key={`${product.product_id}-${product.name}`}>
                    <Row
                      product={product}
                      isSmallScreen={isSmallScreen}
                      handleOpenEditForm={handleOpenEditForm}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Paper>
      </Box>
      {formOpen && (
        <Form
          open={formOpen}
          handleClose={handleCloseForm}
          editMode={editMode}
          productData={productData}
          onSubmitSuccess={refreshData}
        />
      )}
    </div>
  );
};

export default MainProduct;

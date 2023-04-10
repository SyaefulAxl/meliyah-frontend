import React, { useState, useEffect } from 'react';
import { Select, MenuItem } from '@mui/material';
import api from '../api';

const Filter = ({ onCategoryChange }) => {
  const [filter, setFilter] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from API
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      const data = response.data;
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (event) => {
    setFilter(event.target.value);
    onCategoryChange(event.target.value);
  };

  return (
    <Select
      value={filter}
      onChange={handleChange}
      displayEmpty
      sx={{ color: '#ffffff', border: 'solid' }}>
      <MenuItem value='' sx={{ color: '#000000' }}>
        <em>All</em>
      </MenuItem>
      {categories.map((category) => (
        <MenuItem
          key={category.category_id}
          value={category.category_name.toLowerCase()}
          sx={{ color: '#000000' }}>
          {category.category_name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default Filter;

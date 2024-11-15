// context/ProductContext.js
"use client";
import React, { createContext, useContext, useState } from 'react';

// Context oluşturma
const ProductContext = createContext();

// Context sağlayıcı bileşeni
export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        filteredProducts,
        setFilteredProducts,
        searchTerm,
        setSearchTerm,
        category,
        setCategory,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

// Custom hook for context kullanım kolaylığı
export function useProductContext() {
  return useContext(ProductContext);
}

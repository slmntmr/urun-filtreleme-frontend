"use client";

import '../styles/responsive.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useProductContext } from '../context/ProductContext';
import { debounce } from 'lodash';

export default function Home() {
  const router = useRouter();
  const {
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
  } = useProductContext();

  const [visibleProducts, setVisibleProducts] = useState(20); // Başlangıçta görüntülenecek ürün sayısı
  const observerRef = useRef(); // Intersection Observer için referans
  const [sortOption, setSortOption] = useState(''); // Sıralama seçeneği durumu
  const [categories, setCategories] = useState([]); // Kategoriler için state

  // API'den ürün verilerini çekme ve kategorileri ayıklama
  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=200')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
        setFilteredProducts(data.products);

        // Kategorileri ayıklayıp benzersiz hale getirir
        const uniqueCategories = [...new Set(data.products.map((product) => product.category))];
        setCategories(uniqueCategories); // Kategorileri state'e ata
      });
  }, [setProducts, setFilteredProducts]);

  // Debounced arama işlevi
  const handleSearch = debounce((value) => setSearchTerm(value), 300);

  // Ürünleri sıralama fonksiyonu
  const sortProducts = (products) => {
    if (sortOption === 'popularity') {
      return [...products].sort((a, b) => b.rating - a.rating); // Popülerliğe göre sıralama
    } else if (sortOption === 'newest') {
      return [...products].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)); // Yeniliğe göre sıralama
    }
    return products;
  };

  // Ürünleri filtreleme: Arama terimi, kategori, fiyat aralığına ve sıralama seçeneğine göre
  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (category === '' || product.category === category) &&
        (minPrice === '' || product.price >= parseFloat(minPrice)) &&
        (maxPrice === '' || product.price <= parseFloat(maxPrice))
    );
    setFilteredProducts(sortProducts(filtered)); // Filtrelenmiş ürünleri günceller
    setVisibleProducts(20); // Her filtrelemede görünür ürün sayısını sıfırlar
  }, [searchTerm, category, minPrice, maxPrice, products, sortOption, setFilteredProducts]);

  // Lazy-loading işlevi
  const lastProductRef = useCallback(
    (node) => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setVisibleProducts((prevCount) => prevCount + 20); // Görünen ürün sayısını artırır
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [filteredProducts]
  );

  return (
    <Container>
      <h1 className="text-center my-4">Ürün Listesi</h1>

      {/* Filtre ve Arama Çubukları */}
      <div className="filter-container">
        {/* Arama Çubuğu */}
        <div className="filter-item">
          <label className="filter-label" htmlFor="search">İstediğiniz ürünü yazın:</label>
          <Form.Control
            id="search"
            className="small-input"
            type="text"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Kategori Seçimi */}
        <div className="filter-item">
          <label className="filter-label" htmlFor="category">Kategori seçin:</label>
          <Form.Select
            id="category"
            className="small-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((categoryName) => (
              <option key={categoryName} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </Form.Select>
        </div>

        {/* Sıralama Seçimi */}
        <div className="filter-item">
          <label className="filter-label" htmlFor="sortOption">Sıralama seçin:</label>
          <Form.Select
            id="sortOption"
            className="small-input"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Varsayılan Sıralama</option>
            <option value="popularity">Popülerliğe Göre</option>
            <option value="newest">Yeniliğe Göre</option>
          </Form.Select>
        </div>

        {/* Fiyat Aralığı Filtreleme */}
        <div className="filter-item">
          <label className="filter-label" htmlFor="priceRange">Fiyat aralığı girin:</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Form.Control
              id="minPrice"
              className="small-input"
              type="number"
              placeholder="Min Fiyat"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <Form.Control
              id="maxPrice"
              className="small-input"
              type="number"
              placeholder="Max Fiyat"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Ürün Kartları */}
      <Row>
        {filteredProducts.slice(0, visibleProducts).map((product, index) => (
          <Col
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={product.id}
            className="mb-4"
            ref={index === visibleProducts - 1 ? lastProductRef : null}
          >
            <Card>
              <Card.Img variant="top" src={product.thumbnail} alt={`${product.title} resmi`} />
              <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>{product.price} TL</Card.Text>
                <Card.Text>Rating: {product.rating}</Card.Text>
                <Button
                  variant="primary"
                  aria-label={`${product.title} detaylarına git`}
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  Detaylar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

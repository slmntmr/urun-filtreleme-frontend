"use client";

import React, { useEffect, useState } from 'react';
import { Container, Card, Button, ListGroup, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '../../../styles/responsive.css';

// Yıldızlarla puan gösterimi için yardımcı fonksiyon
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? '½' : '';
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <span className="stars">
      {'★'.repeat(fullStars)}
      {halfStar}
      {'☆'.repeat(emptyStars)}
    </span>
  );
}

export default function ProductDetail({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const router = useRouter();

  // API'den veriyi client-side olarak çekiyoruz
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Veriler yüklenirken bir Spinner gösteriyoruz
  if (!product) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      <Card className="my-4">
        {/* Ürün Küçük Resmi */}
        <Card.Img
          as={Image}
          src={product.thumbnail} // Sadece küçük resmi kullanıyoruz
          alt={`${product.title} küçük resmi`}
          width={400}  // Küçük genişlik
          height={300} // Küçük yükseklik
          layout="responsive"
          priority={true} // Öncelikli yükleme
          placeholder="blur" // Blur efekti ile daha iyi yüklenme deneyimi sağlıyoruz
          blurDataURL="data:image/jpeg;base64,[YOUR_BASE64_BLUR_DATA]"
        />

        <Card.Body>
          {/* Temel Bilgiler */}
          <Card.Title>{product.title}</Card.Title>
          <Card.Text>Açıklama: {product.description}</Card.Text>
          <Card.Text>Fiyat: {product.price} TL</Card.Text>
          <Card.Text>Rating: {renderStars(product.rating)}</Card.Text>

          {/* Ek Bilgiler Listesi */}
          <ListGroup variant="flush" className="my-3">
            <ListGroup.Item><strong>Marka:</strong> {product.brand}</ListGroup.Item>
            <ListGroup.Item><strong>Kategori:</strong> {product.category}</ListGroup.Item>
            <ListGroup.Item><strong>Stok Durumu:</strong> {product.availabilityStatus}</ListGroup.Item>
            <ListGroup.Item><strong>Stok Sayısı:</strong> {product.stock}</ListGroup.Item>
            <ListGroup.Item><strong>Garanti Bilgisi:</strong> {product.warrantyInformation}</ListGroup.Item>
            <ListGroup.Item><strong>Kargo Bilgisi:</strong> {product.shippingInformation}</ListGroup.Item>
            <ListGroup.Item><strong>Geri Dönüş Politikası:</strong> {product.returnPolicy}</ListGroup.Item>
            <ListGroup.Item>
              <strong>Ürün Boyutları:</strong>
              {` Genişlik: ${product.dimensions.width} cm, Yükseklik: ${product.dimensions.height} cm, Derinlik: ${product.dimensions.depth} cm`}
            </ListGroup.Item>
          </ListGroup>

          {/* Kullanıcı Yorumları */}
          <h5>Yorumlar</h5>
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review, index) => (
              <Card key={index} className="my-2">
                <Card.Body>
                  <Card.Title className="review-title">{review.reviewerName}</Card.Title>
                  <Card.Text className="review-comment">
                    <strong>Puan:</strong> {renderStars(review.rating)}
                    <br />
                    <strong>Yorum:</strong> {review.comment}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>Bu ürün için henüz yorum yapılmamış.</p>
          )}

          {/* Geri Dön Butonu */}
          <Button variant="primary" onClick={() => router.back()}>
            Geri Dön
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

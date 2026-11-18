import { useEffect, useState } from 'react';
import Layout from '../Layout/Layout';
import Gallery from '../../components/Gallery/Gallery';
import Section from '../../components/Section/Section';
import ProductListing from '../../components/ProductListing/ProductListing';
import './HomePage.css';

const API = import.meta.env.VITE_API_URL;

const slides = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ src: `/home-slide-${n}.jpeg` }));

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(API + '/v1/product/search?limit=8')
      .then((response) => response.json())
      .then((result) => {
        const cards = result.data.map((product) => ({
          id: product.id,
          name: product.name,
          image: product.images[0].content,
          price: product.price,
          priceDiscount: product.price_with_discount < product.price ? product.price_with_discount : null,
        }));
        setProducts(cards);
      });
  }, []);

  return (
    <Layout>
      <Gallery images={slides} width="1440px" height="681px" />

      <div className="container">
        <Section title="Coleções em destaque" titleAlign="center">
          <div className="home-collections">
            <img src="/collection-1.png" alt="Coleção 1" />
            <img src="/collection-2.png" alt="Coleção 2" />
            <img src="/collection-3.png" alt="Coleção 3" />
          </div>
        </Section>

        <Section title="Produtos em alta" titleAlign="left" link={{ text: 'Ver todos', href: '/products' }}>
          <ProductListing products={products} />
        </Section>
      </div>
    </Layout>
  );
}

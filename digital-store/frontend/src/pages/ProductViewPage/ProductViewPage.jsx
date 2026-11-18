import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Section from '../../components/Section/Section';
import ProductListing from '../../components/ProductListing/ProductListing';
import ProductDetails from '../../components/ProductDetails/ProductDetails';

const API = import.meta.env.VITE_API_URL;

export default function ProductViewPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    fetch(API + '/v1/product/' + id)
      .then((response) => response.json())
      .then((result) => setProduct(result));

    fetch(API + '/v1/product/search?limit=4')
      .then((response) => response.json())
      .then((result) => {
        const cards = result.data.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.images[0].content,
          price: item.price,
          priceDiscount: item.price_with_discount < item.price ? item.price_with_discount : null,
        }));
        setRecommended(cards);
      });

    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return <Layout><p className="container">Carregando...</p></Layout>;
  }

  if (!product.id) {
    return <Layout><p className="container">Produto não encontrado.</p></Layout>;
  }

  return (
    <Layout>
      <div className="container">
        <ProductDetails key={product.id} product={product} />

        <Section title="Produtos recomendados" titleAlign="left" link={{ text: 'Ver todos', href: '/products' }}>
          <ProductListing products={recommended} />
        </Section>
      </div>
    </Layout>
  );
}

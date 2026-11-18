import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Section from '../../components/Section/Section';
import ProductListing from '../../components/ProductListing/ProductListing';
import FilterGroup from '../../components/FilterGroup/FilterGroup';
import './ProductListingPage.css';

const API = import.meta.env.VITE_API_URL;

export default function ProductListingPage() {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState('');
  const [order, setOrder] = useState('menor');

  useEffect(() => {
    fetch(API + '/v1/category/search?limit=-1&use_in_menu=true')
      .then((response) => response.json())
      .then((result) => setCategories(result.data));
  }, []);

  useEffect(() => {
    const url =
      API +
      '/v1/product/search?limit=-1' +
      '&match=' + filter +
      '&category_ids=' + selectedCategories.join(',') +
      '&price-range=' + priceRange;

    fetch(url)
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
  }, [filter, selectedCategories, priceRange]);

  function handleCategory(event) {
    const id = event.target.value;
    if (event.target.checked) {
      setSelectedCategories([...selectedCategories, id]);
    } else {
      setSelectedCategories(selectedCategories.filter((item) => item !== id));
    }
  }

  const sorted = [...products].sort((a, b) => {
    const priceA = a.priceDiscount || a.price;
    const priceB = b.priceDiscount || b.price;
    return order === 'menor' ? priceA - priceB : priceB - priceA;
  });

  return (
    <Layout>
      <div className="container listing-page">
        <aside>
          <label className="listing-label">Ordenar por</label>
          <select className="listing-order" value={order} onChange={(event) => setOrder(event.target.value)}>
            <option value="menor">Menor preço</option>
            <option value="maior">Maior preço</option>
          </select>

          <div className="listing-filters">
            <p>Filtrar por</p>
            <hr />
            <FilterGroup
              title="Categoria"
              inputType="checkbox"
              options={categories.map((category) => ({ text: category.name, value: String(category.id) }))}
              onChange={handleCategory}
            />
            <FilterGroup
              title="Preço"
              inputType="radio"
              options={[
                { text: 'Até R$ 150', value: '0-150' },
                { text: 'R$ 150 a R$ 250', value: '150-250' },
                { text: 'Acima de R$ 250', value: '250-10000' },
              ]}
              onChange={(event) => setPriceRange(event.target.value)}
            />
          </div>
        </aside>

        <main>
          <Section title={products.length + ' produtos encontrados'} titleAlign="left">
            <ProductListing products={sorted} />
          </Section>
        </main>
      </div>
    </Layout>
  );
}

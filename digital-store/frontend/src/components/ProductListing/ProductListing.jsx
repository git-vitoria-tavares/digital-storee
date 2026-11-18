import ProductCard from '../ProductCard/ProductCard';
import './ProductListing.css';

export default function ProductListing({ products }) {
  return (
    <div className="product-listing">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}

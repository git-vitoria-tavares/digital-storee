import { Link } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ id, image, name, price, priceDiscount }) {
  return (
    <Link to={'/product/' + id} className="product-card">
      <img src={image} alt={name} />
      <p>{name}</p>

      <span className={priceDiscount ? 'old-price' : 'price'}>R$ {price.toFixed(2).replace(".", ",")}</span>
      {priceDiscount && <span className="price">R$ {priceDiscount.toFixed(2).replace(".", ",")}</span>}
    </Link>
  );
}

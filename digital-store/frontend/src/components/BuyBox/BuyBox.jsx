import starIcon from '../../assets/star-icon.svg';
import './BuyBox.css';

export default function BuyBox({ name, reference, stars, rating, price, priceDiscount, description, children }) {
  return (
    <div className="buy-box">
      <h1>{name}</h1>
      <p className="buy-box-reference">{reference}</p>

      <p>
        <span className="buy-box-stars">
          {stars} <img src={starIcon} alt="estrela" />
        </span>
        <span className="buy-box-rating"> ({rating} avaliações)</span>
      </p>

      <p>
        <span className="buy-box-price">R$ {(priceDiscount || price).toFixed(2).replace(".", ",")}</span>
        {priceDiscount && <span className="buy-box-old-price">R$ {price.toFixed(2).replace(".", ",")}</span>}
      </p>

      <p className="buy-box-description">{description}</p>

      {children}

      <button className="buy-box-button">COMPRAR</button>
    </div>
  );
}

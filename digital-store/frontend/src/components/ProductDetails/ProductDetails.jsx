import Gallery from '../Gallery/Gallery';
import BuyBox from '../BuyBox/BuyBox';
import ProductOptions from '../ProductOptions/ProductOptions';
import './ProductDetails.css';

export default function ProductDetails({ product }) {
  const images = product.images.map((image) => ({ src: image.content }));

  return (
    <div className="product-details">
      <Gallery images={images} showThumbs width="700px" height="570px" radius="4px" />

      <BuyBox
        name={product.name}
        reference={'REF: ' + product.id}
        stars={4.7}
        rating={90}
        price={product.price}
        priceDiscount={product.price_with_discount < product.price ? product.price_with_discount : null}
        description={product.description}
      >
        {product.options.map((option) => (
          <div key={option.id}>
            <p>{option.title}</p>
            <ProductOptions
              options={option.values}
              radius={option.radius + 'px'}
              shape={option.shape}
              type={option.type}
            />
          </div>
        ))}
      </BuyBox>
    </div>
  );
}

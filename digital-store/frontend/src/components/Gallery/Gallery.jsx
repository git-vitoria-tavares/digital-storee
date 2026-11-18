import { useState } from 'react';
import arrowLeft from '../../assets/arrow-left.svg';
import arrowRight from '../../assets/arrow-right.svg';
import './Gallery.css';

export default function Gallery({ images, width, height, radius, showThumbs, className }) {
  const [current, setCurrent] = useState(0);

  return (
    <div className={'gallery ' + (className || '')} style={{ width }}>
      <div className="gallery-slide" style={{ height, borderRadius: radius }}>
        <div className="gallery-track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {images.map((image) => (
            <img key={image.src} src={image.src} alt="" />
          ))}
        </div>

        <button className="arrow left" disabled={current === 0} onClick={() => setCurrent(current - 1)}>
          <img src={arrowLeft} alt="Anterior" />
        </button>
        <button className="arrow right" disabled={current === images.length - 1} onClick={() => setCurrent(current + 1)}>
          <img src={arrowRight} alt="Próxima" />
        </button>
      </div>

      {showThumbs && (
        <div className="gallery-thumbs">
          {images.map((image, index) => (
            <img
              key={image.src}
              src={image.src}
              alt=""
              style={{ borderRadius: radius }}
              className={index === current ? 'selected' : ''}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import './ProductOptions.css';

export default function ProductOptions({ options, radius, shape, type }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="product-options">
      {options.map((option) => (
        <button
          key={option}
          className={shape + (selected === option ? ' selected' : '')}
          style={{
            borderRadius: shape === 'square' ? radius : '50%',
            background: type === 'color' ? option : 'white',
          }}
          onClick={() => setSelected(option)}
        >
          {type === 'text' && option}
        </button>
      ))}
    </div>
  );
}

import './FilterGroup.css';

export default function FilterGroup({ title, inputType, options, onChange }) {
  return (
    <div className="filter-group">
      <p>{title}</p>

      {options.map((option) => (
        <label key={option.text}>
          <input
            type={inputType}
            name={title}
            value={option.value || option.text}
            onChange={onChange}
          />
          {option.text}
        </label>
      ))}
    </div>
  );
}

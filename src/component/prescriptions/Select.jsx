function Select({ label, value, onChange, options, valueKey, getLabel, placeholder, disabled = false }) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <select
        className="form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o[valueKey]} value={o[valueKey]}>{getLabel(o)}</option>
        ))}
      </select>
    </div>
  );
}

export default Select;

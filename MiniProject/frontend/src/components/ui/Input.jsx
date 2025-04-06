const Input = ({ value, onChange, placeholder }) => {
    return (
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="p-2 border rounded w-full"
      />
    );
  };
  
  export default Input;
  
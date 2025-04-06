const Card = ({ children, className }) => {
    return (
      <div className={`border rounded-xl p-4 shadow-md ${className || ""}`}>
        {children}
      </div>
    );
  };
  
  export default Card;
  
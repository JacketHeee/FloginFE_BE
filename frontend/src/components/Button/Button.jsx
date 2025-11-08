import "./Button.scss"

export default function Button({ 
  label, 
  onClick, 
  type = "primary", 
  disabled = false,
  children
}) {
  return (
    <button 
      className={`btn ${type}`} 
      onClick={onClick} 
      disabled={disabled}
    >
      {label}
      {children}
    </button>
  )
}

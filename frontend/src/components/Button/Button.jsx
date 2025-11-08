import "./Button.scss"

export default function Button({ 
  label, 
  onClick, 
  variant = "default", // default, primary, secondary, success, danger, cancel, save, delete, update
  disabled = false,
  children,
  type = "button", // button, submit, reset
  className = "",
  ...props
}) {
  return (
    <button 
      className={`btn btn--${variant} ${className}`} 
      onClick={onClick} 
      disabled={disabled}
      type={type}
      {...props}
    >
      {label}
      {children}
    </button>
  )
}

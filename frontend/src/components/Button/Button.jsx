import PropTypes from 'prop-types';
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

Button.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'danger',
    'cancel',
    'save',
    'delete',
    'update'
  ]),
  disabled: PropTypes.bool,
  children: PropTypes.node,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
};


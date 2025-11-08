import { useState, useRef, useEffect } from "react";
import "./CustomSelect.scss";

export default function CustomSelect({ options = [], value, onChange, disabled = false, placeholder = "Chọn mục" }) {
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState("down");
  const selectRef = useRef(null);

  useEffect(() => {
    if (open && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < 180 && spaceAbove > spaceBelow) {
        setDirection("up");
      } else {
        setDirection("down");
      }
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div
      ref={selectRef}
      className={`custom-select ${open ? "open" : ""} ${disabled ? "disabled" : ""}`}
      onClick={() => !disabled && setOpen(!open)}
    >
      <div className="selected">
        <span>{value || placeholder}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {open && (
        <ul className={`dropdown ${direction}`}>
          {options.map((opt, index) => (
            <li key={index} onClick={() => handleSelect(opt)}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

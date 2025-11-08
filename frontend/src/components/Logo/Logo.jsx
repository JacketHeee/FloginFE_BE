import React from "react"
import "./Logo.scss"

const Logo = ({
  text = "LANNM",
  slogan = "Product Management",
  isText = true,
  size = "medium", // small, medium, large
  theme = "light"  // ✅ light | dark
}) => {
  const sizeMap = {
    small: { width: 32, iconSize: 32, fontSize: "12px", sloganSize: "10px" },
    medium: { width: 48, iconSize: 48, fontSize: "20px", sloganSize: "12px" },
    large: { width: 64, iconSize: 64, fontSize: "28px", sloganSize: "14px" },
  }

  const currentSize = sizeMap[size] || sizeMap.medium

  return (
    <div className={`logo logo--${size} logo--${theme}`}>
      <svg
        width={currentSize.iconSize}
        height={currentSize.iconSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="logo__icon"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#01AE84", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#35D64E", stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        <rect width="64" height="64" rx="16" fill="url(#logoGradient)" />

        <path
          d="M20 16 L20 40 L30 40"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        <path
          d="M34 40 L38 28 L42 40 M35 36 L41 36"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        <circle cx="48" cy="20" r="2.5" fill="white" opacity="0.8" />
        <circle cx="54" cy="26" r="1.5" fill="white" opacity="0.6" />
      </svg>

      {isText && (
        <div className="logo__text">
          <h1 style={{ fontSize: currentSize.fontSize }}>{text}</h1>
          <p style={{ fontSize: currentSize.sloganSize }}>{slogan}</p>
        </div>
      )}
    </div>
  )
}

export default Logo

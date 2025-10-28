import React from "react";
import "./Logo.scss";
import logoIcon from "../assets/logo_1.png"

const Logo = ({ text = "L.A.N.M.L", slogan = "Product Management App" }) => {
  return (
    <div className="logo">
      <div className="logo__icon">
        <img src={logoIcon} alt="Logo" />
      </div>
      <div className="logo__text">
        <h1>{text}</h1>
        <p>{slogan}</p>
      </div>
    </div>
  );
};

export default Logo;

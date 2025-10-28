import React from "react";
import "./Logo.scss";
import logo from "../../assets/logo_1.png";
import logoFull from "../../assets/logo.png";

const Logo = ({ text = "L.A.N.M.L", slogan = "Product Management App", isText, isFull }) => {
  return (
    <div className="logo">
      <img src={isFull? logoFull : logo} alt="" />
      {
        isText && 
        <div className="logo__text">
          <h1>{text}</h1>
          <p>{slogan}</p>
        </div>
      }
    </div>
  );
};

export default Logo;

import React from "react";
import "./Message.scss";

const Message = ({ type = "error", text }) => {
  if (!text) return null;
  return <span className={`message ${type}`}>{text}</span>;
};

export default Message;

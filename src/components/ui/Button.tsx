import React from "react";

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <button {...props} className={`app-btn${props.className ? " " + props.className : ""}`}>
    {props.children}
  </button>
);

export default Button;

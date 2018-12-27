import React from "react";
import ReactDom from "react-dom";

import MainPage from "./js/component/container/MainPage";

const wrapper = document.querySelector("#container");

const body = document.querySelector('body')
body.style.height = '100vh';
body.style.overflow = 'hidden';

if (wrapper != null) ReactDom.render(<MainPage />, wrapper);

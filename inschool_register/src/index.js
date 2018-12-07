import React from "react";
import ReactDom from "react-dom";

import MainPage from "./js/component/container/MainPage";

const wrapper = document.querySelector("#container");

if (wrapper != null) ReactDom.render(<MainPage />, wrapper);

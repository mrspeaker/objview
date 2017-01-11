import React from "react";
import ReactDOM from "react-dom";
import Editor from "./Editor";
import Scene from "./Scene";

ReactDOM.render(
  <Editor>
    <Scene />
  </Editor>,
  document.querySelector("#container")
);

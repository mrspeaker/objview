import React from "react";
import ReactDOM from "react-dom";
import Editor from "./Editor";
import Scene from "./Scene";

const tick = state => {
  ReactDOM.render(
    <Editor state={state}>
      <Scene state={state} onSerialize={tick} />
    </Editor>,
    document.querySelector("#container")
  );
};
tick({});

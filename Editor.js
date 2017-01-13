import React from "react";
const {Component} = React;

class Editor extends Component {

  render () {
    return <div style={{display: "flex", minHeight: "100vh", flexDirection: "column"}}>
      <header style={{height: "5em", backgroundColor: "#ccc", textAlign: "center"}}>
        ObjViewer. Drop obj/mtl files into dropzone
      </header>
      <div style={{display: "flex", flex: 1}}>
        <div style={{flex: 1, backgroundColor: "#eee"}}>
          {this.props.children}
        </div>
        <nav style={{flex: "0 0 9em", order: -1, backgroundColor: "#ccc"}}>
          <div>sidebar</div>
          <textarea
            style={{width: 100, fontSize: 6}}
            value={JSON.stringify(this.props.state)} />
        </nav>
      </div>
    </div>;
  }
}

export default Editor;

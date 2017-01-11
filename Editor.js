import React from "react";
import Dropzone from "react-dropzone";
const {Component} = React;

class Editor extends Component {

  state = {
    files: [],
  }

  onDrop = files => {
    this.setState({
      files: [...files]
    });
  }

  render () {
    return <div style={{display: "flex", minHeight: "100vh", flexDirection: "column"}}>
      <header style={{height: "5em", backgroundColor: "#ccc", textAlign: "center"}}>
        ObjViewer. Drop obj/mtl files into dropzone
      </header>
      <div style={{display: "flex", flex: 1}}>
        <div style={{flex: 1, backgroundColor: "#eee"}}>
          <Dropzone style={{border: 0}} onDrop={this.onDrop}>
            {this.props.children}
          </Dropzone>
        </div>
        <nav style={{flex: "0 0 9em", order: -1, backgroundColor: "#ccc"}}>
          {this.state.files.map(f => <div>{f.name}</div>)}
        </nav>
      </div>
    </div>;
  }
}

export default Editor;

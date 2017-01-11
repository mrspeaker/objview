import React from "react";
import * as THREE from "three";
const {Component} = React;

class Editor extends Component {

  componentDidMount () {
    const dom = this.refs.scene;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(400, 300);

    dom.appendChild(this.renderer.domElement);
    this.setup();
    this.tick = this.tick.bind(this);
    this.tick();
  }

  setup () {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x006600});
    const cube = new THREE.Mesh(geometry, material);
    cube.rotation.z = Math.PI / 3;
    cube.rotation.x = Math.PI / 3;
    this.scene.add(cube);
    this.camera.position.z = 5;
    this.cube = cube;
  }

  tick () {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.z += 0.01;

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.tick);
  }

  render () {
    return <div ref="scene"></div>;
  }
}

export default Editor;

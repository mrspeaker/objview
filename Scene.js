import React from "react";
import * as THREE from "three";
import Dropzone from "react-dropzone";
import OBJLoader from "./vendor/OBJLoader";
import MTLLoader from "./vendor/MTLLoader";
import EditorControls from "./vendor/EditorControls";

const {Component} = React;

class Scene extends Component {

  mats = new Map();

  mtlLoader = new MTLLoader();
  objLoader = new OBJLoader();


  onDrop = (files, rejected, e) => {

    console.log(e.dataTransfer.items[0].webkitGetAsEntry());

    const mtls = files.filter(f => f.name.endsWith(".mtl"));
    const objs = files.filter(f => f.name.endsWith(".obj"));

    // Load materials
    Promise.all(
      mtls.map(m => new Promise(res => {
        const name = m.name.split(".")[0];
        if (this.mats.has(name)) {
          return res();
        }
        this.mtlLoader.load(m, materials => {
          materials.preload();
          this.mats.set(name, materials);
          res();
        });
      }))
    )
    .then(
      // Load meshes
      () => objs.forEach(o => this.loadObj(o))
    );



    this.camera.position.z += 4;
  }

  loadObj (o) {
    const name = o.name.split(".")[0];
    if (!this.mats.has(name)) {
      return;
    }
    const materials = this.mats.get(name);
    this.objLoader.setMaterials(materials);
    this.objLoader.load(o, mesh => {
      // Compute bounding
      mesh.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.computeBoundingBox();
        }
      });
      mesh.scale.set(0.6, 0.6, 0.6);
      mesh.position.x = this.camera.position.x + (Math.random() * 6) - 3;
      //mesh.position.y = this.camera.position.y - 10;
      mesh.position.z = this.camera.position.z - 6 + (Math.random() * 3);
      this.scene.add(mesh);

      //var bbox = new THREE.Box3().setFromObject(mesh);
      //const bbox = mesh.children[0].geometry.boundingBox;
      //console.log("bbox", bbox, bbox.max.z - bbox.min.z);
      const helper = new THREE.BoxHelper(mesh, 0xff0000);
      this.scene.add(helper);
    });
  }

  componentDidMount () {
    const dom = this.refs.scene;
    const parent = dom.parentNode.parentNode;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.y = 2;
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(parent.clientWidth - 50, parent.offsetHeight - 50);

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
    cube.position.y = -4;
    this.scene.add(cube);
    this.camera.position.z = 2;
    this.cube = cube;

    this.lightScene();

    this.controls = new EditorControls(cube);
  }

  lightScene () {
    this.dist = 10;
    const {scene} = this;
    scene.background = new THREE.Color(0xc0e9FD);
    scene.fog = new THREE.Fog(0xc0e9FD, this.dist / 2, this.dist * 2);

    const amb = new THREE.AmbientLight(0x555555);
    scene.add(amb);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(-1, 0.5, 1).normalize();
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight2.position.set(1, 0.5, 1).normalize();
    scene.add(dirLight2);
  }

  tick () {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.z += 0.01;

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.tick);
  }

  render () {
    return <Dropzone disableClick style={{border: 0}} onDrop={this.onDrop}>
      <div ref="scene"></div>
    </Dropzone>;
  }
}

export default Scene;

import React from "react";
import * as THREE from "three";
import Dropzone from "react-dropzone";
import OBJLoader from "./vendor/OBJLoader";
import MTLLoader from "./vendor/MTLLoader";
import EditorControls from "./vendor/EditorControls";
import KeyControls from "./KeyControls";

const {Component} = React;
const filename = name => name.split(".")[0];

const mtlLoader = new MTLLoader();
const objLoader = new OBJLoader();
const mats = new Map();

class Scene extends Component {

  constructor () {
    super();
    this.keys = new KeyControls();
  }

  onDrop = (files, rejected, e) => {

    console.log(e.dataTransfer.items[0].webkitGetAsEntry());

    const mtls = files.filter(f => f.name.endsWith(".mtl"));
    const objs = files.filter(f => f.name.endsWith(".obj"));

    // Load materials then object, and add to scene
    Promise.all(mtls.map(::this.loadMtl))
      .then(() => Promise.all(objs.map(::this.loadObj)))
      .then(meshs => meshs.map(mesh => {
        this.scene.add(mesh);
        //const bh = new THREE.BoxHelper(mesh, 0xff0000);
        //this.scene.add(bh);

        const bb = mesh.children[0].geometry.boundingBox;
        const w = bb.min.x - bb.max.x;
        //console.log(w, bh);

        for (var i = 0; i < 3; i++) {
          const two = mesh.clone();
          two.position.x -= w * (i + 1) * two.scale.x;//i * (w * 0.75);
          this.scene.add(two);
          //const bh = new THREE.BoxHelper(two, 0xffff00);
          //this.scene.add(bh);

        }
        return mesh;
      }))
      .then(::this.serialize);

    this.camera.position.z += 4;
  }

  serialize () {
    this.props.onSerialize(this.scene.toJSON());
  }


  loadMtl (m) { // : File => Promise[Materials]
    return new Promise(res => {
      const name = filename(m.name);
      if (mats.has(name)) {
        return res(mats.get(name));
      }
      mtlLoader.load(m, materials => {
        materials.preload();
        mats.set(name, materials);
        res(materials);
      });
    });
  }

  loadObj (o) { // : File => Promise[Mesh]
    const name = filename(o.name);
    if (!mats.has(name)) {
      return;
    }
    objLoader.setMaterials(mats.get(name));

    return new Promise(res => {
      objLoader.load(o, mesh => {
        // Compute bounding
        mesh.traverse(child => {
          if (child instanceof THREE.Mesh) {
            child.geometry.computeBoundingBox();
          }
        });
        mesh.scale.set(0.6, 0.6, 0.6);
        mesh.position.x = this.camera.position.x + (Math.random() * 6) - 3;
        mesh.position.z = this.camera.position.z - 6 + (Math.random() * 3);
        res(mesh);
      });
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
    this.serialize();

    this.tick = this.tick.bind(this);
    this.tick();
  }

  setup () {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x006600});
    const cube = new THREE.Mesh(geometry, material);
    cube.rotation.z = Math.PI / 3;
    cube.rotation.x = Math.PI / 3;
    //cube.position.y = -4;
    this.scene.add(cube);
    this.camera.position.z = 5;
    this.cube = cube;

    this.lightScene();
    this.controls = new EditorControls(cube);

    const ground = new THREE.PlaneBufferGeometry(32, 32, 32);
    const grass = new THREE.MeshLambertMaterial({color: 0x006600});
    const mesh = new THREE.Mesh(ground, grass);
    mesh.rotation.x = - Math.PI / 2;
    mesh.position.y = 0;
    this.scene.add(mesh);
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

    const speed = 0.1;
    if (this.keys.isDown("LEFT")) {
      this.camera.position.x -= speed;
    }
    if (this.keys.isDown("RIGHT")) {
      this.camera.position.x += speed;
    }
    if (this.keys.isDown("FORWARD")) {
      this.camera.position.z -= speed;
    }
    if (this.keys.isDown("BACKWARD")) {
      this.camera.position.z += speed;
    }
    if (this.keys.isDown("UP")) {
      this.camera.position.y += speed;
    }
    if (this.keys.isDown("DOWN")) {
      this.camera.position.y -= speed;
    }

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

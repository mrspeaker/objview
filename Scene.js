import React from "react";
import * as THREE from "three";
import Dropzone from "react-dropzone";
import OBJLoader from "./vendor/OBJLoader";
import MTLLoader from "./vendor/MTLLoader";

const {Component} = React;

class Scene extends Component {

  onDrop = files => {
    const mtls = files.filter(f => f.name.endsWith(".mtl"));
    const objs = files.filter(f => f.name.endsWith(".obj"));

    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();

    //mtls.forEach(m => mtlLoader.load(m, materials => {
//      materials.preload();
  //  }));

    /*const load = (name, cb) => mtlLoader.load(name + ".mtl", materials => {
      materials.preload();
      objLoader.setMaterials(materials);
      objLoader.load(name + ".obj", mesh => cb(mesh));
    });*/
    objs.forEach(o => {
      const name = o.name.split(".")[0];
      console.log(name, mtls);
      const m = mtls.find(m => m.name.startsWith(name));
      if (m) {
        mtlLoader.load(m, materials => {
          materials.preload();
          objLoader.setMaterials(materials);
          objLoader.load(o, mesh => {
            mesh.position.z = this.camera.position.z - 10;
            mesh.position.y = this.camera.position.y;
            this.scene.add(mesh);
          });
        });
      }
    });

    this.camera.position.z += 4;
    this.camera.position.y -= Math.random() * 2 + 1;
  }

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
    cube.position.y = -4;
    this.scene.add(cube);
    this.camera.position.z = 5;
    this.cube = cube;

    this.lightScene();

  }

  lightScene () {
    const {scene} = this;
    scene.background = new THREE.Color(0xc0e9FD);
    scene.fog = new THREE.Fog(0xc0e9FD, this.dist / 2, this.dist * 2);

    const amb = new THREE.AmbientLight(0x555555);
    scene.add(amb);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(-1, 0.5, 1).normalize();
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.9);
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
    return <Dropzone style={{border: 0}} onDrop={this.onDrop}>
      <div ref="scene"></div>
    </Dropzone>;
  }
}

export default Scene;

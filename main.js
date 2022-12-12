import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import gsap from "gsap";
import "./style.css";

const canvas = document.querySelector(".webgl");

const sizes = {
  width: innerWidth,
  height: innerHeight,
};

// Cursor
const cursor = {
  x: 0,
  y: 0,
};

addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);
});

// Handle resize
addEventListener("resize", (e) => {
  sizes.width = innerWidth;
  sizes.height = innerHeight;

  // update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
});

addEventListener("dblclick", () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

// Scene
const scene = new THREE.Scene();

// Objects
// Mesh = geometry + material
const geo = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshBasicMaterial({
  color: 0xff0000,
});
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

// Debug
const gui = new GUI();

const debugObj = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, {
      duration: 1,
      y: mesh.rotation.y + 10,
    });
  },
};

gui.add(debugObj, "spin");

gui.addColor(debugObj, "color").onChange((val) => {
  mat.color.set(val);
});

gui.add(mesh.position, "y", -3, 3, 0.01);
gui.add(mesh.position, "x", -3, 3, 0.01);
gui.add(mesh.position, "z", -3, 3, 0.01);
gui.add(mesh, "visible");
gui.add(mat, "wireframe");

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Conrols
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer

const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const clock = new THREE.Clock();

const tick = () => {
  // const elapsedTime = clock.getElapsedTime();
  // Update cameara

  // Update controls
  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();

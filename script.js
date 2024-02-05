// Selecting elements
const btns = document.querySelectorAll(".scroll");
const introBtn = document.getElementById("intro__btn");

// Making a smooth scroll from buttons
btns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const id = e.target.closest("a").getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  });
});

// Making the img move
document.addEventListener("mousemove", parallax);
const logo = document.getElementById("logo");

function parallax(e) {
  let x = (window.innerWidth - e.clientX - window.innerWidth / 2) / 70;
  let y = (window.innerHeight - e.clientY - window.innerHeight / 2) / 70;

  logo.style.transform = "translateX(" + x + "px) translateY(" + y + "px)";
}

///////////////////
// 3D
///////////////////

//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const logo3D = document.getElementById;

//Keep track of the mouse position, so we can make the eye move
let mouseX = logo3D.innerWidth / 2;
let mouseY = logo3D.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = "logo";

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `dist/3D/${objToRender}.glb`,
  function (glb) {
    //If the file is loaded, add it to the scene
    object = glb.scene;
    scene.add(object);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
// renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("contact__3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = objToRender === "logo" ? 4 : 500;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500); //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(
  0x333333,
  objToRender === "logo" ? 5 : 1
);
scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
// if (objToRender === "logo") {
//   controls = new OrbitControls(camera, renderer.domElement);
// }

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement

  //Make the eye move
  if (object && objToRender === "logo") {
    //I've played with the constants here until it looked good
    object.rotation.y = -0.3 + (mouseX / window.innerWidth) * 0.4;
    object.rotation.x = 1.2 + (mouseY * 0.8) / window.innerHeight;
  }
  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
const resizeCanvas = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener("resize", resizeCanvas());

//add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
};

//Start the 3D rendering
animate();

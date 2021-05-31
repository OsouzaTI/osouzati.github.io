const options = {
    targetSelector: '#scene',
    width: document.body.clientWidth,
    height: document.body.clientHeight,
    backgroundColor: 0x000000
}

const renderer = new THREE.WebGLRenderer();
renderer.setSize(options.width, options.height);

let domScene = document.querySelector(options.targetSelector);
domScene.appendChild(renderer.domElement);

// Cenas
const scene = new THREE.Scene();
scene.background = new THREE.Color(options.backgroundColor);


// Camera
const aspectRatio = options.width / options.height;
const camera = new THREE.PerspectiveCamera(
    50, aspectRatio,
);

camera.position.z = 15;
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const container = document.querySelector('.dice-container');
const canvas = container.querySelector('canvas');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);

renderer.setClearColor(new THREE.Color(0xffffff), 0);

// Position the camera at an angle to the dice
camera.position.set(1, 4, 3);
camera.lookAt(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

const loader = new GLTFLoader();
let dice = null;

loader.load('../assets/3dmodels/dice.glb', function (gltf) {
    dice = gltf.scene;
    dice.scale.set(1, 1, 1);
    dice.position.set(0, 0, 0);
    scene.add(dice);
    console.log('Model loaded successfully');
    console.log(dice);
}, undefined, function (error) {
    console.error('Error loading model:', error);
});

let rolling = false;
let velocity = new THREE.Vector3();
let angularVelocity = new THREE.Vector3();
let initialPosition = new THREE.Vector3(0, 0, 0); 

const boxWidth = 2;
const boxHeight = 2;
const boxDepth = 2;

function animate() {
    requestAnimationFrame(animate);

    if (rolling && dice) {
        dice.position.add(velocity);

        dice.rotation.x += angularVelocity.x;
        dice.rotation.y += angularVelocity.y;
        dice.rotation.z += angularVelocity.z;

        velocity.y -= 0.01;

        // Boundary constraints
        if (dice.position.x > boxWidth) {
            dice.position.x = boxWidth;
            velocity.x *= -0.5; 
        }
        if (dice.position.x < -boxWidth) {
            dice.position.x = -boxWidth;
            velocity.x *= -0.5;
        }
        if (dice.position.y > boxHeight) {
            dice.position.y = boxHeight;
            velocity.y *= -0.5;
        }
        if (dice.position.y < -boxHeight) {
            dice.position.y = -boxHeight;
            velocity.y *= -0.5;
        }
        if (dice.position.z > boxDepth) {
            dice.position.z = boxDepth;
            velocity.z *= -0.5;
        }
        if (dice.position.z < -boxDepth) {
            dice.position.z = -boxDepth;
            velocity.z *= -0.5;
        }

        // Check if the dice has landed
        if (dice.position.y <= initialPosition.y) {
            dice.position.y = initialPosition.y;
            rolling = false;
            setDiceFace();
        }
    }

    renderer.render(scene, camera);
}

function rollDice() {
    if (dice) {
        rolling = true;
        velocity.set(
            (Math.random() - 0.4) * 0.2, 
            (Math.random() + 0.4) * 0.2,  
            (Math.random() - 0.4) * 0.2  
        );
        angularVelocity.set(
            (Math.random() - 0.4) * 0.2, 
            (Math.random() - 0.4) * 0.2,
            (Math.random() - 0.4) * 0.2
        );
    }
}

function setDiceFace() {
    const faceIndex = Math.floor(Math.random() * 6) + 1;
    console.log(`The dice shows: ${faceIndex}`);

    switch (faceIndex) {
        case 1:
            dice.rotation.set(0, 0, 0); // Adjusted rotation for face 1
            break;
        case 2:
            dice.rotation.set(0, Math.PI / 2, Math.PI / 2);
            break;
        case 3:
            dice.rotation.set(Math.PI / 2, 0, 0);
            break;
        case 4:
            dice.rotation.set(-Math.PI / 2, 0, 0);
            break;
        case 5:
            dice.rotation.set(0, -Math.PI / 2, -Math.PI / 2);
            break;
        case 6:
            dice.rotation.set(Math.PI, 0, 0);
            break;
    }
}

document.addEventListener('click', rollDice);

animate();

function onResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener('resize', onResize);
onResize();

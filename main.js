import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js'
import {VRButton} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/webxr/VRButton.js'
import {ARButton} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/webxr/ARButton.js'

//solar references

const sun = document.getElementById('sun');
const mercury = document.getElementById('mercury');
const venus = document.getElementById('venus');
const earth = document.getElementById('earth');
const mars = document.getElementById('mars');
const jupiter = document.getElementById('jupiter');
const saturn = document.getElementById('saturn');
const uranus = document.getElementById('uranus');
const neptune = document.getElementById('neptune');



let hitTestSource = null;
let hitTestSourceRequested = false;
let reticle;
let planet;


const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,100);
camera.position.set(0,0,5);


//renderer
const renderer = new THREE.WebGLRenderer({
    antialias:true,
    alpha:true
});
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
document.body.appendChild(renderer.domElement);
renderer.xr.enabled = true;

//ARButton
document.body.appendChild(ARButton.createButton(renderer,{
    requiredFeatures:['hit-test'],
    optionalFeatures:['dom-overlay'],
    domOverlay:{
    root:document.body  
}
}));


//Lights
const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( ambientLight );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set(0,1,1);
scene.add( directionalLight );

//orbitcontrols
const orbit = new OrbitControls(camera,renderer.domElement);



//GLTF Loader
const loader = new GLTFLoader();
//load solar model
function loadSolarModel(model){
   loader.load(model,(glb)=>{
    planet = glb.scene;
    planet.scale.set(0.1,0.1,0.1)
   })
}


//solar Events
sun.addEventListener('click',()=>{
    solarModel = loadSolarModel('solarModels/Sun.glb');    
});

mercury.addEventListener('click',()=>{
    solarModel = loadSolarModel('solarModels/Mercury.glb');   
});

venus.addEventListener('click',()=>{
    solarModel = loadSolarModel('solarModels/Venus.glb');    
});

earth.addEventListener('click',()=>{
    solarModel = loadSolarModel('solarModels/Earth.glb');   
});

mars.addEventListener('click',()=>{
    solarModel = loadSolarModel('solarModels/Mars.glb');
    
});

jupiter.addEventListener('click',()=>{
    solarModel = loadSolarModel('solarModels/Jupiter.glb');    
});

saturn.addEventListener('click',()=>{
    solarModel = loadSolarModel('solarModels/Saturn.glb');   
});

uranus.addEventListener('click',()=>{
    solarModel = loadSolarModel('solarModels/Uranus.glb');  
});

neptune.addEventListener('click',()=>{
    solarModel = loadSolarModel('solarModels/Neptune.glb');
});


//controller
const controller = renderer.xr.getController(0);
controller.addEventListener('select',onClick);
scene.add(controller);




function onClick(){

    if(planet){
        if(reticle.visible){
            planet.position.setFromMatrixPosition(reticle.matrix);
            scene.add(planet);
        }
    }
    
}


renderer.setAnimationLoop(render);


function render( timestamp, frame ) {

    if ( frame ) {

        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if ( hitTestSourceRequested === false ) {

            session.requestReferenceSpace( 'viewer' ).then( function ( referenceSpace ) {

                session.requestHitTestSource( { space: referenceSpace } ).then( function ( source ) {

                    hitTestSource = source;

                } );

            } );

            session.addEventListener( 'end', function () {

                hitTestSourceRequested = false;
                hitTestSource = null;

            } );

            hitTestSourceRequested = true;

        }

        if ( hitTestSource ) {

            const hitTestResults = frame.getHitTestResults( hitTestSource );

            if ( hitTestResults.length ) {

                const hit = hitTestResults[ 0 ];

                reticle.visible = true;
                reticle.matrix.fromArray( hit.getPose( referenceSpace ).transform.matrix );

            } else {

                reticle.visible = false;

            }

        }

    }

    renderer.render( scene, camera );

}

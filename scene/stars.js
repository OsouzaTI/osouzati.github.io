const NUM_PARTICLES = 6000;

const options = {
    targetSelector: '#scene',
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x000000
}

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(60, options.width / options.height, 1, 1000);
camera.position.z = 1;
camera.rotation.x = Math.PI/2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(options.width, options.height);

let domScene = document.querySelector(options.targetSelector);
domScene.appendChild(renderer.domElement);

let startGeo = new THREE.BufferGeometry();


let i;
let positions = [];
let vectors = [];
for(i = 0; i < NUM_PARTICLES; i++){

    let star = new THREE.Vector3(
        Math.random() * 600 - 300,
        Math.random() * 600 - 300,
        Math.random() * 600 - 300
    );
    star.velocity = 0;
    star.acceleration = 0.02;
    // x
    positions.push(star.x);
    // y
    positions.push(star.y);
    // z
    positions.push(star.z);
    
    vectors.push(star);

}

startGeo.setAttribute(
    'position',
    new THREE.Float32BufferAttribute( positions, 3 )
);

let loader = new THREE.TextureLoader();

// load a resource
loader.load(
	// resource URL
	'../images/star_texture.png',

	// onLoad callback
	function ( texture ) {
		// in this example we create the material when the texture is loaded
		const material = new THREE.MeshBasicMaterial( {
			map: texture
		 } );
	},

	// onProgress callback currently not supported
	undefined,

	// onError callback
	function ( err ) {
		console.error( 'An error happened.');
        console.log(err)
	}
);

let starMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.7,
    map: loader.load('./images/star_texture.png')
});

const starPoints = new THREE.Points( startGeo, starMaterial );
scene.add(starPoints)

renderer.render(scene, camera);

// functions helpers
function updatePositions(){
    let index = 0;
    vectors.forEach(v => {
        v.velocity += v.acceleration;
        v.y -= v.velocity;
        if(v.y < -200){
            v.y = 200;
            v.velocity = 0;
        }
        positions[index]   = v.x;
        positions[index+1] = v.y;
        positions[index+2] = v.z;
        index += 3;
    })

}


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
window.addEventListener( 'resize', onWindowResize );


let angle = 0.0;

renderer.setAnimationLoop(_=>{
    updatePositions();
    startGeo.setAttribute(
        'position',
        new THREE.Float32BufferAttribute( positions, 3 )
    );
    starPoints.rotation.y += 0.005;
    startGeo.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);

});



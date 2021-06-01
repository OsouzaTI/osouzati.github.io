// standard global variables
let container,
    scene,
    camera,
    renderer,
    controls,
    listener,
    stats,
    world,
    dice = [];
let mousex = 0;
let mousey = 0;

let orbitalCamera = false;
let activateAudio = false;

// Dice Controller
const diceController = new DiceControll();

addEventListener('mousemove', e => {
    mousex = e.x;
    mousey = e.y;
});


init();
// FUNCTIONS
function init()
{      
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	let SCREEN_WIDTH = window.innerWidth;
    let SCREEN_HEIGHT = window.innerHeight;
	let VIEW_ANGLE = 45;
    let ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
    let NEAR = 0.01;
    let FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.rotation.x = -Math.PI/2;
    
    // // create an AudioListener and add it to the camera
    listener = new THREE.AudioListener();
    camera.add(listener);
    // create a global audio source
    const sound = new THREE.Audio( listener );
    
    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    
    // create a global audio source
    // const sound = new THREE.Audio( listener );

    // setInterval(_=>{
    //     camera.rotation.x += 0.01;
    //     // camera.rotation.y += 0.01;
    //     // camera.rotation.z += 0.01;
    // }, 100);

	scene.add(camera);
	camera.position.set(0, 65, 0);
	// RENDERER
    renderer = new THREE.WebGLRenderer( {antialias:true} );
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	container = document.getElementById( 'ThreeJS' );
	let canvas = container.appendChild( renderer.domElement );

    // EVENTS
	// CONTROLS
    controls = new THREE.OrbitControls(
        camera,
        renderer.domElement
    );
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );

	let ambient = new THREE.AmbientLight('#ffffff', 0.3);
	scene.add(ambient);

    let directionalLight = new THREE.DirectionalLight('#ffffff', 0.8);
    directionalLight.position.x = -1000;
    directionalLight.position.y = 1000;
    directionalLight.position.z = 1000;
    scene.add(directionalLight);

    let light = new THREE.SpotLight(0xefdfd5, 0.5);
    light.position.y = 100;
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.camera.near = 50;
    light.shadow.camera.far = 110;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);

    let light1 = new THREE.SpotLight(0xefdfd5, 0.2);
    light.position.y = 60;
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.camera.near = 50;
    light.shadow.camera.far = 110;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light1);

    
	// FLOOR
    let loader = new THREE.TextureLoader();
	let floorMaterial = new THREE.MeshPhongMaterial({
        color: '#fff',
        side: THREE.DoubleSide,
        map: loader.load('../images/table01.bmp')
    });
	let floorBaseMaterial = new THREE.MeshPhongMaterial({ color: '#212121', side: THREE.DoubleSide});
	
    let easterEggMaterial = new THREE.MeshPhongMaterial({
        color: '#212121',
        side: THREE.DoubleSide,
        map: loader.load('../images/kevin_go.png')
    });
	
    let easterEggGeometry = new THREE.PlaneGeometry(60, 50, 10, 10);
    let floorGeometry = new THREE.PlaneGeometry(60, 50, 10, 10);
	let floorBaseGeometry = new THREE.BoxGeometry(50, 50, 1, 1);
	let floor = new THREE.Mesh(floorGeometry, floorMaterial);
	let floorBase = new THREE.Mesh(floorBaseGeometry, floorBaseMaterial);
	let easterEggMesh = new THREE.Mesh(easterEggGeometry, easterEggMaterial);
	floor.receiveShadow  = true;
	floor.rotation.x = Math.PI / 2;
	floor.rotation.y = Math.PI;
	floor.rotation.z = Math.PI;
	floorBase.rotation.x = Math.PI / 2;
	floorBase.rotation.y = Math.PI;
	floorBase.rotation.z = Math.PI;
    floorBase.position.y = -1;
    easterEggMesh.rotation.x = Math.PI/2;
    easterEggMesh.rotation.z = Math.PI;
    easterEggMesh.rotation.y = Math.PI;
    easterEggMesh.position.y = -100;

	scene.add(floor);
	scene.add(floorBase);
	scene.add(easterEggMesh);
	// SKYBOX/FOG
	let skyBoxGeometry = new THREE.BoxGeometry( 10000, 10000, 10000 );
	let skyBoxMaterial = new THREE.MeshPhongMaterial({
        color: 0x9999ff, side: THREE.BackSide
    });
	let skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	// scene.add(skyBox);
	scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

	////////////
	// CUSTOM //
	////////////
    world = new CANNON.World();

    world.gravity.set(0, -9.82 * 20, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 16;

    DiceManager.setWorld(world);


    //Floor
    let floorBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Plane(),
        material: DiceManager.floorBodyMaterial
    });

    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.add(floorBody);

    //-------------- Walls  
    function createShape({x, y, z, width, height, depth}){
        // console.log(x, y, z, width, height, depth);
        // parte fisica
        let vector = new CANNON.Vec3(width/2, height/2, depth/2);
        let cannonGeometry = new CANNON.Box(vector);
        let bodyShape = new CANNON.Body({mass: 0, shape: cannonGeometry});
        world.addBody(bodyShape);

        // parte gráfica
        let material = new THREE.MeshPhongMaterial({
            color: '#FFFFFF',
            opacity: 0.0,
            transparent: true,
        }); 

        let threeGeometry = new THREE.BoxGeometry(width, height, depth);
        let geometryMesh = new THREE.Mesh( threeGeometry, material ); 

        geometryMesh.position.set(x, y, z);
        bodyShape.position.set(x, y, z);  

        return geometryMesh;
    }



    // Physics
    let wallLeftSize  = {x: -25, y: 40, z: 0, width: 1,    height: 80, depth: 50};
    let wallRightSize = {x: 25,  y: 40, z: 0, width: 1,    height: 80, depth: 50};
    let wallTopSize   = {x: 0,   y: 40, z: -25, width: 50, height: 80, depth: 1};
    let wallDownSize  = {x: 0,   y: 40, z: 25, width: 50,  height: 80, depth: 1};
    
    let wallLeft = createShape(wallLeftSize);
    let wallRight = createShape(wallRightSize);
    let wallTop = createShape(wallTopSize);
    let wallDown = createShape(wallDownSize);

    scene.add(wallLeft);
    scene.add(wallRight);
    scene.add(wallTop);
    scene.add(wallDown);

    function randomDiceThrow() {
        dice = diceController.getDices();

        let diceValues = [];
        let rng = new RNG(Math.random()*10);
        for (var i = 0; i < dice.length; i++) {            
            scene.add(dice[i].getObject());

            let yRand = rng.nextRange(20, 30);
            console.log(yRand);
            dice[i].resetBody();
            dice[i].getObject().position.x = -15 - (i % 3) * 1.5;
            dice[i].getObject().position.y = 2 + Math.floor(i / 3) * 1.5;
            dice[i].getObject().position.z = -15 + (i % 3) * 1.5;
            dice[i].getObject().quaternion.x = rng.nextRange(45, 90) * Math.PI / 180;
            dice[i].getObject().quaternion.z = rng.nextRange(50, 85) * Math.PI / 180;
            dice[i].updateBodyFromMesh();
            let rand = Math.random() * 10;
            dice[i].getObject().body.velocity.set(
                rng.nextRange(10, 50) + rand,
                rng.nextRange(10, 50) + yRand,
                rng.nextRange(10, 30) + rand
            );
            dice[i].getObject().body.angularVelocity.set(20 * Math.random() -10, 20 * Math.random() -10, 20 * Math.random() -10);

            diceValues.push({
                dice: dice[i],
                value: rng.nextRange(1, dice[i].values)
            });
        }
        
        DiceManager.prepareValues(diceValues);
    }
    
    document.getElementById("btThrow").addEventListener('click',()=>{
        randomDiceThrow();        
        setTimeout(()=>{
            let history = document.getElementById("history");

            if(history.children.length > 3){
                let resultList = history.getElementsByClassName("result");
                history.removeChild(resultList[0]);
            }


            let beginRow = `<div class="result">`;
            dice.forEach(d =>{
                let value = d.getUpsideValue();
                
                if(activateAudio){
                    if(value == 1){
                        audioLoader.load('../audios/falhaCritica.mp3', (b)=>play(b, sound));
                    }else if(value == 20){
                        audioLoader.load('../audios/acertoCritico.mp3', (b)=>play(b, sound));
                    }
                }

                let status = "";
                if(value == d.values)
                    status = 'acertoCritico';
                else if(value == 1)
                    status = 'erroCritico';

                beginRow += `
                <div class="result-item ${status}">${value}</div>                
                `;
            });
            beginRow += `</div>`;        
            history.innerHTML += beginRow;           

        }, 3000)
    });

    requestAnimationFrame( animate );
}

// Buttons bind
const d4p = document.getElementById("d4p");
const d4m = document.getElementById("d4m");
const d4l = document.getElementById("d4l");

const d6p = document.getElementById("d6p");
const d6m = document.getElementById("d6m");
const d6l = document.getElementById("d6l");

const d8p = document.getElementById("d8p");
const d8m = document.getElementById("d8m");
const d8l = document.getElementById("d8l");

const d10p = document.getElementById("d10p");
const d10m = document.getElementById("d10m");
const d10l = document.getElementById("d10l");

const d12p = document.getElementById("d12p");
const d12m = document.getElementById("d12m");
const d12l = document.getElementById("d12l");

const d20p = document.getElementById("d20p");
const d20m = document.getElementById("d20m");
const d20l = document.getElementById("d20l");

document.getElementById("btClean").addEventListener('click', ()=>{
    diceController.getDices().forEach(d => {
        scene.remove(d.getObject());
    });
    diceController.cleanDices();  
    d4l.innerHTML = `0 d4`;      
    d6l.innerHTML = `0 d6`;      
    d8l.innerHTML = `0 d8`;      
    d10l.innerHTML = `0 d10`;      
    d12l.innerHTML = `0 d12`;      
    d20l.innerHTML = `0 d20`;        
})

d4p.addEventListener('click', ()=>{
    diceController.addD4();
    d4l.innerHTML = `${diceController.getD4()} d4`;
});
d6p.addEventListener('click', ()=>{
    diceController.addD6();
    d6l.innerHTML = `${diceController.getD6()} d6`;
});
d8p.addEventListener('click', ()=>{
    diceController.addD8();
    d8l.innerHTML = `${diceController.getD8()} d8`;
});
d10p.addEventListener('click', ()=>{
    diceController.addD10();
    d10l.innerHTML = `${diceController.getD10()} d10`;
});
d12p.addEventListener('click', ()=>{
    diceController.addD12();
    d12l.innerHTML = `${diceController.getD12()} d12`;
});
d20p.addEventListener('click', ()=>{
    diceController.addD20();
    d20l.innerHTML = `${diceController.getD20()} d20`;
});

d4m.addEventListener('click', ()=>{
    diceController.subD4();
    d4l.innerHTML = `${diceController.getD4()} d4`;
});
d6m.addEventListener('click', ()=>{
    diceController.subD6();
    d6l.innerHTML = `${diceController.getD6()} d6`;
});
d8m.addEventListener('click', ()=>{
    diceController.subD8();
    d8l.innerHTML = `${diceController.getD8()} d8`;
});
d10m.addEventListener('click', ()=>{
    diceController.subD10();
    d10l.innerHTML = `${diceController.getD10()} d10`;
});
d12m.addEventListener('click', ()=>{
    diceController.subD12();
    d12l.innerHTML = `${diceController.getD12()} d12`;
});
d20m.addEventListener('click', ()=>{
    diceController.subD20();
    d20l.innerHTML = `${diceController.getD20()} d20`;
});

// Functions

window.addEventListener('resize', ()=>{
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

});

function animate()
{
    updatePhysics();
	render();
	update();

    requestAnimationFrame( animate );

}

function updatePhysics() {
    world.step(1.0 / 60.0);

    for (let i in dice) {
        dice[i].updateMeshFromBody();
    }
}

function update()
{
    controls.enabled = orbitalCamera;
    controls.update();
	stats.update();
}

function render()
{
	renderer.render( scene, camera );
}
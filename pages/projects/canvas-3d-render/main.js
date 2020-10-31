window.onload = function(){
    let canvas = document.getElementById("canvas");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight
    var ctx = canvas.getContext("2d");        
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;    
    var imageData = ctx.createImageData(canvasWidth, canvasHeight);
    let CENTER_WINDOW = {x: Math.round(canvasWidth / 2), y: Math.round(canvasHeight / 2)};
    let cube_rotation = {x: 0, y: 0, z: 0}
    let view = 640;
 
    addEventListener("resize", ()=>{
        console.log("resize");
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        imageData = ctx.createImageData(canvasWidth, canvasHeight);
        CENTER_WINDOW = {x: Math.round(canvasWidth / 2), y: Math.round(canvasHeight / 2)};
        console.log(canvasWidth);
    })

    const cube = new Array(729);    
    let camera = {x: 0, y: 0, z: -6.4};

    for (let x = -1; x <= 1; x+=0.25) {
        for (let y = -1; y <= 1; y+=0.25) {
            for (let z = -1; z <= 1; z+=0.25) {
                let vec3 = {x: x, y: y, z: z}
                cube.push(vec3)
            }            
        }        
    }

    //functions

    drawRect = (_x, _y, w, h) => {
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {                
                let xx = _x + x;
                let yy = _y + y;
                draw_buffer_color(xx, yy, 255, 255, 0);
            }
        }
    }

    vec2MultiplyScalar = (vec2, s) => {
        vec2.x *= s;
        vec2.y *= s;
    }

    vec2SumScalar = (vec2, s) => {
        vec2.x += s;
        vec2.y += s;
    }

    vec2Translate = (vec2, point) => {
        return {
            x: vec2.x + point.x,
            y: vec2.y + point.y
        }               
    }

    vec3Translate = (vec3, point) => {
        return {
            x: vec3.x + point.x,
            y: vec3.y + point.y,
            z: vec3.z
        }               
    }

    vec3Subtract = (vec3_a, vec3_b) => {
        return {
            x: vec3_a.x - vec3_b.x,
            y: vec3_a.y - vec3_b.y,
            z: vec3_a.z - vec3_b.z
        }
    }

    vec3RotateX = (vec2, angle) => {
        return {
            x: vec2.x,
            y: vec2.y * Math.cos(angle) - vec2.z * Math.sin(angle),
            z: vec2.y * Math.sin(angle) + vec2.z * Math.cos(angle)
        }
    }

    vec3RotateY = (vec2, angle) => {
        return {
            x: vec2.x * Math.cos(angle) - vec2.z * Math.sin(angle),
            y: vec2.y,
            z: vec2.x* Math.sin(angle) + vec2.z * Math.cos(angle)
        }
    }

    vec3RotateZ = (vec2, angle) => {
        return {
            x: vec2.x * Math.cos(angle) - vec2.y * Math.sin(angle),
            y: vec2.x * Math.sin(angle) + vec2.y * Math.cos(angle),
            z: vec2.z
        }
    }

    project = (cube) => {
        let _cube = {
            x: (cube.x * view) / cube.z,
            y: (cube.y * view) / cube.z
        };

        return vec2Translate(_cube, CENTER_WINDOW);
    }

    //--------------

    function clear_buffer_color(){
        for (let x = 0; x < imageData.width; x++) {
            for(let y = 0; y < imageData.height; y++){
                
                var off = (y * imageData.width + x) * 4;
                imageData.data[off]     = 0;
                imageData.data[off + 1] = 0;
                imageData.data[off + 2] = 0;
                imageData.data[off + 3] = 255;            
                
            }
        }
    }

    function draw_buffer_color(_x, _y, r, g, b){
        let x = Math.round(_x);
        let y = Math.round(_y);
        if(x >= 0 && x < canvasWidth && y >= 0 && y < canvasHeight){

            var off = (y * imageData.width + x) * 4;
            imageData.data[off]     = r;
            imageData.data[off + 1] = g;
            imageData.data[off + 2] = b;
            imageData.data[off + 3] = 255;     

        }
        
    }
    
    function draw_cube(){
        cube_rotation.x += 0.01;
        cube_rotation.y += 0.01;
        cube_rotation.z += 0.01;
        cube.forEach(cb => {            
            let point = cb;
            let transformed_point = vec3RotateX(point, cube_rotation.x); 
            
            transformed_point = vec3RotateY(transformed_point, cube_rotation.y);            
            transformed_point = vec3RotateZ(transformed_point, cube_rotation.z);            
            
            let point_projected = project(vec3Subtract(transformed_point, camera));            
            drawRect(
                point_projected.x,
                point_projected.y,
                4, 4
            );
        });
    }
    
    


    function main(){
        
        clear_buffer_color();        
        draw_cube();        
        ctx.putImageData(imageData, 0, 0);

    }

   // Call the main loop 60fps
   setInterval(main, 60/1000);
}
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
            
            let point_projected = project(vec3Subtract(transformed_point, camera), view);            
            
            point_projected = vec3Translate(point_projected, CENTER_WINDOW);

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
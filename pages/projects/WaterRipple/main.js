window.onload = function(){
    let canvas = document.getElementById("canvas");
    let range = document.getElementById("myrange");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight
    var ctx = canvas.getContext("2d");        
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;    
    var imageData = ctx.createImageData(canvasWidth, canvasHeight);
    let CENTER_WINDOW = {x: Math.round(canvasWidth / 2), y: Math.round(canvasHeight / 2)};

    let current = [];
    let previous = [];
    let damping = 0.99;
 
    addEventListener("resize", ()=>{
        console.log("resize");
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        imageData = ctx.createImageData(canvasWidth, canvasHeight);
        CENTER_WINDOW = {x: Math.round(canvasWidth / 2), y: Math.round(canvasHeight / 2)};
        
        load_buffers(); 
        
        console.log(canvasWidth);
    })

    // Jquery event
    addEventListener("mousemove", (e)=>{
        let x = Math.round(e.clientX);
        let y = Math.round(e.clientY);
        previous[x][y] = 255;
    });

    range.addEventListener('change', ()=>{
        console.log("mudou");
        damping = (range.value / 100);
    })

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
    
    function load_buffers(){
        for (let i = 0; i < canvasWidth; i++) {
            current[i] = [];
            previous[i] = [];
            for (let j = 0; j < canvasHeight; j++) {
              current[i][j] = 0;
              previous[i][j] = 0;
            }
        }
        
    }

    function waterRipple(){
        for(let i = 1; i < canvasWidth - 1; i++){
            for(let j = 1; j < canvasHeight - 1; j++){
                current[i][j] =
                (previous[i - 1][j] + previous[i + 1][j] +
                previous[i][j - 1] + previous[i][j + 1] +
                previous[i - 1][j - 1] + previous[i - 1][j + 1] +
                previous[i + 1][j - 1] + previous[i + 1][j + 1]
                ) / 4 - current[i][j];
                current[i][j] = current[i][j] * damping            
                draw_buffer_color(
                    i,
                    j,
                    current[i][j] * 255,
                    current[i][j] * 255,
                    current[i][j] * 255
                );
            }
        }
        //swap buffers
        let temp = previous;
        previous = current;
        current = temp;
    }

    load_buffers();    

    function main(){

        clear_buffer_color();        
        
        waterRipple();

        ctx.putImageData(imageData, 0, 0);

    }

   // Call the main loop 60fps
   setInterval(main, 60/1000);
}
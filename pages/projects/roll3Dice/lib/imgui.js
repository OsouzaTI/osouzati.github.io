(async function() {
    await ImGui.default();
    const canvas = document.getElementById("output");
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.scrollWidth * devicePixelRatio;
    canvas.height = canvas.scrollHeight * devicePixelRatio;
    window.addEventListener("resize", () => {
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = canvas.scrollWidth * devicePixelRatio;
      canvas.height = canvas.scrollHeight * devicePixelRatio;
    });
  
    ImGui.CreateContext();
    ImGui_Impl.Init(canvas);
    ImGui.StyleColorsDark();
  
    const clear_color = new ImGui.ImVec4(0.3, 0.3, 0.3, 1.00);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.gammaFactor = 2.2;
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    
    const scene = new THREE.Scene();
    
    let floorDim = 1000;
    var grid = new THREE.GridHelper(floorDim, 200, 'orange', 'white');
    grid.name = "grid";
    grid.material.opacity = 1.0;
    grid.material.transparent = true;
    grid.material.color.convertGammaToLinear(2.2);
    grid.position.set(0, 2, 0);
    scene.add(grid);
    
    var subgrid = new THREE.GridHelper(floorDim, 600, 'grey', 'grey');
    subgrid.name = "subgrid";
    subgrid.material.opacity = 1.0;
    subgrid.material.color.convertGammaToLinear(2.2);
    subgrid.material.transparent = true;
    subgrid.position.set(0, 1, 0);
    scene.add(subgrid);
    
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
      light.position.set(0, 100, -50);
      light.lookAt(new THREE.Vector3(0, 0, 0));
      scene.add(light);
  
      const box_1_mesh = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshLambertMaterial({ color:0x970000 }));
    box_1_mesh.position.set(0, 5, 0);
    scene.add(box_1_mesh);
  
      const box_2_mesh = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshLambertMaterial({ color:0x333000 }));
    box_2_mesh.position.set(-2, 6, 7);
    scene.add(box_2_mesh);
    
    const camera = new THREE.PerspectiveCamera(50, canvas.width / canvas.height, 2, 10000);
      camera.position.set(0, 10, -25);
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
      scene.add(camera);
  
    setTimeout(() => {
      grid.visible = false;
    }, 1000);
    setTimeout(() => {
      grid.visible = true;
    }, 2000);
    setTimeout(() => {
      console.log(grid.visible);
    }, 2500);
  
    window.requestAnimationFrame(_loop);
    function _loop(time) {
      ImGui_Impl.NewFrame(time);
      ImGui.NewFrame();
  
      ImGui.SetNextWindowPos(new ImGui.ImVec2(20, 20), ImGui.Cond.FirstUseEver);
      ImGui.SetNextWindowSize(new ImGui.ImVec2(294, 140), ImGui.Cond.FirstUseEver);
      ImGui.Begin("Visblility Toggles:");
      ImGui.Checkbox("box_1 (near)", (value = box_1_mesh.visible) => box_1_mesh.visible = value);
      ImGui.Checkbox("box_2 (distant)", (value = box_2_mesh.visible) => box_2_mesh.visible = value);
      ImGui.Checkbox("grid", (value = grid.visible) => grid.visible = value);
      ImGui.Checkbox("subgrid", (value = subgrid.visible) => subgrid.visible = value);
      
      
      ImGui.End();
      ImGui.EndFrame();
      ImGui.Render();
  
      renderer.setClearColor(new THREE.Color(clear_color.x, clear_color.y, clear_color.z), clear_color.w);
      renderer.setSize(canvas.width, canvas.height);
      camera.aspect = canvas.width / canvas.height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
  
      const gl = renderer.getContext();
      window.vao = window.vao || gl.createVertexArray();
      const oldVao = gl.getParameter(gl.VERTEX_ARRAY_BINDING);
      gl.bindVertexArray(vao);
      
      ImGui_Impl.RenderDrawData(ImGui.GetDrawData());
      
      gl.bindVertexArray(oldVao);
  
      renderer.state.reset();
  
      window.requestAnimationFrame(_loop);
    }
  
  })();
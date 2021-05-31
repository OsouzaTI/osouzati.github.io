function vec2MultiplyScalar(vec2, s){
    vec2.x *= s;
    vec2.y *= s;
}

function vec2SumScalar(vec2, s){
    vec2.x += s;
    vec2.y += s;
}

function vec2Translate(vec2, point){
    return {
        x: vec2.x + point.x,
        y: vec2.y + point.y
    }               
}

function vec3Translate(vec3, point){
    return {
        x: vec3.x + point.x,
        y: vec3.y + point.y,
        z: vec3.z
    }               
}

function vec3Subtract(vec3_a, vec3_b){
    return {
        x: vec3_a.x - vec3_b.x,
        y: vec3_a.y - vec3_b.y,
        z: vec3_a.z - vec3_b.z
    }
}

function vec3RotateX(vec2, angle){
    return {
        x: vec2.x,
        y: vec2.y * Math.cos(angle) - vec2.z * Math.sin(angle),
        z: vec2.y * Math.sin(angle) + vec2.z * Math.cos(angle)
    }
}

function vec3RotateY(vec2, angle){
    return {
        x: vec2.x * Math.cos(angle) - vec2.z * Math.sin(angle),
        y: vec2.y,
        z: vec2.x* Math.sin(angle) + vec2.z * Math.cos(angle)
    }
}

function vec3RotateZ(vec2, angle){
    return {
        x: vec2.x * Math.cos(angle) - vec2.y * Math.sin(angle),
        y: vec2.x * Math.sin(angle) + vec2.y * Math.cos(angle),
        z: vec2.z
    }
}

function project(cube, view){
    let _cube = {
        x: (cube.x * view) / cube.z,
        y: (cube.y * view) / cube.z
    };
    return _cube;
}

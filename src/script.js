let gl,
    vertices,
    shaderProgram,
    matrix = mat4.create(),
    vertexCount;

initGL = () => {
    let canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl");
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.3, 0.1, 0.8, 1);
};

getShaders = (gl, id) => {
    let shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }
    let theSource = "";
    let currentChild = shaderScript.firstChild;

    while(currentChild) {
        if (currentChild.nodeType == currentChild.TEXT_NODE) {
            theSource += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
    }

    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER)
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER)
    } else {
        return null;
    }
    gl.shaderSource(shader, theSource)

    // Compile the shader program
    gl.compileShader(shader);

    // If it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occured compilling the shaders: " + gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
};

createShaders = () => {
    /**
     * create and compile vertex shader
     */
    let vertexShader = getShaders(gl, "shader-vs");
    /**
     * create and compile fragment shader
     */
    let fragmentShader = getShaders(gl, "shader-fs");
    /**
     * shader program -> link mid vertex and fragment shader
     */
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
};
/**
 * set vars of shader's vertexes through attrs
 */
createVertices = () => {
    vertices = [];
    vertices.push(0,0.9,0.3,   1,1,1,1);
    for (let i = 0; i < Math.PI * 2; i += 0.01) {
        vertices.push(Math.cos(i));
        vertices.push(Math.sin(i));
        vertices.push(Math.sin(i * 10) * 0.1);

        vertices.push(Math.sin(i * 10) * 0.5 + 0.5);
        vertices.push(Math.sin(i * 8) * 0.5 + 0.5);
        vertices.push(Math.sin(i * 12) * 0.5 + 0.5);
        vertices.push(1);
    }
    i = Math.PI * 2;
    vertices.push(Math.cos(i));
    vertices.push(Math.sin(i));
    vertices.push(Math.sin(i * 10) * 0.1);

    vertices.push(Math.sin(i * 10) * 0.5 + 0.5);
    vertices.push(Math.sin(i * 8) * 0.5 + 0.5);
    vertices.push(Math.sin(i * 12) * 0.5 + 0.5);
    vertices.push(1);

    vertexCount = vertices.length / 7;
    /**
     * create buffer array with vertices coords
     */
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    let coords = gl.getAttribLocation(shaderProgram, "coords");
    // gl.vertexAttrib3f(coords, 0, 0, 0); change single point to poits array
    gl.vertexAttribPointer(coords, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, 0);
    gl.enableVertexAttribArray(coords);

    let colorsLocation = gl.getAttribLocation(shaderProgram, "colors");
    gl.vertexAttribPointer(colorsLocation, 4, gl.FLOAT, false,
        Float32Array.BYTES_PER_ELEMENT * 7, Float32Array.BYTES_PER_ELEMENT * 3);
    gl.enableVertexAttribArray(colorsLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let pointSize = gl.getAttribLocation(shaderProgram, "pointSize");
    gl.vertexAttrib1f(pointSize, 50);

    // let color = gl.getUniformLocation(shaderProgram, "color");
    // gl.uniform4f(color, 0, 0, 0, 1);
}

draw = () => {
    mat4.rotateX(matrix, matrix, -0.008);
    mat4.rotateY(matrix, matrix, 0.013);
    mat4.rotateZ(matrix, matrix, 0.01);
    let transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
    gl.uniformMatrix4fv(transformMatrix, false, matrix);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertexCount);
    requestAnimationFrame(draw);
}

/**
 * Call functions
 */
initGL();
createShaders();
createVertices();
draw();
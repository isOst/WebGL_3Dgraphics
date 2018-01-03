let gl,
    vertices,
    shaderProgram,
    matrix = mat4.create(),
    vertexCount = 36;

initGL = () => {
    let canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl");
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 1);
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
    vertices = [
        0.88, -0.25, -0.18,     1, 0, 0, 1,
        0.9, 0.25, 0,           1, 0, 0, 1,
        0.88, -0.25, 0.18,      1, 0, 0, 1,

        0.85, -0.25, 0.29,      1, 1, 0, 1,
        0.78, 0.25, 0.45,       1, 1, 0, 1,
        0.67, -0.25, 0.6,       1, 1, 0, 1,

        0.6, -0.25, 0.67,       0, 1, 0, 1,
        0.45, 0.25, 0.78,       0, 1, 0, 1,
        0.29, -0.25, 0.85,      0, 1, 0, 1,

        0.18, -0.25, 0.88,      0, 1, 1, 1,
        0, 0.25, 0.9,           0, 1, 1, 1,
        -0.18, -0.25, 0.88,     0, 1, 1, 1,

        -0.29, -0.25, 0.85,     0, 0, 1, 1,
        -0.45, 0.25, 0.78,      1, 1, 0, 1,
        -0.6, -0.25, 0.67,      0, 0, 1, 1,

        -0.67, -0.25, 0.6,      1, 0, 1, 1,
        -0.78, 0.25, 0.45,      1, 0, 1, 1,
        -0.85, -0.25, 0.29,     1, 0, 1, 1,

        -0.88, -0.25, 0.18,     1, 0.5, 0, 1,
        -0.9, 0.25, 0,          1, 0.5, 0, 1,
        -0.88, -0.25, -0.18,    1, 0.5, 0, 1,

        -0.85, -0.25, -0.29,    0, 0.5, 1, 1,
        -0.78, 0.25, -0.45,     0, 0.5, 1, 1,
        -0.67, -0.25, -0.6,     0, 0.5, 1, 1,

        -0.6, -0.25, -0.67,     0, 1, 0.5, 1,
        -0.45, 0.25, -0.78,     0, 1, 0.5, 1,
        -0.29, -0.25, -0.85,    0, 1, 0.5, 1,

        -0.18, -0.25, -0.88,    1, 0, 0.5, 1,
        0, 0.25, -0.9,          1, 0, 0.5, 1,
        0.18, -0.25, -0.88,     1, 0, 0.5, 1,

        0.29, -0.25, -0.85,     0.5, 1, 0, 1,
        0.45, 0.25, -0.78,      0.5, 1, 0, 1,
        0.6, -0.25, -0.67,      0.5, 1, 0, 1,

        0.67, -0.25, -0.6,      0.5, 0, 1, 1,
        0.78, 0.25, -0.45,      0.5, 0, 1, 1,
        0.85, -0.25, -0.29,     0.5, 0, 1, 1
    ];
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

    let perspectiveMatrix = mat4.create();
    mat4.perspective(perspectiveMatrix, 1, canvas.width / canvas.height, 0.1, 10);

    let perspectiveLoc = gl.getUniformLocation(shaderProgram, "perspectiveMatrix");
    gl.uniformMatrix4fv(perspectiveLoc, false, perspectiveMatrix);

    mat4.translate(matrix, matrix, [0, 0, -2]);
}

draw = () => {
    mat4.rotateX(matrix, matrix, -0.008);
    mat4.rotateY(matrix, matrix, 0.013);
    mat4.rotateZ(matrix, matrix, 0.01);
    let transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
    gl.uniformMatrix4fv(transformMatrix, false, matrix);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    requestAnimationFrame(draw);
}

/**
 * Call functions
 */
initGL();
createShaders();
createVertices();
draw();
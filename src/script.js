let gl,
    vertices,
    shaderProgram;

initGL = () => {
    let canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl");
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
        -0.9, -0.9, 0.0,
         0.0,  0.9, 0.0,
         0.9, -0.9, 0.0,
    ];
    /**
     * create buffer array with vertices coords
     */
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    let coords = gl.getAttribLocation(shaderProgram, "coords");
    // gl.vertexAttrib3f(coords, 0, 0, 0); change single point to poits array
    gl.vertexAttribPointer(coords, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coords);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let pointSize = gl.getAttribLocation(shaderProgram, "pointSize");
    gl.vertexAttrib1f(pointSize, 50);

    let color = gl.getUniformLocation(shaderProgram, "color");
    gl.uniform4f(color, 0, 0, 0, 1);
}

draw = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
};

/**
 * Call functions
 */
initGL();
createShaders();
createVertices();
draw();
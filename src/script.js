let gl,
    vertices,
    shaderProgram;

initGL = () => {
    let canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl");
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 1);
};

createShaders = () => {
    /**
     * Vertex Shader
     * @type {string}. passing data through attrs vars
     */
    let vs = "";
    vs += "attribute vec4 coords;";
    vs += "attribute float pointSize;";
    vs += "void main(void) {";
    vs += " gl_Position = coords;";
    vs += " gl_PointSize = pointSize;";
    vs += "}";
    /**
     * create and compile vertex shader
     */
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vs);
    gl.compileShader(vertexShader);
    /**
     * Fragment Shader
     * @type {string} passing data through attrs vars
     */
    let fs = "";
    fs += "precision mediump float;";
    fs += "uniform vec4 color;";
    fs += "void main(void) {";
    fs += " gl_FragColor = color;";
    fs += "}";
    /**
     * create and compile fragment shader
     */
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fs);
    gl.compileShader(fragmentShader);
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
    gl.uniform4f(color, 0, 1, 0, 1);
}

draw = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 3);
};

/**
 * Call functions
 */
initGL();
createShaders();
createVertices();
draw();
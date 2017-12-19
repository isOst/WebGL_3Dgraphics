let gl,
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
     * @type {string}
     */
    let vs = "";
    vs += "void main(void) {";
    vs += " gl_Position = vec4(0.0, 0.0, 0.0, 1.0);";
    vs += " gl_PointSize = 10.0;";
    vs += "}";
    /**
     * create and compile vertex shader
     */
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vs);
    gl.compileShader(vertexShader);
    /**
     * Fragment Shader
     * @type {string}
     */
    let fs = "";
    fs += "void main(void) {";
    fs += " gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);";
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

draw = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);
};

/**
 * Call functions
 */
initGL();
createShaders();
draw();
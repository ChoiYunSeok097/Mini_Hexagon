var gl;
var theta = 0;
var theta2 = 0.02;
var thetaLoc;
var length =1;
var Player_pos=0;

var points = [];
var colors = [];
var Hexa_num = 0;
var Line_num = 0;
var Player_num = 3;
var size = 0.05;

var speed = 0.01;
var obs_size = 6;

var Live = true;
var level = 0;

var audio = new Audio('bgm1.mp3');

const vertexColor = [
    vec4(0.0, 0.0, 0.0, 1.0),   // black
    vec4(1.0, 0.0, 0.0, 1.0),   // red
    vec4(1.0, 1.0, 0.0, 1.0),   // yellow
    vec4(0.0, 1.0, 0.0, 1.0),   // green
    vec4(0.0, 0.0, 1.0, 1.0),   // blue
    vec4(1.0, 0.0, 1.0, 1.0),   // magenta
    vec4(1.0, 1.0, 1.0, 1.0),   // white
    vec4(0.0, 1.0, 1.0, 1.0)    // cyan
];

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if( !gl ){
        alert("WebGL isn't available!");
    }

    document.addEventListener("keydown", keyDownHandler, false);

    function keyDownHandler(e) {
        if(e.keyCode == 37) {
            if(Player_pos<1)
                Player_pos = 5;
            else
                Player_pos--;
        }
        else if(e.keyCode == 39) {
            if(Player_pos>4)
                Player_pos = 0;
            else
                Player_pos++;         
        }
        Player(size);
        //console.log(points[Hexa_num+Line_num+1]);
    }

    Hexa(size*2);
    Line(size*2);
    Player(size);
    audio.play();

    gl.viewport(0,0, canvas.width, canvas.height);
    gl.clearColor(0.9, 0.9, 0.9, 1.0);  //색변화

    
    for(var i=0; i<obs_size; i+=2)
    {
        makeObs(i);
        colors.push(vertexColor[1]);
        colors.push(vertexColor[1]);
    }

    //GPU에 데이터 로드
    GpuLoad();

    render();
};

//그리기
function render(){

    if(Live){
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //if(!IsStop)
        theta += theta2;
        
        obs();                              //장애물 만들기
        obsController();                    //장애물 움직이기
        colliderCheck()
        requestAnimationFrame(render);      
        GpuLoad();

        //변수 값을 쉐이더에 보내주기
        gl.uniform1f(thetaLoc, theta);
        gl.uniform1f(LengthLoc, length);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, Hexa_num);
        gl.drawArrays(gl.LINES, Hexa_num, Line_num);
        gl.drawArrays(gl.TRIANGLE_STRIP, Hexa_num+Line_num, Player_num);
        gl.drawArrays(gl.LINES, Hexa_num+Line_num+Player_num, obs_size);
        }
}

function GpuLoad()
{
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //GPU에 데이터 로드
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    //변수의 위치를 가져온다
    thetaLoc = gl.getUniformLocation(program, "theta");
    LengthLoc = gl.getUniformLocation(program, "length");
}

function Hexa(x)
{
    //좌표
    var vertices = [
        vec2(   1*x,   0*x),
        vec2( 0.5*x, 0.5*x),
        vec2( 0.5*x,-0.5*x),
        vec2(-0.5*x,-0.5*x),
        vec2( 0.5*x, 0.5*x),
        vec2(-0.5*x, 0.5*x),
        vec2(  -1*x,   0*x),
        vec2(-0.5*x,0.5*x),
        vec2(-0.5*x,-0.5*x)
    ];

    for(var i=0; i<vertices.length; i++)
    {
        points.push(vertices[i]);
        colors.push(vertexColor[4]);
        Hexa_num++;
    }
}

function Line(x)
{
    var vertices = [
        vec2(   1*x,   0*x),
        vec2(   3  ,   0  ),
        vec2( 0.5*x,-0.5*x),
        vec2(   3  ,  -3  ),
        vec2(-0.5*x,-0.5*x),
        vec2(  -3  ,-  3  ),
        vec2(  -1*x,   0*x),
        vec2(  -3  ,   0  ),
        vec2(-0.5*x, 0.5*x),
        vec2(  -3  ,   3  ),
        vec2( 0.5*x, 0.5*x),
        vec2(   3  ,   3  )
    ];

    for(var i=0; i<vertices.length; i++)
    {
        points.push(vertices[i]);
        colors.push(vertexColor[0]);
        Line_num++;
    }
}

function Player(x)
{
    var vertices = [];
    switch(Player_pos)
    {
        case 0 : vertices = [
            vec2( 0*x, 2*x),
            vec2(-0.5*x, 1.5*x),
            vec2( 0.5*x, 1.5*x)
        ];break;
        case 1 : vertices = [
            vec2( 2.9*x, 1.3*x),      
            vec2( 2*x, 1.3*x),
            vec2( 2.5*x, 0.5*x)
        ];break;
        case 2 : vertices = [
            vec2( 3*x, -1.3*x),      
            vec2( 2.7*x, -0.5*x),
            vec2( 2.3*x, -1.5*x)
        ];break;
        case 3 : vertices = [
            vec2( 0*x, -2*x),
            vec2(0.5*x, -1.5*x),
            vec2(-0.5*x, -1.5*x)
        ];break;
        case 4 : vertices = [
            vec2( -2.9*x, -1.3*x),      
            vec2( -2*x, -1.3*x),
            vec2( -2.5*x, -0.5*x)
        ];break;
        case 5 : vertices = [
            vec2( -3*x, 1.3*x),      
            vec2( -2.7*x, 0.5*x),
            vec2( -2.3*x, 1.5*x)
        ];break;
    }
    
    for(var i=0; i<vertices.length; i++)
    {
        points[Hexa_num+Line_num + i] = vertices[i];
        colors.push(vertexColor[3]);
    }
    
}

// x, y값에 접근
function obsController()
{
    for(var i=0; i<obs_size; i++)
    {
        if(points[Hexa_num+Line_num+Player_num+i][0] > 0.0)
            points[Hexa_num+Line_num+Player_num+i][0] -= speed;
        if(points[Hexa_num+Line_num+Player_num+i][1] > 0.0)
            points[Hexa_num+Line_num+Player_num+i][1] -= speed;
        if(points[Hexa_num+Line_num+Player_num+i][0] < 0.0)
            points[Hexa_num+Line_num+Player_num+i][0] += speed;
        if(points[Hexa_num+Line_num+Player_num+i][1] < 0.0)
            points[Hexa_num+Line_num+Player_num+i][1] += speed; 
    }
}

function obs()
{
    for(var i=0; i<obs_size; i++)
    {
        if(points[Hexa_num+Line_num+Player_num+i][0]<0.01 && points[Hexa_num+Line_num+Player_num+i][0] >-0.01)
        {
            makeObs(i);
        }
    }
}

function makeObs(a)
{
    var rand = Math.floor(Math.random() * 6 + 1);
    switch(rand)
    {
        case 1: var x1 = 1; var y1 = 0; var x2 = 1; var y2 = 1; break;
        case 2: var x1 = 1; var y1 = -1; var x2 = 1; var y2 = 0; break;
        case 3: var x1 = -1; var y1 = -1; var x2 = 1; var y2 = -1; break;
        case 4: var x1 = -1; var y1 = -1; var x2 = -1; var y2 =0; break;
        case 5: var x1 = -1; var y1 = 0; var x2 = -1; var y2 = 1; break;
        case 6: var x1 = -1; var y1 = 1; var x2 = 1; var y2 = 1; break;
    }
    points[Hexa_num+Line_num+Player_num+a] = vec2(x1,y1);
    colors[Hexa_num+Line_num+Player_num+a] = vertexColor[1];
    points[Hexa_num+Line_num+Player_num+a+1] = vec2(x2,y2);
    colors[Hexa_num+Line_num+Player_num+a+1] = vertexColor[1];
    level++;
    if(level % 10 == 0)
        levelUp();
}

function levelUp()
{
          
    theta2 = -theta2;
    if(theta2>0) theta2+=0.01;
    
    if(obs_size<10) 
    {
        makeObs(obs_size);
        obs_size+=2;
    }
    
}

function colliderCheck()
{
    var player = points[Hexa_num+Line_num+1];
    for(var i=0; i<obs_size; i+=2)
    {
        var obs1 = points[Hexa_num+Line_num+Player_num+i];
        var obs2 = points[Hexa_num+Line_num+Player_num+i+1];

        if( player[0] >= obs1[0] && player[0] <= obs2[0])
        {
            if(player[1]>(obs1[1]-0.03) && player[1]< (obs1[1]+0.03)){
                Live = false;
                theta2 = 0.01;
                audio.pause();
            }
        }
      
        if( player[1] >= obs1[1] && player[1] <= obs2[1])
        {
            if(player[0]>(obs1[0]-0.03) && player[0]< (obs1[0]+0.03)){
                Live = false;
                audio.pause();
                theta2 = 0.01;
            }
        }
    }
}
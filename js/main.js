/**
 * Created by Evan on 14-2-23.
 */
init(10,"mydiv",1355,600,main);
var loadinglayer,
    backLayer,
    wallLayer;
var bird,centerLayer;
var sound;
var bitmap,slingshotJoin;
var imglist={};
var imgData=[{name:"bird1",path:"./images/bird1.png"},
    {name:"slingshot1",path:"./images/slingshot1.png"},
    {name:"slingshot2",path:"./images/slingshot2.png"},
    {name:"pig01",path:"./images/pig01.png"},
    {name:"pig02",path:"./images/pig02.png"},
    {name:"st01",path:"./images/st01.png"},
    {name:"st02",path:"./images/st02.png"},
    {name:"st11",path:"./images/st11.png"},
    {name:"st12",path:"./images/st12.png"},
    {name:"st21",path:"./images/st21.png"},
    {name:"st22",path:"./images/st22.png"},
    {name:"st31",path:"./images/st31.png"},
    {name:"st32",path:"./images/st32.png"},
    {name:"remove",path:"./images/remove.png"},
    {name:"desk",path:"./images/desk.png"}
];
var startX,startY;
/*var moveX;*/
var isfly=false;

function main(){
    //LGlobal.setDebug(true);
    backLayer=new LSprite();
    addChild(backLayer);
    //加上载入画面
    loadingLayer=new LoadingSample1();
    backLayer.addChild(loadingLayer);
    LLoadManage.load(
        imgData,
        function (progress) {
            loadingLayer.setProgress(progress);
        },
        function(result){
            imglist=result;
            backLayer.removeChild(loadingLayer);
            loadingLayer=null;
            gameInit();
        }
    );
}

function gameInit(event){
    LGlobal.box2d=new LBox2d();
    var back=new LSprite();
    back.alpha=0.1;
    backLayer.addChild(back);
    back.graphics.drawRect(1,"#ffffff",[0,0,2000,600],true,"#ff0000")

    wallLayer=new LSprite();
    wallLayer.x=0;
    wallLayer.y=0;
    backLayer.addChild(wallLayer);

    var shapeArray=[
        [[0,0],[2000,0],[2000,10],[0,10]],
        [[0,0],[10,0],[10,595],[0,595]],
        [[1990,0],[2000,0],[2000,595],[1990,595]],
        [[0,600],[2000,600],[2000,610],[0,610]]
    ];
    wallLayer.addBodyVertices(shapeArray,0,0,0,.5,.4,.5);

    backLayer.graphics.drawRect(1,"#ffffff",[0,595,2000,5],true,"#000000");
    backLayer.graphics.drawRect(1,"#ffffff",[0,0,5,600],true,"#000000");
    backLayer.graphics.drawRect(1,"#ffffff",[1995,0,5,600],true,"#000000");
    backLayer.graphics.drawRect(1,"#ffffff",[0,0,2000,5],true,"#000000");

    bitmap=new LBitmap(new LBitmapData(imglist["slingshot1"]));
    bitmap.x=215;
    bitmap.y=400;
    backLayer.addChild(bitmap);

    bird=new Bird();
    bird.name="bird01";
    backLayer.addChild(bird);
    bitmap=new LBitmap(new LBitmapData(imglist["bird1"]));
    bird.addChild(bitmap);
    backLayer.addChild(bird);

    bitmap=new LBitmap(new LBitmapData(imglist["slingshot2"]));
    bitmap.x=190;
    bitmap.y=400;
    backLayer.addChild(bitmap);

    setStage(["desk"],1400,530,0,10,false);
    setStage(["desk"],1570,530,0,10,false);
    setStage(["st11","st12"],1535,510,0,1,true);
    setStage(["st01","st02"],1505,470,90,1,true);
    setStage(["st01","st02"],1565,470,90,1,true);
    setStage(["st11","st12"],1535,410,0,1,true);
    setStage(["st31","st32"],1417,470,90,1,true);
    setStage(["st31","st32"],1570,470,90,1,true);
    setStage(["st31","st32"],1495,350,0,1,true);
    setStage(["st21","st22"],1555,330,0,1,true);
    setStage(["st31","st32"],1458,250,90,1,true);
    setStage(["st31","st32"],1525,250,90,1,true);
    setStage(["st11","st12"],1535,150,0,1,true);
    setStage(["st21","st22"],1550,130,90,1,true);
    setStage(["st21","st22"],1410,530,90,1,true);
    setStage(["st21","st22"],1700,530,90,1,true);
    var pig = new Pig();
    pig.x = 1550;
    pig.y = 273;
    backLayer.addChild(pig);

    backLayer.x = LGlobal.width - 2000;
    LGlobal.box2d.synchronous();

    LTweenLite.to(backLayer,1,
        {
            x:0,
            delay:2,
            onUpdate:function(){
                LGlobal.box2d.synchronous();
            },
            onComplete:run,
            ease:Sine.easeIn
        }
    );
}

function run(){
    bird.rotate=0;
    bird.x=300;
    bird.y=550;
    bird.yspeed=-5;
    LTweenLite.to(
        bird,1,
        {
            x:200,
            yspeed:4,
            delay:1,
            rotate:-360,
            onUpdate:function(){
                bird.y+=bird.yspeed;
            },
            onComplete:function(){
                start();
            },
            ease:Sine.easeIn
        }
    );
}

function downStart(event){
    if(event.offsetX > bird.x && event.offsetX < bird.x + bird.getWidth() &&
        event.offsetY > bird.y && event.offsetY < bird.y + bird.getHeight()){
        backLayer.removeEventListener(LMouseEvent.MOUSE_DOWN,downStart);
        /*backLayer.addEventListener(LMouseEvent.MOUSE_DOWN,moveStart);*/
        backLayer.addEventListener(LMouseEvent.MOUSE_MOVE,downMove);
        backLayer.addEventListener(LMouseEvent.MOUSE_UP,downOver);
    }
}

function downOver(event){
    backLayer.removeEventListener(LMouseEvent.MOUSE_UP,downOver);
    backLayer.removeEventListener(LMouseEvent.MOUSE_MOVE,downMove);

    var startX2 = bird.x + bird.getWidth()*0.5;
    var startY2 = bird.y + bird.getHeight()*0.5;
    var r = Math.sqrt(Math.pow((startX - startX2),2)+Math.pow((startY - startY2),2));
    var angle = Math.atan2(startY2 - startY,startX2 - startX);

    bird.addBodyCircle(bird.getWidth()*0.5,bird.getHeight()*0.5,bird.getWidth()*0.5,1,1,0.4,0.5);
    var force = 15;
    var vec = new LGlobal.box2d.b2Vec2(-force*r*Math.cos(angle),-force*r*Math.sin(angle));
    bird.box2dBody.ApplyForce(vec, bird.box2dBody.GetWorldCenter());

    sound=new LSound();
    sound.load("sounds/bird 05 flying.mp3");
    sound.play();

    /*循环侦听*/
    backLayer.addEventListener(LEvent.ENTER_FRAME,onframe);
}

function downMove(event){
    var r = Math.sqrt(Math.pow((startX - event.selfX),2)+Math.pow((startY - event.selfY),2));
    if(r > 100)r = 100;
    var angle = Math.atan2(event.selfY - startY,event.selfX - startX);
    bird.x = Math.cos(angle) * r + startX - bird.getWidth()*0.5;
    bird.y = Math.sin(angle) * r + startY - bird.getHeight()*0.5;
}

function start(){
    LGlobal.box2d.setEvent(LEvent.POST_SOLVE,postSolve);
    bird.x = 200;
    bird.y = 400;
    backLayer.addEventListener(LMouseEvent.MOUSE_DOWN,downStart);
    startX = bird.x + bird.getWidth()*0.5;
    startY = bird.y + bird.getHeight()*0.5;
}

function postSolve(contact, impulse){
    /*sound = new LSound();
    sound.load("sounds/wood collision a1.mp3");
    sound.play();*/
    if(contact.GetFixtureA().GetBody().GetUserData().hit)contact.GetFixtureA().GetBody().GetUserData().hit(impulse.normalImpulses[0]);
    if(contact.GetFixtureB().GetBody().GetUserData().hit)contact.GetFixtureB().GetBody().GetUserData().hit(impulse.normalImpulses[0]);
}

function onframe(){
    if(bird){
        //if(isfly==false){
            backLayer.x = LGlobal.width*0.5 - (bird.x + bird.getWidth()*0.5);
        //}
        /*if(bird.x>1400){
            isfly=true;
        }
        if(isfly){
            backLayer.x=backLayer.x+10;
        }*/
        if(backLayer.x > 0){
            backLayer.x=0;
        }else if(backLayer.x < LGlobal.width - 1600){
            backLayer.x = LGlobal.width - 1600;
        }
        LGlobal.box2d.synchronous();
    }
    var child;
    for(var key in backLayer.childList){
        child = backLayer.childList[key];
        if(child.name == null)continue;
        if(child.x < -child.getWidth() || child.x > backLayer.getWidth()){
            backLayer.removeChild(child);
            if(child.name == "bird01"){
                bird = null;
                /*backLayer.addEventListener(LMouseEvent.MOUSE_DOWN,moveStart);
                backLayer.addEventListener(LMouseEvent.MOUSE_MOVE,moveRun);
                backLayer.addEventListener(LMouseEvent.MOUSE_UP,moveEnd);*/
            }
        }else if((child.name == "stage" || child.name == "pig") && child.hp <= 0){
            if(child.name == "pig"){
                var removeObj = new RemoveObject();
                removeObj.x = child.x;
                removeObj.y = child.y;
                backLayer.addChild(removeObj);
            }
            backLayer.removeChild(child);
            sound=new LSound();
            sound.load("sounds/wood destroyed a1.mp3");
            sound.play();
        }else if(child.name == "remove"){
            child.run();
        }
    }
}

/*function moveStart(){
    backLayer.removeEventListener(LMouseEvent.MOUSE_DOWN,moveStart);
    backLayer.addEventListener(LMouseEvent.MOUSE_MOVE,moveRun);
    backLayer.addEventListener(LMouseEvent.MOUSE_UP,moveEnd);
    moveX=backLayer.x;
}
function moveRun(event){
    backLayer.x=moveX+event.selfX;
}
function moveEnd(){
    backLayer.removeEventListener(LMouseEvent.MOUSE_MOVE,moveRun);
    backLayer.removeEventListener(LMouseEvent.MOUSE_UP,moveEnd);
    backLayer.addEventListener(LMouseEvent.MOUSE_DOWN,moveStart);
}*/

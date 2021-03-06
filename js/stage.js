/**
 * Created by Evan on 14-2-24.
 */
function Stage(list,rotate,m,ctrl){
    base(this,LSprite,[]);
    var self = this;
    self.name = "stage";
    self.ctrl = ctrl;
    self.list = list;
    self.bitmap = new LBitmap(new LBitmapData(imglist[self.list[0]]));
    self.hp = 200;
    self.addChild(self.bitmap);
    self.addBodyPolygon(self.bitmap.getWidth(),self.bitmap.getHeight(),1,m,.4,.2);
    if(rotate != 0)self.setRotate(rotate*Math.PI/180);
}
function setStage(list,x,y,rotate,m,ctrl){
    var stageLayer = new Stage(list,rotate,m,ctrl);
    stageLayer.x = x;
    stageLayer.y = y;
    backLayer.addChild(stageLayer);
    return stageLayer;
}
Stage.prototype.hit = function(value){
    var self = this;
    if(!self.ctrl)return;
    if(value < 1)return;
    if(self.hp == 200)self.bitmap.bitmapData = new LBitmapData(imglist[self.list[1]]);
    self.hp -= value;
}
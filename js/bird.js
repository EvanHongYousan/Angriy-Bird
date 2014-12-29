/**
 * Created by Evan on 14-2-23.
 */
function Bird(){
    base(this,LSprite,[]);
    var self=this;
    var bitmap=new LBitmap(new LBitmapData(imglist["bird1"]));
    self.addChild(bitmap);
}

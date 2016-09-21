
function getPixel(imgData, index) {
  var i = index*4, d = imgData.data;
  return [d[i],d[i+1],d[i+2],d[i+3]] // [R,G,B,A]
}
function getPixelXY( imgData, x, y){
  return getPixel(imgData, y*imgData.width+x);
}

export function getTransparencyAtXY( img, image_box, pt){
  const cvs = document.createElement('canvas')
  cvs.width = image_box.width;
  cvs.height = image_box.height;
  const ctx = cvs.getContext("2d");
  ctx.drawImage( img, 0, 0, cvs.width, cvs.height);
  const image_data = ctx.getImageData( 0,0,cvs.width, cvs.height);
  const pd = getPixelXY( image_data, pt.x, pt.y);
  return pd[3];
}

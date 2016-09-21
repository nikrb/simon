
function getPixel(imgData, index) {
  var i = index*4, d = imgData.data;
  return [d[i],d[i+1],d[i+2],d[i+3]] // [R,G,B,A]
}
function getPixelXY( imgData, x, y){
  return getPixel(imgData, y*imgData.width+x);
}

function getXY( e){
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.pageX - rect.left;
  const y = e.pageY - rect.top;
  return { x, y};
}

export function getTransparencyAtXY( e){
  const img = e.currentTarget;
  const pt = getXY( e);
  const cvs = document.createElement('canvas')
  cvs.width = img.width;
  cvs.height = img.height;
  const ctx = cvs.getContext("2d");
  ctx.drawImage( img, 0, 0, cvs.width, cvs.height);
  const image_data = ctx.getImageData( 0,0,cvs.width, cvs.height);
  const pd = getPixelXY( image_data, pt.x, pt.y);
  return pd[3];
}

//Tao hinh nen canvas
let duong = document.getElementById("laiye");
let ctx = duong.getContext("2d");
let imageObj = new Image();
imageObj.onload = function () {
    ctx.drawImage(imageObj, 0, 0, duong.width, duong.height);
}
imageObj.src = "./duong.jpg";
//chen xe vao canvas
let xe = document.getElementById("laiye");
let ctx1 = xe.getContext("2d");
let xeimageObj = new Image();
xeimageObj.onload = function () {
    ctx.drawImage(xeimageObj, 111, 137, 25, 13);
}
xeimageObj.src = "./xemay.png";
//Tao chuyen dong cho xe

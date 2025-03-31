const canvar = document.getElementById("canvar");
const ctx = canvas.getContext("2d");
let buttonStart = document.getElementById("start");
const playImage = new Image();
playImage.src = "xemay1.png";
const enemyImage = new Image();
enemyImage.src = "xexanh.png";
class playerBike {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }

}

// Tao lop car
// Lấy ngữ cảnh vẽ của canvas
const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");
// Lop xe
class Car {
    constructor(x, y, width, height, speed, img) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.img = img; // Hình ảnh của xe
    }

    // Ve xe lên canvas
    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    // Di chuyển xe
    move(direction) {
        switch (direction) {
            case 'left':
                if (this.x - this.speed >= 0) this.x -= this.speed;
                break;
            case 'right':
                if (this.x + this.width + this.speed <= canvas.width) this.x += this.speed;
                break;
        }
    }
}

// Lop tro choi Game
class Game {
    constructor() {
        this.car = null;
        this.greenCars = [];
        this.isRunning = true;
        this.score = 0;
    }

    // Khoi tao tro choi
    init() {
        const carImg = new Image();
        carImg.src = "xemay1.png"; // xe may minh
        carImg.onload = () => {
            this.car = new Car(200, 600, 27, 50, 1, carImg); // Tao xe
            this.startGame();
        };
    }

    // Ve game
    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas mỗi khung hình
        this.car.draw(); // Xe minh`

        // Xe dich
        this.greenCars.forEach(greenCar => greenCar.draw());

        // diem so
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Score: " + this.score, 10, 30);
    }

    // Cap nhat game
    update() {
        this.draw();

    }

    // Bat dau game
    startGame() {
        if (this.isRunning) {
            this.update();
            requestAnimationFrame(() => this.startGame());
        }
    }

    // Dung game
    stopGame() {
        this.isRunning = false;
        alert("Game Over! Final Score: " + this.score);
    }
}

// Khoi tao game
const game = new Game();
game.init();

// Xu li su kien ban phim
document.addEventListener("keydown", (event) => {
    if (!game.isRunning) return;

    switch (event.key) {
        case "ArrowLeft":
            game.car.move('left');
            break;
        case "ArrowRight":
            game.car.move('right');
            break;
    }
});

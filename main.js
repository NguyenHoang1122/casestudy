class Gamelaixe {
    constructor() {
        this.gameContainer = document.getElementById("gameContainer");//Phan tu chua game
        this.startButton = document.getElementById("start");//goi nut start
        this.scoreElement = document.getElementById("score");//goi hien thi diem

        this.score = 0;          // Khoi tao diem ban dau
        this.obstacles = [];     // Khoi tao danh sach vat can
        this.gameSpeed = 3;      // Toc do vat can luc dau
        this.bikeX = 0;           // Toa do ngang cua xe
        this.keys = {};          // Khoi tao trang thai phím bấm
        this.gameRunning = false; // Khoi tao biến kiểm tra trangj thái trò chơi.
        this.initEventListeners(); // Ham lang nghe su kien nut bam va start
    }

    // Khoi tao ham lang nghe su kien
    initEventListeners() {
        document.addEventListener("keydown", (e) => this.keys[e.key] = true);//Nhan phim danh dau phim duoc nhan
        document.addEventListener("keyup", (e) => this.keys[e.key] = false);//Nha phim danh dau phim duoc nhả
        this.startButton.addEventListener("click", () => this.startGame());
    }

    // Bat dau game
    startGame() {
        if (this.gameRunning) return;//Neu game chay thi k lam j ca.
        this.bike = document.getElementById("bike");//Lay phan tu xe may
        this.gameRunning = true;//Danh dau game dang chay.
        this.startButton.style.display = "none";//An start
        this.gameContainer.style.animation = 'roadmove 1s infinite linear';//Kich hoat hieu ung di chuyen
        this.score = 0;//Reset điểm về 0
        this.gameSpeed = 3;
        this.scoreElement.innerText = this.score;//Cap nhat lai giao dien dem se

        // Reset trang thai phim de tranh bi loi
        this.keys = {};

        // Xoa vat can cu neu co
        this.obstacles.forEach(obs => obs.remove());
        this.obstacles = [];

        // Dat xe vao trung tam ngang vầ gan đáy.
        this.bikeX = (this.gameContainer.clientWidth - this.bike.clientWidth) / 2;
        this.bikeY = this.gameContainer.clientHeight - this.bike.clientHeight - 10;
        this.updateBikePosition();
        requestAnimationFrame(() => this.update());//Băt dau` vong lap
    }

    // Cập nhật trạng thái game
    update() {
        if (!this.gameRunning) return; //Neu game ket thuc dung cap nhat
        this.moveBike();//Xuli di chuyen xe
        this.spawnObstacles();//Tao xe dich
        this.moveObstacles();//Di chuyen xe dich
        this.checkCollision();//Check va chạm
        if (this.gameRunning) {
            requestAnimationFrame(() => this.update());//Cap nhat neu van dang chạy
        }
    }

    // Điều khiển xe
    moveBike() {
        const maxX = this.gameContainer.clientWidth - this.bike.clientWidth;
        if (this.keys["ArrowLeft"]) this.bikeX = Math.max(0, this.bikeX - 2);
        if (this.keys["ArrowRight"]) this.bikeX = Math.min(maxX, this.bikeX + 2);
        this.updateBikePosition();
    }

    // Cap nhat vi tri xe
        updateBikePosition() {
            this.bike.style.left = `${this.bikeX}px`;
            this.bike.style.top = `${this.bikeY}px`;
        }

    // Tao xe dich
    spawnObstacles() {
        if (Math.random() < 0.1) { // Xac suat tao xe dich 10%
            let maxAttempts = 7; // Số lần thử tìm vị trí hợp lệ
            let positionValid = false; //Giả định ban đầu vị trí chưa hợp lệ.
            let newLeft; //Luu vi tri toa do ngang của xe dich.

            while (maxAttempts > 0 && !positionValid) {
                newLeft = Math.random() * (this.gameContainer.clientWidth - 35);//Chọn 1 vị trí  ngẫu nhien trên truc ngang
                positionValid = this.checkObstaclePosition(newLeft); // Kiểm tra vị trí co trung vs xe khác không
                maxAttempts--; // giam dan so lan thu?
            }

            if (positionValid) {
                let obs = document.createElement("img"); // Tạo phần tử <img>
                obs.src = "xexanh.png"; // Đặt hình ảnh cho xe địch
                obs.className = "obstacleImage"; // Thêm class để CSS có thể định dạng
                obs.style.left = newLeft + "px"; // Đặt vị trí ngang (left)
                obs.style.top = "0px"; // Đặt vị trí dọc (bắt đầu từ trên cùng)
                this.gameContainer.appendChild(obs); // Thêm vào màn chơi
                this.obstacles.push(obs); // Lưu xe dich vào danh sách để qly
            }
        }
    }
    //Kiem tra khoang cach cua se dich cũ và mới có hợp lệ không.
    checkObstaclePosition(newLeft) {
        let minDistance = 65;//Khoang cach toi thieu giua cac xe
        for (let i = 0; i < this.obstacles.length; i++) {
            let obsLeft = parseFloat(this.obstacles[i].style.left);//chuyen chuoi thanh so
            //Su dung if de so kiem tra khoang cach tu xe dich cu vs xe moi co <65 khong
            if (Math.abs(newLeft - obsLeft) < minDistance) {
                return false;
            }
        }
        return true;
    }

    // Di chuyển xe dich
    moveObstacles() {
        //Duyệt ngược để tránh bị lỗi khi xóa phần tử trong mảng
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            let obs = this.obstacles[i];
            obs.style.top = (parseInt(obs.style.top) + this.gameSpeed) + "px";//di chuyen xe dich chay tu tren xuong duoi

            if (parseInt(obs.style.top) > this.gameContainer.clientHeight) {
                obs.remove();
                this.obstacles.splice(i, 1);//Lon hon chieu cao cua khung game thi xóa
                // +5 điểm khi né được xe dich
                if (this.gameRunning) {
                    this.score += 5;
                    this.scoreElement.innerText = this.score;
                }
                //mỗi lần tăng 100 điểm thì sẽ tăng tốc độ của xe địch
                if(this.score%100===0){
                    this.gameSpeed ++;
                }
            }
        }
    }


    // Kiểm tra va chạm
    checkCollision() {
        let bikeRect = this.bike.getBoundingClientRect(); //getBoundingClientRect là một phương thức của DOM, trả về thông tin về kích thước và vị trí của phần tử trên màn hình.
        let buffer = 10; // Cho phép sai số 10px
        //kiem tra va chạm vs từng xe địch
        for (let obs of this.obstacles) {
            let obsRect = obs.getBoundingClientRect();
            if (
                bikeRect.left < obsRect.right - buffer && //Khog vuot quá ben phải xe địch
                bikeRect.right > obsRect.left + buffer && //Khog vuot quá ben trái xe địch
                bikeRect.top < obsRect.bottom - buffer && //Khong vuot quá phía dưới xe địch
                bikeRect.bottom > obsRect.top + buffer //Khong vuot quá phía trên xe địch
            ) {
                this.endGame();//DÚng thì endgame
                break;
            }
        }
    }

    // Kết thúc trò chơi
    endGame() {
        this.gameRunning = false;//Dung game
        // Hiển thị thông báo game over và điểm số
        alert("Kết thúc! Score: " + this.score);

        // Hiển thị lại nút Start để chơi lại
        this.startButton.innerText = "Chơi lại";
        this.startButton.style.backgroundColor = "red";//Nen do cho nut start
        this.startButton.style.display = "block";//Hien thi len tren giao dien game
        this.gameContainer.style.animation = 'none'; //Dung lai hieu ung di chuyen duong xa
        this.keys = {}; // Reset lại phím khi game kết thúc

        // Xóa chướng ngại vật cũ
        this.obstacles.forEach(obs => obs.remove());//Duyet qua tat cac cac xe dịch va xoa di.
        this.obstacles = [];//Dat thanh mang rong de loai bo nhung xe dich da xoa truoc do.
    }
}
// Khởi tạo trò chơi
const game = new Gamelaixe();
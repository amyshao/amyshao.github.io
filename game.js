var canvas = document.getElementById("myCanvas");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight - 100;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
window.addEventListener("resize", function() {
    // quick dirty way to avoid resizing problems for now
    window.location.href = "index.html";
})

var context = canvas.getContext("2d");

function drawRect(locationx, locationy, width, height, color = "black") {
    context.beginPath();
    context.rect(locationx, locationy, width, height);
    context.fillStyle = color;
    context.fill();
    context.closePath();
}

var player = {
    x: canvas.width/2,
    y: 10,
    width: 40,
    height: 40,
    dx: 10,
    dy: 10,
    move: function () {
        if (rightPressed) {
            if (this.x + this.dx + this.width < canvas.width) {
                this.x += this.dx;
            }
        } else if (leftPressed) {
            if (this.x - this.dx >= 0) {
                this.x -= this.dx;
            }
        } else if (upPressed) {
            if (this.y - this.dy > 0) {
                this.y -= this.dy;
            }
        } else if (downPressed) {
            if (this.y + this.height + this.dy < canvas.height) {
                this.y += this.dy;
            }
        }
    },
    draw: function () {
        if (started) drawRect(this.x, this.y, this.width, this.height);
    },
    restart: function () {
        this.x = canvas.width/2;
        this.y = 10;
    }
};

function startText() {
    if (!started) {
        context.font = "20px Courier New";
        context.fillStyle = "black";
        context.textAlign = "center";
        context.fillText("welcome to my site! || try arrow keys for someting cool", canvas.width/2, 40);
    }
    else {
        context.fillStyle = "rgba(255, 255, 255, 0)";
    }
}


var started = false;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

const aHouseX = canvas.width/2 - 100;
const nHouseX = aHouseX - 250;
const pHouseX = aHouseX + 250;
const houseY = canvas.height - canvas.height/3;
const houseWidth = 200;
const houseHeight = 200;

const messages = ["hi there ", "how you ", "doing "]; 
var created = [[], [], []];
var lastSent = [null, null, null];

const startx = canvas.width;
const level2 = Math.max(50 + (houseY - houseHeight)/2, 220);
const level3 = level2 + 130;
const level1 = Math.max(level2 - 120, 100);
const Ylevels = [level1, level2, level3];

const dotWidth = player.width;
const dotHeight = player.height;
const dashWidth = dotWidth*3;
const dashHeight = dotHeight;

var wobbleCount = 5;

function toMorse(char) {
    char = char.toLowerCase();
    if (char == 'a') return "01";
    if (char == 'b') return "1000";
    if (char == 'c') return "1010";
    if (char == 'd') return "01";
    if (char == 'e') return "0";
    if (char == 'f') return "0010";
    if (char == 'g') return "110";
    if (char == 'h') return "0000";
    if (char == 'i') return "00";
    if (char == 'j') return "0111";
    if (char == 'k') return "101";
    if (char == 'l') return "0100";
    if (char == 'm') return "11";
    if (char == 'n') return "10";
    if (char == 'o') return "111";
    if (char == 'p') return "0110";
    if (char == 'q') return "1101";
    if (char == 'r') return "010";
    if (char == 's') return "000";
    if (char == 't') return "1";
    if (char == 'u') return "001";
    if (char == 'v') return "0001";
    if (char == 'w') return "011";
    if (char == 'x') return "1001";
    if (char == 'y') return "1011";
    if (char == 'z') return "1100";
    if (char == '1') return "01111";
    if (char == '2') return "00111";
    if (char == '3') return "00011";
    if (char == '4') return "00001";
    if (char == '5') return "00000";
    if (char == '6') return "10000";
    if (char == '7') return "11000";
    if (char == '8') return "11100";
    if (char == '9') return "11110";
    if (char == '0') return "11111";
    if (char == ' ') return " ";
    else return null;
}

function createDotOrDash(type, level, count) {
    created[level].push({
        type,
        id: count,
        x: -1000,
        y: Ylevels[level],
        dx: player.dx / (5/(level+1)),
        width: type === "dot" ? dotWidth : dashWidth,
        height: type === "dash" ? dashHeight : dotHeight,
        color: type === "space" ? "rgba(255, 255, 255, 0)" : "black",
        move: function() {
            if (this.x - this.dx + this.width*2 >= 0) {
                this.x -= this.dx;
            }
        },
        start: function() {
            this.x = startx;
        },
        draw: function () {
            drawRect(this.x, this.y, this.width, this.height, this.color);
        },
        isFullyVisible: function () {
            return (this.x + this.width + 40 < canvas.width && this.x > 0);
        },
        isHittingPlayer: function () {
            const give = 0;
            return type === "space" 
            ? false 
            : (((player.x + give >= this.x && player.x + give <= this.x + this.width) || 
                (player.x + player.width >= this.x && player.x + player.width + give <= this.x + this.width)) && 
               ((player.y + give >= this.y && player.y + give <= this.y + this.height) || 
                (player.y - give + player.height >= this.y && player.y + player.height - give <= this.y + this.height)));
        }
    });
}

function mapMorse() {
    var level = 0;
    var count = 0;
    messages.forEach(message => {
        
        [...message].forEach(letter => {
            const code = toMorse(letter);
            if (!code) return;

            [...code].forEach(type => {
                if (type === ' ') {
                    createDotOrDash("dot", level, count);
                } else {
                    createDotOrDash(type === '0' ? "dot" : "dash", level, count);
                }
                count++;
            });
            createDotOrDash("space", level, count++);
        });
        level++;
    });
}

function keyDownHandler(e) {
    if (!started) {
        started = true;
        console.log(started);
    }
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    } else if (e.key == "Up" || e.key == "ArrowUp") {
        upPressed = true;
    } else if (e.key == "Down" || e.key == "ArrowDown") {
        downPressed = true;
    } 
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    } else if (e.key == "Up" || e.key == "ArrowUp") {
        upPressed = false;
    } else if (e.key == "Down" || e.key == "ArrowDown") {
        downPressed = false;
    }
}

function drawHouses() {
    var aboutHouse  = document.getElementById("about-house");
    context.drawImage(aboutHouse, aHouseX, houseY, houseWidth, houseHeight);
    var notesHouse  = document.getElementById("notes-house");
    context.drawImage(notesHouse, nHouseX, houseY, houseWidth, houseHeight);
    var projectsHouse  = document.getElementById("projects-house");
    context.drawImage(projectsHouse, pHouseX, houseY, houseWidth, houseHeight);
}

function checkReachedHouse() {
    if (player.y >= houseY - player.height) {
        if (player.x >= nHouseX && player.x <= nHouseX + houseWidth - player.width) {
            clearInterval();
            window.location.href = "notes.html";
        } else if (player.x >= aHouseX && player.x <= aHouseX + houseWidth - player.width) {
            clearInterval();
            window.location.href = "about.html";
        } else if (player.x >= pHouseX && player.x <= pHouseX + houseWidth - player.width) {
            clearInterval();
            window.location.href = "code.html";
        }
    }
}

function sendNext(level) {
    // put first dot/dash in queue in ready position if ready
    if (!lastSent[level] || lastSent[level].isFullyVisible()) {
        lastSent[level] = created[level].shift();
        lastSent[level].start();
        created[level].push(lastSent[level]);        
    }
}

function draw() {
    wobbleCount--
    if (wobbleCount == 0) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        wobbleCount = 5;
        startText();
    }
    player.draw();
    drawHouses();
    
    player.move();
    checkReachedHouse();
    // draw all dots and dashes
    created.forEach(level => {
        level.forEach(dotOrDash => {
            if (!dotOrDash) return;
            if (dotOrDash.isHittingPlayer()) {
                player.restart();
            }
            dotOrDash.move();
            dotOrDash.draw();
        });
    });

    // send next dotdash if ready
    for (var i = 0; i <= 2; i++) {
        sendNext(i);
    }
    
}

function main() {
    mapMorse();
    setInterval(draw, 30);
}

main();

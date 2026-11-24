const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let player = {
    x: 375,
    y: 380,
    width: 50,
    height: 50,
    speed: 6
};

let fallingObjects = [];
let keys = {};
let score = 0;
let gameOver = false;
let frame = 0;
let objectSpeed = 3;

// Detect keyboard presses
document.addEventListener("keydown", function(event) {
    keys[event.key] = true;

    if (event.key.toLowerCase() === "r" && gameOver) {
        restartGame();
    }
});

// Detect when keys are released
document.addEventListener("keyup", function(event) {
    keys[event.key] = false;
});

// Create a falling object
function createFallingObject() {
    fallingObjects.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        width: 30,
        height: 30,
        speed: objectSpeed
    });
}

// Check if two objects touch
function touching(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// Update the game
function update() {
    if (gameOver) {
        return;
    }

    frame++;

    // Move player
    if (keys["ArrowLeft"] || keys["a"]) {
        player.x -= player.speed;
    }

    if (keys["ArrowRight"] || keys["d"]) {
        player.x += player.speed;
    }

    // Keep player inside the screen
    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    // Create objects
    if (frame % 45 === 0) {
        createFallingObject();
    }

    // Move falling objects
    for (let object of fallingObjects) {
        object.y += object.speed;

        // Check collision
        if (touching(player, object)) {
            gameOver = true;
        }
    }

    // Remove objects that leave the screen
    for (let i = fallingObjects.length - 1; i >= 0; i--) {
        if (fallingObjects[i].y > canvas.height) {
            fallingObjects.splice(i, 1);
            score++;
        }
    }

    // Make the game harder
    if (score > 0 && score % 10 === 0) {
        objectSpeed = 3 + Math.floor(score / 10);
    }
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Player
    ctx.fillStyle = "blue";
    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );

    // Falling objects
    for (let object of fallingObjects) {
        ctx.fillStyle = "red";
        ctx.fillRect(
            object.x,
            object.y,
            object.width,
            object.height
        );
    }

    // Score
    ctx.fillStyle = "black";
    ctx.font = "28px Arial";
    ctx.fillText("Score: " + score, 20, 35);

    ctx.font = "18px Arial";
    ctx.fillText("Move with Arrow Keys or A/D", 520, 30);

    // Game over screen
    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "red";
        ctx.font = "48px Arial";
        ctx.fillText("GAME OVER", 270, 210);

        ctx.fillStyle = "white";
        ctx.font = "26px Arial";
        ctx.fillText("Final Score: " + score, 320, 255);
        ctx.fillText("Press R to restart", 295, 300);
    }
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function restartGame() {
    player.x = 375;
    fallingObjects = [];
    score = 0;
    frame = 0;
    objectSpeed = 3;
    gameOver = false;
}

gameLoop();
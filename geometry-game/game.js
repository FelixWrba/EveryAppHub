const gameCanvas = $('#game-canvas');

let sizeX = window.innerWidth;
let sizeY = window.innerHeight;

gameCanvas.width = sizeX;
gameCanvas.height = sizeY;

const ctx = gameCanvas.getContext('2d');
const fps = 1000 / 60;
const gravity = 0.5;
const groundLevel = 400;

const textureCount = 2;
let loadedTextures = false;

let isPaused = false;
let timePassed = 0;
let isJumping = false;

let physicsId, drawId;

let player = {
    w: 32,
    h: 32,
    x: -100,
    y: groundLevel,
    vx: 5,
    vy: 0,
    grounded: false,
    texture: new Image(),
    rotation: 0,
}

let floor = {
    texture: new Image(),
    w: 512,
    h: 128,
}

let camera = {
    padding: 100,
    x: player.x - 100,
    y: player.y - 100,
}

let spikes = [200, 500, 1000, 1050, 2000, 3000];

player.texture.src = 'assets/cube.png';
player.texture.onload = handleTextureLoad();
floor.texture.src = 'assets/floor.png';
floor.texture.onload = handleTextureLoad();

function handleTextureLoad() {
    loadedTextures++;

    if (loadedTextures >= textureCount) {
        startGame();
    }
}

function process() {
    timePassed += fps;

    // update camera
    camera.x = player.x - camera.padding;
    camera.y = groundLevel - sizeY + camera.padding;

    // update player
    player.x += player.vx;
    player.y += player.vy;

    if (!player.grounded) {
        player.vy += gravity;
    }

    if ((player.y + player.h) >= groundLevel) {
        player.vy = 0;
        player.y = groundLevel - player.h;
        player.grounded = true;
        player.rotation = player.rotation - (player.rotation % 1.5707963267948966)
    }

    if (player.grounded && isJumping) {
        player.vy = -10;
        player.grounded = false;
        player.rotation += 0.1;
    }

    if (player.rotation % 1.5707963267948966 > 0.01) {
        player.rotation = lerp(player.rotation, player.rotation + 1.5707963267948966, 0.025);
    }
}

function draw() {
    ctx.clearRect(0, 0, sizeX, sizeY);

    drawGround();

    ctx.fillStyle = 'red';
    for (const spike of spikes) {
        ctx.fillRect(spike - camera.x, groundLevel - 50 - camera.y, 20, 50);
    }
    drawPlayer();

    drawId = requestAnimationFrame(draw);
}

function drawPlayer() {
    const x = player.x - camera.x;
    const y = player.y - camera.y;
    const cx = player.w * 0.5 + x;
    const cy = player.h * 0.5 + y;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(player.rotation);
    ctx.translate(-cx, -cy);

    ctx.drawImage(player.texture, x, y, player.w, player.h);

    ctx.restore();
}

function drawGround() {
    // ctx.fillStyle = 'lightblue';
    // ctx.fillRect(0, groundLevel - camera.y, sizeX, sizeY);

    const tiles = Math.ceil(sizeX / floor.w) + 1;
    const position = camera.x % floor.w;

    for (let i = 0; i < tiles; i++) {
        ctx.drawImage(floor.texture, i * floor.w - position, groundLevel - camera.y, floor.w, floor.h);
    }
}

function startGame() {
    isPaused = false;
    physicsId = setInterval(() => process(), fps);

    setupInputs();

    draw();
}

function pauseGame() {
    isPaused = true;

    clearInterval(physicsId);
    cancelAnimationFrame(drawId);
}

function unpauseGame() {
    isPaused = false;
    physicsId = setInterval(() => process(), fps);
    draw();
}

function setupInputs() {
    gameCanvas.addEventListener('mousedown', () => isJumping = true);
    gameCanvas.addEventListener('mouseup', () => isJumping = false);
    gameCanvas.addEventListener('touchstart', () => isJumping = true);
    gameCanvas.addEventListener('touchend', () => isJumping = false);

    $('#pause-btn').addEventListener('click', () => {
        if (isPaused) {
            unpauseGame();
        }
        else {
            pauseGame();
        }
    });
}

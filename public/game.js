const socket = io();
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

let players = {};

// Отрисовка игроков
function drawPlayers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let id in players) {
        let p = players[id];
        ctx.fillStyle = id === socket.id ? "blue" : "red";
        ctx.fillRect(p.x, p.y, 20, 20);
    }
}

// Обновление игроков
socket.on("updatePlayers", (serverPlayers) => {
    players = serverPlayers;
    drawPlayers();
});

// Движение (WASD)
document.addEventListener("keydown", (e) => {
    let dx = 0, dy = 0;
    if (e.key === "ArrowUp" || e.key === "w") dy = -5;
    if (e.key === "ArrowDown" || e.key === "s") dy = 5;
    if (e.key === "ArrowLeft" || e.key === "a") dx = -5;
    if (e.key === "ArrowRight" || e.key === "d") dx = 5;
    
    socket.emit("move", { dx, dy });
});

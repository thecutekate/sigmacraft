const express = require('express');
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static("public")); // Раздаёт HTML, CSS, JS

let players = {}; // Храним данные игроков

io.on("connection", (socket) => {
    console.log("Игрок подключился:", socket.id);

    // Добавляем игрока
    players[socket.id] = { x: 100, y: 100 };
    io.emit("updatePlayers", players);

    // Обрабатываем передвижение
    socket.on("move", (data) => {
        if (players[socket.id]) {
            players[socket.id].x += data.dx;
            players[socket.id].y += data.dy;
        }
        io.emit("updatePlayers", players);
    });

    // Удаляем игрока при выходе
    socket.on("disconnect", () => {
        delete players[socket.id];
        io.emit("updatePlayers", players);
    });
});

server.listen(3000, () => {
    console.log("Сервер запущен на порту 3000");
});

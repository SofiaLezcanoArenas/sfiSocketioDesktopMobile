let socket;
let cloudX = 200;
let cloudY = 200;
let isDrawing = false;
let clouds = [];

function setup() {
    createCanvas(400, 400);
    background(220);

    let socketUrl = 'https://ancient-ghost-4jgrwwppvg472j79r-3000.app.github.dev/';
    socket = io(socketUrl);

    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('message', (data) => {
        let parsedData = JSON.parse(data);
        if (parsedData.type === 'touch') {
            cloudX = parsedData.x;
            cloudY = parsedData.y;
        } else if (parsedData.type === 'draw') {
            clouds.push(parsedData);
        }
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });

    socket.on('connect_error', (error) => {
        console.error('Socket.IO error:', error);
    });
}

function draw() {
    background(220);
    drawCloud(cloudX, cloudY); // Dibuja la nube que sigue al dedo

    // Dibujar nubes en el camino
    for (let cloud of clouds) {
        drawCloud(cloud.x, cloud.y, cloud.size);
    }
}

// Función para dibujar una nube
function drawCloud(x, y, size = 20) {
    fill(255);
    noStroke();
    ellipse(x, y, size, size / 2);
    ellipse(x - size / 4, y, size / 1.5, size / 3);
    ellipse(x + size / 4, y, size / 1.5, size / 3);
    ellipse(x - size / 2, y - size / 5, size / 1.5, size / 3);
    ellipse(x + size / 2, y - size / 5, size / 1.5, size / 3);
}

let socket;
let lastTouchX = null; 
let lastTouchY = null; 
const threshold = 5;
let isDrawing = false; // Estado de dibujo
let button; // Botón para alternar modos

function setup() {
    createCanvas(400, 400);
    background(220);

    let socketUrl = 'https://ancient-ghost-4jgrwwppvg472j79r-3000.app.github.dev/';
    socket = io(socketUrl);

    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('message', (data) => {
        console.log(`Received message: ${data}`);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });

    socket.on('connect_error', (error) => {
        console.error('Socket.IO error:', error);
    });

    // Crear botón para alternar entre modos
    button = createButton('Toggle Draw/Move');
    button.position(10, height - 40);
    button.mousePressed(toggleDrawMove);
}

function draw() {
    background(220);
    fill(0, 255, 0);
    textAlign(CENTER, CENTER);
    textSize(32);
    text('Touch to draw or move the cloud', width / 2, height / 2);
}

function toggleDrawMove() {
    isDrawing = !isDrawing; // Cambiar el estado de dibujo
    if (isDrawing) {
        button.html('Move Cloud'); // Cambiar texto del botón
    } else {
        button.html('Draw'); // Cambiar texto del botón
    }
}

function touchMoved() {
    if (socket && socket.connected) { 
        let dx = abs(mouseX - lastTouchX);
        let dy = abs(mouseY - lastTouchY);

        if (dx > threshold || dy > threshold) {
            if (isDrawing) {
                let drawData = {
                    type: 'draw',
                    x: mouseX,
                    y: mouseY,
                    size: 20
                };
                socket.emit('message', JSON.stringify(drawData));
            } else {
                let touchData = {
                    type: 'touch',
                    x: mouseX,
                    y: mouseY
                };
                socket.emit('message', JSON.stringify(touchData));
            }

            // Actualiza la última posición
            lastTouchX = mouseX;
            lastTouchY = mouseY;
        }
    }
    return false;
}

function touchEnded() {
    lastTouchX = null; // Reinicia las coordenadas al soltar el toque
    lastTouchY = null; 
}

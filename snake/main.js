'use strict';
var param = {
        grid : {
            x : 40,
            y : 40
        },
        speed : 100
    },
    snake = [
        { x : 10, y : 10 }, 
        { x :  9, y : 10 },
        { x :  8, y : 10 }
    ],
    food = { x: 15, y: 15 },
    direction = 'Right',
    moving = false,
    moveInterval,
    score = 0,
    highScore = 0;


var canvas = document.getElementById('view'), 
    context;

context = canvas.getContext('2d');
context.font = '15px Arial';
context.fillStyle = 'White';

// window.context = context;
// window.drawRect = drawRect;
// window.direction = direction;

function drawRect (x, y) {
    var cellSize  = canvas.height/param.grid.x;
    context.beginPath();
    context.rect(x*cellSize, y*cellSize, cellSize, cellSize);
    context.fillStyle = 'white';
    context.fill();
}

function randPos () {
    var result = {
        x: Math.floor(Math.random() * param.grid.x),
        y: Math.floor(Math.random() * param.grid.y)
    };

    return result;
}

function clearCanvas () {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function render () {
    clearCanvas();
    context.fillText('Score: ' + score, 10, 20);
    context.fillText('High Score: ' + highScore, 10, 40); 
    drawRect (food.x, food.y);
    for (var i = 0; i < snake.length; i++) {
        drawRect (snake[i].x, snake[i].y);
    }
}

render();

document.onkeydown = handle;

function handle (e) {
    var key = e.keyIdentifier;
    if (moving === false) {
        start();
    }
    if (key === 'Left' && direction !== 'Right') {
        direction = key;    
    }
    if (key === 'Right' && direction !== 'Left') {
        direction = key;    
    }
    if (key === 'Up' && direction !== 'Down') {
        direction = key;    
    }
    if (key === 'Down' && direction !== 'Up') {
        direction = key;    
    }
}

function move () {
    for (var i = snake.length - 1; i >= 0; i--) {
        if (i === 0) {
            switch (direction) {
                case 'Left':
                    snake[i].x -=1;
                break;
                case 'Right':
                    snake[i].x +=1;
                break;
                case 'Up':
                    snake[i].y -=1;
                break;
                case 'Down':
                    snake[i].y +=1;
                break;
            }
        } else {
            snake[i].x = snake[i-1].x;
            snake[i].y = snake[i-1].y;
        }
    }

    if (checkCrossing(snake[0], food)) {
        grow();
        food = randPos();
        score += 1;
    }

    if (checkStepIsValid() === false) {
        gameover();
    }

    render();
}

function checkCrossing (one, two) {
    if (one.x == two.x && one.y == two.y ) {
        return true;
    } else {
        return false;
    }
}

function grow () {
    snake.push({x : -1, y : -1});
}
window.gameover = gameover;

function gameover () {
    clearInterval(moveInterval);
    

    if (score > highScore) {
        highScore = score;
    }
    score = 0;
    moving = false;
    render();
}

function start () {
    snake = [
        { x : 10, y : 10 }, 
        { x :  9, y : 10 },
        { x :  8, y : 10 }
    ];

    moveInterval = setInterval (move, param.speed);
    moving = true;
}

function checkStepIsValid () {
    if (snake[0].x == -1 || 
        snake[0].x == param.grid.x || 
        snake[0].y == -1 || 
        snake[0].y == param.grid.y 
        ) {
        return false;
    }
    if (snake.length > 4) {
        for (var i = 4; i < snake.length; i++) {
            if (checkCrossing(snake[0], snake[i])) {
                return false;
            }
        }
    }
}
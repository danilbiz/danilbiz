'use strict';
var param = {
        grid : {
            x : 20,
            y : 20
        },
        speed : 100,
        cellSize : null
    },
    racket = {
        width : 5,
        position : 10,
        moveLeft : function () {
            if (this.position > 0) {
                this.position = this.position - 1;
            }
        },
        moveRight : function () {
            if (this.position < param.grid.x - this.width) {
                this.position = this.position + 1;
            }
        },
    },
    ball = { 
        x: 20,
        y: 20,
        direction : {
            leftward : true,
            upward : false
        },
        moveInterval : null,
        startMove : function () {
            var self = this;

            if (Math.random() > 0.5){
                this.direction.leftward = true;
            } else {
                this.direction.leftward = false;
            }

            this.moveInterval = setInterval(function(){
                var obstacles = self.getObstacles();
                if (obstacles.out === true) {
                    self.stopMove();
                    self.placeOnRacket();
                    self.direction.leftward = true;
                    self.direction.upward = false;
                    return;
                }

                if (obstacles.h === true) {
                    self.direction.leftward = !self.direction.leftward;
                }
                if (obstacles.v === true) {
                    self.direction.upward = !self.direction.upward;
                }
                self.step();  
            }, 300);
        },
        stopMove : function () {
            clearInterval(this.moveInterval);
            this.moveInterval = null;
        },
        getObstacles: function () {
            var self = this;
            var result = {
                v   : false,
                h   : false,
                out : false
            };

            function fieldBorders () {
                if (self.x === 0 || self.x === param.grid.x - 1) {
                    result.h = true;
                }
                if (self.y === 0) {
                    result.v = true;
                } 
                if (self.y === param.grid.y - 3 && self.x >= racket.position && self.x < racket.position + racket.width) {
                    result.v = true;
                }
                if (self.y > param.grid.y) {
                    result.out = true;
                }
            }

            function checkBricks () {
                var bricksInfo = bricks.setBall(self.x, self.y);

                if (bricksInfo.h === true) {
                    result.h = true;
                }
                
                if (bricksInfo.v === true) {
                    result.v = true;
                }
            }
            
            fieldBorders();
            checkBricks();
            
            return result;
        },
        step : function () {
            if (this.direction.leftward) {
                this.x--;
            } else {
                this.x++;
            }
            if (this.direction.upward) {
                this.y--;
            } else {
                this.y ++;
            }
        },
        placeOnRacket : function () {
            this.y = param.grid.y - 3;
            this.x = racket.position + Math.floor(racket.width / 2);
        } 
    },
    bricks = {
        content : {},
        setBall : function (x, y) {
            var result = {
                h : false,
                v : false
            };

            for (var k in this.content){
                if (this.content[k].x - x >= -1 && 
                    this.content[k].x - x <=  1 &&
                    this.content[k].y - y >= -1 && 
                    this.content[k].y - y <=  1
                ){
                    if (this.content[k].x - x === 1 || this.content[k].x - x === -1){
                        result.h = true;
                    }

                    if (this.content[k].y - y === 1 || this.content[k].y - y === -1){
                        result.v = true;
                    }

                    this.removeBrick(this.content[k].x, this.content[k].y);
                }
            }

            console.log(result);

            return result;
        },
        addBrick : function (x, y) {
            this.content[x + 'x' + y] = {
                x : x,
                y : y
            };
        },
        removeBrick : function (x, y) {
            delete this.content[x + 'x' + y];
        }
    };


var canvas = document.getElementById('view'), 
    context;

context = canvas.getContext('2d');


function setUp () {
    param.cellSize = canvas.width / param.grid.x;
}
setUp();

function render () {
    clearCanvas();
    renderRacket();
    renderBall();
    renderBricks();
    
    function renderRacket () {
        context.beginPath();
        context.rect (racket.position * param.cellSize, (param.grid.y - 2) * param.cellSize, racket.width * param.cellSize, param.cellSize);
        context.fillStyle = 'white';
        context.fill();
    }

    function renderBall () {
        context.beginPath();
        context.rect (ball.x * param.cellSize, ball.y * param.cellSize, param.cellSize, param.cellSize);
        context.fillStyle = 'white';
        context.fill();
    }

    function renderBricks () {
        for (var k in bricks.content) {
            context.beginPath();
            context.rect (bricks.content[k].x * param.cellSize, bricks.content[k].y * param.cellSize, param.cellSize, param.cellSize);
            context.fillStyle = 'white';
            context.fill();
        }
    }

    requestAnimationFrame(render);
}

requestAnimationFrame(render);

ball.placeOnRacket();
ball.startMove();

function clearCanvas () {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

document.onkeydown = handle;

function handle (e) {
    var key = e.keyIdentifier;
    if (ball.moveInterval === null) {
        console.log('isNull');
        ball.startMove();
    }

    if (key === 'Left') {
       racket.moveLeft();   
    }
    if (key === 'Right') {
        racket.moveRight();      
    }
}

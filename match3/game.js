'use strict';
var renderer,
    game,
    config,
    resources = {
        hemeTextures : [],
    },
    Heme;

config = {
    gridSize : 5,
    maxColors : 5,
    minLineLenght : 2,
    hemeSkins : [
        'images/heme_idle_purple.png',
        'images/heme_idle_green.png',
        'images/heme_idle_blue.png',
        'images/heme_idle_orange.png',
        'images/heme_idle_yellow.png',
        'images/heme_idle_violet.png',
        'images/heme_idle_grey.png',
    ]
};

//Объект, отображающий текущее состояние игры. т.н. модель ----------------------ы
game = {
    scene : new PIXI.Container(),
    field : {
        content : [],
        fill : function () {
            for (var i = 0; i < this.content.length; i++) {
                for (var j = 0; j < this.content[i].length; j++) {
                    this.content[i][j] = new Heme(randomColor(), i, j);

                    do {
                        this.content[i][j].changeColor(randomColor());
                    } while (this.checkNeighbors(i, j).summary === true);

                }
            } 
            
        },
        checkNeighbors : function(x, y){
            var result = {
                    h : [],
                    v : [],
                    summary : false
                },
                self = this;

            checkV(x, y);
            checkH(x, y);

            function checkV (x, y) {
                if (isAlreadyInResult(x, y).v){
                    return;
                }

                result.v.push({x : x, y : y});

                if (y > 0 && 
                    self.content[x][y - 1] !== false && 
                    self.content[x][y - 1].colorId === self.content[x][y].colorId
                ){
                    checkV(x, y - 1);
                }

                if (y < config.gridSize - 1 && 
                    self.content[x][y + 1] !== false && 
                    self.content[x][y + 1].colorId === self.content[x][y].colorId
                ){
                    checkV(x, y + 1);
                }
            }

            function checkH (x, y) {
                if (isAlreadyInResult(x, y).h){
                    return;
                }

                result.h.push({x : x, y : y});

                if (x > 0 && 
                    self.content[x - 1][y] !== false && 
                    self.content[x - 1][y].colorId === self.content[x][y].colorId
                ){
                    checkH(x - 1, y);
                }

                if (x < config.gridSize - 1 && 
                    self.content[x + 1][y] !== false && 
                    self.content[x + 1][y].colorId === self.content[x][y].colorId
                ){
                    checkH(x + 1, y);
                }
            }

            function isAlreadyInResult(x, y){
                var report = {
                    v : false,
                    h : false
                };

                for (var k = 0; k < result.h.length; k++){
                    if (result.h[k].x === x && result.h[k].y === y){
                       report.h = true;
                    }
                }
                for (k = 0; k < result.v.length; k++){
                    if (result.v[k].x === x && result.v[k].y === y){
                       report.v = true;
                    }
                }

                return report;
            }

            if (result.v.length < config.minLineLenght){
                result.v = false;
            }

            if (result.h.length < config.minLineLenght){
                result.h = false;
            }

            if (result.v !== false || result.h !== false){
                result.summary = true;
            }

            console.log(result);

            return result;

        }
    }
};
//-------------------------------------------------------------------------------



//Создание и настройка ренедерера -----------------------------------------------
renderer = PIXI.autoDetectRenderer(800,800);
renderer.backgroundColor = 0x150919;
document.body.appendChild(renderer.view);
//-------------------------------------------------------------------------------



//Отрисовочная петля Render-loop ------------------------------------------------
function render(){
    renderer.render(game.scene);
    requestAnimationFrame(render);
}

requestAnimationFrame(render);
//--------------------------------------------------------------------------------



//Функция, возвращающая случайное число от нуля до максимального количества цветов
function randomColor(){
    return Math.floor(Math.random() * (config.maxColors + 1));
}
//--------------------------------------------------------------------------------



//Функция конструктор одной гемы -------------------------------------------------
Heme = function(colorId, x, y){
    var self = this;

    this.colorId = colorId;
    this.sprite = new PIXI.Sprite(resources.hemeTextures[colorId]);
    this.sprite.width = config.cellSize;
    this.sprite.height = config.cellSize;

    this.x = x;
    this.y = y;

    this.sprite.interactive = true;
    this.sprite.buttonMode = true;

    this.sprite.anchor.set(0.5, 0.5);

    this.sprite.click = function(e){
        var neibs = game.field.checkNeighbors(self.x, self.y);
        console.log(self.x, self.y);
        for (var k = 0; k < neibs.v.length; k++){
            game.field.content[neibs.v[k].x][neibs.v[k].y].sprite.alpha = 0.5;
        }

        for (k = 0; k < neibs.h.length; k++){
            game.field.content[neibs.h[k].x][neibs.h[k].y].sprite.alpha = 0.5;
        }


        //for (var k = 0; k < neibs.length; k++){
        //    game.field.content[neibs[k].x][neibs[k].y].sprite.alpha = 0;
        //}
    };

    this.setPosAtField(x, y); 
    game.scene.addChild(this.sprite);

};

Heme.prototype = {
    setPosAtField : function (x, y) {
        this.sprite.x = x * config.cellSize + config.cellSize/2;
        this.sprite.y = y * config.cellSize + config.cellSize/2;
    },
    changeColor : function(colorId){
        this.sprite.texture = resources.hemeTextures[colorId];
        this.colorId = colorId;
    }
};
//--------------------------------------------------------------------------------

//Подготовка ---------------------------------------------------------------------
function setup () {
    config.cellSize = renderer.width / config.gridSize;
    for (var i=0; i < config.hemeSkins.length; i++) {
        resources.hemeTextures.push(PIXI.Texture.fromImage(config.hemeSkins[i]));
    }

    for (var k=0; k < config.gridSize; k++) {
        game.field.content.push([]);

        for (var j=0; j < config.gridSize; j++){
            game.field.content[k].push(false);
        }

    }
}

setup();
//--------------------------------------------------------------------------------
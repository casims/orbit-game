'use strict';

let game = {
    title: 'Orbit',
    isRunning: false,
    playerName: '',
    difficulty: null,
    // timeMin: $("#mins"),
    // timeSec: $("#secs"),
    // timeTenths: $("#tenths"),
    loopDuration: null,
    // realTime: 0,
    intervalID: null,
    score: 0,
    playerAngle: 0,
    scrnStart: $('#scrnStart'),
    scrnScores: $('#scrnScores'),
    scrnControls: $('#scrnControls'),
    scrnDiffSelect: $('#scrnDiffSelect'),
    scrnGetName: $('#scrnGetName'),
    scrnGame: $('#scrnGame'),
    scrnEnd: $('#scrnEnd'),
    scrn: $('.screen'),
    // Hides all screens except for Start, adds functionality to buttons/controls.
    setup: function() {
        game.scrn.hide();
        game.scrnStart.show();
        window.addEventListener('keypress', (event) => {
            if(event.code === 'KeyD') {
            //   console.log('ArrowRight was pressed!');
              game.movePlayerRight();
            }
        });
        window.addEventListener('keypress', (event) => {
            if(event.code === 'KeyA') {
            //   console.log('ArrowLeft was pressed!');
              game.movePlayerLeft();
            }
        });    
        $('#startBtnStart').click(function(){
            game.changeScrn(game.scrnDiffSelect);
        })
        $('#startBtnScores').click(function(){
            game.changeScrn(game.scrnScores);
        })
        $('#startBtnControls').click(function(){
            game.changeScrn(game.scrnControls);
        })
        $('.btnBack').click(function(){
            game.changeScrn(game.scrnStart);
        })
        $('#selectBtnEasy').click(function(){
            game.changeScrn(game.scrnGetName);
            game.difficulty = 'Easy';
            game.loopDuration = 4000;
        })
        $('#selectBtnNormal').click(function(){
            game.changeScrn(game.scrnGetName);
            game.difficulty = 'Normal';
            game.loopDuration = 1200;
        })
        $('#selectBtnHard').click(function(){
            game.changeScrn(game.scrnGetName);
            game.difficulty = 'Hard';
            game.loopDuration = 1000;
        })
        $('#getnameBtnConfirm').click(function(){
            game.changeScrn(game.scrnGame);
            game.getPlayerName();
            game.startGame(game.difficulty);
        })
        $('#endBtnRetry').click(function(){
            game.changeScrn(game.scrnGame);
            game.startGame();
        })
        $('#endBtnScores').click(function(){
            game.changeScrn(game.scrnScores);
        })
        $('#endBtnReset').click(function(){
            game.changeScrn(game.scrnStart);
            game.difficulty = null;
        })
    // Hides all screens then shows the screen given through the argument from the clicked button
    },
    changeScrn: function(scrnName) {
        game.scrn.hide();
        scrnName.show();
    },
    // Grabs the player's name from the input, if input is empty then it is set to "Anonymous"
    getPlayerName: function() {
        game.playerName = $('#inputName').val();
        if ($('#inputName').val().trim() == '') {
            game.playerName = 'Anonymous';
        }
    },
    // Starts the game, sets "isRunning" to true, also resets the player's angle and score to 0, then draws the player
    startGame: function() {
        // game.resetTimer();
        game.isRunning = true;
        game.startLoop();
        game.playerAngle = 0;
        game.score = 0;
        $('#scoreCounter').html(game.score);
        game.drawPlayer();
    },
    // Interval function, picks a random angle for the incomming lines, then constructs them. Sends different values down to the constructor depending on difficulty chosen
    tickTock: function() {
        let anglePicker = Math.floor(Math.random() * 4);
        let chosenAngle = null;
        if (anglePicker === 0) {
            chosenAngle = 0;
        } else if (anglePicker === 1) {
            chosenAngle = 90;
        } else if (anglePicker === 2) {
            chosenAngle = 180;
        } else if (anglePicker === 3) {
            chosenAngle = 270;
        };
        //constructor(classes = "", angle = null, speed = null, scaleRate = null)
        if (game.difficulty === 'Easy') {
            let lineEasy = new line('easy', chosenAngle, 200, .03);
            lineEasy.drawLine();
            lineEasy.lineMovementLoop();
        } else if (game.difficulty === 'Normal') {
            let lineNormal = new line('normal', chosenAngle, 60, .03);
            lineNormal.drawLine();
            lineNormal.lineMovementLoop();    
        } else if (game.difficulty === 'Hard') {
            let lineHard = new line('hard', chosenAngle, 40, .03);
            lineHard.drawLine();
            lineHard.lineMovementLoop();    
        }
        // game.realTime = game.realTime + 100;
        // game.updateTimer();
    },
    // Starts the Interval
    startLoop: function() {
        game.intervalID = setInterval(game.tickTock, game.loopDuration);
    },
    // updateTimer: function() {
    //     let displayMin = Math.floor((game.realTime % (1000 * 60 * 60)) / (1000 * 60));
    //     let displaySec = Math.floor((game.realTime % (1000 * 60)) / 1000);
    //     let displayTenths = Math.floor((game.realTime % 1000) / 100);
    //     game.timeMin.html(displayMin.toLocaleString('en-US', {minimumIntegerDigits: 2}));
    //     game.timeSec.html(displaySec.toLocaleString('en-US', {minimumIntegerDigits: 2}));
    //     game.timeTenths.html(displayTenths);
    // },
    // Stops the Interval
    stopLoop: function() {
        clearInterval(game.intervalID);
    },
    // resetTimer: function() {
    //     game.realTime = 0;
    //     game.timeMin.html("00");
    //     game.timeSec.html("00");
    //     game.timeTenths.html("0");
    // },
    // Draws the player by inserting some HTML into the DOM
    drawPlayer: function() {
        $('#gameCanvas').html('<div id="playerObject"><div id="playerObjectBall"></div><div id="playerObjectCore"></div></div>');
    },
    // Moves player right, also resets angle so it doesn't go upwards of 360 which would break the hit detection
    movePlayerRight: function() {
        game.playerAngle = game.playerAngle + 15;
        $('#playerObject').css(`transform`, `rotate(${game.playerAngle}deg)`);
        if (game.playerAngle === 360) {
            game.playerAngle = 0;
        }
    }, 
    // Moves player left, also resets angle so it doesn't go into negatives, which would also break the hit detection
    movePlayerLeft: function() {
        game.playerAngle = game.playerAngle - 15;
        $('#playerObject').css(`transform`, `rotate(${game.playerAngle}deg)`);
        if (game.playerAngle === -15) {
            game.playerAngle = 345;
        }
    },
    // Wipes the game area by clearing the HTML
    clearCanvas: function() {
        $('#gameCanvas').html('');
    },
    // Ends the game, sets "isRunning" to false, also stops Interval and calls the "submitScore" function after 3 seconds
    endGame: function() {
        game.isRunning = false;
        game.stopLoop();
        game.submitScore();
        setTimeout(function() {
            game.changeScrn(game.scrnEnd);
            game.clearCanvas();
        }, 3000);
    },
    // Sends the player's info to the highscores page
    submitScore: function() {
        // $('#scoreboard').append(`<li>${game.playerName} - ${game.score} - ${$('#mins').text()}:${$('#secs').text()}:${$('#tenths').text()} - ${game.difficulty}</li>`);
        $('#scoreboard').append(`<li>${game.score} - ${game.difficulty} - ${game.playerName}`);
    },
};

// Line class, arguments will vary depending on the difficulty (How fast the lines move towards the player, etc.)
class line {
    scale = 1;
    constructor(classes = "", angle = null, speed = null, scaleRate = null) {
    this.classes = classes;
    this.angle = angle;
    this.speed = speed;
    this.scaleRate = scaleRate;
    // The function that inserts a new line into the DOM
    }
    drawLine() {
        const htmlToInsert = `<div class="line ${this.classes}"></div>`;
        $('#gameCanvas').append(htmlToInsert);
        this.dom = $('.line').last();
    };
    // Hit detection, "safe zone" will vary depending on the angle (or the open spot in the line)
    hitDetection() {
        // Hit detection if line's angle is at 0
        if (this.angle === 0) {
            if (this.scale > 0.1 && this.scale < 0.2) {
                if (game.playerAngle <= 315 && game.playerAngle >= 45) {
                    game.endGame();
                }
            }
        }
        if (this.angle === 90) {
            if (this.scale > 0.1 && this.scale < 0.2) {
                if (game.playerAngle <= 45 || game.playerAngle >= 135) {
                    game.endGame();
                }
            }
        }
        if (this.angle === 180) {
            if (this.scale > 0.1 && this.scale < 0.2) {
                if (game.playerAngle <= 135 || game.playerAngle >= 225) {
                    game.endGame();
                }
            }
        }
        if (this.angle === 270) {
            if (this.scale > 0.1 && this.scale < 0.2) {
                if (game.playerAngle <= 225 || game.playerAngle >= 315) {
                    game.endGame();
                }
            }
        }
    }
    // The function that will continuously move/shrink the line towards the player and call the "hitDetection" function, if it doesn't hit the player it is removed from the DOM and points are added to the player's score
    lineMovementLoop() {
        let that = this; // I cant believe this works
        this.scale = this.scale - this.scaleRate;
        this.dom.css({transform: `scale(${this.scale}) rotate(${this.angle}deg)`});
        this.hitDetection();
        if (this.scale >= .05 && game.isRunning === true) {
             setTimeout(function() {
                that.lineMovementLoop();
            }, that.speed);
        } else if (this.scale < .05 && game.isRunning === true) {
            this.dom.remove();
            game.score = game.score + 10;
            $('#scoreCounter').html(game.score);
        }
    };
}

// scale(0.1) is when the line is small enough to where it shouldnt be hit anymore
// scale(.05) is when the line is fully behind the center circle

$(() => {
    game.setup();
});
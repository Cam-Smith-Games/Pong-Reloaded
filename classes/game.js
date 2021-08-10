
var game = {

    // load -> start -> loop loop loop loop

    load: function () {
        let soundFiles = ["explode", "loss", "miss"];
        this.sounds = {};



        let soundCount = 0;
        let game = this;
        let onAudioLoad = function () {
            this.removeEventListener("canplaythrough", onAudioLoad, false);

   
            if (++soundCount >= soundFiles.length) {
                // because chrome is retarded, they require the user to interact with the document before palying a sound...
                // therefore we make player click button to start game

                let $btn = $("<button id='btnStart'>START GAME</button>").on("click", () => {
                    $btn.remove();
                    game.start();
                }).appendTo("#container");
            }
        };

        soundFiles.forEach(s => {
            let audio = new Audio("sound/" + s + ".ogg");
            this.sounds[s] = audio;
            audio.addEventListener("canplaythrough", onAudioLoad, false);
        });
    },

    start: function () {
        this.player = new GameObject.Rect(canvas.width / 2, canvas.height / 2, 25, 100, "red");


        this.circles = [];


        this.$canvas = $("#canvas");
        this.canvas = this.$canvas.get(0);
        this.ctx = canvas.getContext("2d");


        this.prevMousePos = { x: 0, y: 0 };
        this.mousePos = { x: 0, y: 0 };

        // when mouse moves -> store mouse position for next loop
        this.canvas.addEventListener("mousemove", evt => {
            let rect = this.canvas.getBoundingClientRect();
            this.mousePos.x = (evt.clientX - rect.left) * (this.canvas.height / this.$canvas.height());
            this.mousePos.y = (evt.clientY - rect.top) * (this.canvas.width / this.$canvas.width());
        }, false);

        this.score = 0;
        this.health = 10;
        $("#health").html(this.health);

        this.loopCounter = 0;
        this.fps = 60;
        this.lastFrame = new Date();
        this.play();

        // adding circles at random interval
        setInterval(() => {
            let isBlue = Math.random() >= 0.5;
            let isMovingRight = Math.random() >= 0.5;

            this.circles.push(new Circle(
                isMovingRight ? 100 : canvas.width - 100,
                Math.random() * canvas.height,
                25, 25,
                isBlue ? "blue" : "red",
                { x: isMovingRight ? 0.25 : -0.25, y: 0 }
            ));
        }, 500);
    },

    pause() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },

    play() {
        this.pause();
        this.interval = setInterval(() => this.loop(), 1000 / this.fps)
    },


    drawBackground: function () {
        this.ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        this.ctx.fillRect(0, 0, this.canvas.width / 2, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
        this.ctx.fillRect(this.canvas.width / 2, 0, this.canvas.width / 2, this.canvas.height);

        this.ctx.beginPath();
        this.ctx.setLineDash([5, 15]);
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this.ctx.moveTo(canvas.width / 2 - 1, 0);
        this.ctx.lineTo(canvas.width / 2 - 1, canvas.height);
        this.ctx.closePath();
        this.ctx.stroke();
    },

    addScore() {
        // victory sound
        this.score++;
        $("#score").html(this.score);
    },

    subtractHealth() {
        this.sounds.miss.play();
        this.health--;
        $("#health").html(this.health);

        if (this.health <= 0) {
            game.pause();
            this.sounds.loss.play();

            $("#container").append("<div id='lossPopup'>You fucking suck!</div>");
        }
    },

    loop: function () {
        let now = new Date();
        let deltaT = now - this.lastFrame;
        this.lastFrame = now;
       
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();

        //let mouseMove = {
        //    x: this.mousePos.x - this.prevMousePos.x,
        //    y: this.mousePos.y - this.prevMousePos.y
        //};

        this.player.moveWithinBounds({
            x: canvas.width / 2,
            y: this.mousePos.y
        }, this.canvas);

        this.prevMousePos.x = this.mousePos.x;
        this.prevMousePos.y = this.mousePos.y;

        this.player.draw(this.ctx);

        for (var i = this.circles.length - 1; i > -1; i--) {
            let circle = this.circles[i];

            let isColliding = GameObject.IsRectCollidingWithCircle(this.player, circle, true);
            if (isColliding) {
                this.sounds.explode.play();
                this.circles.splice(i, 1);
            }


            // TODO: check color here
            // right enters right half 
            if (circle.velocity.x > 0 && circle.x > canvas.width / 2) {
                this.circles.splice(i, 1);    

                if (circle.color == "blue") {
                    this.addScore();
                } else {
                    this.subtractHealth();
                }
            }
            // moving left and on left half -> subtract score            
            else if (circle.velocity.x < 0 && circle.x < canvas.width / 2) {
                this.circles.splice(i, 1);

                if (circle.color == "red") {
                    this.addScore();
                } else {
                    this.subtractHealth();
                }
            }


            // bounce -> flip velocity
            if (circle.x <= circle.width / 2 ||
                circle.y <= circle.height / 2 ||
                circle.x >= canvas.width - circle.width / 2 ||
                circle.y >= canvas.height - circle.height / 2 ||
                isColliding) {
                circle.velocity.x *= -1;
                circle.velocity.y *= -1;
            }

            circle.move(deltaT, this.canvas);

            circle.draw(this.ctx);
        }

        // get mouse position
        // compare to preivous mouse position
        // move platform by delta y (ignoring delta X because it's centered in screen)

        // move balls
        // collision -> bounce
        // reaches other side -> subtract from score

        // score <= 0 -> end game, print score, save to database (prompting username, remember previous username from cookie)

        // onleave -> remember entered username (if provided)
    }
}
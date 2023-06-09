var canvas = document.getElementById('canvas');
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
var ctx = canvas.getContext('2d');
var count = canvas.height;
var bubbles = [];
var bubbleCount = 20;
var bubbleSpeed = 1;
var popLines = 6;
var popDistance = 60;
var mouseOffset = {
    x: 0,
    y: 0
}
var clumsyFingerOffset = 1.5 //extra space around bubble where still popped


// --------------
// Animation Loop
// --------------

function animate() {



    // ------------
    // Clear Canvas
    // ------------

    ctx.clearRect(0, 0, canvas.width, canvas.height);



    // ------------
    // Draw Bubbles
    // ------------

    ctx.beginPath();
    for (var i = 0; i < bubbles.length; i++) {
        // first num = distance between waves
        // second num = wave height
        // third num = move the center of the wave away from the edge
        bubbles[i].position.x = Math.sin(bubbles[i].count / bubbles[i].distanceBetweenWaves) * 50 + bubbles[i].xOff;
        bubbles[i].position.y = bubbles[i].count;
        bubbles[i].render();

        if (bubbles[i].count < 0 - bubbles[i].radius) {
            bubbles[i].count = canvas.height + bubbles[i].yOff;
        } else {
            bubbles[i].count -= bubbleSpeed;
        }
    }

    // ---------------
    // On Bubble Hover
    // ---------------

    for (var i = 0; i < bubbles.length; i++) {
        if (mouseOffset.x > bubbles[i].position.x - bubbles[i].radius*clumsyFingerOffset && mouseOffset.x < bubbles[i].position.x + bubbles[i].radius*clumsyFingerOffset) {
            if (mouseOffset.y > bubbles[i].position.y - bubbles[i].radius*clumsyFingerOffset && mouseOffset.y < bubbles[i].position.y + bubbles[i].radius*clumsyFingerOffset) {
                for (var a = 0; a < bubbles[i].lines.length; a++) {
                    popDistance = bubbles[i].radius * 0.5;
                    bubbles[i].lines[a].popping = true;
                    bubbles[i].popping = true;
                }
            }
        }
    }

    window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);



// ------------------
// Bubble Constructor
// ------------------

var createBubble = function () {
    this.position = { x: 0, y: 0 };
    this.radius = 10 + Math.random() * 8;
    this.xOff = Math.random() * canvas.width - this.radius;
    this.yOff = Math.random() * canvas.height;
    this.distanceBetweenWaves = 50 + Math.random() * 40;
    this.count = canvas.height + this.yOff;
    this.color = '#a6d7eb';
    this.lines = [];
    this.popping = false;
    this.maxRotation = 85;
    this.rotation = Math.floor(Math.random() * (this.maxRotation - (this.maxRotation * -1))) + (this.maxRotation * -1);
    this.rotationDirection = 'forward';

    // Populate Lines
    for (var i = 0; i < popLines; i++) {
        var tempLine = new createLine();
        tempLine.bubble = this;
        tempLine.index = i;

        this.lines.push(tempLine);
    }

    this.resetPosition = function () {
        this.position = { x: 0, y: 0 };
        this.radius = 8 + Math.random() * 6;
        this.xOff = Math.random() * canvas.width - this.radius;
        this.yOff = Math.random() * canvas.height;
        this.distanceBetweenWaves = 50 + Math.random() * 40;
        this.count = canvas.height + this.yOff;
        this.popping = false;
    }

    // Render the circles
    this.render = function () {
        if (this.rotationDirection === 'forward') {
            if (this.rotation < this.maxRotation) {
                this.rotation++;
            } else {
                this.rotationDirection = 'backward';
            }
        } else {
            if (this.rotation > this.maxRotation * -1) {
                this.rotation--;
            } else {
                this.rotationDirection = 'forward';
            }
        }

        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation * Math.PI / 180);

        if (!this.popping) {
            ctx.beginPath();
            ctx.strokeStyle = '#a6d7eb';
            ctx.lineWidth = 2;
            ctx.arc(0, 0, this.radius - 3, 0, Math.PI * 1.5, true);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
            ctx.stroke();
        }

        ctx.restore();

        // Draw the lines
        for (var a = 0; a < this.lines.length; a++) {
            if (this.lines[a].popping) {
                if (this.lines[a].lineLength < popDistance && !this.lines[a].inversePop) {
                    this.lines[a].popDistance += 0.10;
                } else {
                    if (this.lines[a].popDistance >= 0) {
                        this.lines[a].inversePop = true;
                        this.lines[a].popDistanceReturn += 1;
                        this.lines[a].popDistance -= 0.03;
                    } else {
                        this.lines[a].resetValues();
                        this.resetPosition();
                    }
                }

                this.lines[a].updateValues();
                this.lines[a].render();
            }
        }
    }
}



// ----------------
// Populate Bubbles
// ----------------

for (var i = 0; i < bubbleCount; i++) {
    var tempBubble = new createBubble();

    bubbles.push(tempBubble);
}



// ----------------
// Line Constructor
// ----------------

function createLine() {
    this.lineLength = 0;
    this.popDistance = 0;
    this.popDistanceReturn = 0;
    this.inversePop = false; // When the lines reach full length they need to shrink into the end position
    this.popping = false;

    this.resetValues = function () {
        this.lineLength = 0;
        this.popDistance = 0;
        this.popDistanceReturn = 0;
        this.inversePop = false;
        this.popping = false;

        this.updateValues();
    }

    this.updateValues = function () {
        this.x = this.bubble.position.x + (this.bubble.radius + this.popDistanceReturn) * Math.cos(2 * Math.PI * this.index / this.bubble.lines.length);
        this.y = this.bubble.position.y + (this.bubble.radius + this.popDistanceReturn) * Math.sin(2 * Math.PI * this.index / this.bubble.lines.length);
        this.lineLength = this.bubble.radius * this.popDistance;
        this.endX = this.lineLength;
        this.endY = this.lineLength;
    }

    this.render = function () {
        this.updateValues();

        ctx.beginPath();
        ctx.strokeStyle = '#E5F3FD';
        ctx.lineWidth = 2;
        ctx.moveTo(this.x, this.y);
        if (this.x < this.bubble.position.x) {
            this.endX = this.lineLength * -1;
        }
        if (this.y < this.bubble.position.y) {
            this.endY = this.lineLength * -1;
        }
        if (this.y === this.bubble.position.y) {
            this.endY = 0;
        }
        if (this.x === this.bubble.position.x) {
            this.endX = 0;
        }
        ctx.lineTo(this.x + this.endX, this.y + this.endY);
        ctx.stroke();
    };
}



// ---------------
// Event Listeners
// ---------------

canvas.addEventListener('mousemove', mouseMove);

canvas.addEventListener('mouseclick', mouseClick);

function mouseMove(e) {
    e.preventDefault();
    mouseOffset.x = e.offsetX;
    mouseOffset.y = e.offsetY;
}

function mouseClick(e) {
    mouseOffset.x = e.offsetX;
    mouseOffset.y = e.offsetY;
}


window.addEventListener('resize', function () {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
});



class GameObject {

    constructor(x, y, width, height, color, shape) {
        this.x = x - width / 2;
        this.y = y - height / 2;
        this.width = width;
        this.height = height;
        this.shape = shape;

        // TODO: new ColoredGameObject class that extends base GameObject
        // this is because some GameObjects will take images instead, and color is pointless

        this.color = color;
    }

    moveWithinBounds(pos, canvas) {
        this.y = Math.max(this.height / 2, Math.min(canvas.height - this.height / 2, pos.y));
        this.x = Math.max(0, Math.min(canvas.width - this.width / 2, pos.x));
    }




    static IsRectCollidingWithCircle(rect, circle) {
        // Step#1: Find the orizontal/vertical distances between the circle’s center and the rectangle’s center
        var distX = Math.abs(circle.x - rect.x);
        var distY = Math.abs(circle.y - rect.y);

        // Step#2: If the distance is greater than halfCircle + halfRect, then they are too far apart to be colliding
        if (distX > (rect.width / 2 + circle.width / 2)) { return false; }
        if (distY > (rect.height / 2 + circle.width / 2)) { return false; }

        // Step#3: If the distance is less than halfRect then they are definitely colliding
        if (distX <= (rect.width / 2)) { return true; }
        if (distY <= (rect.height / 2)) { return true; }

        // Step#4: Test for collision at rect corner.
        var dx = distX - rect.width / 2;
        var dy = distY - rect.height / 2;
        return (dx * dx + dy * dy <= (circle.width/2 * circle.width/2));
    }

    draw(ctx) {


        let prevFill = ctx.fillStyle;
        //let prevStroke = ctx.strokeStyle;
        ctx.fillStyle = this.color;
        if (this.shape == GameObject.Shapes.RECT) {
            // offset by half width/height so coordinate is at center of player
            ctx.fillRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
        }
        else if (this.shape == GameObject.Shapes.CIRCLE) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        }



        ctx.fillStyle = "cyan";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();


        ctx.fillStyle = prevFill;

    }
}



GameObject.Shapes = {
    RECT: 0,
    CIRCLE: 1
};

class Circle extends GameObject {
    constructor(x, y, width, height, color, velocity) {
        super(x, y, width, height, color, GameObject.Shapes.CIRCLE);

        this.velocity = velocity; //{ x: 0, y: 0 };
    }

    move(deltaT, canvas) {
        let pos = {
            x: this.x + this.velocity.x * deltaT,
            y: this.y + this.velocity.y * deltaT
        };

        this.moveWithinBounds(pos, canvas);
    }
}

GameObject.Rect = function (x, y, width, height, color) {
    return new GameObject(x, y, width, height, color, GameObject.Shapes.RECT);
}
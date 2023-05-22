var nup = 0;

function Bird() {
    this.y = height/2;
    this.x = 70;
    this.size = 24;

    this.gravity = 1;
    this.lift = 10;
    this.velocity = 0;
    this.gravity_y = 0.9;

    this.score = 0;
    this.dead = false;

    var img = loadImage('bird_1.png')
    nup++;
    console.log(nup);
    this.show = function(){
        fill(255);
        ellipse(this.x, this.y, this.size, this.size);
        image(img, this.x-(3*this.size)/4, this.y-this.size/2);

    }

    this.update = function() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        this.velocity *= this.gravity_y;


        if(this.y > height){
            this.y = height;
            this.velocity = 0;
        }
        if(this.y < 0){
            this.y = 0;
            this.velocity = 0;
        }
    }
    
    this.up = function() {
        this.velocity -= this.lift;
        if (this.velocity < -20) {
            this.velocity = -20;
        }
    }

    this.die = function(){
        this.speed = 0;
        //this.y = height*2;
        this.dead = true;

        var label = "Your score is: "+this.score;

        fill(100, 100, 100);
        textSize(32);
        text(label, width/2-100, height/2);
        //reset();
    }

    this.increaseScore = function() {
        this.score++;
    }

    this.showScore = function() {
        var sc = ""+this.score;
        fill(255);
        textSize(32);
        text(sc, 0,0);
    }
}
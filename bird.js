function Bird() {
    this.y = height/2;
    this.x = 70;
    this.size = 25;

    this.gravity = 1;
    this.lift = 20;
    this.velocity = 0;

    this.score = 0;

    var img = loadImage('bird_1.png')

    this.show = function(){
        /*fill(255);
        ellipse(this.x, this.y, this.size, this.size);*/
        image(img, this.x, this.y);

    }

    this.update = function() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        this.velocity *= 0.9;


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
    }

    this.die = function(){
        this.speed = 0;
        this.y = height*2;

        var label = "Your score is: "+this.score;

        fill(100, 100, 100);
        textSize(32);
        text(label, width/2-100, height/2);
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
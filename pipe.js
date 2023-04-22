function Pipe() {

    this.spacing = 100;
    this.centery = random(this.spacing, height-this.spacing);
    this.top = this.centery - this.spacing/2;
    this.bottom = height - this.top - this.spacing;
    this.x = width;
    this.w = 40;
    this.speed = 3;
    this.count = false;

    this.hits = function(bird) {
        /*if(bird.y < this.top || bird.y > height-this.bottom){
            if(bird.x > this.x && bird.x < this.x+this.w){
                return true;
            }
        }*/
        //console.log(bird.y)
        //console.log(this.top, this.bottom)
        if (bird.x > this.x && bird.x < this.x + this.w) {
            if (bird.y - bird.size/2 < this.top) {
                /*console.log("TOP")
                console.log(bird.y - bird.size/2);
                console.log(this.top)*/
                return true;
            }
            if (bird.y + bird.size/2 > height - this.bottom) {
                /*console.log("BOTTOM")
                console.log(bird.y + bird.size/2)
                console.log(height-this.bottom)*/
                return true
            }
        }
        if ((bird.y < this.top && bird.x+bird.size/2 > this.x && bird.x + bird.size/2 < this.x) || (bird.y > height - this.bottom && bird.x + bird.size/2 > this.x && bird.x + bird.size/2 < this.x + this.w)) {
            return true
        }
        if ((Math.pow((this.x - bird.x), 2) + Math.pow((this.top - bird.y), 2) < Math.pow(bird.size/2, 2)) || (Math.pow((this.x - bird.x), 2) + Math.pow((height-this.bottom - bird.y), 2) < Math.pow(bird.size/2, 2))) {
            return true;
        }
        return false;
    }

    this.show = function() {
        fill(0,200,200);
        rect(this.x, 0, this.w, this.top);
        rect(this.x, height-this.bottom, this.w, this.bottom);
    }

    this.update = function() {
        this.x -= this.speed;
    }

    this.offscreen = function() {
        return (this.x < - this.w);
    }

}
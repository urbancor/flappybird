function Pipe() {

    this.spacing = 80;
    this.centery = random(this.spacing, height-this.spacing);
    this.top = this.centery - this.spacing/2;
    this.bottom = height - this.top - this.spacing;
    this.x = width;
    this.w = 40;
    this.speed = 3;
    this.count = false;

    this.hits = function(bird) {
        if(bird.y < this.top || bird.y > height-this.bottom){
            if(bird.x > this.x && bird.x < this.x+this.w){
                return true;
            }
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
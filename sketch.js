var bird;
var pipes = [];
var pressed = false;

function setup() {
  var img = loadImage('./bird_1.png')
  createCanvas(400, 600);
  bird = new Bird();
  pipes.push(new Pipe());
}

function draw() {
  
  background(0);

  bird.update();
  for(var i = pipes.length-1; i >= 0; i--){
    pipes[i].show();
    pipes[i].update();
    if(pipes[i].offscreen()){
      pipes.splice(i,1);
    }

    if(pipes[i].x+pipes[i].w < bird.x-bird.size){
      if(!pipes[i].count){
        bird.increaseScore();
        pipes[i].count = true;
      }
    }

    if(pipes[i].hits(bird) || bird.y == height) {
      bird.die();
      noLoop();
    }

  }

  
  bird.show();
  showScore(bird);

  /*if(frameCount % 100 == 0){
    pipes.push(new Pipe());
  }*/
  if (pipes[pipes.length-1].x < width/2) {
    pipes.push(new Pipe());
  }
}

function keyPressed() {
  if(key == ' ') {
    bird.up();
  }
  if (key == 'r') {
    if (bird.dead == false) return;
    background(0);
    bird = new Bird();
    pipes = [];
    pipes.push(new Pipe());
    loop();
  }
}

function touchStarted() {
  if(!pressed){
    bird.up();
    pressed = true;
  }
}
function touchEnded() {
  pressed = false;
}

function mousePressed() {
  bird.up();
}

function showScore(bird) {
  var label = "Score: "+bird.score;
  fill(0,255,0);
  textSize(32);
  text(label, 25,25);
}
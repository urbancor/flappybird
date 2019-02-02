var bird;
var pipes = [];

function setup() {
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

  if(frameCount % 100 == 0){
    pipes.push(new Pipe());
  }
}

function keyPressed() {
  if(key == ' ') {
    bird.up();
  }
}

function touchStarted() {
  bird.up();
  return false;
}

/*
function mousePressed() {
  bird.up();
}
*/
function showScore(bird) {
  var label = "Score: "+bird.score;
  fill(0,255,0);
  textSize(32);
  text(label, 25,25);
}
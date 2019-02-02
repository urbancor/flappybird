var bird;
var pipes = [];

function setup() {
  createCanvas(400, 600);
  bird = new Bird();
  pipes.push(new Pipe());
}

function draw() {
  
  background(0);
/*
  for(var i = pipes.lenght-1; i >= 0; i--){
    window.alert("NEKI");
    pipes[i].show();
    window.alert("NEKI");
    pipes[i].update();

    //if(pipes[i].hits(bird)){
     // console.log("HIT");
    //}

    if(pipes[i].x < 0) {
      pipes.splice(i,1);
    }
  }
  window.alert("NEKI");*/
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
      //window.alert("HIT");
      bird.die();
      noLoop();
    }

  }

  
  bird.show();
  showScore(bird);

  if(frameCount % 100 == 0){
    pipes.push(new Pipe());
  }

  

/*
  if(frameCount % 30 == 0){
    pipes.push(new Pipe);
  }
*/
}

function keyPressed() {
  if(key == ' ') {
    bird.up();
    //console.log("SPACE");
  }
}

function showScore(bird) {
  var label = "Score: "+bird.score;
  fill(0,255,0);
  textSize(32);
  text(label, 25,25);
}
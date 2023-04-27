var bird;
var agent;
var pipes = [];
var pressed = false;


function setup() {
  var img = loadImage('./bird_1.png')
  createCanvas(600, 600);
  bird = new Bird();
  pipes.push(new Pipe());
  agent = new Agent();
  agent.init();
}

function reset() {
  background(0);
  bird = new Bird();
  pipes = [];
  pipes.push(new Pipe());
  loop();
}

function draw() {
  
  background(0);
  if (!bird.dead) {
    let current_state = getState();
    let action = agent.determineAction(current_state);
    if (action == FLAP) {
      bird.up();
    }
    let new_state = getState();
    let reward = getReward();
    agent.updateQValue(current_state, action, reward, new_state);
  } 
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
      setTimeout(reset, 200);
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
  console.log(key)
  if(key == ' ') {
    bird.up();
  }
  if (key == 'ArrowUp') {
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

var getState = function() {
  // x distance to the upcoming pipe
  // if the bird is past the pipe, then the distance is the distance to the next pipe
  // if the bird is before the pipe, then the distance is the distance to the current pipe
  if(pipes[0].x < bird.x){
    if(pipes.length > 1){
      var x_distance = pipes[1].x - bird.x;
    } else {
      var x_distance = pipes[0].x - bird.x;
    }
  } else {
    var x_distance = pipes[0].x - bird.x;
  }

  //let x_distance = pipes[0].x - bird.x;

  //The y distance to the upcoming bottom pipe
  let y_distance = height-pipes[0].bottom - bird.y;

  //current velocity
  let vel = bird.velocity;

  //distance between bottom and the top pipe
  let pipe_distance = height-pipes[0].bottom - pipes[0].top;

  /*const no_of_bins = 10;

  const min_x_distance = 0;
  const max_x_distance = width;

  //same for y distance
  const min_y_distance = 0;
  const max_y_distance = height;

  //same for velocity
  const min_vel = -30;
  const max_vel = 30;

  //same for pipe distance
  const min_pipe_distance = 80;
  const max_pipe_distance = 100;

  // Discretized state space
  let x_distance_bin = Math.floor((x_distance - min_x_distance) / (max_x_distance - min_x_distance) * no_of_bins);
  let y_distance_bin = Math.floor((y_distance - min_y_distance) / (max_y_distance - min_y_distance) * no_of_bins);
  let vel_bin = Math.floor((vel - min_vel) / (max_vel - min_vel) * no_of_bins);
  let pipe_distance_bin = Math.floor((pipe_distance - min_pipe_distance) / (max_pipe_distance - min_pipe_distance) * no_of_bins);

  return [x_distance_bin, y_distance_bin, vel_bin, pipe_distance_bin];*/
  return [x_distance, y_distance, vel, pipe_distance];
}

var getReward = function() {
  if (bird.dead) {
    return -1000;
  }
  return 15;
}
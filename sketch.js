var bird;
var agent;
var pipes = [];
var pressed = false;
var tries = 20;
var max_score = 0;
var cum_reward = 0;
var scores = [];
var avg_scores = [];
var FLAP = 1;
var NO_FLAP = 0;

var high_scores = [];

function setup() {
  var img = loadImage('./bird_1.png')
  var myCanvas = createCanvas(600, 600);
  myCanvas.parent('game');
  frameRate(120);

  bird = new Bird();
  pipes.push(new Pipe());
  agent = new Agent();
  agent.init(false);
}

function reset() {
  background(0);
  bird = new Bird();
  pipes = [];
  pipes.push(new Pipe());
  tries += 1;
  //download_q_table();
  loop();
}

function draw() {
  if (agent.q_table == null) {
    return;
  }
  background(0);
  //if (!bird.dead) {
    let current_state = getState();
    let action = agent.determineAction(current_state);
    if (action == FLAP) {
      bird.up();
    }
    let new_state = getState();
    let reward = getReward();
    if (reward == -1000) {
      //console.log("dead");
    }
    //console.log(reward);
    //if the bird position is in between the pipes only in y direction then the penalty is +0.1 otherwise the penalty is the negative value difference in y coordinates
    let penalty = 0;
    if(bird.y == 0) {
      penalty = -1000;
    }
    /*if (bird.y > pipes[0].top && bird.y < height-pipes[0].bottom) {
      //console.log("in between");
      penalty = 1;
    } else if(bird.y == 0) {
      penalty = -1000;
    } else {
      penalty = -Math.abs(bird.y - (pipes[0].top + pipes[0].bottom)/2);
    }*/
    //penalty = (-(new_state[0] + new_state[1]))*0.1;
    //agent.updateQValue(current_state, action, reward, new_state);
    agent.addToHistory(current_state, action, new_state, penalty);
  //} 
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
        agent.updateQTable(false, bird.score);
        //agent.updateLearningRate();
        //agent.updateEpsilon();
        cum_reward += 200;
        pipes[i].count = true;
      }
    }

    if(pipes[i].hits(bird) || bird.y == height/* || bird.y == 0*/) {

      //bird.die();
      let current_state = getState();
      let action = agent.determineAction(current_state);
      if (action == FLAP) {
        bird.up();
      }
      let new_state = getState();
      let reward = getReward();
      if (reward == -1000) {
        //console.log("dead");
      }
      //console.log(reward);
      //agent.updateQValue(current_state, action, reward, new_state);
      agent.updateQTable(true, bird.score);
      cum_reward = 0;
      //noLoop();
      //new_max_score = max(max_score, bird.score);
      if (bird.score > max_score) {
        max_score = bird.score;
        agent.updateLearningRate();
      }
      tries += 1;
      scores.push(bird.score);

      high_scores.push(max_score);
      var interval = 1;

      if (tries % interval == 0) {
        var temp = 0;
        for (var i = scores.length-1; i >= scores.length - (interval - 1); i--) {
          temp += scores[i];
        }
        avg_scores.push(temp/interval);
        agent.updateEpsilon();
        showChart();
      }
      if (tries % 5 == 0) {
        //agent.updateQTable(true, bird.score);
      }
      bird = new Bird();
      pipes = [];
      pipes.push(new Pipe());
      break;
      //setTimeout(reset, 200);
    }
  }

  
  bird.show();
  showScore(bird);
  showTries();
  showMaxScore();
  showLearningRate(agent.learning_rate);

  /*if(frameCount % 100 == 0){
    pipes.push(new Pipe());
  }*/
  if (pipes[pipes.length-1].x < width/2) {
    pipes.push(new Pipe());
  }
}

function keyPressed() {
  //console.log(key)
  if(key == ' ') {
    bird.up();
  }
  if (key == 'ArrowUp') {
    bird.up();
  }
  if (key == 'r') {
    if (bird.dead == false) return;
    reset();
  }
  if (key == 'd') {
    download_q_table();
  }
  if (key == 's') {
    noLoop();
  }
  if (key == 'p') {
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

function showTries() {
  var label = "Tries: "+tries;
  fill(0,255,0);
  textSize(32);
  text(label, 25,50);
}

function showMaxScore() {
  var label = "Max score: "+max_score;
  fill(0,255,0);
  textSize(32);
  text(label, 25,75);
}

function showLearningRate(rate) {
  var label = "Learning rate: "+rate;
  fill(0,255,0);
  textSize(32);
  text(label, 25,100);
}

// chart data from scores to ctx chart
function showChart() {
  var ctx = document.getElementById("myChart").getContext('2d');
  // if scores length more than 50, remove last element

  if (scores.length > 100) {
    scores.shift();
  }
  var chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: scores,
      datasets: [{
        label: 'scores',
        borderColor: 'red',
        backgroundColor: 'white',
        data: scores,
      },{
        label: 'Highest Score',
        borderColor: 'blue',
        backgroundColor: 'white',
        data: high_scores,
      }]
    },
    options: {}
  });
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
  /*let pipe_distance = height-pipes[0].bottom - pipes[0].top;*/

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
  return [x_distance, y_distance, vel/*, pipe_distance*/];
}

var getReward = function() {
  if (bird.dead) {
    return -2000;
  }
  //let reward = 0;
  /*if (bird.y > pipes[0].top && bird.y < height-pipes[0].bottom) {
    cum_reward += 10;
  } else {
    //cum_reward -= 0.01;
  }
  //cum_reward += bird.score*50;
  console.log(cum_reward);
  return cum_reward;*/
  return bird.score * 20;
}

function download_q_table() {
  const json = JSON.stringify(agent.q_table);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'q_table.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
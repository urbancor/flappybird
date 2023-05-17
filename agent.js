var FLAP = 1;
var NO_FLAP = 0;

const num_bins = [25, 50, 15];
const min_values = [0, -600, -50];
const max_values = [600, 600, 30];
const num_actions = 2;

function load_q_table_from_file(file) {
    return new Promise((resolve, reject) => {
        console.log("test2")
        let reader = new FileReader();
        try {
            console.log("test3");
            let text = reader.readAsText(file);
            console.log(text);
            resolve(JSON.parse(text));
        } catch (e) {
            reject(e);
        }
    });
}

function Agent() {
    this.q_table = {};
    this.actions = [FLAP, NO_FLAP];
    this.learning_rate = 0.9;
    this.discount_factor = 0.9;
    this.epsilon = 0.1;

    this.defaultAction = FLAP;
    this.no_of_updates = 0;

    this.history = [];
    

    // Initialize Agent
    this.init = function (existing_q_table) {
        console.log(existing_q_table)
        if (existing_q_table) {
            this.q_table = qt;
        } else {
            console.log("Initializing agent")
            // Initialize the Q-table with zeros
            for (let i = 0; i < Math.pow(num_bins[0], num_bins.length); i++) {
                this.q_table[i] = new Array(num_actions).fill(0);
            }
        }
        //console.log(this.q_table)
    }

    function get_state_index(state) {
        //console.log(state)
        let index = 0;
        for (let i = 0; i < state.length; i++) {
            if ((state[i] - min_values[i]) < 0) {
                console.log("State out of bounds: " + state[i] + " < " + min_values[i] + " in dimension " + i);
            }
            let bin = Math.floor(((state[i] - min_values[i]) / (max_values[i] - min_values[i])) * num_bins[i]);
            //console.log("bin: " + bin);
            index += bin * Math.pow(num_bins[i], i);
        }
        //console.log(index)
        return index;
    }
    // Update the Q-value for a given state-action pair
    this.updateQValue = function (state, action, reward, next_state) {
        let current_state_index = get_state_index(state);
        let current_q_value = this.q_table[current_state_index][action];
        let max_next_q_value = Math.max(...this.q_table[get_state_index(next_state)]);
        let new_q_value = current_q_value + this.learning_rate * (reward + this.discount_factor * max_next_q_value - current_q_value);
        this.q_table[current_state_index][action] = new_q_value;
        this.no_of_updates++;
        //console.log(this.no_of_updates);
    }

    this.determineAction = function (state) {
        // Determine the next action - epsilon greedy strategy
        if (Math.random() < this.epsilon) {
            // Random action
            //console.log("Random")
            var action = Math.round(Math.random());
        } else {
            // Greedy action
            //console.log("Not random")
            var action = this.greedyAction(state);
        }
        return action;
    }

    this.greedyAction = function (state) {
        //console.log(state)
        //console.log(this.q_table)
        let state_index = get_state_index(state);
        //console.log(state_index)
        let action = this.q_table[state_index].indexOf(Math.max(...this.q_table[state_index]));
        return action;
    }

    this.addToHistory = function (state, action, next_state, penalty) {
        //console.log("Adding to history")
        this.history.push([state, action, next_state, penalty]);
    }

    this.updateQTable = function (dead, score) {
        t = 0;
        console.log("history length: " + this.history.length)
        for (let i = this.history.length-1; i >= 0;i--) {
            t += 1;
            let currReward = 0;
            let penalty = this.history[i][3];
            //console.log("Penalty: " + penalty);
            if (dead) {
                currReward = -1000 + penalty;
                dead = false;
            } else if (t <= 2) {
                currReward = -1000 + penalty;
            } else {
                currReward = score*15 + penalty;
            }
            console.log("currReward: " + currReward);
            this.updateQValue(this.history[i][0], this.history[i][1], currReward, this.history[i][2]);
        }
        this.history = [];
    }

    this.updateEpsilon = function () {
        if (this.epsilon > 0.05) this.epsilon -= 0.025;
    }

    this.updateLearningRate = function () {
        if (this.learning_rate > 0.4) this.learning_rate -= 0.025;
    }
}


var FLAP = 1;
var NO_FLAP = 0;

const num_bins = [10, 10, 10, 10];
const min_values = [0, -600, -50, 80];
const max_values = [600, 600, 30, 100];
const num_actions = 2;

function Agent() {
    this.q_table = {};
    this.alpha;
    this.actions = [FLAP, NO_FLAP];
    this.learning_rate = 0.5;
    this.discount_factor = 0.99;
    this.epsilon = 0.1;

    this.defaultAction = FLAP;
    

    // Initialize Agent
    this.init = function () {
        console.log("Initializing agent")
        // Initialize the Q-table with zeros
        for (let i = 0; i < Math.pow(num_bins[0], num_bins.length); i++) {
            this.q_table[i] = new Array(num_actions).fill(0);
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
            let bin = Math.floor((state[i] - min_values[i]) / ((max_values[i] - min_values[i]) * num_bins[i]));
            index += bin * Math.pow(num_bins[i], i);
        }
        return index;
    }
    // Update the Q-value for a given state-action pair
    this.updateQValue = function (state, action, reward, next_state) {
        let current_state_index = get_state_index(state);
        let current_q_value = this.q_table[current_state_index][action];
        let max_next_q_value = Math.max(...this.q_table[get_state_index(next_state)]);
        let new_q_value = current_q_value + this.learning_rate * (reward + this.discount_factor * max_next_q_value - current_q_value);
        this.q_table[current_state_index][action] = new_q_value;
    }

    this.determineAction = function (state) {
        // Determine the next action - epsilon greedy strategy
        if (Math.random() < this.epsilon) {
            // Random action
            var action = Math.floor(Math.random() * this.actions.length);
        } else {
            // Greedy action
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
}
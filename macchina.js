var CONFIG = {
    HEAD_LOW_LIMIT: -1000,
    HEAD_HIGH_LIMIT: 1000,
    STEP_LIMIT: 100000,
    BLANK_SYMBOL: "_",
    ANY_SYMBOL: "*",
    ACCEPT_SYMBOL: "ACCEPT",
    REJECT_SYMBOL: "REJECT"
}


function check(condition, message) {
    if (!condition) {
        throw (message || "ERROR");
    }
}


function Macchina() {
    this.initialState = null;
    this.states = {};
    this.execution = null;
}

Macchina.prototype = {
    state: function(name, ...rules) {
        check(typeof name === "string", "State names must be strings!");
        check(!(name in this.states), "State '" + name + "' already defined!");

        this.states[name] = rules;

        if (this.initialState == null) {
            this.setInitialState(name);
        }
    },

    setInitialState: function(name) {
        check(typeof name === "string", "State names must be strings!");
        check((name in this.states), "State '" + name + "' does not exist!");

        this.initialState = name;
    },

    run: function(input) {
        this.execution = new Execution(this);
        this.execution.setInput(input);
        this.execution.run();
        return this.execution.state;
    }
}

var tm = new Macchina();

tm.state(
    "even",
    { when: "*", action: "moveRight" }
)

console.log(tm);

console.log(tm.run("10001"));



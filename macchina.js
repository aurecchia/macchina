
function check(condition, checker, culprit, message) {
    if (!condition) {
        var name = checker.constructor.name;
        throw "error in '" + name + "': " + message + " Got <" + culprit + ">";
    }
}


function Machine() {
    if (arguments.callee._singleton)
        return arguments.callee._singleton;

    arguments.callee._singleton = this;

    this.initialState = null;
    this.states = {};
    this.execution = null;

}

Machine.prototype.addState = function (state) {
    check(state instanceof State, this, state, "Not a state object!");

    this.states[state.name] = state;

    if (this.initialState == null)
        this.initialState = state;
}

Machine.prototype.state = function (name) {
    check(typeof name === "string", this, name, "State names must be strings!");
    check(name in this.states, this, name, "State not in this machine!");

    return this.states[name];
}

Machine.prototype.setInitialState = function (state) {
    check(state instanceof State, this, state, "Not a state object!");

    this.initialState = state;
}

Machine.prototype.run = function (input) {
    this.execution = new Execution(this);
    this.execution.setInput(input);
    this.execution.run();
    return this.execution.state;
}

Machine.prototype.toString = function () {
    var keys = Object.keys(this.states);
    var strings = [];

    for (var i = 0; i < keys.length; i++) {
        strings.push(this.states[keys[i]].toString());
    }

    return strings.join("\n\n");
}


function State(name) {
    this.name = name;
    this.actions = {}
}

State.prototype.toString = function () {
    var keys = Object.keys(this.actions);
    var strings = [];

    for (var i = 0; i < keys.length; i++) {
        var action = this.actions[keys[i]];
        var repr = ["on '", keys[i], "'  ->  ", action.toString()].join("");
        strings.push(repr);
    }

    return "State <" + this.name + ">\n\t" + strings.join("\n\t");
}

State.prototype.on = function(read) {
    check(typeof read === "string", this, read, "Not a string!");
    check(read.length === 1, this, read, "Length larger than 1!");

    this.actions[read] = new Action;
    return this.actions[read];
}

State.prototype.got = function(read) {
    var action = this.actions[read];

    if (action === undefined)
        return this.actions[CONFIG.ANY_SYMBOL];

    return action;
}

var tm = new Machine();


//tm.addState(new State("even"));

//tm.state("even").on("1").right().goto("odd");
//tm.state("even").on("*").right();
//tm.state("even").on("_").accept();


//tm.addState(new State("odd"));

//tm.state("odd").on("*").right().goto("even");
//tm.state("odd").on("0").right();
//tm.state("odd").on("_").reject();

tm.addState(new State("state"));

tm.state("state").on("0").write("1").right();
tm.state("state").on("1").write("0").right();
tm.state("state").on("*").stop();

console.log(tm.toString());

console.log(tm.run("10011101010010101101"));



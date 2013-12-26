
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
    this.EXECUTIONS = {
        STOPPED: 0,
        RUNNING: 1,
        ACCEPTED: 2,
        REJECTED: 3,
        LOOPING: 4
    }
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

Machine.prototype.step = function () {

}

Machine.prototype.toString = function () {
    var keys = Object.keys(this.states);
    var strings = [];

    for (var i = 0; i < keys.length; i++) {
        strings.push(this.states[keys[i]].toString());
    }

    return strings.join("\n\n");
}


function Action() {
    this.symbol = null;
    this.direction = null;
    this.state = null;
}

Action.prototype.write = function (symbol) {
    check(typeof symbol === "string", this, symbol, "Not a string!");
    check(symbol.length === 1, this, symbol, "Longer than 1!");

    this.symbol = symbol;
    return this;
}

Action.prototype.move = function (direction) {
    // Add checks for direction

    this.direction = direction;
    return this;
}

Action.prototype.goto = function (state) {
    // Add checks for state

    this.state = state;
    return this;
}

Action.prototype.accept = function () {
    this.state = "ACCEPT";
    return this;
}

Action.prototype.reject = function () {
    this.state = "REJECT";
    return this;
}

Action.prototype.toString = function () {
    var repr = [];
    if (this.symbol != null)
        repr.push("write '" + this.symbol + "'");

    if (this.direction != null)
        repr.push("move " + this.direction);

    if (this.state != null) {
        if (this.state != "ACCEPT" && this.state != "REJECT")
            repr.push("GOTO " + this.state);
        else
            repr.push(this.state);
    }

    return repr.join(", ");
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


var tm = new Machine();


tm.addState(new State("even"));

tm.state("even").on("1").move("right").goto("odd");
tm.state("even").on("0").move("left");
tm.state("even").on("_").accept();


tm.addState(new State("odd"));

tm.state("odd").on("1").move("right").goto("even");
tm.state("odd").on("0").move("right");
tm.state("odd").on("_").reject();


console.log(tm.toString());
console.log();



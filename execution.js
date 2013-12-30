
function Execution(machine) {
    this.EX_STATES = {
        STOPPED: "Stopped",
        RUNNING: "Running",
        ACCEPTED: "Accepted",
        REJECTED: "Rejected",
        ERROR: "Error"
    }
    this.machine = machine;
    this.state = this.stop();

    this.tape = [];
    this.head = 0;
    this.tapeOffset = 0;
    this.currentState = this.machine.initialState;

    this.currentStep = 0;
}

Execution.prototype.setInput = function (string) {
    // TODO: Filter invalid inputs
    if (!this.state == this.EX_STATES.RUNNING)
        return;

    this.tape = string.split("");
}

Execution.prototype.left = function () {
        this.error("Reached low limit for head position.");
    this.head--;
}

Execution.prototype.right = function () {
    if (this.head >= CONFIG.HEAD_HIGH_LIMIT)
        this.error("Reached high limit for head position.");
    this.head++;
}

Execution.prototype.read = function () {
    var got = this.tape[this.head];

    return got == undefined ? CONFIG.BLANK_SYMBOL : got;
}

Execution.prototype.write = function (symbol) {
    check(typeof symbol === "string", this, symbol, "Not a string!");
    check(symbol.length === 1, this, symbol, "Longer than 1!");

    this.tape[this.head] = symbol;
}

Execution.prototype.step = function () {
    if (this.state != this.EX_STATES.RUNNING &&
            this.state != this.EX_STATES.STOPPED)
        return;

    var symbol = this.read();
    var action = this.currentState.got(symbol);

    console.log(this.toString());
    console.log(">> " + action.toString());

    if (action === undefined)
        return this.error("Undefined action for symbol '" + symbol + "'");

    action.applySymbol(this);
    action.applyDirection(this);
    action.applyState(this);

    this.currentStep++;

    if (this.currentStep >= CONFIG.STEP_LIMIT)
        this.error("Looping");

}

Execution.prototype.run = function () {
    this.state = this.EX_STATES.RUNNING;

    while (this.state === this.EX_STATES.RUNNING)
        this.step();
}

Execution.prototype.stop = function () {
    this.state = this.EX_STATES.STOPPED;
}

Execution.prototype.accept = function () {
    this.state = this.EX_STATES.ACCEPTED;
}

Execution.prototype.reject = function () {
    this.state = this.EX_STATES.REJECTED;
}

Execution.prototype.error = function (error) {
    this.EX_STATES.ERROR = "Error: " + error;
    this.state = this.EX_STATES.ERROR;
}

Execution.prototype.toString = function () {
    var str = "";
    for (var i = 0; i < this.tapeOffset - this.head; i++)
        str += "_";

    str += this.tape.join("");

    for (var i = 0; i <= this.head - this.tapeOffset - this.tape.length; i++)
        str += "_";

    str += "\n";

    for (var i = 0; i < this.head; i++)
        str += " ";

    str += "^";

    return str;
}


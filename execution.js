function Execution(machine) {
    this.EX_STATES = {
        STOPPED: "Stopped",
        RUNNING: "Running",
        ACCEPTED: "Accepted",
        REJECTED: "Rejected",
        ERROR: "Error"
    }
    this.machine = machine;
    this.state = this.EX_STATES.STOPPED;

    this.tape = [];
    this.head = 0;
    this.tapeOffset = 0;
    this.currentState = this.machine.initialState;

    this.currentStep = 0;
}

Execution.prototype = {
    setInput: function(string) {
        // TODO: Filter invalid inputs
        if (!this.state == this.EX_STATES.RUNNING)
            return;

        this.tape = string.split("");
    },

    apply: function(action) {
        switch(action) {
            case "moveLeft":
                if (this.head <= CONFIG.HEAD_HIGH_LIMIT)
                    this.error("Reached low limit for head position.");
                this.head--;
                break;

            case "moveRight":
                if (this.head >= CONFIG.HEAD_HIGH_LIMIT)
                    this.error("Reached high limit for head position.");
                this.head++;
                break;

            case "accept":
                this.state = this.EX_STATES.ACCEPTED;
                break;

            case "reject":
                this.state = this.EX_STATES.REJECTED;
                break;

            default:
                this.error("Unknown action '" + action + "'");
                break;
        }
    },

    read: function() {
        var got = this.tape[this.head];
        return got == undefined ? CONFIG.BLANK_SYMBOL : got;
    },

    write: function(symbol) {
        check(typeof symbol === "string", this, symbol, "Not a string!");
        check(symbol.length === 1, this, symbol, "Longer than 1!");

        this.tape[this.head] = symbol;
    },

    changeState: function(state) {
        this.currentState = state;
    },

    getRule: function(symbol) {
        var state = this.machine.states[this.currentState];

        var rule = state.find(function (e) { return e.when === symbol; });

        if (rule === undefined) {
            rule = state.find(function (e) { return e.when === "*"; })
        }

        if (rule === undefined) {
            this.error("Could not find rule for '" + symbol + "'");
        }

        return rule;
    },

    step: function() {
        console.log(this.toString());

        if (this.state != this.EX_STATES.RUNNING && this.state != this.EX_STATES.STOPPED)
            return;

        var rule = this.getRule(this.read());

        if ("write" in rule) {
            this.write(rule.write);
        }

        if ("action" in rule) {
            this.apply(rule.action);
        }

        if ("state" in rule) {
            this.changeState(rule.state);
        }

        this.currentStep++;
        if (this.currentStep >= CONFIG.STEP_LIMIT)
            this.error("Step limit exceeded");
    },

    run: function() {
        this.state = this.EX_STATES.RUNNING;

        while (this.state === this.EX_STATES.RUNNING)
            this.step();
    },

    error: function(error) {
        this.EX_STATES.ERROR = "Error: " + error;
        this.state = this.EX_STATES.ERROR;
    },

    toString: function() {
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
}


function Action() {
    var nop = function() { return; };

    this.symbol = null;
    this.applySymbol = nop;

    this.direction = null;
    this.applyDirection = nop;

    this.state = null;
    this.applyState = nop;
}

Action.prototype.write = function (symbol) {
    check(typeof symbol === "string", this, symbol, "Not a string!");
    check(symbol.length === 1, this, symbol, "Longer than 1!");

    this.symbol = symbol;
    this.applySymbol = function (execution) {
        execution.write(symbol);
    }
    return this;
}

Action.prototype.left = function () {
    this.direction = "left";
    this.applyDirection = function (execution) {
        execution.left();
    }
    return this;
}

Action.prototype.right = function () {
    this.direction = "right";
    this.applyDirection = function (execution) {
        execution.right();
    }
    return this;
}

Action.prototype.goto = function (state) {
    // TODO: Add checks for state

    this.state = state;
    this.applyState = function (execution) {
        execution.currentState = execution.machine.state(state);
    }
    return this;
}

Action.prototype.accept = function () {
    this.state = "ACCEPT";
    this.applyState = function (execution) {
        execution.accept();
    }
    return this;
}

Action.prototype.reject = function () {
    this.state = "REJECT";
    this.applyState = function (execution) {
        execution.reject();
    }
    return this;
}

Action.prototype.stop = function () {
    this.state = "STOPPED";
    this.applyState = function (execution) {
        execution.stop();
    }
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


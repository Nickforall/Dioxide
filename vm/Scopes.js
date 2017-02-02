const CBNull = require('./types/CBNull');

class ScopeManager {
    constructor() {
        this.scopes = [];
    }

    createScope(parentid) {
        return this.scopes.push(new Scope(parentid)) - 1;
    }

    getScope(id) {
        return this.scopes[id]
    }

    varExists(id, name) {
        let scope = this.getScope(id);

        if(scope.has(name)) return true;

        if(scope.parent !== undefined && scope.parent > -1) {
            return this.varExists(scope.parent, name);
        } else {
            return false;
        }
    }

    getFrom(id, name) {
        let scope = this.getScope(id);

        if(scope.has(name)) return scope.load(name);

        if(scope.parent !== undefined && scope.parent > -1) {
            return this.getFrom(scope.parent, name);
        } else {
            return new CBNull();
        }

        throw new Error("Reached the end of Scope.GetFrom, which should be technically impossible. Kay.")
    }
}

class Scope {
    constructor(pid) {
        this.parent = pid;
        this.variables = {};
    }

    has(name) {
        return this.variables[name] ? true : false;
    }

    store(name, value) {
        this.variables[name] = value;
    }

    load(name) {
        return this.variables[name];
    }
}

module.exports.ScopeManager = ScopeManager;
module.exports.Scope = Scope;

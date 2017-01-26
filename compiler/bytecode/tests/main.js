var hey = {
  "type": "script",
  "prog": [
    {
      "type": "call",
      "func": {
        "type": "var",
        "value": "print"
      },
      "args": [
        {
          "type": "str",
          "value": "hey"
        }
      ]
    }
  ]
};

const compiler = require("../compiler");
compiler.compileTree(hey);

struct Instr {
    op: i16,
    args: i16,
    name: String,
}

let instructions = [
    Instr {op: 0, args: 0, name: "null"},
    Instr {op: 1, args: 1, name: "pushnum"},
    Instr {op: 2, args: 1, name: "pushstr"},
    Instr {op: 3, args: 1, name: "pusharr"},
    Instr {op: 4, args: 0, name: "pushflt"},
    Instr {op: 5, args: 0, name: "valadd"},
    Instr {op: 6, args: 0, name: "nummlp"},
    Instr {op: 7, args: 0, name: "numdiv"},
    Instr {op: 8, args: 0, name: "numsub"},
    Instr {op: 9, args: 0, name: "nummod"},
    Instr {op: 10, args: 0, name: "pushtrue"},
    Instr {op: 11, args: 0, name: "pushfalse"}
];

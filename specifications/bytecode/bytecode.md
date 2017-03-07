# Bytecode Specification

## 0: null

Pushes a Carbon "null" value to the stack.

## 1: pushnum (number)

Pushes a Carbon Number value to the stack.

`pushnum 0`

## 2: pushstr (string addr)

Pushes a string from the string registry to the string.

The following bytecode `pushstr 0` gets the string with address 0 from the string reg,
and pushes it to the stack as a carbon string.

## 3: pusharr (initial length)

Pushes an array to the stack.

The following bytecode

```
pushnum 1000
pushnum 2000
pusharr 2
```

pushes `[1000, 2000]` to the stack. The first argument is the initial length of the
array, so the VM knows how much to read on the stack.

## 4: negative

unused.

## 5: valadd

Adds the 2 values above it on the stack and pushes the result to the stack.

The following bytecode

```
pushnum 100
pushnum 200
valadd
```

is the equilevant of `100 + 200`.

# 6: valmlp

Multiplies the 2 values above it on the stack and pushes the result to the stack.

The following bytecode

```
pushnum 100
pushnum 200
valmlp
```

is the equilevant of `100 * 200`.

# 7: valdiv

Divides the 2 values above it on the stack and pushes the result to the stack.

The following bytecode

```
pushnum 100
pushnum 200
valdiv
```

is the equilevant of `100 / 200`.

# 8: valsub

Subtracts the 2 values above it on the stack and pushes the result to the stack.

The following bytecode

```
pushnum 200
pushnum 100
valsub
```

is the equilevant of `200 - 100`.

# 9: valmod

Gets the modulo of the 2 values above it on the stack and pushes the result to the stack.

The following bytecode

```
pushnum 200
pushnum 100
valsub
```

is the equilevant of `200 % 100`.

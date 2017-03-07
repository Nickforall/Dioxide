# Globals

Globals are variables that can be accessed anywhere in a Carbon script.
**API STATUS: in-dev, APIs aren't frozen yet and are subject to change**

## print(string)

Prints a string to `stdout`. Only one argument can be passed and it's expected
to be a String, however any carbon object will be converted to a string when
passed.

## println(string)

Equilevant of `print`, except it ends the string with a newline automatically.

## unixtime()

Returns the current unix timestamp in seconds.

## unixtimemillis()

Returns the current unix timestamp in milliseconds.

## sleep(lambda, milliseconds)

Executes a lambda function after a certain amount of milliseconds.

### Usage:

```carbon
sleep(fn() {
    println("This function is executed after 1 second!");
}, 1000);
```

## proc

The process API object

## system

The system API object

# Dioxide

**Dioxide** is the main compiler and runtime for the Carbonscript language.

## Installation

You can install Dioxide by cloning this repository, and running `npm install -g` in its root.

## Usage

You can compile any utf8 file by running `carbonc filename.cb`

## What is Carbonscript?

Carbonscript is a language designed by [Nick Vernij](https://github.com/nickforall), I created this language because I was simply bored, and I was annoyed by some of the things other languages do.

Carbonscript is a C-like scripting language, the current builds are almost identical to JavaScript, but I am planning to add unique functionality in the future.

## Why Node.js

You'll probably hate me for using Node.JS as a compiler and VM. I am aware that it is incredibly inefficient as a VM, and probably not the best choice for a compiler too.

The reason why I use node.js is because I want to be able to rapidly prototype the features of my language, which is why I choose a langauge and platform where I have the most experience in: node.js

### Roadmap

In the near future I plan to port the VM to a language that compiles to machine code on a lot of platforms, such as C++, C or Rust. I haven't made my pick yet.

The compiler will obviously be ported to Carbonscript at some point.

## Issues

When you have an Issue with your Carbonscript code, it would be incredibly helpful if you could post your code, and if you know what you are doing, the _Abstract Syntax Tree_.

Also don't forget to check if the issue still occurs with the latest build on the **master** branch of this repository.

## Contributing

If you'd like to contribute, you can make a pull-request for simple fixes. For additions or more complex issues I would recommend to email me first at [hello@nickforall.nl](mailto:hello@nickforall.nl).

I haven't set any communities up yet, but am planning to do this in the near future.

## License

This project is licensed under the **Apache License 2.0** license.

_Now you've made it to the end of this readme, you deserve some coffee, and have fun coding in or contributing to Carbonscript_

# System

The System API allows you to gather information of the host operating system.
**API STATUS: in-dev, APIs aren't frozen yet and are subject to change**

## platform

This constant returns the platform your program is currently running on. It will
return one of the following strings:

* `'aix'`
* `'darwin'`
* `'freebsd'`
* `'linux'`
* `'openbsd'`
* `'sunos'`
* `'win32'`

### Usage

```carbon
# prints the platform to stdout
println(system.platform); # prints: "darwin"
```

## home

This constant returns the home directory of the user that is running your carbon
program.

### Usage

```carbon
# prints the home directory to stdout
println(system.home); # prints: "/users/nick/"
```

## arch

This constant returns the system's CPU architecture as a string. It will return
one of the following strings:

* `'arm'`
* `'arm64'`
* `'ia32'`
* `'mips'`
* `'mipsel'`
* `'ppc'`
* `'ppc64'`
* `'s390'`
* `'s390x'`
* `'x32'`
* `'x64'`
* `'x86'`

## uptime()

This function returns the system uptime in number of seconds.

## freeMemory()

This function returns the amount of free system memory in number of bytes.

## totalMemory()

This function returns the amount of total system memory in number of bytes.

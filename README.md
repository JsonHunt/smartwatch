# smartwatch
A command line tool that monitors folder tree and executes configurable commands based on file modification type and file glob.
It depends on the [fireworm package](https://github.com/airportyh/fireworm)

## Usage:
**smartwatch [a|c|r|s] [glob] [command]**

Options:

    a: execute [command] whenever a file matching the glob is added  
    c: execute [command] whenever a file matching the glob is changed  
    r: execute [command] whenever a file matching the glob is removed  
    s: if present, the output of [command] will be silenced  
    glob: a glob, i.e. **/*.js  
    command: command to be executed when file matching the glob is added/changed/removed.  
    It can accept parameters like this: #{path}

  Available parameters are:

  path: full path and filename  
  root: file root  
  dir: path without the filename  
  rel: path without the filename and topmost folder  
  base: file name and extension  
  ext: just file extension  
  name: just file name  

Multiple acrs/glob/command sets can be defined by adding additional parameters

### Example:

smartwatch acr src/\*\*/\*.jade "jade -P #{path} -o build#{rel}"

This command will monitor the 'src' folder and compile all jade templates into the build folder, retaining the original folder structure.

The src/house/room/closet.jade will be compiled into build/house/room/closet.html

Smartwatch can be used for:

* source code compilation
* testing
* linting
* minification
* live reload
* and many more

Sample package.json using [parallelshell](https://github.com/keithamus/parallelshell):

"scripts": {  
  "watch:jade": "smartwatch acs src/\*\*/\*.jade \"jade -P #{path} -o build#{rel}\""  
  "watch:coffee": "smartwatch acs src/*\*/\*.coffee \"coffee --compile --map -o build#{rel} #{path}\""  
  "watch:sass": "smartwatch acs src/\*\*/\*.sass \"node-sass #{path} build#{rel}\""  
  "watch:spec": "smartwatch ac test/\*\*/\*.js mocha"  
  "watch:all": "paralellshell 'npm run watch:jade' 'npm run watch:coffee' 'npm run watch:sass' 'npm run watch:spec'"  
},

Now execute "npm run watch:all" to start all your watchers

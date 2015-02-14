// Generated by CoffeeScript 1.9.0
(function() {
  var S, XDate, child_process, fireworm, path, runCommand;

  fireworm = require('fireworm');

  path = require('path');

  S = require('string');

  child_process = require('child_process');

  path = require('path');

  XDate = require('xdate');

  runCommand = function(filename, command, silent) {
    var fkey, index, key, model, value;
    model = path.parse(filename);
    model.path = filename;
    index = model.dir.indexOf(path.sep);
    if (index !== -1) {
      model.rel = model.dir.substr(index);
    }
    if (index === -1) {
      model.rel = '';
    }
    for (key in model) {
      value = model[key];
      fkey = '#{' + key + '}';
      command = S(command).replaceAll(fkey, value).s;
    }
    return child_process.exec(command, function(error, stdout, stderr) {
      if (silent === false) {
        if (stdout !== null) {
          console.log(stdout);
        }
        if (stderr !== null) {
          console.log(stderr);
        }
        if (error !== null) {
          return console.log(error);
        }
      }
    });
  };

  exports.run = function() {
    var commands, last;
    commands = [];
    process.argv.forEach(function(val, index, array) {
      if (index < 2 || (index + 1) % 3 !== 0) {
        return;
      }
      return commands.push({
        actions: array[index],
        glob: array[index + 1],
        command: array[index + 2]
      });
    });
    last = {};
    return commands.forEach(function(val, index, array) {
      var fw, silent;
      fw = fireworm('.');
      fw.add(val.glob);
      silent = val.actions.indexOf('s') !== -1 ? true : false;
      if (val.actions.indexOf('a') !== -1) {
        fw.on('add', function(filename) {
          var newStamp, oldStamp;
          oldStamp = last["add-" + index + "-" + filename];
          newStamp = new XDate();
          if (oldStamp === void 0 || (oldStamp.diffMilliseconds(newStamp) > 500)) {
            last["add-" + index + "-" + filename] = new XDate();
            return runCommand(filename, val.command, silent);
          }
        });
      }
      if (val.actions.indexOf('c') !== -1) {
        fw.on('change', function(filename) {
          var newStamp, oldStamp;
          oldStamp = last["change-" + index + "-" + filename];
          newStamp = new XDate();
          if (oldStamp === void 0 || (oldStamp.diffMilliseconds(newStamp) > 500)) {
            last["change-" + index + "-" + filename] = new XDate();
            return runCommand(filename, val.command, silent);
          }
        });
      }
      if (val.actions.indexOf('r') !== -1) {
        return fw.on('remove', function(filename) {
          var newStamp, oldStamp;
          oldStamp = last["remove-" + index + "-" + filename];
          newStamp = new XDate();
          if (oldStamp === void 0 || (oldStamp.diffMilliseconds(newStamp) > 500)) {
            last["remove-" + index + "-" + filename] = new XDate();
            return runCommand(filename, val.command, silent);
          }
        });
      }
    });
  };

}).call(this);
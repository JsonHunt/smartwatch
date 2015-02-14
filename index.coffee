#! /usr/bin/env node

fireworm = require 'fireworm'
path = require 'path'
S = require 'string'
child_process = require 'child_process'
path = require 'path'
XDate = require 'xdate'

runCommand = (filename, command, silent)->

  model = path.parse filename
  model.path = filename
  index = model.dir.indexOf(path.sep)
  model.rel = model.dir.substr(index) if index isnt -1
  model.rel = '' if index is -1
  # console.log model
  for key,value of model
    fkey = '#{' + key + '}'
    command = S(command).replaceAll(fkey,value).s
  child_process.exec command, (error, stdout, stderr) ->
    if silent is false
      console.log stdout if stdout isnt null
      console.log stderr if stderr isnt null
      console.log error if error isnt null

exports.run = ()->
  commands = []
  process.argv.forEach (val, index, array) ->
    return if index < 2 or (index+1) % 3 isnt 0
    commands.push
      actions: array[index]
      glob: array[index+1]
      command: array[index+2]

  last = {}

  commands.forEach (val,index,array) ->
    fw = fireworm '.'
    fw.add val.glob
    silent = if val.actions.indexOf('s') != -1 then true else false
    if val.actions.indexOf('a') != -1
      fw.on 'add', (filename) ->
        oldStamp = last["add-#{index}-#{filename}"]
        newStamp = new XDate()
        if oldStamp is undefined or (oldStamp.diffMilliseconds(newStamp) > 500)
          last["add-#{index}-#{filename}"] = new XDate()
          runCommand(filename, val.command, silent)

    if val.actions.indexOf('c') isnt -1
      fw.on 'change', (filename) ->
        oldStamp = last["change-#{index}-#{filename}"]
        newStamp = new XDate()
        if oldStamp is undefined or (oldStamp.diffMilliseconds(newStamp) > 500)
          last["change-#{index}-#{filename}"] = new XDate()
          runCommand(filename, val.command, silent)

    if val.actions.indexOf('r') isnt -1
      fw.on 'remove', (filename) ->
        oldStamp = last["remove-#{index}-#{filename}"]
        newStamp = new XDate()
        if oldStamp is undefined or (oldStamp.diffMilliseconds(newStamp) > 500)
          last["remove-#{index}-#{filename}"] = new XDate()
          runCommand(filename, val.command, silent)

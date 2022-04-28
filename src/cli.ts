#!/usr/bin/env node

import CliApplication from './app/cli-application.js';
import GenerateCommand from './cli-command/generate-command.js';
import HelpCommand from './cli-command/help-command.js';
import ImportCommand from './cli-command/import-command.js';
import VersionCommand from './cli-command/version-command.js';


const cliApp = new CliApplication();
cliApp.registerCommands([
  new HelpCommand(),
  new VersionCommand(),
  new ImportCommand(),
  new GenerateCommand(),
]);
cliApp.processCommand(process.argv);

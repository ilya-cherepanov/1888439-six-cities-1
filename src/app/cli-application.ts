import {CliCommandInterface} from '../cli-command/cli-command.interface.js';


type ParsedCommand = {
  [key: string]: string[];
}


export default class CliApplication {
  private commands: {[propertyName: string]: CliCommandInterface} = {};
  private defaultCommand = 'help';

  private parseCommand = (cliArguments: string[]): ParsedCommand => {
    const parsedCommand: ParsedCommand = {};
    let commandName = '';

    return cliArguments.reduce((acc, item) => {
      if (item.startsWith('--')) {
        commandName = item.substring(2);
        acc[commandName] = [];
      } else if (commandName && item) {
        acc[commandName].push(item);
      }

      return acc;
    }, parsedCommand);
  };

  public registerCommands = (commandList: CliCommandInterface[]): void => {
    this.commands = commandList.reduce((acc, command) => {
      acc[command.name] = command;
      return acc;
    }, this.commands);
  };

  public getCommand = (commandName: string): CliCommandInterface => (
    this.commands[commandName] ?? this.commands[this.defaultCommand]
  );

  public processCommand = (argv: string[]): void => {
    const parsedCommand = this.parseCommand(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  };
}

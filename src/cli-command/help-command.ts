import {CliCommandInterface} from './cli-command.interface.js';
import chalk from 'chalk';


export default class HelpCommand implements CliCommandInterface {
  public readonly name = 'help';

  public execute = (): void => {
    console.log(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            ${chalk.cyan('cli.js')} ${chalk.yellow('--<command>')} ${chalk.green('[--arguments]')}
        Команды:
            ${chalk.yellow('--version')}:                   # выводит номер версии
            ${chalk.yellow('--help')}:                      # печатает этот текст
            ${chalk.yellow('--import')} ${chalk.green('<path>')}:             # импортирует данные из TSV
        `);
  };
}

import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import {CliCommandInterface} from './cli-command.interface.js';
import chalk from 'chalk';


export default class ImportCommand implements CliCommandInterface {
  readonly name = 'import';

  public execute = (fileName: string): void => {
    const fileReader = new TSVFileReader(fileName);

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      console.error(chalk.red(`Не удалось импортировать данные из файла по причине: «${error.message}»`));
    }
  };
}

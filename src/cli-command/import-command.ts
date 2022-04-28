import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import {CliCommandInterface} from './cli-command.interface.js';
import chalk from 'chalk';
import {createOffer} from '../utils/offer.js';


export default class ImportCommand implements CliCommandInterface {
  readonly name = 'import';

  public async execute(fileName: string): Promise<void> {
    const fileReader = new TSVFileReader(fileName.trim());
    fileReader.on('row', this.onRow);
    fileReader.on('end', this.onEnd);

    try {
      await fileReader.read();
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      console.error(chalk.red(`Не удалось импортировать данные из файла по причине: «${error.message}»`));
    }
  }

  private onRow(row: string): void {
    const offer = createOffer(row);
    console.log(offer);
  }

  private onEnd(count: number): void {
    console.log(`${count} строк импортированно`);
  }
}

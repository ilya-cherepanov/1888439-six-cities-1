import got from 'got';
import {MockData} from '../types/mock-data.type.js';
import {OfferGenerator} from '../common/offer-generator/offer-generator.js';
import {CliCommandInterface} from './cli-command.interface.js';
import {TSVFileWriter} from '../common/file-writer/tsv-file-writer.js';
import chalk from 'chalk';


export default class GenerateCommand implements CliCommandInterface {
  public readonly name: string = 'generate';
  private initialData!: MockData;

  public async execute(...params: string[]): Promise<void> {
    const [count, filePath, url] = params;
    const offerCount = parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      console.error(chalk.red(`Can't fetch data from ${url}.`));
      return;
    }

    const offerGenerator = new OfferGenerator(this.initialData);
    const fileWriter = new TSVFileWriter(filePath);

    try {
      for (let i = 0; i < offerCount; ++i) {
        await fileWriter.write(offerGenerator.generate());
      }
    } finally {
      fileWriter.destroy();
    }
  }
}

import {once} from 'events';
import {createWriteStream, WriteStream} from 'fs';
import {FileWriterInterface} from './file-writer.interface.js';


export class TSVFileWriter implements FileWriterInterface {
  private stream: WriteStream;

  constructor(public readonly fileName: string) {
    this.stream = createWriteStream(fileName, {
      flags: 'w',
      encoding: 'utf-8',
      highWaterMark: 2 ** 12,
      autoClose: true,
    });
  }

  public async write(row: string): Promise<void> {
    if (this.stream.destroyed) {
      throw new Error('TSVFileWriter has been destroyed');
    }

    if (!this.stream.write(`${row}\n`)) {
      await once(this.stream, 'drain');
    }
  }

  public async destroy(): Promise<void> {
    await once(this.stream, 'finished');
    this.stream.destroy();
  }
}

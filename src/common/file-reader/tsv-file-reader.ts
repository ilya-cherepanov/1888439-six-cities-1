import EventEmitter from 'events';
import {createReadStream} from 'fs';
import {DATA_CHUNK_SIZE} from '../../consts.js';
import {FileReaderInterface} from './file-reader.interface.js';


export default class TSVFileReader extends EventEmitter implements FileReaderInterface {
  constructor(public fileName: string) {
    super();
  }

  public async read(): Promise<void> {
    const stream = createReadStream(this.fileName, {
      highWaterMark: DATA_CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let lineRead = '';
    let endLinePosition = -1;
    let importedRowCount = 0;

    try {
      for await (const chunk of stream) {
        lineRead += chunk.toString();

        endLinePosition = lineRead.indexOf('\n');
        while (endLinePosition >= 0) {
          const row = lineRead.slice(0, endLinePosition - 1);
          lineRead = lineRead.slice(++endLinePosition);
          importedRowCount += 1;

          await new Promise((resolve) => { this.emit('row', row, resolve); });
          endLinePosition = lineRead.indexOf('\n');
        }
      }

      this.emit('end', importedRowCount);
    } finally {
      stream.destroy();
    }
  }
}

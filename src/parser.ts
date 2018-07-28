import * as fs from 'fs';
import * as path from 'path';

export class Parser {
  constructor(protected filename: string) {}

  public async fromCSV(): Promise<any[]> {
    const contents: string = await fs.promises.readFile(path.join('./files', this.filename), 'utf8');

    const lines: string[] = contents.split('\n');

    const headerColumns: string[] = this.splitCSVLineToColumns(lines[0]);

    const result: any[] = [];

    for (let index = 1; index < lines.length; index++) {
      const line = lines[index];

      if (!line) {
        continue;
      }

      result.push(this.lineToItem(line, headerColumns));
    }

    return result;
  }

  protected lineToItem(line: string, headerColumns: string[]) {
    const columns: string[] = this.splitCSVLineToColumns(line);

    const item = {};

    for (let columnIndex = 0; columnIndex < headerColumns.length; columnIndex++) {
      item[headerColumns[columnIndex]] = columns[columnIndex];
    }

    return item;
  }

  protected splitCSVLineToColumns(line: string): string[] {
    const values: string[] = [];

    let insideQuotes: boolean = false;

    let temp = '';

    for (const char of line) {
      if (char === ',' && !insideQuotes) {
        values.push(temp.replace(/'/g, "''"));

        temp = '';

        continue;
      }

      if (char === '"') {
        if (!insideQuotes) {
          insideQuotes = true;

          continue;
        }

        if (insideQuotes) {
          insideQuotes = false;

          continue;
        }
      }

      temp += char;
    }

    values.push(temp.replace(/'/g, "''"));

    return values;
  }
}

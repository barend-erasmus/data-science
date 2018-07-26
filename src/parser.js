const fs = require('fs').promises;
const path = require('path');

async function parseCSV(filename) {
    const contents = await fs.readFile(path.join('./files', filename), 'utf8');

    const lines = contents.split('\r\n');

    const headerColumns = lineToColumns(lines[0]);

    const result = [];

    for (let index = 1; index < lines.length; index++) {
        const line = lines[index];

        if (!line) {
            continue;
        }

        const columns = lineToColumns(line);

        const item = {};

        for (let columnIndex = 0; columnIndex < headerColumns.length; columnIndex ++) {
            item[headerColumns[columnIndex]] = columns[columnIndex];
        }

        result.push(item);
    }

    return result;
}

function lineToColumns(line) {
    const values = [];

    let insideQuotes = false;

    let temp = '';

    for (const char of line) {
        if (char === ',' && !insideQuotes) {
            values.push(temp.replace(/'/g, '\'\''));
            
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

    values.push(temp.replace(/'/g, '\'\''));

    return values;
}

module.exports = {
    parseCSV,
};

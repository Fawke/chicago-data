// PART -1 (Data Munging)
// 1. Read the file
// 2. Break down the csv line by line
// 3. Extract the header row and store the indexes
// 4. Filter and aggregate the date and store the data
// 5. Convert the data into JSON
// 6. Write the JSON back to a file

// PART - 2 (Data Visualization) (using d3.js)

console.time('data munging');
const fs = require('fs');
const readline = require('readline');

const csvData = fs.createReadStream('./data/input/chicagocrimes.csv');

const rl = readline.createInterface({
  input: csvData
});

let isHeader = true;
let header = [];
let year, primaryType, description;
let finalData = {};
rl.on('line', (line) => {
  if (isHeader) {
    isHeader = false;
    header = line.split(',');
    year = header.indexOf('Year');
    primaryType = header.indexOf('Primary Type');
    description = header.indexOf('Description');
    console.log(header);
  } else {
    const row = line.split(',');

    // filteration.
    let obj = {};
    if (row[primaryType] === 'THEFT' && 
          (row[year] >= 2001 && row[year] <= 2018)) {
          
            if (row[description] === "OVER $500"){
              if (finalData[row[year]]) {
                finalData[row[year]]['theftOver500']++
              } else {
                obj['theftOver500'] = 1;
                obj['theftUnder500'] = 0;
                finalData[row[year]] = obj;
              }
            } else if (row[description] === "$500 AND UNDER") {
               if (finalData[row[year]]) {
                finalData[row[year]]['theftUnder500']++
              } else {
                obj['theftOver500'] = 0;
                obj['theftUnder500'] = 1;
                finalData[row[year]] = obj;
              }
            }
          } 
  }
});

rl.on('close', () => {
  fs.writeFile('data/output/theft.json', JSON.stringify(finalData),(err) => {
    if (err) {console.log("ERR::", err)};
    console.log("file has been written!")
    console.timeEnd('data munging');
  });
});


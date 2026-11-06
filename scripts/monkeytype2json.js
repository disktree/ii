const fs = require('node:fs');
const process = require('node:process');

const src = "/home/tong/downloads/monkeytype_results";
const dst = "data/monkeytype.json";


// function filterDuplicates(arr) {
//   const counts = arr.reduce((acc, obj) => {
//     acc[obj._id] = (acc[obj._id] || 0) + 1;
//     return acc;
//   }, {});
//   return arr.filter(obj => counts[obj._id] === 1);
// }

const data = [];

fs.readdirSync(src).forEach(file => {
  const str = fs.readFileSync(`${src}/${file}`).toString();
  const lines = str.split("\n");
  const sep = lines[0].indexOf("|") !== -1 ? "|" : ",";
  const fields = lines.shift().split(sep);
  // const entries = [];
  lines.forEach(line => {
    const values = line.split(sep);
    values.splice(1, 1);
    const obj = {}
    for (let i = 0; i < fields.length; i++) {
      obj[fields[i]] = values[i];
    }
    // entries.push(obj);
    data.push(obj);
  });
  //data.push(entries);

})

const counts = data.reduce((acc, obj) => {
  acc[obj._id] = (acc[obj._id] || 0) + 1;
  return acc;
}, {});
const list = data.filter(obj => counts[obj._id] === 1);
//console.log(data.length, list.length);

fs.writeFileSync(dst, JSON.stringify(list));

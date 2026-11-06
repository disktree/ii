const fs = require("fs");
const sass = require("sass");

const options = {
    loadPaths: [process.env["SASS_ENRON"]],
    sourceMap: true
};
const result = sass.compile('style/main.scss', options);
//console.log(JSON.stringify(result.sourceMap));
fs.writeFileSync("static/style.css", result.css);
fs.writeFileSync("static/style.css.map", JSON.stringify(result.sourceMap));

const expressApp = require('express')(),

  node_xj = require("xls-to-json"),
  fs = require('fs');


const mkdirSync = function (dirPath) {
  try {
    fs.mkdirSync(dirPath)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

function readFiles(dirname, calback) {
  let files = [];
  fs.readdir(dirname, function (err, filenames) {
    if (err) {
      calback(err);
      return;
    }

    filenames = filenames.filter((fileName) => {
      return fileName.endsWith(".xlsx");
    });
    calback(null, filenames);
  });
}

const generate = (basePath) => {
  let jsonsPath = 'jsons';
  let jsonBasePath = `${basePath}/${jsonsPath}`;
  mkdirSync(jsonBasePath);
  readFiles('/home/tato/Desktop/for-del/un-ziped/', (err, filenames) => {
    if (err) {
      console.log('error while reading files');
      return;
    }
    console.log(filenames);

    (function processNextXls(err, success) {
      if (filenames.length == 0) {
        console.log('Processed succesfuly');
        return;
      }
      if (err) {
        console.log('ERROR while processing');
        return;
      }
      let fileName = filenames.shift();


      node_xj({
        input: `${basePath}/${fileName}`,  // input xls
        output: `${jsonBasePath}/${fileName}.json`, // output json
      }, function (err, result) {
        if (err) {
          console.error(err);
          processNextXls(err);
          return;
        } else {
          processNextXls(null);
          //console.log(result);
        }
      });

    })();

  });

};



let basePath = generate('/home/tato/Desktop/for-del/un-ziped/');



expressApp.listen(3000, () => {
  console.log('app is listening on port 3000');
});


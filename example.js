'use strict';

const filepath = 'user.csv';

const SqlBatchTransform = require('./lib/SqlBatchTransform');
const fs = require('fs');
const readStream = fs.createReadStream(filepath);
const writeStream = fs.createWriteStream(filepath + '.sql');
const exec = require('child_process').exec;

const voucherQuery = new SqlBatchTransform("UPDATE user SET active = 1 WHERE id IN(?);\n");


exec('wc -l ' + filepath, function (err, results) {
  const lines = parseInt(results) + 1; // +1, last line may contain no EOL

  voucherQuery.on('readable', function () {
    let progress;
    let query;

    while (null !== (query = voucherQuery.read())) {
      progress = Math.floor(100 / lines * voucherQuery.counter);
      process.stdout.write('processing...' + progress + "%\r");

      if( progress === 100 ) {
        process.stdout.write("\ndone!\n");
      }
    }
  });

  readStream.pipe(voucherQuery).pipe(writeStream);
});
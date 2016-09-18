### SQL Batch Transformer

playing around with streams...

```js
const filepath = 'user.csv';

const SqlBatchTransform = require('./lib/SqlBatchTransform');
const fs = require('fs');
const readStream = fs.createReadStream(filepath);
const writeStream = fs.createWriteStream(filepath + '.sql');

const voucherQuery = new SqlBatchTransform("UPDATE user SET active = 1 WHERE id IN(?);\n");

readStream.pipe(voucherQuery).pipe(writeStream);
```

gives you

```sql
UPDATE user SET active = 1 WHERE id IN(1,2,3,4,5,6,7);
UPDATE user SET active = 1 WHERE id IN(8,9,10,11,12,13,14);
...
```

see example.js for more
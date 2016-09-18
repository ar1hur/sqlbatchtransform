'use strict';

const LINE_BOUNDARIES = /\r\n|[\n\v\f\r\x85\u2028\u2029]/g;
const Transform = require('stream').Transform;
const escape = require('mysql').escape;

class SqlBatchTransform extends Transform {
  constructor(sql) {
    super({objectMode: true});
    this.sql = sql;
    this.counter = 0;
  }

  _transform(chunk, encoding, done) {
    let data = chunk.toString();
    if (this._lastLineData) data = this._lastLineData + data;

    let lines = data.split(LINE_BOUNDARIES);
    this._lastLineData = lines.splice(lines.length - 1, 1)[0];
    let query = this.buildQuery(lines);

    this.push(query);
    done();
  };

  _flush(done) {
    if (this._lastLineData) {
      let lines = this._lastLineData.split(LINE_BOUNDARIES);
      let query = this.buildQuery(lines);
      this.push(query)
    }
    this._lastLineData = null;
    done();
  };

  buildQuery(lines) {
    let query = this.sql.replace('?', escape(lines));
    this.counter += lines.length;
    return query;
  }
}

module.exports = SqlBatchTransform;
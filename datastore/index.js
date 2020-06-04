const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
// const readdir = Promise.promisify(fs.readdir);
// const mapp = Promise.promisify(_.map);
// const readOneFile = Promise.promisify(exports.readOne);


var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw err;
    } else {
      var newFile = path.join(exports.dataDir, id + '.txt');
      fs.writeFile(newFile, text, (err) => {
        if (err) {
          console.log('error writing new file');
        } else {
          callback(null, { id, text })
        }
      });
    }
  });
}

exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};


exports.readAll = (callback) => {
  console.log(exports.readOne);
  const readOneFile = Promise.promisify(exports.readOne);
    fs.readdir(exports.dataDir, (err, data) => {
      if (err) {new Error(`There are no files in the director`);}
      else {
        var file = _.map(data, (text) => {
        text = text.slice(0, 5);
        console.log(text);
        var id = text;
        return readOneFile(id);
      })
      Promise.all(file).then(value => {
        callback(null, value);
      })
    } })


};

exports.readOne = (id, callback) => {
  var currentFile = path.join(exports.dataDir, id + '.txt');
  fs.readFile(currentFile, (err, data) => {
    if (err || data === undefined) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      let text = data.toString();
      callback(null, { id, text });
    }
  })
};

exports.update = (id, text, callback) => {
  let filePath = path.join(exports.dataDir, id + '.txt');
  exports.readOne(id, (err, data) => {
    if (err || data === undefined) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text });
        }
      })
    }
  })
};

exports.delete = (id, callback) => {
  let filePath = path.join(exports.dataDir, id + '.txt');
  exports.readOne(id, (err) => {
      if (err) {
        // report an error if item not found
        callback(new Error(`No item with id: ${id}`));
      } else {
        fs.unlink(filePath, (err) => {
          if (err) {
            callback(new Error(`No item with id: ${id}`));
          } else {
            callback(null);
          }
      })
    }
  })
}

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const url = "mongodb://127.0.0.1:27017"; // 数据库服务器的地址
const dbName = 'bbs'
module.exports = {
  addFileImage: function (opts, callback) {
    addInsertOne({ url, dbName, listName: 'files', opts, callback });
  },
  queryFileById: function (_id, callback) {
    const opts = { _id: ObjectID(_id) };
    queryInsertOne({ url, dbName, listName: 'files', opts, callback });
  },
  addDynamic: function (opts, callback) {
    addInsertOne({ url, dbName, listName: 'dynamic', opts, callback});
  },
  queryDynamicList: function (opts, callback) {
    queryToArray({ url, dbName, listName: 'dynamic', opts, callback});
  },
  registerBBS: function (opts, callback) {
    addInsertOne({ url, dbName, listName: 'users', opts, callback });
  },
  loginBBS: function (opts, callback) {
    queryInsertOne({ url, dbName, listName: 'users', opts, callback });
  },
  addLogin: function (opts, callback) {
    addInsertOne({url, dbName, listName: 'users', opts, callback})
  },
  addOneRoomMsg: function (opts, callback) {
    addInsertOne({url, dbName, listName: 'room', opts, callback});
  },
  queryAllMsg: function (opts, callback) {
    queryAllToArry({url, dbName, listName: 'room', opts, callback});
  },
	addContact: function (opts, callback) {
	  addInsertOne({ url, dbName, listName: 'contact', opts, callback });
	},
	queryContactList: function (opts, callback) {
		queryAllToArry({url, dbName, listName: 'contact', opts, callback});
	},
	deleteContactById: function (_id, callback) {
		const opts = { _id: ObjectID(_id) };
		deleteInsertOne({ url, dbName, listName: 'contact', opts, callback });
	},
	keywordContact: function(findval, callback) {
		keywordAllToArry({ url, dbName, findval, listName: 'contact', callback });
	},
	eidtContact: function(opts, callback) {
		eidtOneById({ url, dbName, opts, listName: 'contact', callback })
	}
}

// 添加数据
function addInsertOne({ url, dbName, listName, opts, callback } = {}) {
  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, client) {
    if (err) {
      console.log(opts);
      return console.log("链接服务器失败了", err);
    }
    const db = client.db(dbName);
    db.collection(listName).insertOne(opts, function (err, result) {
      if (err) {
        return console.log("服务器链接失败", err);
      }
      // console.log(result);
      // callback(result);
      if (result) {
        db.collection(listName).findOne(opts, function (err, json) {
          if (err) {
            console.log(opts);
            return console.log("链接服务器失败了", err);
          }
          callback(json);
        });
        client.close();
      } else {
        client.close();
      }
    })
  })
}

// 查找一条数据
function queryInsertOne({ url, dbName, listName, opts, callback }) {
  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, client) {
    if (err) {
      console.log(opts);
      return console.log("链接服务器失败了", err);
    }
    const db = client.db(dbName);
    db.collection(listName).findOne(opts, function (err, result) {
      if (err) {
        return console.log("服务器链接失败", err);
      }
      callback(result);
    })
    client.close();
  })
}

// 查询多条数据
function queryToArray({ url, dbName, listName, opts, callback }) {
  MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
    if (err) {
      return console.log("链接服务器失败了", err);
    }
    const limit = +opts.pageSize;
    const skip = (+opts.page - 1) * limit;
    const db = client.db(dbName);
    db.collection(listName).find().skip(skip).limit(limit).toArray(function (err, result) {
      if (err) {
        return console.log("链接服务器失败了", err);
      }
      callback(result)
    });
    client.close();
  })
}
// 查询全部信息
function queryAllToArry({ url, dbName, opts, listName, callback }) {
  MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
    if (err) {
      return console.log("链接服务器失败了", err);
    }
    const db = client.db(dbName);
    db.collection(listName).find().toArray(function (err, result) {
      if (err) {
        return console.log("链接服务器失败了", err);
      }
      callback(result)
    });
    client.close();
  })
}

// 根据id删除数据
function deleteInsertOne({ url, dbName, listName, opts, callback }) {
	MongoClient.connect(url, {
	  useNewUrlParser: true
	}, function (err, client) {
	  if (err) {
	    console.log(opts);
	    return console.log("链接服务器失败了", err);
	  }
	  const db = client.db(dbName);
	  db.collection(listName).deleteOne(opts, function (err, result) {
	    if (err) {
	      return console.log("服务器链接失败", err);
	    }
	    callback(result);
	  })
	  client.close();
	})
}

// 关键字查询
function keywordAllToArry({ url, dbName, findval, listName, callback }) {
	MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
	  if (err) {
	    return console.log("链接服务器失败了", err);
	  }
	  const db = client.db(dbName);
	  db.collection(listName).find({$or:[{name:findval},{mobile:findval}]}).toArray(function (err, result) {
	    if (err) {
	      return console.log("链接服务器失败了", err);
	    }
	    callback(result)
	  });
	  client.close();
	})
}
// 修改数据
function eidtOneById({ url, dbName, opts, listName, callback }) {
	MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
	  if (err) {
	    return console.log("链接服务器失败了", err);
	  }
	  const db = client.db(dbName);
		const whereStr = { _id: ObjectID(opts._id) };
		delete opts._id;
		const updateStr = { $set: {
			...opts
		}};
	  db.collection(listName).updateOne(whereStr, updateStr, function (err, result) {
	    if (err) {
	      return console.log("链接服务器失败了", err);
	    }
	    callback(result)
	  });
	  client.close();
	})
}
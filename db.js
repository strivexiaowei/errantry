const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const url = "mongodb://127.0.0.1:27017"; //数据库服务器的地址
const dbName = "room"; //数据库的名字
module.exports = {
  login: function (opts, callback) {
    MongoClient.connect(url, {
      useNewUrlParser: true
    }, function (err, client) {
      if (err) {
        return console.log("链接服务器失败了", err);
      }
      const db = client.db(dbName);
      db.collection('user').findOne(opts, function (err, result) {
        if (err) {
          return console.log("服务器链接失败", err);
        }
        callback(result);
      })
      client.close();
    })
  },
  register: function (opts,callback) {
    MongoClient.connect(url, {
      useNewUrlParser: true
    }, function (err, client) {
      if (err) {
        return console.log("链接服务器失败了", err);
      }
      const db = client.db(dbName);
      db.collection('user').insertOne(opts, function (err, result) {
        if (err) {
          return console.log("服务器链接失败", err);
        }
        callback(result);
      })
      client.close();
    })
  },
  queryUserById: function (_id, callback) {
    MongoClient.connect(url, {
      useNewUrlParser: true
    }, function (err, client) {
      if (err) {
        return console.log("链接服务器失败了", err);
      }
      const db = client.db(dbName);
      db.collection('user').findOne({_id:ObjectID(_id)}, function (err, result) {
        if (err) {
          return console.log("服务器链接失败", err);
        }
        callback(result);
      })
      client.close();
    })
  },
  roomlist: function (opts, callback) {
    MongoClient.connect(url, {
      useNewUrlParser: true
    }, function (err, client) {
      if (err) {
        return console.log("链接服务器失败了", err);
      }
      const db = client.db(dbName);
      // console.log(opts);
      db.collection('roomlist').findOne({
        nickname: opts.nickname
      }, function (err, result) {
        if (err) {
          return console.log("服务器链接失败", err);
        }
        if (result) {
          let whereStr = {
            nickname: opts.nickname
          }; // 查询条件
          // console.log(whereStr);
          let updateStr = {
            $set: {
              isOnline: opts.isOnline
            }
          };
          console.log(updateStr);
          db.collection("roomlist").updateOne(whereStr, updateStr, function (err, info) {
            if (err) {
              return console.log("服务器链接失败", err);
            }
            db.collection("roomlist").find().toArray(function (err, res) {
              if (err) {
                return err;
              }
              callback(res)
            })
            client.close();
          });
        } else {
          db.collection("roomlist").insertOne(opts, function (err, res) {
            if (err) {
              return console.log("服务器链接失败", err);
            }
            db.collection("roomlist").find().toArray(function (err, res) {
              if (err) {
                return err;
              }
              callback(res)
            })
            client.close();
          });
        }
      })
    })
  },
  queryMsg: function(opts,callback) {
    if (opts.nickname) {
      MongoClient.connect(url, {
        useNewUrlParser: true
      }, function (err, client) {
        if (err) {
          return console.log("链接服务器失败了", err);
        }
        const db = client.db(dbName);
        db.collection('message').insertOne(opts, function (err, result) {
          if (err) {
            return console.log("服务器链接失败", err);
          }
          db.collection("message").find().toArray(function (err, res) {
            if (err) {
              return err;
            }
            callback(res)
          })
          client.close();
        })
      })
    } else {
      MongoClient.connect(url, {
        useNewUrlParser: true
      }, function (err, client) {
        if (err) {
          return console.log("链接服务器失败了", err);
        }
        const db = client.db(dbName);
        db.collection('message').find().toArray(function (err, result) {
          if (err) {
            return console.log("服务器链接失败", err);
          }
          callback(result);
        })
        client.close();
      })
    }
  }
}
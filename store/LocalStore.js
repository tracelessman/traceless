/**
 * Created by renbaogang on 2017/10/30.
 */

import SQLite from 'react-native-sqlite-storage';
var db = SQLite.openDatabase({name: 'traceless.db', location: 'default'}, function () {
}, function (err) {
});
db.transaction((tx)=>{
    tx.executeSql("create table if not exists traceless(id INTEGER PRIMARY KEY NOT NULL,data TEXT)",[],function () {
    },function (err) {
    });
    tx.executeSql("create table if not exists mq(id INTEGER PRIMARY KEY NOT NULL,req TEXT NOT NULL,lastSendTime INTEGER)",[],function () {
    },function (err) {
    });
});

var Store = require("../store/Store");
var exists = false;
function _update(data,callback) {
    db.transaction((tx)=>{

        tx.executeSql("update traceless set data=? where id=1",[data],function () {
            console.info("update:"+data);
            if(callback)
                callback();
        },function (err) {
            console.info(err);
        });
    });
}
Store.save2Local =function (key,data,callback) {
    if(!exists){
        db.transaction((tx)=>{
            tx.executeSql("select * from traceless",[],function (tx,results) {
                var len = results.rows.length;
                if(len>0){
                    _update(data,callback);
                }else{
                    tx.executeSql("insert into traceless(id,data) values(1,?)",[data],function () {
                        exists = true;
                        if(callback)
                            callback();
                    },function (err) {
                        console.info(err);
                    });
                }

            },function (err) {
                console.info(err);
            });
        });

    }else{
        _update(data,callback);
    }


    // AsyncStorage.setItem(key,value,function (error) {
    //     if(error)
    //         console.info("store save error:"+error);
    // });
};
Store.queryFromLocal=function (key,callback) {
    db.transaction((tx)=>{
        tx.executeSql("select * from traceless where id=1",[],function (tx,results) {
            var len = results.rows.length;
            if(len>0){
                callback(results.rows.item(0).data);
            }else{
                callback(null);
            }

        },function (err) {
            console.info(err);
        });
    });
    // AsyncStorage.getItem(key,(err,result)=>{
    //     if(err){
    //         console.info("find local store err:"+err);
    //     }else{
    //         callback(result);
    //     }
    // });
};
Store.push2MQ=function (req,callback) {
    db.transaction((tx)=>{
        tx.executeSql("insert into mq(id,req,lastSendTime) values(?,?,?)",[req.id,JSON.stringify(req),Date.now()],function () {
            if(callback)
                callback();
        },function (err) {
            console.info(err);
        });
    });
};
Store.removeFromMQ=function (reqId,callback) {
    db.transaction((tx)=>{
        tx.executeSql("delete from mq where id=?",[reqId],function () {
            if(callback)
                callback();
        },function (err) {
            console.info(err);
        });
    });
};
Store.eachTimeoutMsg=function (callback,complete) {
    var n = Date.now();
    db.transaction((tx)=>{
        tx.executeSql("select * from mq where lastSendTime is not null and "+n+"-lastSendTime>180000 order by id",[],function (tx,results) {
            var len = results.rows.length;
            for(var i=0;i<len;i++){
                callback(results.rows.item(i));
            }
            complete(len);
        },function (err) {
            console.info(err);
        });
    });
};
Store.updateLastSendTime=function (id,time,callback) {
    db.transaction((tx)=>{
        tx.executeSql("update mq set lastSendTime=? where id=?",[time,id],function () {
            if(callback)
                callback();
        },function (err) {
            console.info(err);
        });
    });
};
export default Store;

//获取本地key，无key就引导下载，有则到主界面

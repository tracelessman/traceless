/* eslint-disable */
import SQLite from 'react-native-sqlite-storage';
import RNFetchBlob from 'react-native-fetch-blob';
const dirs = RNFetchBlob.fs.dirs;

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
    tx.executeSql("create table if not exists record(chatId TEXT NOT NULL,senderUid TEXT,senderCid TEXT,type INTEGER,content TEXT,time INTEGER,msgId INTEGER,state INTEGER)",[],function () {
    },function (err) {
    });
    tx.executeSql("create table if not exists record_state_report(chatId TEXT NOT NULL,msgId INTEGER ,reporterUid TEXT NOT NULL,state INTEGER)",[],function () {
    },function (err) {
    });
});

var Store = require("../store/Store");
var exists = false;
function _update(data,callback) {
    db.transaction((tx)=>{

        tx.executeSql("update traceless set data=? where id=1",[data],function () {
            // console.info("update:"+data);
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

Store._deleteLocalRecords=function (chatId,callback) {
    db.transaction((tx)=>{
        tx.executeSql("delete from record where chatId=?",[chatId],function () {
            if(callback)
                callback();
        },function (err) {
            console.info(err);
        });
    });
};
Store._getLocalRecords = function (chatId,callback,limit) {
    var sql = "select * from record where chatId=? order by time";
    if(limit&&limit>0){
        sql += " desc limit ";
        sql += limit;
    }
    db.transaction((tx)=>{
        tx.executeSql(sql,[chatId],function (tx,results) {
            var rs = [];
            var len = results.rows.length;
            for(var i=0;i<len;i++){
                rs.push(results.rows.item(i));
            }
            if(limit&&limit>0) {
                rs = rs.reverse()
            }
            callback(rs);
        },function (err) {
            console.info(err);
        });
    });
};
Store._insertRecord2Local = function (chatId,record,callback) {
    var type = -1;
    var content = null;
    var state = isNaN(record.state)?-1:record.state;
    var insert2DB = function () {
        db.transaction((tx)=>{
            tx.executeSql("insert into record(chatId,senderUid,senderCid,type,content,time,msgId,state) values(?,?,?,?,?,?,?,?) ",[chatId,record.senderUid||null,record.senderCid||null,type,content,record.time,record.msgId,state],function () {
                if(callback)
                    callback();
            },function (err) {
                console.info(err);
            });
        });
    };
    if(record.text){
        type = Store.MESSAGE_TYEP_TEXT;
        content = record.text;
        insert2DB();
    }else if(record.img){
        type = Store.MESSAGE_TYPE_IMAGE;
        var dir = dirs.DocumentDir+"/images/"+chatId;
        var createImage = function () {
            var url = dir+"/"+(record.senderUid?record.senderUid:"")+"-"+record.msgId+".jpg";
            RNFetchBlob.fs.createFile(url,record.img.data,'base64').then(()=>{
                content = JSON.stringify({width:record.img.width,height:record.img.height,data:url});
                insert2DB();
            }).catch(err=>{
                console.log(err)
            });
        }
        RNFetchBlob.fs.exists(dir).then(
            exist=>{
                if(!exist){
                    RNFetchBlob.fs.mkdir(dir).then(()=>{
                        createImage();
                    }).catch();
                }else{
                    createImage();
                }
            }
        ).catch(
            err=>{
                console.log(err)
            }
        );

    }else if(record.file){
        type = Store.MESSAGE_TYPE_FILE;
        delete record.file.data;
        content = JSON.stringify(record.file);
        insert2DB();
    }

};
Store._updateLocalRecordState = function (chatId,msgIds,state,callback) {
    if(msgIds){
        var sql = "update record set state=? where chatId=? and msgId ";
        var update = false;
        if(typeof msgIds == "string"){
            sql += "='"
            sql += msgIds;
            sql += "'";
            update = true;
        }else{
            sql += "in (";
            for(var i=0;i<msgIds.length;i++){
                sql+="'";
                sql+=msgIds[i];
                sql+="'";
                if(i<msgIds.length-1){
                    sql+=",";
                }
            }
            sql+=")";
            update = true;
        }
        if(update){
            db.transaction((tx)=>{
                tx.executeSql(sql,[state,chatId],function () {
                    if(callback)
                        callback();
                },function (err) {
                    console.info(err);
                });
            });
        }
    }
};
Store._getLocalRecord = function (chatId,msgId,senderUid,callback) {
    var sql = "select * from record where chatId=? and msgId=? and ";
    if(senderUid)
        sql+="senderUid='"+senderUid+"' ";
    else
        sql+="senderUid is null ";
    sql+= "order by time";
    db.transaction((tx)=>{
        tx.executeSql(sql,[chatId,msgId],function (tx,results) {
            var rs = [];
            var len = results.rows.length;
            if(len>0){
                callback(results.rows.item(0));
            }else{
                callback()
            }
        },function (err) {
            console.info(err);
            callback()
        });
    });
};
Store._updateLocalGroupRecordState = function (chatId,msgIds,state,callback,reporterUid) {
    if(msgIds){
        var updateRS = function () {
            var sql = "update record set state=? where chatId=? ";
            sql+="and state<? ";
            sql+="and msgId "
            var update = false;
            if(typeof msgIds == "string"){
                sql += "='"
                sql += msgIds;
                sql += "'";
                update = true;
            }else{
                sql += "in (";
                for(var i=0;i<msgIds.length;i++){
                    sql+="'";
                    sql+=msgIds[i];
                    sql+="'";
                    if(i<msgIds.length-1){
                        sql+=",";
                    }
                }
                sql+=")";
                update = true;
            }
            if(update){
                db.transaction((tx)=>{
                    tx.executeSql(sql,[state,chatId,state],function () {
                        if(callback)
                            callback();
                    },function (err) {
                        console.info(err);
                    });
                });
            }
        }
        if(reporterUid){
            var sql;
            var params=[];
            if(isNaN(msgIds.length)){
                sql = "insert into record_state_report(chatId,msgId,reporterUid,state) values(?,?,?,?)"
                params[chatId,msgIds,reporterUid,state];

            }else{
                sql = "insert into record_state_report(chatId,msgId,reporterUid,state) values ";
                var params=[];
                for(var i=0;i<msgIds.length;i++){
                    var m = msgIds[i];
                    sql += "(?,?,?,?)";
                    if(i<msgIds.length-1){
                        sql +=",";
                    }
                    params.push(chatId);
                    params.push(m);
                    params.push(reporterUid);
                    params.push(state);
                }
            }
            db.transaction((tx)=>{
                tx.executeSql(sql,params,function () {
                    updateRS();
                },function (err) {
                    console.info(err);
                });
            });
        }else{
            updateRS();
        }




    }

};

Store._clearLocalRecords=function (callback) {
    db.transaction((tx)=>{
        tx.executeSql("delete from record",[],function () {
            deleteFolder(dirs.DocumentDir+"/images");
        },function (err) {
            console.info(err);
        });
        tx.executeSql("delete from record_state_report",[],function () {
        },function (err) {
            console.info(err);
        });
    });
};
Store._getLocalRecordStateReports=function (chatId,msgId,callback) {
    db.transaction((tx)=>{
        tx.executeSql("select * from record_state_report where chatId=? and msgId=?",[chatId,msgId],function (tx,results) {
            var rs = [];
            var len = results.rows.length;
            for(var i=0;i<len;i++){
                rs.push(results.rows.item(i));
            }
            callback(rs);
        },function (err) {
            console.info(err);
        });
    });
};

function deleteFolder(p) {
    RNFetchBlob.fs.exists(p).then((exists)=>{
        if(exists){
            RNFetchBlob.fs.ls(p).then(
                (files)=>{
                    if(files&&files.length>0){
                        files.forEach(function (f) {
                            var np = p+"/"+f;
                            RNFetchBlob.fs.isDir(np).then(
                                (isDir)=>{
                                    if(isDir){
                                        deleteFolder(np)
                                    }else{
                                        RNFetchBlob.fs.unlink(np).then().catch();
                                    }
                                }
                            ).catch()

                        })
                    }else{
                        RNFetchBlob.fs.unlink(p).then().catch();
                    }
                }
            ).catch();
        }
    }).catch();
}

export default Store;

//获取本地key，无key就引导下载，有则到主界面

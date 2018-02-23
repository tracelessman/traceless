/**
 * Created by renbaogang on 2017/10/30.
 */
import {
    AsyncStorage
} from 'react-native';
var Store = require("../store/Store");
Store.save2Local =function (key,value) {
    AsyncStorage.setItem(key,value,function (error) {
        if(error)
            console.info("store save error:"+error);
    });
};
Store.queryFromLocal=function (key,callback) {
    AsyncStorage.getItem(key,(err,result)=>{
        if(err){
            console.info("find local store err:"+err);
        }else{
            callback(result);
        }
    });
};
export default Store;

//获取本地key，无key就引导下载，有则到主界面

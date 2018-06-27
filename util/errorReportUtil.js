import WSChannel from "../channel/LocalWSChannel";
import {Alert} from "react-native";
import Store from "../store/LocalStore";
import DeviceInfo from 'react-native-device-info'
const config = require('../config')
const commonUtil = require('./commonUtil')
const RNFS = require('react-native-fs')

const errorReportUtil = {
    errorReport(option){
        let {errorStr,type,extra,level} = option
        if(Store.getCurrentUid() === config.spiritUid){
            Alert.alert("error",errorStr)
        }


        if(!__DEV__){
            if(!level){
                level = 0
            }
            if(!extra){
                extra = {}
            }
            let obj = {
                level,
                type,
                err:errorStr,
                name:Store.getCurrentName(),
                time:commonUtil.getTimeDisplay(),
                bundleId:DeviceInfo.getBundleId(),
                brand:DeviceInfo.getBrand(),
                systemVersion:DeviceInfo.getSystemVersion(),
                systemName:DeviceInfo.getSystemName(),
                versionLocal:require('../package').version,
                ...extra
            }
            let jsonStr = JSON.stringify(obj,null,5)

            WSChannel.errReport(jsonStr)
        }

        let obj = {
            time:commonUtil.getTimeDisplay(),
            errorStr,
        }
        RNFS.appendFile(config.errorLogPath, JSON.stringify(obj,null,5)+'\n', 'utf8').then((success) => {
        }).catch((err) => {
            if(__DEV__){
                console.log(err);
            }
        });
    }
}

module.exports = errorReportUtil

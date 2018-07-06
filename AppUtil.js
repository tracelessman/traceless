import JPushModule from 'jpush-react-native'
import {Platform, PushNotificationIOS, StyleSheet,Alert} from 'react-native'
import {Toast} from "native-base";
import WSChannel from "./channel/LocalWSChannel";
const _ = require('lodash')
let deviceIdApn,deviceIdApnPromise
import DeviceInfo from 'react-native-device-info'

import Store from "./store/LocalStore"
const config = require('./config')
import {downloadUpdate,switchVersion} from 'react-native-update'
const errorReportUtil = require("./util/errorReportUtil")
const netInfoUtil = require("./util/netInfoUtil")
const updateUtil = require("./util/updateUtil")
const pushUtil = require("./util/pushUtil")
const devUtil = require("./util/devUtil")


let AppUtil={
    setApp (app) {
        this.app = app;
    },
    reset (target) {
        this._target = target;
        this.app.reset();
    },
    getResetTarget () {
        return this._target;
    },
    clearResetTarget () {
        delete this._target;
    },
    isFreeRegister () {
        return true;
    },

    getAvatarSource(pic){
        let result
        if(pic){
            result = {uri:pic}
        }else{
            result = require('./images/defaultAvatar.png')
        }
        return result
    },
    //TODO 迁移到commonUtil,AppUtil只保留业务相关util
    debounceFunc(func,interval = 1000*2){
        return _.throttle(func,interval,{
            leading:true,
            trailing:false
        })
    },
    init(){
        Store.on("fetchAllKeys",(data)=>{
            let option = {
                name:null,
                uid:null
            }
            if(data && data[0]){
                const keyData = data[0]
                option = {
                    name:keyData.name,
                    uid:keyData.id
                }
                //获取id后再判断是否开发模式
                if(keyData.id === config.spiritUid || config.isPreviewVersion || __DEV__){
                    config.isDevMode = true

                }
            }
            updateUtil.checkUpdateGeneral(option)
        })
        errorReportUtil.init()
        updateUtil.init()
        netInfoUtil.init()
        pushUtil.init()
        devUtil.init()
    },


};
export default AppUtil;

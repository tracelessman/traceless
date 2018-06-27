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
    debounceFunc(func,interval = 1000*2){
        return _.throttle(func,interval,{
            leading:true,
            trailing:false
        })
    },
    init(){
        errorReportUtil.init()
        updateUtil.init()
        netInfoUtil.init()
        pushUtil.init()
    },


};
export default AppUtil;

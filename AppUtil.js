import JPushModule from 'jpush-react-native'
import {Platform, PushNotificationIOS, StyleSheet,Alert} from 'react-native'
import {Toast} from "native-base";
import WSChannel from "./channel/LocalWSChannel";
const _ = require('lodash')
let deviceIdApn,deviceIdApnPromise
import DeviceInfo from 'react-native-device-info'

import Store from "./store/LocalStore"
const config = require('./config')


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
    setJpush(option){
        if(Platform.OS === 'android'){
            const {clickHandler,tag} = option
            return new Promise((resolve,reject) =>{
                JPushModule.getRegistrationID(registrationId => {
                    JPushModule.setTags([tag], setTagResult => {
                        const {errorCode} = setTagResult
                        if(errorCode === 0){
                            JPushModule.notifyJSDidLoad(resultCode=>{
                                if(resultCode === 0){
                                    JPushModule.addReceiveNotificationListener((message) => {
                                        clickHandler(message)
                                    })
                                    const result = {
                                        registrationId
                                    }
                                    resolve(result)

                                }else{
                                    reject(new Error(`notifyJSDidLoad failed,resultCode is ${resultCode}`))
                                }
                            })
                        }else{
                            reject(new Error(`setTags failed,errorCode is ${errorCode}`))
                        }

                    })


                })

            })

        }
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
    getAPNDeviceId(){
        let result;
        if(Platform.OS === 'ios'){
            if(deviceIdApn){
                result = Promise.resolve(deviceIdApn)
            }else{
                result = deviceIdApnPromise
            }

        }else{
            result = Promise.resolve(null)
        }


        return result
    },
    iosPushInit(){
        return new Promise(resolve=>{
            PushNotificationIOS.addEventListener('register', (deviceId) => {

                deviceIdApn = deviceId
                this.deviceIdApn = deviceIdApn
                resolve(deviceId)
            });

            PushNotificationIOS.getInitialNotification().then(res=>{
                // console.log(res)

            })
            PushNotificationIOS.getApplicationIconBadgeNumber(num=>{
                // console.log(num)

            })
            PushNotificationIOS.checkPermissions((permissions) => {
                const {alert,sound,badge} = permissions

                if(alert === 0 && sound === 0 && badge === 0){
                    PushNotificationIOS.requestPermissions().then(res=>{

                    })
                }else{
                    PushNotificationIOS.addEventListener('notification', (res) => {

                    });
                    PushNotificationIOS.requestPermissions().then(res=>{

                    })
                }
            });
        })
    },
    init(){
        if(Platform.OS === 'ios'){
            deviceIdApnPromise = this.iosPushInit()
            this.removeNotify()
        }

        WSChannel.on("badnetwork",()=>{
            Toast.show({
                text: '网络不给力',
                position: "top",
                type:"warning",
                duration: 5000
            })
        })

        console.ignoredYellowBox = ['Setting a timer','Remote debugger']

        require('ErrorUtils').setGlobalHandler(function (err) {

            console.log(err)
            if(Store.getCurrentUid() === config.spiritUid){
                Alert.alert("error",err.toString())
            }

            let obj = {
                err:err.toString(),
                name:Store.getCurrentName(),
                time:`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
                bundleId:DeviceInfo.getBundleId(),
                brand:DeviceInfo.getBrand(),
                systemVersion:DeviceInfo.getSystemVersion(),
                systemName:DeviceInfo.getSystemName(),
                versionLocal:require('./package').version,
                stack:err.stack,
            }
            let jsonStr = JSON.stringify(obj,null,5)
            WSChannel.errReport(jsonStr)
        });
    },
    removeNotify(){
        if(Platform.OS === 'ios'){
            PushNotificationIOS.removeAllDeliveredNotifications();
            PushNotificationIOS.setApplicationIconBadgeNumber(0)
        }
    },
    deviceIdApn:null
};
export default AppUtil;

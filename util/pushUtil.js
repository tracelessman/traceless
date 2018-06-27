import {Platform, PushNotificationIOS} from "react-native";
import JPushModule from "jpush-react-native/index";
const errorReportUtil = require('./errorReportUtil')
let deviceIdApn,deviceIdApnPromise


const pushUtil = {
    deviceIdApn:null,
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
                                    errorReportUtil.errorReport({
                                        type:"setJpush",
                                        errorStr:`notifyJSDidLoad failed,resultCode is ${resultCode}`,
                                    })
                                }
                            })
                        }else{
                            errorReportUtil.errorReport({
                                type:"setJpush",
                                errorStr:`setTags failed,errorCode is ${errorCode}`,
                            })
                        }
                    })
                })
            })
        }
    },
    init(){
        if(Platform.OS === 'ios'){
            deviceIdApnPromise = this.iosPushInit()
            this.removeNotify()
        }
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
                }
            });
        })
    },
    removeNotify(){
        if(Platform.OS === 'ios'){
            PushNotificationIOS.removeAllDeliveredNotifications();
            PushNotificationIOS.setApplicationIconBadgeNumber(0)
        }
    },
}

module.exports = pushUtil

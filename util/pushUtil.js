import {Platform, PushNotificationIOS} from "react-native";
import JPushModule from "jpush-react-native/index";
const errorReportUtil = require('./errorReportUtil')
import {Toast} from 'native-base'
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
            //必须要调用requestPermissions,否则无法接受到register事件获取deviceId
            PushNotificationIOS.requestPermissions().then(res=>{

            })
            deviceIdApnPromise = this.iosPushInit()

            PushNotificationIOS.getInitialNotification().then(res=>{
                //TODO 跳转到指定聊天窗口
            })

            this.removeNotify()

            // PushNotificationIOS.addEventListener('notification', (res) => {
            //
            // });
            PushNotificationIOS.checkPermissions((permissions) => {
                const {alert,sound,badge} = permissions

                if(alert === 0 && sound === 0 && badge === 0){
                    PushNotificationIOS.requestPermissions().then(res=>{
                        Toast.show({
                            text: '请在通知中心中允许LK发送通知',
                            position: "top",
                            type:"warning",
                            duration: 10000
                        })
                    })

                }else{

                }
            });
            PushNotificationIOS.addEventListener('registrationError', (reason) => {
                errorReportUtil.errorReport({
                    errorStr:JSON.stringify(reason),
                    type:"registrationError",
                    level:10
                })
            });
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
                if(__DEV__ && Platform.OS === 'ios'){
                    console.log(`deviceId APN: ${deviceId}`)

                }

                deviceIdApn = deviceId
                this.deviceIdApn = deviceIdApn

                resolve(deviceId)
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

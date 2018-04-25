import JPushModule from 'jpush-react-native'
import {Platform, StyleSheet} from 'react-native'

var AppUtil={
    setApp:function (app) {
        this.app = app;
    },
    reset:function (target) {
        this._target = target;
        this.app.reset();
    },
    getResetTarget:function () {
        return this._target;
    },
    clearResetTarget:function () {
        delete this._target;
    },
    isFreeRegister:function () {
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
    }
};
export default AppUtil;

import {
    NetInfo, Platform
} from 'react-native'
import WSChannel from "../channel/LocalWSChannel";
import {Toast} from "native-base";
const errorReportUtil = require('./errorReportUtil')
const commonUtil = require('./commonUtil')
const devUtil = require('./devUtil')
import Store from "../store/LocalStore"
const state = require('../state')

const netInfoUtil = {
    init(){
        NetInfo.addEventListener('connectionChange', (connectionInfo)=> {
             const {type} = connectionInfo
                if(type === 'none'||type === 'unknown'){
                 this.online = false

                }else{
                  this.online = true
                }
             }
        );
        WSChannel.on("badnetwork",()=>{
            if(this.online){
                const timeDiff = Math.abs(state.reOpenTime.getTime() - new Date())
                devUtil.debugToLog(timeDiff)

                if(timeDiff > 1000*60){
                    // Toast.show({
                    //     text: '网络不给力',
                    //     position: "top",
                    //     type:"warning",
                    //     duration: 5000
                    // })
                    // errorReportUtil.errorReport({
                    //     errorStr:`can not connect to ${Store.getCurrentServer()}`,
                    //     type:"badnetwork",
                    //     level:10
                    // })
                }
                Toast.show({
                    text: '网络不给力',
                    position: "top",
                    type:"warning",
                    duration: 5000
                })
                errorReportUtil.errorReport({
                    errorStr:`can not connect to ${Store.getCurrentServer()}`,
                    type:"badnetwork",
                    level:10
                })
            }else{
                this.informNoConnection()
            }

        })
    },

    //todo:应该放在状态管理里
    online:true,
    webConnet(func,offlineCb){
        if(this.online){
            func()
        }else{
            commonUtil.runFunc(offlineCb)
            this.informNoConnection()
        }
    },
    informNoConnection:commonUtil.debounceFunc(()=>{
        Toast.show({
            text: '无法连接网络,请检查网络设置',
            position: "top",
            type:"warning",
            duration: 5000
        })
    },1000*60),
    httpPost(option){
        const {offlineCb,url,param} = option

        return new Promise(resolve=>{
            this.webConnet(()=>{
                fetch(url, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(param),
                }).then(response=>{
                    let result = response.json()
                    resolve(result)
                }).catch(error=>{
                    errorReportUtil.errorReportForError({
                        error,
                        type:"httpPost",
                        extra:{
                            url,
                            param
                        }
                    })
                })
            },offlineCb)
        })
    }
}

module.exports = netInfoUtil

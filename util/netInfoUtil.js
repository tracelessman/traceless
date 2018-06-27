import {
    NetInfo
} from  'react-native'
import WSChannel from "../channel/LocalWSChannel";
import {Toast} from "native-base";
const errorReportUtil = require('./errorReportUtil')
import Store from "../store/LocalStore"

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
                Toast.show({
                    text: '无法连接网络,请检查网络设置',
                    position: "top",
                    type:"warning",
                    duration: 5000
                })
            }

        })
    },
    online:true
}

module.exports = netInfoUtil

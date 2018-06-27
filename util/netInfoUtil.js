import {
    NetInfo
} from  'react-native'

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
    },
    online:true
}

module.exports = netInfoUtil

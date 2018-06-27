import {Toast} from "native-base";

const config = require('../config')
import {downloadUpdate,switchVersion,isFirstTime,isRolledBack,markSuccess} from 'react-native-update'
import DeviceInfo from 'react-native-device-info'
import {Platform, PushNotificationIOS, StyleSheet,Alert} from 'react-native'
const errorReportUtil = require('./errorReportUtil')


const updateUtil = {
    checkUpdateGeneral:async function(option){
        const {name,uid,beforeUpdate,noUpdateCb} = option
        const result = await fetch(config.checkUpdateUrl, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                os:Platform.OS,
                bundleId:DeviceInfo.getBundleId(),
                uniqueId:DeviceInfo.getUniqueID(),
                uid,
                versionLocal:require('../package').version,
                isPreviewVersion:config.isPreviewVersion,
                buildNumberClient:DeviceInfo.getBuildNumber(),
            }),
        }).then(response=>{
            return response.json()
        })

        const {needUpdate,isForce,hash,os,isHotUpdate,apkUrl,manifestUrl,
            ppkUrl,manualDownloadUrl,isPreviewVersion,fileName,updatePlatform,newVersion,serverVersion} = result
        if(needUpdate){
            // if(beforeUpdate){
            //     await beforeUpdate()
            // }
            // this._update(result)
            if(isHotUpdate){
                let options = {
                    updateUrl: ppkUrl,
                    hash,  //hash必须是字符串
                    update : true
                }
                downloadUpdate(options).then(hash => {
                    switchVersion(hash)
                }).catch(error => {
                    Toast.show({
                        text: '下载更新出现错误,请联系技术人员',
                        position: "top",
                        type:"warning",
                        duration: 5000
                    })
                    Alert.alert(
                        '提示',
                        `下载更新出现错误,请联系技术人员`,
                        [
                            {
                                text: '确认',
                                onPress:()=>{
                                    this.setState({mode:'ready'});
                                }

                            },
                        ],
                        { cancelable: false }
                    )

                });
            }else{

            }
        }else{
            if(noUpdateCb){
                noUpdateCb()
            }
        }
    },
    _update(result){
        const {needUpdate,isForce,hash,os,isHotUpdate,apkUrl,manifestUrl,
            ppkUrl,manualDownloadUrl,isPreviewVersion,fileName,updatePlatform,newVersion,serverVersion} = result
        const optionAry =  [
            {text: '取消', onPress: () =>{}, style: 'cancel'},
            {
                text: '确认',
                onPress:()=>{

                }
            },
        ]
        if(isForce){
            optionAry.shift()
        }
        Alert.alert(
            '提示',
            `有最新版本${newVersion},是否马上升级?`,
            optionAry,
            { cancelable: false }
        )
    },
    init(){
        if(isFirstTime){
            try{
                markSuccess()
            }catch(err){
                Alert.alert(err.toString())
            }
        }
        if(isRolledBack){
            errorReportUtil.errorReport({
                type:"isRolledBack",
                errorStr:"isRolledBack",
                level:10
            })
        }
    }
}

module.exports = updateUtil

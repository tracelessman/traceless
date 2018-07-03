import React, {Component} from 'react';
import {
    AsyncStorage,
    NativeModules,
    Platform,
    StyleSheet,
    View,Alert
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Store from "../store/LocalStore";
const uuid = require('uuid/v4')
import {Button, Icon, Text, Toast} from 'native-base'
const {debounceFunc} = require("../util")
const netInfoUtil = require("../util/netInfoUtil")
const config = require('../config')
import RNFetchBlob from 'react-native-fetch-blob'

export default class DataQrView extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount = () => {

    }

    componentWillUnmount = () => {
    }


    componentWillUnmount = () => {

    }

    render() {
        const msg = {

        }

        msg.name = Store.keyData.name;
        msg.id = Store.keyData.id;
        msg.publicKey = Store.keyData.publicKey;
        msg.privateKey = Store.keyData.privateKey;
        msg.serverPublicKey = Store.keyData.serverPublicKey;
        msg.server = Store.keyData.server;
        msg.friends = Store.keyData.friends;
        msg.groups = Store.keyData.groups;
        msg.pic = Store.keyData.pic;
        const data = {
            uid:msg.id
        }

        return (
            <View  style={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:60}}>
                <QRCode size={240}
                        color='#393a3f'
                        value={JSON.stringify(data)}
                        logoBackgroundColor='transparent'
                />
                <View style={{marginVertical:20}}>
                    <Button iconLeft  info onPress={debounceFunc(()=>{
                        const tmpFilePath =  `${RNFetchBlob.fs.dirs.CacheDir}/${Store.getCurrentUid()}.json`
                        RNFetchBlob.fs.writeFile(tmpFilePath,JSON.stringify(msg), 'utf8')
                            .then(()=>{
                                const uploadUrl = config.url+"/uploadData"

                                RNFetchBlob.fetch('POST', uploadUrl, {
                                    'Content-Type' : 'multipart/form-data',
                                }, [
                                    // element with property `filename` will be transformed into `file` in form data
                                    { name :"json", filename : `${Store.getCurrentUid()}.json`,  data:RNFetchBlob.wrap(tmpFilePath)},
                            ]).then((resp) => {
                                    console.log(resp)
                                    Alert.alert("success")

                                }).catch((err) => {
                                    console.log(err)
                                    Alert.alert("error")


                                })
                            })

                    })}>
                        <Icon name='ios-arrow-round-up-outline' />
                        <Text>上传</Text>
                    </Button>
                </View>

            </View>

        );
    }

}


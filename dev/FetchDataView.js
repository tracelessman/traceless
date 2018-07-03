import React, {Component} from 'react';
import {
    AsyncStorage,
    NativeModules,
    Platform,
    StyleSheet, Text,
    View,Modal,Alert
} from 'react-native';
import ScanView from '../common/ScanView'
import RNFetchBlob from "react-native-fetch-blob";
import Store from "../store/LocalStore";
const config = require('../config')

export default class FetchDataView extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            visible:true
        };
    }

    componentDidMount = () => {

    }

    componentWillUnmount = () => {
    }


    componentWillUnmount = () => {

    }

    render() {
        return (
            <View>
                <Modal visible={this.state.visible}
                       onRequestClose={()=>{
                           this.setState({visible:false})
                       }}
                >
                    <ScanView onCancel={()=>{
                        this.setState({
                            visible:false
                        })
                        this.props.navigation.goBack()
                    }} onRead={(e)=>{

                        const {data} = e

                        const {uid,clientId} = JSON.parse(data)
                        const tmpFilePath =  `${RNFetchBlob.fs.dirs.CacheDir}/${uid}.json`
                        // this.setState({
                        //     visible:false
                        // })
                        // this.props.navigation.goBack()
                        RNFetchBlob.config({
                            useDownloadManager : true,
                            fileCache : true,
                            path:tmpFilePath
                        }).fetch('GET',`${config.url}/upload/${uid}.json`).then((res)=>{
                            RNFetchBlob.fs.readFile(tmpFilePath, 'utf8')
                                .then((data) => {
                                    let keyData = JSON.parse(data)
                                    console.log(keyData)
                                    this.setState({
                                        visible:false
                                    })
                                    keyData.clientId = clientId
                                    Store.data.splice(0,1,keyData);
                                    Store._save();

                                    this.props.navigation.goBack()

                                })


                        }).catch(err=>{
                            console.log(err)
                            Alert.alert('error')
                        })

                    }}></ScanView>
                </Modal>

            </View>
        );
    }

}


import React, { Component} from 'react';
import {
    Alert,AlertIOS,Clipboard,Dimensions,Image,Platform,StyleSheet,Switch,TextInput,ToastAndroid,TouchableOpacity,View
} from 'react-native';
import { Avatar,Card ,List,ListItem,} from 'react-native-elements'
import {Button,Icon,Text} from 'native-base'
const versionLocal = require('../package').version
import AppUtil from "../AppUtil"
const RNFS = require('react-native-fs');
import DeviceInfo from 'react-native-device-info'
console.log(RNFS.MainBundlePath)


export default class VersionView extends Component<{}> {

    constructor(props) {
        super(props);

        this.uid = props.navigation.state.params.uid
    }

    render() {
        console.log(AppUtil.deviceIdApn)
        const {width} = Dimensions.get('window')


        return (
            <View style={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:40,}}>
                <Card title="个人身份唯一标识" style={{}}>
                    <View style={{flexDirection:"column",marginHorizontal:5,marginTop:20,justifyContent:'center',alignItems:'flex-start'}}>
                        <Text selectable style={{fontSize:width/28}} >
                           当前版本:{versionLocal}
                        </Text>
                        <Text selectable style={{fontSize:width/28}} >
                            设备标识:{AppUtil.deviceIdApn}
                        </Text>
                        <Text selectable style={{fontSize:width/28}} >
                            文件路径:{RNFS.MainBundlePath}
                        </Text>
                        <Text selectable style={{fontSize:width/28}} >
                            bundleId:{DeviceInfo.getBundleId()}
                        </Text>
                        <View>
                            <Button iconLeft  info>
                                <Icon name='refresh' />
                                <Text>检查更新</Text>
                            </Button>
                        </View>
                    </View>
                </Card>

            </View>);

    }
}

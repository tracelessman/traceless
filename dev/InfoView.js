import React, { Component} from 'react';
import {
    Alert,AlertIOS,Clipboard,Dimensions,Image,Platform,StyleSheet,Switch,Text,TextInput,ToastAndroid,TouchableOpacity,View,ScrollView
} from 'react-native';
import { Avatar, Button,Card,Icon ,List,ListItem,} from 'react-native-elements'
import Store from "../store/LocalStore"
const pushUtil = require("../util/pushUtil")
import DeviceInfo from 'react-native-device-info'
const config = require('../config')

export default class InfoView extends Component<{}> {

    constructor(props) {
        super(props);
    }

    render() {
        const {width} = Dimensions.get('window')


        return (
            <ScrollView>
                <View style={{display:'flex',justifyContent:'flex-start',alignItems:'flex-start',marginVertical:40,}}>
                    <Card title="" style={{}}>
                        <View style={{marginHorizontal:5,marginTop:20,justifyContent:'flex-start',alignItems:'flex-start'}}>
                            <Text selectable style={{}} >
                                deviceIdAPN:{pushUtil.deviceIdApn}
                            </Text>
                        </View>
                        <View style={{marginHorizontal:5,marginTop:20,justifyContent:'flex-start',alignItems:'flex-start'}}>
                            <Text selectable style={{}} >
                                clientId:{Store.getClientId()}
                            </Text>
                        </View>
                        <View style={{marginHorizontal:5,marginTop:20,justifyContent:'flex-start',alignItems:'flex-start'}}>
                            <Text selectable style={{}} >
                                bundleId:{DeviceInfo.getBundleId()}
                            </Text>
                        </View>
                        <View style={{marginHorizontal:5,marginTop:20,justifyContent:'flex-start',alignItems:'flex-start'}}>
                            <Text selectable style={{}} >
                                开发状态:{__DEV__?"是":"否"}
                            </Text>
                        </View>
                        <View style={{marginHorizontal:5,marginTop:20,justifyContent:'flex-start',alignItems:'flex-start'}}>
                            <Text selectable style={{}} >
                                预览模式:{config.isPreviewVersion?"是":"否"}
                            </Text>
                        </View>
                        <View style={{marginHorizontal:5,marginTop:20,justifyContent:'flex-start',alignItems:'flex-start'}}>
                            <Text selectable style={{}} >
                                开发模式:{config.isDevMode?"是":"否"}
                            </Text>
                        </View>
                        <View style={{marginHorizontal:5,marginTop:20,justifyContent:'flex-start',alignItems:'flex-start'}}>
                            <Text selectable style={{}} >
                                uniqueId:{DeviceInfo.getUniqueID()}
                            </Text>
                        </View>
                        <View style={{marginHorizontal:5,marginTop:20,justifyContent:'flex-start',alignItems:'flex-start'}}>
                            <Text selectable style={{}} >
                                原生版本:{DeviceInfo.getVersion()}
                            </Text>
                        </View>
                        <View style={{marginHorizontal:5,marginTop:20,justifyContent:'flex-start',alignItems:'flex-start'}}>
                            <Text selectable style={{}} >
                                buildNumber:{DeviceInfo.getBuildNumber()}
                            </Text>
                        </View>
                    </Card>


                </View>
            </ScrollView>
            );

    }
}

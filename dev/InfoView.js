import React, { Component} from 'react';
import {
    Alert,AlertIOS,Clipboard,Dimensions,Image,Platform,StyleSheet,Switch,Text,TextInput,ToastAndroid,TouchableOpacity,View
} from 'react-native';
import { Avatar, Button,Card,Icon ,List,ListItem,} from 'react-native-elements'
import Store from "../store/LocalStore"
const pushUtil = require("../util/pushUtil")
import DeviceInfo from 'react-native-device-info'

export default class InfoView extends Component<{}> {

    constructor(props) {
        super(props);
    }

    render() {
        const {width} = Dimensions.get('window')


        return (
            <View style={{display:'flex',justifyContent:'flex-start',alignItems:'flex-start',marginTop:40,}}>
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
                            开发模式:{__DEV__?"是":"否"}
                        </Text>
                    </View>
                    <View style={{marginHorizontal:5,marginTop:20,justifyContent:'flex-start',alignItems:'flex-start'}}>
                        <Text selectable style={{}} >
                            uniqueId:{DeviceInfo.getUniqueID()}
                        </Text>
                    </View>
                </Card>

            </View>);

    }
}

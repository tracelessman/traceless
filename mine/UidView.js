import React, { Component} from 'react';
import {
    Alert,AlertIOS,Clipboard,Dimensions,Image,Platform,StyleSheet,Switch,Text,TextInput,ToastAndroid,TouchableOpacity,View
} from 'react-native';
import { Avatar, Button,Card,Icon ,List,ListItem,} from 'react-native-elements'
import Store from "../store/LocalStore"

export default class UidView extends Component<{}> {

    constructor(props) {
        super(props);
    }

    render() {
        const {width} = Dimensions.get('window')


        return (
            <View style={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:40,}}>
                <Card title="个人身份唯一标识" style={{}}>
                    <View style={{marginHorizontal:5,marginTop:20,justifyContent:'center',alignItems:'center'}}>
                        <Text selectable style={{fontSize:width/28}} >
                            {Store.getCurrentUid()}
                        </Text>
                    </View>
                </Card>

            </View>);

    }
}

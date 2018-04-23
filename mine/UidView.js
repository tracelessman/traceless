import React, { Component} from 'react';
import {
    Text,View,Image,TouchableOpacity,Switch,TextInput,StyleSheet,Alert,Clipboard,ToastAndroid,Platform,AlertIOS,Dimensions
} from 'react-native';
import { List, ListItem,Avatar,Card ,Icon,Button,} from 'react-native-elements'

export default class QrcodeView extends Component<{}> {

    constructor(props) {
        super(props);

        this.uid = props.navigation.state.params.uid
    }

    render() {
        const {width} = Dimensions.get('window')


        return (
            <View style={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:40,}}>
                <Card title="个人身份唯一标识" style={{}}>
                    <View style={{marginHorizontal:5,marginTop:20,justifyContent:'center',alignItems:'center'}}>
                        <Text selectable style={{fontSize:width/28}} >
                            {this.uid}
                        </Text>
                    </View>
                </Card>

            </View>);

    }
}

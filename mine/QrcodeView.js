/**
 * Created by renbaogang on 2018/2/8.
 */
import React, { Component} from 'react';
import { Text,View,Image,TouchableOpacity,Button,Switch,TextInput,StyleSheet} from 'react-native';
import Camera from 'react-native-camera';
import Store from "../store/LocalStore"
import QRCode from 'react-native-qrcode-svg';


        export default class QrcodeView extends Component<{}> {

            constructor(props) {
                super(props);

      this.info = props.navigation.state.params
    }

    render() {
        return (
            <View style={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:40}}>
                <View style={{margin:20}}>
                    <Text>
                        扫一扫添加好友吧
                    </Text>
                </View>
                <QRCode size={240}
                        color='#393a3f'
                    value={JSON.stringify(this.info.qrcode)}
                    logo={{uri:this.info.avatarUrl}}
                        logoSize={60}
                        logoBackgroundColor='transparent'
                        />


            </View>);

    }
}

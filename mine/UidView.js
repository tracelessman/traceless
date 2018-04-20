import React, { Component} from 'react';
import {
    Text,View,Image,TouchableOpacity,Switch,TextInput,StyleSheet,Alert,Clipboard,ToastAndroid,Platform,AlertIOS
} from 'react-native';
import { List, ListItem,Avatar,Card ,Icon,Button,} from 'react-native-elements'

export default class QrcodeView extends Component<{}> {

    constructor(props) {
        super(props);

        this.uid = props.navigation.state.params.uid
    }

    render() {
        return (
            <View style={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:40}}>
                <Card title="个人身份唯一标识">
                    <View style={{marginHorizontal:5,marginTop:20,justifyContent:'center',alignItems:'center'}}>
                        <Text selectable>
                            {this.uid}
                        </Text>
                        <Button
                            title="复制"
                            titleStyle={{ fontWeight: "700" }}
                            buttonStyle={{
                                backgroundColor: "#2d8cf0",
                                width: 100,
                                height: 35,
                                borderColor: "transparent",
                                borderWidth: 0,
                                borderRadius: 5,
                                margin:25
                            }}
                            containerStyle={{ marginTop: 20 }}
                            onPress={()=>{
                                Clipboard.setString(this.uid)
                                if(Platform.OS === 'android'){
                                    ToastAndroid.show('标识已复制到剪贴板', ToastAndroid.SHORT);
                                }else{
                                    AlertIOS.alert(
                                        '提示',
                                        '标识已复制到剪贴板',
                                    );
                                }
                            }}
                        />

                    </View>
                </Card>

            </View>);

    }
}

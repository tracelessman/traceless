/**
 * Created by renbaogang on 2017/10/31.
 */

import React, { Component } from 'react';
import {
    Text,
    View,TextInput,TouchableOpacity,Modal
} from 'react-native';
import Store from "../store/LocalStore"
import AppUtil from "../AppUtil"


export default class MineView extends Component<{}> {



    constructor(props){
        super(props);
    }

    reset=()=>{
        Store.reset();
        AppUtil.reset();
    }

    clear=()=>{
        Store.clear();
        AppUtil.reset();
    }

    showScanView=()=>{
        this.props.navigation.navigate("ScanView");
    }

    render() {
        return (
            <View style={{flex:1,flexDirection:"column",justifyContent:"flex-start",alignItems:"center",backgroundColor:"#ffffff"}}>
                <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                    <Text>标识：  </Text><TextInput style={{flex:1,color:"gray"}} underlineColorAndroid='transparent' defaultValue={Store.getCurrentUid()} editable={false} />
                </View>
                <View style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>
                <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                    <Text>昵称：  </Text><TextInput  style={{flex:1,color:"gray"}} underlineColorAndroid='transparent' defaultValue={Store.getCurrentName()} editable={false} />
                </View>
                <View style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>
                <TouchableOpacity onPress={this.clear} style={{width:"100%",flexDirection:"row",justifyContent:"center"}}>
                    <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                        <Text>清除本地聊天缓存  </Text>
                    </View>
                </TouchableOpacity>
                <View style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>
                <TouchableOpacity onPress={this.reset} style={{width:"100%",flexDirection:"row",justifyContent:"center"}}>
                    <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                        <Text>重置  </Text>
                    </View>
                </TouchableOpacity>
                <View style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>
                <TouchableOpacity onPress={this.showScanView} style={{width:"100%",flexDirection:"row",justifyContent:"center"}}>
                    <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                        <Text>授权其他设备  </Text>
                    </View>
                </TouchableOpacity>
                <View style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>
            </View>
        );
    }

}

import React, { Component} from 'react';
import { Button,Image,StyleSheet,Switch,Text,TextInput,TouchableOpacity,View} from 'react-native';
import Camera from 'react-native-camera';
import Store from "../store/LocalStore"
import { NetworkInfo } from 'react-native-network-info';
const util = require('../util')
const {debounceFunc} = util

export default class ScanView extends Component<{}> {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>

                <Camera
                    onBarCodeRead={debounceFunc((e)=>{this.props.onRead(e)},1000*2)}
                    style={styles.preview}
                    aspect={Camera.constants.Aspect.full}>
                    <View style={{flex:1,backgroundColor:"#000",opacity:0.5,width:"100%"}}/>
                    <View style={{width:"100%",height:250,flexDirection:"row",justifyContent:"space-between"}}>
                        <View style={{flex:1,backgroundColor:"#000",opacity:0.5,height:"100%"}}/>
                        <View style={{width:250,height:250,borderWidth:1,borderColor:"#f0f0f0",borderStyle:"dotted"}}>
                            <View style={{width:15,height:15,borderLeftWidth:2,borderTopWidth:2,borderColor:"#f9e160"}}/>
                            <View style={{width:15,height:15,borderTopWidth:2,borderRightWidth:2,borderColor:"#f9e160",right:0,position:"absolute"}}/>
                            <View style={{width:15,height:15,borderLeftWidth:2,borderBottomWidth:2,borderColor:"#f9e160",bottom:0,position:"absolute"}}/>
                            <View style={{width:15,height:15,borderRightWidth:2,borderBottomWidth:2,borderColor:"#f9e160",bottom:0,right:0,position:"absolute"}}/>
                        </View>
                        <View style={{flex:1,backgroundColor:"#000",opacity:0.5,height:"100%"}}/>
                    </View>
                    <TouchableOpacity onPress={this.props.onCancel} style={{
                        flex: 2,
                        backgroundColor: "#000",
                        opacity: 0.5,
                        width: "100%",
                        flexDirection: "column",
                        justifyContent: "center"
                    }}><Text style={{color: "white", textAlign: "center",fontSize:18}}>取  消</Text></TouchableOpacity>

                </Camera>
            </View>);

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    preview: {
        flex: 1,
        flexDirection: 'column',
        justifyContent:'center',
        alignItems:'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40
    }
});

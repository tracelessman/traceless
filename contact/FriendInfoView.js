/**
 * Created by renbaogang on 2017/11/3.
 */

import React, { Component } from 'react';
import {
    Button,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import  WSChannel from '../channel/LocalWSChannel'
import AppUtil from "../AppUtil";
const {getAvatarSource} = AppUtil
import { Avatar, Card,Icon,List ,ListItem} from 'react-native-elements'


export default class FriendInfoView extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {};
        this.friend = this.props.navigation.state.params.friend;
        console.log(this.friend)
    }

    sendMessage=()=>{
        //this.props.navigation.navigate("MainTabView");
        AppUtil.reset({view:"ChatView",param:{friend:this.friend}});
    }

    render() {
        let friend = this.friend;
        return (

            <View style={{flex:1,flexDirection:"column",justifyContent:"flex-start",alignItems:"center",backgroundColor:"#ffffff"}}>
<Image source={getAvatarSource(this.friend.pic)}
style={{margin:10,width:100,height:100,borderRadius:5}} resizeMode="contain"></Image>


                <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                    <Text>标识：</Text><Text>{friend.id}</Text>
                </View>
                <View style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>
                <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                    <Text>昵称：</Text><Text>{friend.name}</Text>
                </View>
                <View style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>
                <TouchableOpacity onPress={this.sendMessage} style={{marginTop:30,width:"90%",height:40,borderColor:"gray",borderWidth:1,borderRadius:5,flex:0,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
                    <Text style={{fontSize:18,textAlign:"center",color:"gray"}}>发消息</Text>
                </TouchableOpacity>
             </View>
        );
    }
}

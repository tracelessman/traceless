/**
 * Created by renbaogang on 2018/3/20.
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    TextInput,
    ScrollView,
    Button,
    Image,
    TouchableOpacity,Modal,Keyboard,Animated,Platform,Dimensions,WebView
} from 'react-native';
import Store from "../store/LocalStore";
import WSChannel from "../channel/LocalWSChannel";
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'react-native-fetch-blob';
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class GroupMsgStateView extends Component<{}> {
    constructor(props) {
        super(props);

    }

    getIconNameByState=function (state) {
        if(state===0){
            return "md-arrow-round-up";
        }else if(state===1){
            return "md-refresh";
        }else if(state===2){
            return "md-checkmark-circle-outline";
        }else if(state===3){
            return "ios-checkmark-circle-outline";
        }else if(state===4){
            return "ios-mail-open-outline";
        }else if(state===5){
            return "ios-bonfire-outline";
        }
        return "ios-help"
    }

    render(){
        var gid = this.props.navigation.state.params.gid;
        var msgId = this.props.navigation.state.params.msgId;
        var members = Store.getGroup(gid).members;
        var rec = Store.getGroupChatRecord(gid,msgId);

        var friends = [];
        for(var i=0;i<members.length;i++){
            var f = members[i];
            if(f.uid!=Store.getCurrentUid()){
                var state = rec.states[f.uid]||rec.state;
                var iconName = this.getIconNameByState(state);
                friends.push(<TouchableOpacity key={i}  style={{width:"100%",flexDirection:"row",justifyContent:"center"}}>
                    <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                        <Text>    {f.name}  </Text>
                        <Ionicons name={iconName} size={20}  style={{marginRight:5,lineHeight:40}}/>
                    </View>
                </TouchableOpacity>);
                friends.push(<View key={i+"line"} style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>);
            }
        }
        return (
            <View style={{flex:1,flexDirection:"column",justifyContent:"flex-start",alignItems:"center",backgroundColor:"#ffffff"}}>

                {friends}
            </View>
        );
    }
}
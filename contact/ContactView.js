/**
 * Created by renbaogang on 2017/10/31.
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    TouchableOpacity
} from 'react-native';
import Store from '../store/LocalStore'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class ContactView extends Component<{}> {


    static navigationOptions =({ navigation, screenProps }) => (

        {
         headerRight: <TouchableOpacity onPress={()=>{ navigation.navigate("AddContactView",{ContactView:navigation.state.params.ContactView})}}
             style={{marginRight:20}}>
             <Icon name="plus" size={22} />
         </TouchableOpacity>
        }
    );

    constructor(props){
        super(props);
        this.props.navigation.setParams({
            ContactView:this
        });
        //有新的好友请求时更新界面
        Store.on("receiveMKFriends",()=>{
            this.setState({update:true});
        });
        Store.on("readNewMKFriends",()=>{
            this.setState({update:true});
        });
        Store.on("addFriend",()=>{
            this.setState({update:true});
        }) ;
    }

    go2RequireListView=()=>{
        this.props.navigation.navigate("RequireListView",{ContactView:this});
    }

    go2FriendInfoView=(f)=>{
        this.props.navigation.navigate("FriendInfoView",{ContactView:this,friend:f});
    }



    render() {
        var friends = [];
        var all = Store.getAllFriends();
        for(var i=0;i<all.length;i++){
            var f = all[i];
            friends.push(<TouchableOpacity key={i} onPress={()=>{this.go2FriendInfoView(f)}} style={{width:"100%",flexDirection:"row",justifyContent:"center"}}>
                <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                    <Text>    {f.name}  </Text>
                </View>
            </TouchableOpacity>);
            friends.push(<View key={i+"line"} style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>);

        }
        return (
            <View style={{flex:1,flexDirection:"column",justifyContent:"flex-start",alignItems:"center",backgroundColor:"#ffffff"}}>
                <TouchableOpacity onPress={this.go2RequireListView} style={{width:"100%",flexDirection:"row",justifyContent:"center"}}>
                    <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                        <Icon name="call-received" size={16} /><Text> 好友请求  </Text><Text style={{color:"red",fontStyle: 'italic', fontSize: 11}}>{Store.hasNewReceivedMKFriends()?"new":""}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>
                {friends}
            </View>
        );
    }

}
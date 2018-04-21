/**
 * Created by renbaogang on 2017/10/31.
 */


import React, { Component } from 'react';
import {
    Text,
    View,Image,
    TouchableOpacity
} from 'react-native';
import AppUtil from "../AppUtil"
import Store from "../store/LocalStore"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class RecentView extends Component<{}> {

    static navigationOptions =({ navigation, screenProps }) => (

        {
            // headerStyle: {
            //     backgroundColor: '#434343'
            // },
            // headerTintColor: '#ffffff',
            headerRight:<TouchableOpacity onPress={()=>{navigation.navigate("AddGroupView")}}
                                          style={{marginRight:20}}>
                <Icon name="account-multiple-plus" size={22} />
            </TouchableOpacity>,
        }
    );

    constructor(props){
        super(props);
    }

    update=(fromId)=>{
        this.setState({update:true});
    }

    componentWillMount =()=> {
        Store.on("receiveMessage",this.update);
        Store.on("readChatRecords",this.update);
        Store.on("readGroupChatRecords",this.update);
        Store.on("addGroup",this.update);
        Store.on("receiveGroupMessage",this.update);
    }

    componentWillUnmount =()=> {
        Store.un("receiveMessage",this.update);
        Store.un("readChatRecords",this.update);
        Store.un("readGroupChatRecords",this.update);
        Store.un("addGroup",this.update);
        Store.un("receiveGroupMessage",this.update);
    }
    componentDidMount=()=>{
        var target = AppUtil.getResetTarget();
        if(target){
            this.props.navigation.navigate(target.view,target.param);
            AppUtil.clearResetTarget();
        }
    }

    chat=function () {
        var f = Store.getFriend(this.id);
        this.RecentView.props.navigation.navigate("ChatView",{friend:f});
    }

    groupChat=function () {
        this.RecentView.props.navigation.navigate("ChatView",{group:this.group});
    }


    render() {
        var recent = Store.getAllRecent();
        var recentList=[];
        if(recent){
            for(var i=0;i<recent.length;i++){
                var re = recent[i];
                var redTip=null;
                if(re.newReceive){
                    redTip = <View style={{width:14,height:14,borderRadius:14,backgroundColor:"red",overflow:"hidden",flexDirection:"row",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:10,color:"#ffffff",textAlign:"center",lineHeight:18}}>{re.newMsgNum}</Text></View>
                }
                recentList.push(<TouchableOpacity key={i} RecentView={this} id={re.id} onPress={this.chat} style={{width:"100%",flexDirection:"row",justifyContent:"center"}}>
                    <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                        <Text>    {Store.getFriend(re.id).name}  </Text>{redTip}
                    </View>
                </TouchableOpacity>);
                recentList.push(<View key={i+"line"} style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>);

            }

        }
        var groups = Store.getGroups();
        var groupAry=[];
        if(groups){
            for(var i=0;i<groups.length;i++){
                var group = groups[i];
                var redTip=null;
                if(group.newReceive){
                    redTip = <View style={{width:18,height:18,borderRadius:18,backgroundColor:"red",overflow:"hidden"}}><Text style={{fontSize:10,color:"#ffffff",textAlign:"center",lineHeight:18}}>{group.newMsgNum}</Text></View>
                }
                groupAry.push(<TouchableOpacity key={i} RecentView={this} group={group}  onPress={this.groupChat} style={{width:"100%",flexDirection:"row",justifyContent:"center"}}>
                    <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                        <Image source={require('../images/mulChat.png')} style={{width:20,height:20}} resizeMode="contain"></Image>
                        <Text>    {group.name}  </Text>
                        {redTip}
                    </View>
                </TouchableOpacity>);
                groupAry.push(<View key={i+"line"} style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>);

            }

        }

        return (
            <View style={{flex:1,flexDirection:"column",justifyContent:"flex-start",alignItems:"center",backgroundColor:"#ffffff"}}>
                {recentList}
                {groupAry}
            </View>
        );
    }

}



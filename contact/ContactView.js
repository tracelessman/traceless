import React, { Component } from 'react';
import {
    Button,
    Image,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Store from '../store/LocalStore'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AppUtil from "../AppUtil";
const {getAvatarSource,debounceFunc} = AppUtil
import { Avatar, Card,List,ListItem } from 'react-native-elements'

export default class ContactView extends Component<{}> {


    static navigationOptions =({ navigation, screenProps }) => (

        {
         headerRight: <TouchableOpacity onPress={debounceFunc(()=>{ navigation.navigate("AddContactView",{ContactView:navigation.state.params.ContactView})})}
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
        this.eventAry = ["receiveMKFriends","readNewMKFriends","addFriend","updateFriendPic"]

    }

    componentDidMount(){
        for(let event of this.eventAry){
            Store.on(event,this.update);
        }
    }

    componentWillUnmount =()=> {
        for(let event of this.eventAry){
            Store.un(event,this.update);
        }
    }

    update = ()=>{
        this.setState({update:true});
    }

    go2RequireListView=debounceFunc(()=>{
        this.props.navigation.navigate("RequireListView",{ContactView:this});
    })

    go2FriendInfoView=debounceFunc((f)=>{
        this.props.navigation.navigate("FriendInfoView",{ContactView:this,friend:f});
    })



    render() {
        let friends = [];
        let all = Store.getAllFriends();
        for(let i=0;i<all.length;i++){
            let f = all[i];

            friends.push(<TouchableOpacity key={i} onPress={()=>{this.go2FriendInfoView(f)}} style={{width:"100%",flexDirection:"row",justifyContent:"center"}}>
                <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                <Avatar
                  source={getAvatarSource(f.pic)}
                  onPress={() => {}}
                  activeOpacity={1}
                />
                    <Text>    {f.name}  </Text>
                </View>
            </TouchableOpacity>);
            friends.push(<View key={i+"line"} style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>);

        }
        return (
            <View style={{flex:1,flexDirection:"column",justifyContent:"flex-start",alignItems:"center",backgroundColor:"#ffffff"}}>
                <TouchableOpacity onPress={this.go2RequireListView} style={{width:"100%",flexDirection:"row",justifyContent:"center"}}>
                    <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"96%",height:40,marginTop:20}}>
                        <Icon name="call-received" size={22} style={{flex:2,marginLeft:5}}/>
                        <Text style={{flex:17,margin:0,fontWeight:"bold",color:"#282828"}}>好友请求</Text>
                        <Text style={{flex:2,color:"red",fontStyle: 'italic', fontSize: 11}}>{Store.hasNewReceivedMKFriends()?"new":""}</Text>
                        <Icon name="chevron-right" size={22} style={{flex:1,margin:5}}/>
                    </View>
                </TouchableOpacity>
                <View style={{width:"96%",height:0,borderTopWidth:0.5,borderColor:"#d0d0d0",marginTop:5,marginBottom:5}}></View>
                {friends}
            </View>
        );
    }

}

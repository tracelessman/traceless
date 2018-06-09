
import React, { Component } from 'react';
import {
    Alert,
    Text,
    TouchableOpacity,
    View,ScrollView
} from 'react-native';
import Store from '../store/LocalStore'
import { Badge, Body, Button, Card, CardItem ,Container ,
    Content, Header ,Icon,Input,Item,Left,  List,
    ListItem,Right,Spinner,Thumbnail,Toast
} from 'native-base'
const {alert} = Alert
import WSChannel from "../channel/WSChannel"
import AppUtil from "../AppUtil"
const {getAvatarSource,debounceFunc} = AppUtil

export default class GroupInfoView extends Component<{}> {
  static navigationOptions =({ navigation, screenProps }) => ({
            headerRight:  <TouchableOpacity style={{marginRight:15}} onPress={debounceFunc(()=>{
              navigation.navigate("AddGroupMemberView",{group:navigation.state.params.group})
            })}  >
               <Icon name='person-add' />
            </TouchableOpacity>,
        })
    constructor(props){
        super(props);
        const {group} = this.props.navigation.state.params
        this.state = {
            group,
            isManager:group.id.startsWith(Store.getCurrentUid())
        }
    }
    leaveGroup = ()=>{
      WSChannel.leaveGroup(this.state.group.id)
      this.props.navigation.popToTop()
    }

    componentWillMount(){
        Store.on("groupMembersChanged",this.update);

    }

    componentWillUnmount =()=> {
        Store.un("groupMembersChanged",this.update);
    }

    update = ()=>{
        let newGroup = Store.getGroup(this.state.group.id)
        this.setState({
          group:newGroup
        })
    }

    render() {
        let friends = [];
        let all = this.state.group.members;
        for(let i=0;i<all.length;i++){
            let f = all[i];
            friends.push(<View key={i}  style={{width:"100%",flexDirection:"row",justifyContent:"center"}}>
                <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                    <Text>    {f.name}  </Text>
                    <Icon></Icon>
                </View>
            </View>);
            friends.push(<View key={i+"line"} style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>);

        }
        let buttonQuit =
          <TouchableOpacity onPress={()=>{this.leaveGroup()}} style={{marginTop:30,width:"90%",height:40,borderColor:"gray",borderWidth:1,borderRadius:5,flex:0,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
                <Text style={{fontSize:18,textAlign:"center",color:"gray"}}>退出该群</Text>
            </TouchableOpacity>


        return (
            <ScrollView style={{flex:1,flexDirection:"column",justifyContent:"flex-start",alignItems:"center",backgroundColor:"#ffffff"}}>
                {friends}

            </ScrollView>
        );
    }

}

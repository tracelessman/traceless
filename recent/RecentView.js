
import React, { Component } from 'react';
import {
    Alert,Image,ListView,
    ScrollView,
    TouchableOpacity,
    View
} from 'react-native';
import Store from "../store/LocalStore"
import WSChannel from "../channel/WSChannel"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Badge, Body, Button, Card, CardItem, Container, Content ,Header ,
    Input, Item ,Left,List,ListItem,Icon as NBIcon,
    Right,Spinner,Text,Thumbnail,Toast
} from 'native-base';
import AppUtil from "../AppUtil";
import GroupAvatar from "./GroupAvatar";
const {getAvatarSource,debounceFunc} = AppUtil
const {alert} = Alert
const _ = require('lodash')


export default class RecentView extends Component<{}> {

    static navigationOptions =({ navigation, screenProps }) => (
        {
            // headerStyle: {
            //     backgroundColor: '#434343'
            // },
            // headerTintColor: '#ffffff',
            headerRight:<TouchableOpacity onPress={debounceFunc(()=>{navigation.navigate("AddGroupView")})}
                                          style={{height:50,width:50,paddingTop:14,paddingLeft:14}}>
                <Icon name="account-multiple-plus" size={22} style={{}}/>
            </TouchableOpacity>,
        }
    );

    constructor(props){
        super(props);
        const recent = Store.getAllRecent();
        this.state = {
            listViewData : recent
        }
        this.eventAry = ["receiveMessage","readChatRecords","readGroupChatRecords","addGroup","receiveGroupMessage","updateFriendPic"]
    }

    update=(fromId)=>{
              this.updateRecent()
    }

    componentWillMount =()=> {
        for(let event of this.eventAry){
            Store.on(event,this.update);
        }
    }

    componentWillUnmount =()=> {
        for(let event of this.eventAry){
            Store.un(event,this.update);
        }
    }
    componentDidMount=()=>{
        this.updateRecent()
        let target = AppUtil.getResetTarget();
        if(target){
            this.props.navigation.navigate(target.view,target.param);
            AppUtil.clearResetTarget();
        }
    }

    componentWillUpdate(){

    }

    updateRecent(){
      const recent = Store.getAllRecent();

      this.state.listViewData = recent
      let promiseAry = []
      for(let ele of this.state.listViewData){
          promiseAry.push(this.getLastMsg(ele.id))
      }
      Promise.all(promiseAry).then(resultMsgAry=>{
          let newData = this.state.listViewData
          for(let i =0;i<newData.length;i++){
              if(resultMsgAry[i]){
                  newData[i].lastMsg = resultMsgAry[i].content
                  newData[i].time = this.getDisplayTime(new Date(resultMsgAry[i].time))
              }
          }
          this.setState({listViewData:newData})
      })
    }

    getDisplayTime(date){
        let result = ''
        const now = new Date()
        const year = date.getFullYear()
        const month = date.getMonth()
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
        const timeDiff = now.getTime() - date.getTime()
        const dayDiff = Math.floor(timeDiff / (1000*60*60*24))

        if(year === now.getFullYear()){
            if(month === now.getMonth() && day === now.getDate()){
              let prefix = ''
              if(hour < 12){
                prefix = '上午'
              }else if(hour > 12){
                prefix = '下午'
              }else if(hour === 12){
                prefix = '中午'
              }
              result = `${prefix} ${hour}:${this.pad(minute)}`
            }else{
                result = `${this.pad(month+1)}-${day}`
            }
        }else{
            result = `${year}-${this.pad(month+1)}月-${day}日`
        }
        if(dayDiff === 1){
          result = '昨天'
        }
        return result
    }

    pad(num){
      num = String(num)
      if(num.length === 1){
        num = '0'+num
      }
      return num
    }

    chat = debounceFunc((uid)=>{
        const f = Store.getFriend(uid);

        this.props.navigation.navigate("ChatView",{friend:f});
    })


    groupChat = debounceFunc( (group)=>{
        this.props.navigation.navigate("ChatView",{group});
    })
    test(){
        alert('test')
    }

    deleteRow(data) {
      Store.deleteRecent(data.id,()=>{
          this.update()
      })
    }

    getLastMsg(chatId){
        return new Promise(resolve=>{
            Store._getLocalRecords(chatId,(res)=>{
                let result = res[res.length-1]

                const {type} = result
                const {length} = result.content
                const maxDisplay = 15
                if(type === Store.MESSAGE_TYEP_TEXT){
                    if(length > maxDisplay){
                      result.content = result.content.substring(0,maxDisplay)+"......"
                    }
                }else if(type === Store.MESSAGE_TYPE_IMAGE){
                  result.content = '[图片]'
                }else if(type === Store.MESSAGE_TYEP_FILE){
                  result.content = '[文件]'
                }

                resolve(result)
            })
        })

    }

    render() {
        let groups = Store.getGroups();
        let groupAry=[];
        if(groups){
            for(let i=0;i<groups.length;i++){
                let group = groups[i];
                let redTip=null;
                if(group.newReceive){
                    redTip =  <Badge style={{transform: [{scaleX:0.8},{scaleY:0.8}]}}>
                        <Text style={{}}>{group.newMsgNum}</Text>
                    </Badge>
                }
                groupAry.push(<TouchableOpacity key={i}    onPress={()=>{this.groupChat(group)}} style={{width:"100%",flexDirection:"row",justifyContent:"center"}}>
                    <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",width:"100%",height:40,marginTop:20}}>
                        <View style={{flexDirection:"row",justifyContent:"center",alignItems:"flex-start",marginLeft:10}}>
                            <GroupAvatar group={group} ></GroupAvatar>
                            <Text>    {group.name}  </Text>
                        </View>
                        <View style={{paddingRight:58,flexDirection:"column",justifyContent:"flex-start",alignItems:"flex-start"}}>
                            {redTip}
                        </View>

                    </View>
                </TouchableOpacity>);
                groupAry.push(<View key={i+"line"} style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>);

            }

        }

        return (
            <View style={{flex:1,flexDirection:"column",justifyContent:"flex-start",alignItems:"center",backgroundColor:"#ffffff"}}>
            {!this.state.listViewData.length && !groupAry.length?
              <TouchableOpacity onPress={()=>{this.props.navigation.navigate('ContactTab')}} style={{marginTop:30,width:"90%",height:40,borderColor:"gray",borderWidth:1,borderRadius:5,flex:0,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
                  <Text style={{fontSize:18,textAlign:"center",color:"gray"}}>开始和好友聊天吧!</Text>
              </TouchableOpacity>
               :null}
                <ScrollView ref="scrollView" style={{width:"100%"}}>
                    <List
                        dataSource={new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(this.state.listViewData)}
                        renderRow={data =>
                                <ListItem thumbnail style={{}} >
                                    <Left style={{marginLeft:10,}}>
                                        <Thumbnail square size={40} style={{width:50,height:50}} source={getAvatarSource(Store.getFriend(data.id).pic)} />
                                    </Left>
                                    <Body >
                                    <TouchableOpacity onPress={()=>{this.chat(data.id)}}>
                                    <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",width:"90%",height:45}}>
                                        <View>
                                            <Text style={{fontSize:18,fontWeight:"500"}}>
                                                {Store.getFriend(data.id).name}
                                            </Text>
                                            <Text style={{fontSize:15,fontWeight:"400",color:"#a0a0a0",marginTop:3}}>
                                                {data.lastMsg}
                                            </Text>
                                        </View>
                                        <View style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                                            <Text style={{fontSize:15,fontWeight:"400",color:"#a0a0a0",marginBottom:3}}>
                                                {data.time}
                                            </Text>
                                            <View>
                                            {data.newReceive?
                                                <Badge style={{transform: [{scaleX:0.8},{scaleY:0.8}]}}>
                                                    <Text style={{}}>{data.newMsgNum}</Text>
                                                </Badge>
                                                :null}
                                            </View>
                                        </View>
                                    </View>
                                    </TouchableOpacity>
                                    </Body>
                                </ListItem>

                           }

                        // renderLeftHiddenRow={data =>
                        //     <Button full onPress={() => alert(data)}>
                        //         <NBIcon active name="information-circle" />
                        //     </Button>}
                        renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                            <Button full danger onPress={_ => this.deleteRow(data)}>
                                <NBIcon active name="trash" />
                            </Button>}
                        // leftOpenValue={75}
                        rightOpenValue={-75}
                    />

                {groupAry}
                </ScrollView>
            </View>
        );
    }

}

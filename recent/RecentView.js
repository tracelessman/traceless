
import React, { Component } from 'react';
import {
    View,Image,ScrollView,
    TouchableOpacity,
    ListView,
    Alert
} from 'react-native';
import Store from "../store/LocalStore"
import WSChannel from "../channel/WSChannel"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Container, Header, Content, Button, List, ListItem, Text ,Icon as NBIcon ,
    Item, Input ,Card,CardItem,Body,Badge,
    Thumbnail,Left,Right,Toast,Spinner
} from 'native-base';
import AppUtil from "../AppUtil";
const {getAvatarSource} = AppUtil
const {alert} = Alert
const _ = require('lodash')

export default class RecentView extends Component<{}> {

    static navigationOptions =({ navigation, screenProps }) => (

        {
            // headerStyle: {
            //     backgroundColor: '#434343'
            // },
            // headerTintColor: '#ffffff',
            headerRight:<TouchableOpacity onPress={()=>{navigation.navigate("AddGroupView")}}
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
    }

    update=(fromId)=>{

              this.updateRecent()
        // this.setState({update:true});
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

        this.updateRecent()
        var target = AppUtil.getResetTarget();
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
        return result
    }

    pad(num){
      num = String(num)
      if(num.length === 1){
        num = '0'+num
      }
      return num
    }

    chat(uid) {
        var f = Store.getFriend(uid);

        this.props.navigation.navigate("ChatView",{friend:f});
    }

    groupChat=function () {
        this.RecentView.props.navigation.navigate("ChatView",{group:this.group});
    }
    test(){
        alert('test')
    }

    deleteRow(data) {
      WSChannel.deleteContact(data.id)
      this.update()
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
        var groups = Store.getGroups();
        var groupAry=[];
        if(groups){
            for(var i=0;i<groups.length;i++){
                var group = groups[i];
                var redTip=null;
                if(group.newReceive){
                    redTip = <View style={{width:14,height:14,borderRadius:14,backgroundColor:"red",overflow:"hidden"}}><Text style={{fontSize:9,color:"#ffffff",textAlign:"center"}}>{group.newMsgNum}</Text></View>
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
            {(!this.state.listViewData.length && !groupAry.length)?
              <TouchableOpacity onPress={()=>{this.props.navigation.navigate('ContactTab')}} style={{marginTop:30,width:"90%",height:40,borderColor:"gray",borderWidth:1,borderRadius:5,flex:0,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
                  <Text style={{fontSize:18,textAlign:"center",color:"gray"}}>开始和好友聊天吧!</Text>
              </TouchableOpacity>
               :null}

                <ScrollView ref="scrollView" style={{width:"100%"}}>

                    <List
                        dataSource={new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(this.state.listViewData)}
                        renderRow={data =>

                                <ListItem thumbnail style={{}} >
                                    <Left style={{marginLeft:10}}>
                                        <Thumbnail   source={getAvatarSource(Store.getFriend(data.id).pic)} />
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

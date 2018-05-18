/**
 * Created by renbaogang on 2017/10/31.
 */


import React, { Component } from 'react';
import {
    View,Image,ScrollView,
    TouchableOpacity,
    ListView,
    Alert
} from 'react-native';
import Store from "../store/LocalStore"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Container, Header, Content, Button, List, ListItem, Text ,Icon as NBIcon ,
    Item, Input ,Card,CardItem,Body,Badge,
    Thumbnail,Left,Right,Toast,Spinner
} from 'native-base';
import AppUtil from "../AppUtil";
const {getAvatarSource} = AppUtil
const {alert} = Alert

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

    deleteRow(secId, rowId, rowMap) {
        rowMap[`${secId}${rowId}`].props.closeRow();
        const newData = [...this.state.listViewData];
        newData.splice(rowId, 1);
        this.setState({ listViewData: newData });
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
                                            <Text style={{fontSize:25,fontWeight:'bold'}}>
                                                {Store.getFriend(data.id).name}
                                            </Text>
                                        </View>
                                        <View>
                                            {data.newReceive?
                                                <Badge style={{}}>
                                                    <Text style={{}}>{data.newMsgNum}</Text>
                                                </Badge>
                                                :null}
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
                            <Button full danger onPress={_ => this.deleteRow(secId, rowId, rowMap)}>
                                <NBIcon active name="trash" />
                            </Button>}
                        // leftOpenValue={75}
                        rightOpenValue={-75}
                    />
                {/*{recentList}*/}
                {groupAry}
                </ScrollView>
            </View>
        );
    }

}



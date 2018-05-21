/**
 * Created by renbaogang on 2017/11/10.
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    Alert,
    TouchableOpacity
} from 'react-native';
import Store from '../store/LocalStore'
import { Container, Header, Content, List, ListItem ,Icon ,
    Item, Input ,Card,CardItem,Body,Badge,  Button,
    Thumbnail,Left,Right,Toast,Spinner
} from 'native-base'
const {alert} = Alert


export default class GroupInfoView extends Component<{}> {
  static navigationOptions =({ navigation, screenProps }) => {
    console.log(navigation)
    return      {

            headerRight:  <TouchableOpacity style={{marginRight:15}} onPress={()=>{
              navigation.navigate("AddGroupMemberView",{group:navigation.state.params.group})
            }}  >
               <Icon name='person-add' />

            </TouchableOpacity>,

        }

  }
    constructor(props){
        super(props);
       this.group = this.props.navigation.state.params.group;
       console.log(this.group)
        console.log(Store.getCurrentUid())
        this.isManager = this.group.id.startsWith(Store.getCurrentUid())
        console.log(this.isManager)
    }




    render() {
        var friends = [];
        var all = this.group.members;
        for(var i=0;i<all.length;i++){
            var f = all[i];
            friends.push(<View key={i}  style={{width:"100%",flexDirection:"row",justifyContent:"center"}}>
                <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                    <Text>    {f.name}  </Text>
                    <Icon></Icon>
                </View>
            </View>);
            friends.push(<View key={i+"line"} style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>);

        }
        return (
            <View style={{flex:1,flexDirection:"column",justifyContent:"flex-start",alignItems:"center",backgroundColor:"#ffffff"}}>

                {friends}
                <View style={{display:"flex",flexDirection:"column",alignItems:"flex-end",justifyContent:"flex-end"}}>
                <View>
                {this.isManager?
                  (<Button style={{padding:20,margin:20}} onPress={()=>{alert('退出')}} >
                        <Text style={{color:'white'}}>删除该群</Text>
                    </Button>)
                  :
                  (<Button style={{padding:20,margin:20}} onPress={()=>{alert('退出')}} >
                        <Text style={{color:'white'}}>退出该群</Text>
                    </Button>)
                }
                </View>


                </View>


            </View>
        );
    }

}

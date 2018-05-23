
import React, { Component } from 'react';
import {
    Alert,
    Text,
    View,
    TextInput,TouchableOpacity,Image,
    Platform
} from 'react-native';
import  WSChannel from '../channel/LocalWSChannel'
import Store from "../store/LocalStore"
import {
    Container, Header, Content, Item, Input, Icon ,Button,Card,CardItem,Body,ListItem,List,Thumbnail,Left,Right,Toast
} from 'native-base';
import ScanView from '../mine/ScanView'
const {alert} = Alert
import AppUtil from "../AppUtil"


export default class GroupAvatar extends Component<{}> {

    constructor(props){
        super(props);



    }


    render() {
        const picAry = [Store.getPersonalPic()]

        for(let member of this.props.group.members){
            if(member.uid !== Store.getCurrentUid()){
              picAry.push(Store.getFriend(member.uid).pic)
            }
            if(picAry.length === 4){
                break
            }
        }
        let avatarAry = []
        let key = 0
        for(let pic of picAry){
            avatarAry.push(<Image  key={key} source={AppUtil.getAvatarSource(pic)} style={{width:22,height:22,margin:0.5}} resizeMode="contain"></Image>)
            key++
        }

        return   (
          <View style={{display:'flex',justifyContent:"center",alignItems:"center",flexDirection:"row",
              borderWidth:1,borderRadius:1,borderColor:"#e0e0e0",backgroundColor:"#f0f0f0",width:51,height:51,marginBottom:20,
              flexWrap:"wrap",padding:1
          }}>
              {avatarAry}
            </View>
        )
    }

}


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


export default class GroupAvatar extends Component<{}> {

    constructor(props){
        super(props);



    }


    render() {
        const picAry = [Store.getPersonalPic()]

        for(let member of this.props.group.members){
            if(member.uid !== Store.getCurrentUid()){
              picAry.push(Store.getFriend(member.uid))
            }
        }
        return   (
          <View style={{display:'flex',justifyContent:"center",alignItems:"center"}}>
              <Image source={require('../images/mulChat.png')} style={{width:20,height:20}} resizeMode="contain"></Image>
            </View>
        )
    }

}

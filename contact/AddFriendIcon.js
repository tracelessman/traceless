
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


export default class AddFriendIcon extends Component<{}> {

    constructor(props){
        super(props);
        this.state={isSending:false};
    }



    addFriend = (fid)=>{
        WSChannel.applyMakeFriends(fid, (result)=> {
            this.setState({isSending:true})
            Toast.show({
                text: '好友申请已发送，等待对方审核',
                position: "top",
                type:"success",
                duration: 3000
            })
        })

    }


    render() {


        const view1 = (
            <View>
                <Button transparent onPress={()=>{
                }}>
                    <Icon name='md-checkmark' />
                </Button>
            </View>

        )
        const view2 = (
            <View>
                <Button transparent onPress={()=>{
                    this.addFriend(this.props.uid)
                }}>
                    <Icon name='md-add' />
                </Button>
            </View>

        )
        return this.state.isSending?view1:view2
    }

}

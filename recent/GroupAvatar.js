
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


export default class AddFriendIcon extends Component<{}> {

    constructor(props){
        super(props);
        this.state={isSending:false};
    }



    check = ()=>{
      this.setState({isSending:true})
      this.props.checked()
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
                    this.check()
                }}>
                    <Icon name='md-add' />
                </Button>
            </View>

        )
        return this.state.isSending?view1:view2
    }

}

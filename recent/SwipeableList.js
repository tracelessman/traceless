/* eslint-enable */


import React, { Component } from 'react';
import {
    Alert,
    Image,
    Platform,
    Text,TextInput,TouchableOpacity,
    View,PanResponder,TouchableHighlight
} from 'react-native';
import  WSChannel from '../channel/LocalWSChannel'
import Store from "../store/LocalStore"
import {
    Body, Button, Card, CardItem, Container, Content ,Header,Icon,Input,Item,Left,List,ListItem,Right,Thumbnail,Toast
} from 'native-base';
import ScanView from '../mine/ScanView'
const {alert} = Alert
import AppUtil from "../AppUtil"


export default class SwipeableList extends Component<{}> {

    constructor(props){
        super(props);
        this.state = {
            left:0
        }
        this.width = 100
    }

    componentWillMount() {
    this._panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

        onPanResponderGrant: (evt, gestureState) => {
        },
        onPanResponderMove: (evt, gestureState) => {
            let left = gestureState.dx
            // console.log(left)


            let intervalWidth = 0-this.width
            if(left >= intervalWidth && this.state.left>=intervalWidth && left <= 0-intervalWidth){
                if(left >= 0 && this.state.left<=0){
                    left = this.state.left+left
                }
                if(left >= 0){
                    left = 0
                }
                this.setState({
                    left:left
                })
            }

        return true

            // The most recent move distance is gestureState.move{X,Y}

            // The accumulated gesture distance since becoming responder is
            // gestureState.d{x,y}
        },
        onPanResponderTerminationRequest: (evt, gestureState) => true,
        onPanResponderRelease: (evt, gestureState) => {
            if(this.state.left < (0-this.width)){
                this.setState({
                    left:0-this.width
                })
            }else{
                this.setState({
                    left:0
                })
            }
            return true
        },
        onPanResponderTerminate: (evt, gestureState) => {
            // Another component has become the responder, so this gesture
            // should be cancelled
        },
        onShouldBlockNativeResponder: (evt, gestureState) => {
            // Returns whether this component should block native components from becoming the JS
            // responder. Returns true by default. Is currently only supported on android.
            return true;
        },
    });
}


    render() {
        return   (
            <View style={{width:"100%",}} >
                <View style={{position:"absolute",right:0,top:0,display:"flex",backgroundColor:"#d9534f",
                    height:"100%",width:this.width,justifyContent:"center",alignItems:"center"}} onPress={this.props.rightPress}>
                    <Icon name='ios-trash-outline' style={{color:"white"}} />
                </View>

                    <View {...this._panResponder.panHandlers}
                                      style={{width:"100%",backgroundColor:"white",left:this.state.left}}>
                        {this.props.slot}
                    </View >

                <View style={{width:"100%",height:0,borderTopWidth:1,borderColor:"#f0f0f0"}}/>
            </View>
        )
    }

}

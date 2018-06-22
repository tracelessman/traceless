
import React, { Component } from 'react';
import {
    Alert,
    Image,
    Modal,
    ScrollView,Text,TextInput,TouchableOpacity,View
} from 'react-native';
import Store from "../store/LocalStore"
import AppUtil from "../AppUtil"
const {getAvatarSource,debounceFunc} = AppUtil
import WSChannel from "../channel/WSChannel"
import { Avatar,Card,Icon ,List,ListItem} from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker';
import {
    Button,Toast
} from "native-base"

import RNFetchBlob from 'react-native-fetch-blob'
const versionLocal = require('../package').version


export default class BasicInfoView extends Component<{}> {
    constructor(props){
        super(props);
        this.state = {
            disabled:true
        }

    }
    static navigationOptions =({ navigation, screenProps }) =>{

        return (

            {
                headerRight:(
                    <View style={{marginHorizontal:10}}>
                        <Button  primary small style={{paddingHorizontal:8}} onPress={debounceFunc(()=>{
                            navigation.state.params.save()
                        })}>
                            <Text style={{color:"white"}}>保存</Text>
                        </Button>
                    </View>

                )
            }
        );

    }

    componentDidMount(){
        this.props.navigation.setParams({ save:()=>{
                if(typeof this.refs.input._lastNativeText === "undefined"){
                    Toast.show({
                        text: '请修改昵称后保存',
                        position:"top"
                    })
                }else if(!this.refs.input._lastNativeText){
                    Toast.show({
                        text: '昵称不能为空',
                        position:"top"
                    })
                }else{
                    WSChannel.setPersonalName(this.refs.input._lastNativeText,(data)=>{
                        const {err} = data
                        if(err){
                            console.log(err)
                            Toast.show({
                                text: `设置昵称失败,请稍后重试`,
                                position:"top"
                            })
                        }else{

                            this.props.navigation.goBack()
                        }
                    },()=>{
                        Toast.show({
                            text: '设置昵称超时,请稍后重试',
                            position:"top"
                        })
                    })
                }
            } })
    }


    onChangeText = (t)=>{
        // if(t === Store.getCurrentName()){
        //     this.setState({
        //         disabled:true
        //     })
        // }else if(this.state.disabled){
        //     this.setState({
        //         disabled:false
        //     })
        // }

    }


    render() {

        return (
            <ScrollView >
                <View style={{backgroundColor:"white",marginVertical:20,width:"100%",padding:12}}>
                   <TextInput  onChangeText={this.onChangeText} ref="input"  style={{fontSize:18}} autoFocus defaultValue={Store.getCurrentName()}/>
                </View>
            </ScrollView>
        );
    }

}

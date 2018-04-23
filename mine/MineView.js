/**
 * Created by renbaogang on 2017/10/31.
 */

import React, { Component } from 'react';
import {
    Alert,
    Image,
    Text,
    View,TextInput,TouchableOpacity,Modal,ScrollView
} from 'react-native';
import Store from "../store/LocalStore"
import AppUtil from "../AppUtil"
import WSChannel from "../channel/WSChannel"
import { List, ListItem,Avatar,Card ,Icon,Button} from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'react-native-fetch-blob'


export default class MineView extends Component<{}> {
    constructor(props){
        super(props);
        let picUrl = Store.getPersonalPic()
        let avatarSource = {
            uri:picUrl
        }
        if(!picUrl){
            avatarSource = require("../images/defaultAvatar.png")

        }

        this.state = {
            avatarSource
        }
    }



    reset=()=>{
        Alert.alert(
            '提示',
            '重置后会删除当前账号的所有数据,请确认是否继续本操作?',
            [
                {text: '取消', onPress: () => {}, style: 'cancel'},
                {text: '确认', onPress: () => {
                        WSChannel.reset();
                        Store.reset(function () {
                            AppUtil.reset();
                        })
                    }},
            ],
            { cancelable: false }
        )


    }

    clear=()=>{
        Alert.alert(
            '提示',
            '清除聊天记录后不可恢复,请确认是否继续本操作?',
            [
                {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: '确认', onPress: () => {
                        Store.clear(function () {
                            AppUtil.reset();
                        });
                    }},
            ],
            { cancelable: false }
        )


    }

    showScanView=()=>{
        this.props.navigation.navigate("ScanView");
    }

    setAvatar(image){
        RNFetchBlob.fs.readFile(image.path, 'base64')
            .then((data) => {
                const uri = 'data:image/jpeg;base64,'+ data

                WSChannel.setPersonalPic(uri,data=>{
                    this.setState({
                        avatarSource:{
                            uri
                        }
                    })
                },()=>{
                    console.log('timeout')
                    Alert.alert('连接服务器超时,请检查当前网络')
                })
            }).catch(err=>{
            console.log(err)
        })
    }

    render() {



        const list2 = [
            {
                title:`身份标识`,
                icon:'contacts',
                onPress:()=>{
                    this.props.navigation.navigate('UidView',{
                        uid:Store.getCurrentUid()
                    })
                },
            },
            {
                title:`清除本地聊天缓存`,
                icon:'refresh',
                onPress:this.clear,
            },
            {
                title:`重置`,
                icon:'delete-forever',
                onPress:this.reset
            },
            {
                title:`授权其他设备`,
                icon:'crop-free',
                onPress:this.showScanView
            },
        ]

        const pickerOption = {
            width: 300,
            height: 300,
            cropping: true
        }
        const style = {
            listStyle:{
                backgroundColor:'white',marginTop:20,
            }
        }

        return (
            <ScrollView >
                <View style={style.listStyle}>
                    <ListItem
                        title={Store.getCurrentName()}
                        rightIcon={
                            <Icon name='qrcode' type="font-awesome" iconStyle={{margin:10}}  color='gray'
                                  raised
                                  onPress={()=>{
                                      this.props.navigation.navigate('QrcodeView',{
                                          qrcode:{
                                              uid:Store.getCurrentUid(),
                                              ip:Store.getCurrentServer(),
                                              code:'traceless',
                                              action:"addFriend"
                                          },
                                          avatarUrl:this.state.avatarSource.uri
                                      })
                                  }}
                            />}
                        avatar={<Avatar
                            large
                            containerStyle={{marginRight:5}}
                            source={this.state.avatarSource}
                            onPress={() => {
                                Alert.alert(
                                    '设置头像',
                                    '请选择头像设置方式',
                                    [
                                        {text: '取消', onPress: () => console.log('Ask me later pressed')},
                                        {text: '拍照', onPress: () => {
                                                ImagePicker.openCamera(pickerOption).then(image => {
                                                    this.setAvatar(image)
                                                })
                                            }},
                                        {text: '从相册获得', onPress: () => {
                                                ImagePicker.openPicker(pickerOption).then(image => {
                                                    this.setAvatar(image)
                                                }).catch(err=>{
                                                    console.log(err)
                                                })
                                            }},
                                    ],
                                    { cancelable: false }
                                )


                            }}
                            activeOpacity={0.7}
                        />}
                        titleStyle={{fontSize:18,color:'#424242'}}
                    />

                </View>
                <View style={style.listStyle}>
                    {
                        list2.map((item, i) => (
                            <ListItem
                                key={i}
                                title={item.title}

                                rightIcon={item.rightIconColor?{style:{color:item.rightIconColor}}:{}}
                                leftIcon={{name:item.icon,style:{}}}
                                subtitle={item.subtitle}
                                onPress={item.onPress}
                            />
                        ))
                    }
                </View>
            </ScrollView>
        );
    }

}

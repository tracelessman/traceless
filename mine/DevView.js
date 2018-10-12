
import React, { Component } from 'react';
import {
    Alert,
    Image,
    Modal,
    ScrollView,Text,TextInput,TouchableOpacity,View
} from 'react-native';
import AppUtil from "../AppUtil"
const {getAvatarSource,debounceFunc} = AppUtil
import WSChannel from "../channel/WSChannel"
import { Avatar, Button,Card,Icon ,List,ListItem} from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker';

import RNFetchBlob from 'react-native-fetch-blob'
const versionLocal = require('../package').version
const config = require('../config')
import RNRestart from 'react-native-restart';
const updateUtil = require("../util/updateUtil")
import Store from "../store/LocalStore"

export default class BasicInfoView extends Component<{}> {
    constructor(props){
        super(props);
    }
    componentWillMount(){
    }
    componentWillUnMount(){
    }


    render() {
        const style = {
            listItem:{
                display:"flex",
                alignItems:"center",
                justifyContent:"space-between",
                flexDirection:"row"
            },
            listStyle:{
                backgroundColor:'white',marginTop:20,
            },
            titleStyle:{
                fontSize:18,
                marginLeft:10,
                color:"#606060",

            },
            contentStyle:{
                color:"#a0a0a0",
                fontSize:18,
            },
            contentContainer:{
            }
        }
        const list2 = [
            {
                title: (
                    <View style={style.listItem}>
                        <View>
                            <Text style={style.titleStyle}>
                                软件信息
                            </Text>
                        </View>
                        <View>
                            <Text style={style.contentStyle}>
                            </Text>
                        </View>
                    </View>),
                onPress:debounceFunc(()=>{
                    this.props.navigation.navigate("InfoView")
                }),
            },
            {
                title: (
                    <View style={style.listItem}>
                        <View>
                            <Text style={style.titleStyle}>
                                查看错误日志
                            </Text>
                        </View>
                        <View style={style.contentContainer}>
                            <Text style={[style.contentStyle,{fontSize:14}]}>
                            </Text>
                        </View>

                    </View>),
                onPress:debounceFunc(()=>{
                    this.props.navigation.navigate('LogView',{
                        path:config.errorLogPath
                    })
                }),
            },
            {
                title: (
                    <View style={style.listItem}>
                        <View>
                            <Text style={style.titleStyle}>
                                查看调试日志
                            </Text>
                        </View>
                        <View>
                            <Text style={style.contentStyle}>
                            </Text>
                        </View>
                    </View>),
                onPress:debounceFunc(()=>{
                    this.props.navigation.navigate('LogView',{
                        path:config.devLogPath
                    })
                }),
            },
            {
                title: (
                    <View style={style.listItem}>
                        <View>
                            <Text style={style.titleStyle}>
                                数据二维码
                            </Text>
                        </View>
                        <View>
                            <Text style={style.contentStyle}>
                            </Text>
                        </View>
                    </View>),
                onPress:debounceFunc(()=>{

                    this.props.navigation.navigate('DataQrView',{
                    })
                }),
            },
            {
                title: (
                    <View style={style.listItem}>
                        <View>
                            <Text style={style.titleStyle}>
                                重置
                            </Text>
                        </View>
                        <View>
                            <Text style={style.contentStyle}>
                            </Text>
                        </View>
                    </View>),
                onPress:debounceFunc(()=>{
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
                }),
            },

            {
                title: (
                    <View style={style.listItem}>
                        <View>
                            <Text style={style.titleStyle}>
                                设置检查更新服务器地址
                            </Text>
                        </View>
                        <View>
                            <Text style={style.contentStyle}>
                            </Text>
                        </View>
                    </View>),
                onPress:debounceFunc(()=>{
                    this.props.navigation.navigate("SetHostView")
                }),
            },
          {
            title: (
              <View style={style.listItem}>
                <View>
                  <Text style={style.titleStyle}>
                    强制更新
                  </Text>
                </View>
                <View>
                  <Text style={style.contentStyle}>
                  </Text>
                </View>
              </View>),
            onPress:debounceFunc(()=>{
              const option = {
                uid: Store.getCurrentUid(),
                name: Store.getCurrentName(),
                versionLocal:'0.0.1',
                devParam:false
              }
              updateUtil.checkUpdateGeneral(option)
            }),
          },
            // {
            //     title: (
            //         <View style={style.listItem}>
            //             <View>
            //                 <Text style={style.titleStyle}>
            //                     test
            //                 </Text>
            //             </View>
            //             <View>
            //                 <Text style={style.contentStyle}>
            //                 </Text>
            //             </View>
            //         </View>),
            //     onPress:debounceFunc(()=>{
            //         RNRestart.Restart()
            //     }),
            // },
        ]

        return (
            <ScrollView >
                <View style={style.listStyle}>
                    {
                        list2.map((item, i) =>
                            <ListItem
                                key={i}
                                title={item.title}
                                component={item.label}
                                rightIcon={item.rightIconColor?{style:{color:item.rightIconColor}}:{}}
                                onPress={item.onPress}
                            />
                        )
                    }
                </View>
            </ScrollView>
        );
    }

}

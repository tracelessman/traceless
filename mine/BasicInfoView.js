
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
import { Avatar, Button,Card,Icon ,List,ListItem} from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker';

import RNFetchBlob from 'react-native-fetch-blob'
const versionLocal = require('../package').version


export default class BasicInfoView extends Component<{}> {
    constructor(props){
        super(props);
    }
    componentWillMount(){
        Store.on("rename",this.update)
    }
    componentWillUnMount(){
        Store.un("rename",this.update)
    }

    update = ()=>{
        this.setState({update:true})

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
                marginLeft:10
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
                                标识
                            </Text>
                        </View>
                        <View style={style.contentContainer}>
                            <Text style={[style.contentStyle,{fontSize:14}]}>
                                {Store.getCurrentUid()}
                            </Text>
                        </View>

                    </View>),
                onPress:debounceFunc(()=>{
                    this.props.navigation.navigate('UidView',{
                        uid:Store.getCurrentUid()
                    })
                }),
            },

            {
                title: (
                    <View style={style.listItem}>
                        <View>
                            <Text style={style.titleStyle}>
                                昵称
                            </Text>
                        </View>
                        <View>
                            <Text style={style.contentStyle}>
                                {Store.getCurrentName()}
                            </Text>
                        </View>
                    </View>),
                onPress:debounceFunc(()=>{
                    this.props.navigation.navigate('RenameView',{
                    })
                }),
                subtitle:Store.getCurrentName()
            },
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

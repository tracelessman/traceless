/**
 * Created by renbaogang on 2017/11/3.
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    TouchableOpacity
} from 'react-native';
import Store from '../store/LocalStore'
import  WSChannel from '../channel/LocalWSChannel'


export default class RequireListView extends Component<{}> {


    constructor(props){
        super(props);
        this.requirelist = Store.fetchAllReceivedMKFriends();
    }

    accept=(id)=>{
        WSChannel.acceptMakeFriends(id, ()=> {
            Store.acceptMKFriends(id,()=>{
                this.setState({update:true});
            });
        });
    }



    render() {
        var result = [];
        var list = this.requirelist;
        if(list){
            for(var i=0;i<list.length;i++){
                var req = list[i];
                result[i] = <View key={i} style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center",width:"90%",height:40,marginTop:20,borderColor:"#d0d0d0",borderBottomWidth:1}}>
                    <Text>{req.name}</Text><Text>{req.id}</Text>{req.state==0?<Button onPress={()=>{this.accept(req.id)}} title="同意"/>:<Text>已添加</Text>}
                </View>;
            }

        }
        return (
            <View style={{flex:1,flexDirection:"column",justifyContent:"flex-start",alignItems:"center",backgroundColor:"#ffffff"}}>

                {result}
            </View>
        );
    }

}
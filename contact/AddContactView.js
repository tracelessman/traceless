
import React, { Component } from 'react';
import {
    Text,
    View,
    TextInput,
    Button,TouchableOpacity,Image
} from 'react-native';
import  WSChannel from '../channel/LocalWSChannel'


export default class AddContactView extends Component<{}> {

    constructor(props){
        super(props);
        this.state={searchResult:null};
    }

    doSearch=()=>{
        if(this.searchText){
            WSChannel.searchFriends(this.searchText,(data)=>{
                // var result = [{id:"id1",name:"name1"},{id:"id2",name:"name2"}];
                this.setState({searchResult:data.result});
            });

        }
    }

    addFriend=function () {
        WSChannel.applyMakeFriends(this.fid, ()=> {
            alert("好友申请已发送，等待对方审核");
        });
    }

    textChange=(v)=>{
        this.searchText = v;
    }

    render() {
        var searchResult = [];
        if(this.state.searchResult){
            for(var i=0;i<this.state.searchResult.length;i++){
                var result = this.state.searchResult[i];
                searchResult[i] = <View key={i} style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center",width:"90%",height:40,marginTop:20,borderColor:"#d0d0d0",borderBottomWidth:1}}>
                    <Text>{result.name}   </Text><TouchableOpacity fid={result.uid} onPress={this.addFriend}><Image source={require('../images/addGroup.png')} style={{width:22,height:22}} resizeMode="contain"></Image></TouchableOpacity>
                </View>;
            }

        }
        return (
            <View style={{flex:1,flexDirection:"column",justifyContent:"flex-start",alignItems:"center",backgroundColor:"#ffffff"}}>
                <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                    <Text>请输入对方昵称或标识：</Text><TextInput  style={{flex:1,color:"gray"}} underlineColorAndroid='transparent' defaultValue={""} onSubmitEditing={this.doSearch} onChangeText={this.textChange} returnKeyType="search"/>
                </View>
                <View style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>
                {searchResult}
            </View>
        );
    }

}

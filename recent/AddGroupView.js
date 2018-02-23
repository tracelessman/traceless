/**
 * Created by renbaogang on 2017/11/9.
 */

import React, { Component} from 'react';
import { Text,View,Image,TouchableOpacity,Button,Switch,TextInput} from 'react-native';
import Store from '../store/LocalStore'
import  WSChannel from '../channel/LocalWSChannel'
export default class AddGroupView extends Component<{}> {

    constructor(props){
        super(props);
        this._selected=[];
    }

    isSelected=(friend)=>{
        return this._selected.indexOf(friend)!=-1;
    }

    select=function (v) {
        if(v){
            this.AddGroupView._selected.push(this.friend);
        }else{
            this.AddGroupView._selected.splice(this.AddGroupView._selected.indexOf(this.friend),1);
        }

        this.AddGroupView.setState({selectChange:true});
    }

    nameTextChange=(v)=>{
        this.name = v;
    }
    clear=()=>{
        this._selected=[];
        this.setState({selectChange:true});
    }
    createGroup=()=>{
        if(!this.name){
            alert("请填写群名称");
            return;
        }
        if(this._selected.length==0){
            alert("请选择群成员");
            return;
        }
        var id = Store.generateGroupId();
        var members = [{uid:Store.getCurrentUid(),name:Store.getCurrentName()}];
        this._selected.forEach(function (p) {
            members.push({uid:p.id,name:p.name});
        })
        WSChannel.addGroup(id,this.name,members,()=>{
            Store.addGroup(id,this.name,members);
        });

    }

    render() {
        var friends = [];
        var all = Store.getAllFriends();
        for(var i=0;i<all.length;i++){
            var f = all[i];
            friends.push(<TouchableOpacity key={i}  style={{width:"100%",flexDirection:"row",justifyContent:"center"}}>
                <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                    <Text>    {f.name}  </Text><Switch AddGroupView={this} friend={f} value={this.isSelected(f)} onValueChange={this.select}></Switch>
                </View>
            </TouchableOpacity>);
            friends.push(<View key={i+"line"} style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>);

        }
        return (
            <View style={{flex:1,flexDirection:"column",justifyContent:"flex-start",alignItems:"center",backgroundColor:"#ffffff"}}>
                <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                    <Text>名称：</Text>
                    <TextInput  style={{flex:1,color:"gray"}} underlineColorAndroid='transparent' defaultValue={""} onChangeText={this.nameTextChange} />
                </View>
                <View style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>
                <TouchableOpacity style={{width:"100%",flexDirection:"row",justifyContent:"center"}}>
                    <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                        <Button title="确定" onPress={this.createGroup}/><Button title="清空" onPress={this.clear}/>
                    </View>
                </TouchableOpacity>
                {friends}
            </View>
        );
    }

}
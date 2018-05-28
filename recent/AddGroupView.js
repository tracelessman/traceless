import React, { Component} from 'react';
import { Button,Image,Switch,Text,TextInput,TouchableOpacity,View} from 'react-native';
import Store from '../store/LocalStore'
import  WSChannel from '../channel/LocalWSChannel'
import AppUtil from "../AppUtil"
export default class AddGroupView extends Component<{}> {

    static navigationOptions =({ navigation, screenProps }) => (
        {
            headerRight:
                <TouchableOpacity style={{marginRight:20}}>
                    <Button color="#2d8cf0" title="确定"
                                onPress={()=>navigation.state.params.navigateAddGroupPress()}
                                style={{marginRight:20}}/>
                </TouchableOpacity>
        }
    );

    constructor(props){
        super(props);
        this._selected=[];
    }

    isSelected=(friend)=>this._selected.indexOf(friend)!=-1

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
        let id = Store.generateGroupId();
        let members = [{uid:Store.getCurrentUid(),name:Store.getCurrentName()}];
        this._selected.forEach(function (p) {
            members.push({uid:p.id,name:p.name,pic:p.pic});
        })
        WSChannel.addGroup(id,this.name,members,()=>{
            Store.addGroup(id,this.name,members);
            this.props.navigation.goBack();
        });

    }

    componentDidMount(){
        this.props.navigation.setParams({ navigateAddGroupPress:this.createGroup })
    }

    render() {
        let friends = [];
        let all = Store.getAllFriends();
        for(let i=0;i<all.length;i++){
            let f = all[i];
            let imageSource = AppUtil.getAvatarSource(f.pic);
            friends.push(<TouchableOpacity key={i}  style={{width:"100%",flexDirection:"row",justifyContent:"center"}}>
                <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",width:"96%",height:60,marginTop:5}}>
                    <Image source={imageSource} style={{flex:3,marginTop:5,width:50,height:50,alignSelf:"flex-start"}} resizeMode="contain"></Image>
                    <Text style={{flex:13,margin:5}}>{f.name}</Text>
                    <Switch AddGroupView={this} friend={f} value={this.isSelected(f)} onValueChange={this.select} style={{flex:3,height:50}}></Switch>
                </View>
            </TouchableOpacity>);
            friends.push(<View key={i+"line"} style={{width:"96%",height:0,borderTopWidth:0.5,borderColor:"#d0d0d0"}}></View>);

        }
        return (
            <View style={{flex:1,flexDirection:"column",justifyContent:"flex-start",alignItems:"center",backgroundColor:"#ffffff"}}>
                <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"96%",height:40,marginTop:10}}>
                    <Text>群名称：</Text>
                    <TextInput  style={{flex:1,color:"gray"}} underlineColorAndroid='transparent' defaultValue={""} onChangeText={this.nameTextChange} />
                </View>
                <View style={{width:"96%",height:0,borderTopWidth:0.5,borderColor:"#d0d0d0"}}></View>
                {friends}
            </View>
        );
    }

}

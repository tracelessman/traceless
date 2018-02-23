/**
 * Created by renbaogang on 2017/11/10.
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    TouchableOpacity
} from 'react-native';
import Store from '../store/LocalStore'


export default class GroupInfoView extends Component<{}> {

    constructor(props){
        super(props);
       this.group = this.props.navigation.state.params.group;
    }




    render() {
        var friends = [];
        var all = this.group.members;
        for(var i=0;i<all.length;i++){
            var f = all[i];
            friends.push(<TouchableOpacity key={i}  style={{width:"100%",flexDirection:"row",justifyContent:"center"}}>
                <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                    <Text>    {f.name}  </Text>
                </View>
            </TouchableOpacity>);
            friends.push(<View key={i+"line"} style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>);

        }
        return (
            <View style={{flex:1,flexDirection:"column",justifyContent:"flex-start",alignItems:"center",backgroundColor:"#ffffff"}}>

                {friends}
            </View>
        );
    }

}
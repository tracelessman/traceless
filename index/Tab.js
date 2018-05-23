import React from 'react';
import { View,Text} from 'react-native';
import Store from "../store/LocalStore";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class Tab extends React.Component {

    constructor(props) {
        super(props);
        this.type=props["type"];
        this.focused=props["focused"];
        if(this.type=="recent"){
            this.state={newMsgNum:Store.getTotalNewMSgNum()};
        }

    }
    componentDidMount =()=> {
        if(this.type=="recent"){
            Store.on("receiveMessage",this.notify)
            Store.on("receiveGroupMessage",this.notify)
            Store.on("readChatRecords",this.notify)
            Store.on("readGroupChatRecords",this.notify)
        }

    }

    componentWillUnmount =()=> {
        if(this.type=="recent"){
            Store.un("receiveMessage",this.notify);
            Store.un("receiveGroupMessage",this.notify)
            Store.un("readChatRecords",this.notify)
            Store.un("readGroupChatRecords",this.notify)
        }

    }

    notify=()=>{
        if(this.type=="recent"){
            this.setState({newMsgNum:Store.getTotalNewMSgNum()});
        }
    }

    render() {
        var icon = null;
        var redTip = null;
        if(this.type=="recent"){
            icon = this.focused?<Icon name="message-outline" size={26} color="#f9e160" style={{position:"absolute",right:1}}/> : <Icon name="message-outline" size={26}  color="#d0d0d0" style={{position:"absolute",right:1}}/>;
            if(Store.getTotalNewMSgNum()>0)
                redTip = <View style={{width:16,height:16,borderRadius:16,backgroundColor:"red",overflow:"hidden",position:"absolute",right:1,top:1,flexDirection:"row",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:10,color:"#ffffff",textAlign:"center"}}>{Store.getTotalNewMSgNum()}</Text></View>
        }
        return(<View style={{height:26,width:26}}>
            {icon}{redTip}
        </View>);
    }
}

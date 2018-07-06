import React, { Component} from 'react';
import {
    Alert,AlertIOS,Clipboard,Dimensions,Image,Platform,StyleSheet,Switch,TextInput,ToastAndroid,TouchableOpacity,View,ScrollView
} from 'react-native';
import Store from "../store/LocalStore"
import {Button, Icon, Text, Toast} from 'native-base'
import { Card} from 'react-native-elements'


const RNFS = require('react-native-fs')
var path = RNFS.DocumentDirectoryPath + '/test.txt';



export default class LogView extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            result:""
        }
        this.path = this.props.navigation.state.params.path
    }

    componentDidMount(){

        this.reload()
    }

    reload = ()=>{
        RNFS.exists(this.path).then(result=>{
            if(result){
                RNFS.readFile(this.path).then(result=>{
                    this.setState({
                        result
                    })
                })
            }
        })
    }

    render() {


        return (
            <ScrollView style={{}}
                        contentContainerStyle={{marginVertical:20,display:'flex',justifyContent:'center',alignItems:'center'}}>
                <View style={{display:'flex',justifyContent:'space-around',alignItems:'center',flexDirection:"row",flex:1,width:"100%"}}>
                    <View>
                        <Button iconLeft  info onPress={()=>{
                            RNFS.writeFile(this.path, "", 'utf8')
                                .then((success) => {
                                    this.reload()
                                })
                                .catch((err) => {
                                    console.log(err.message);
                                });
                        }}>
                            <Icon name='refresh' />
                            <Text>清空</Text>
                        </Button>
                    </View>
                 <View>
                     <Button iconLeft  info onPress={()=>{
                         this.reload()
                     }}>
                         <Icon name='refresh' />
                         <Text>刷新</Text>
                     </Button>
                 </View>

                </View>
                <Card title="" style={{}}>
                    <Text>
                        {this.state.result}
                    </Text>
                </Card>


            </ScrollView>);

    }
}

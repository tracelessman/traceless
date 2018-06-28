import React, { Component} from 'react';
import {
    Alert,AlertIOS,Clipboard,Dimensions,Image,Platform,StyleSheet,Switch,TextInput,ToastAndroid,TouchableOpacity,View,ScrollView
} from 'react-native';
import Store from "../store/LocalStore"
import {Button, Icon, Text, Toast} from 'native-base'
import { Card} from 'react-native-elements'


const RNFS = require('react-native-fs')
var path = RNFS.DocumentDirectoryPath + '/test.txt';



export default class DevView extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            result:""
        }
    }

    componentDidMount(){

        this.reload()
    }

    reload(){
        RNFS.readFile(path).then(result=>{
            this.setState({
                result
            })
        })

    }

    render() {


        return (
            <ScrollView style={{}}
                        contentContainerStyle={{marginVertical:20,display:'flex',justifyContent:'center',alignItems:'center'}}>
                <Card title="" style={{}}>
                    <Text>
                        {this.state.result}
                    </Text>
                </Card>
                <Button iconLeft  info onPress={()=>{
                    RNFS.writeFile(path, "", 'utf8')
                        .then((success) => {
                            console.log('FILE WRITTEN!');
                            this.reload()
                        })
                        .catch((err) => {
                            console.log(err.message);
                        });
                }}>
                    <Icon name='refresh' />
                    <Text>clear</Text>
                </Button>
                <Button iconLeft  info onPress={()=>{
                    this.reload()
                }}>
                    <Icon name='refresh' />
                    <Text>reload</Text>
                </Button>

            </ScrollView>);

    }
}

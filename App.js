import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  FlatList,
  TouchableOpacity
} from 'react-native';
import firestore from '@react-native-firebase/firestore';



const App = () => {
  useEffect(() => {
    firestore()
    .collection('messages').orderBy("time", "desc")
    .onSnapshot(documentSnapshot => {
      var messages = []
      documentSnapshot.forEach(documentSnapshot => {
        messages.push(documentSnapshot.data())
      });
      setMessages(messages);
    });
  }, []);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState()
  const [isLogin, setIsLogin] = useState(true)
  const [user, setUser] = useState()

  const sendMessage = () => {
    var timeStamp = new Date();
    var timeString = timeStamp.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})
    timeString = timeString.slice(0,-3);
    firestore()
    .collection('messages')
    .add({
      messageOwner: user,
      message: text,
      time:timeStamp,
      timeString: timeString
    })
    setText("")
  }

  if(isLogin){
    return(
      <View style = {styles.container}>
          <View style = {styles.content}>
            <Text style = {{position: "absolute",fontSize:30,fontWeight:'bold',letterSpacing:3,top:0,marginTop:'10%'}}>Chat App</Text>
            <TextInput
            style={styles.loginTextInput}
            onChangeText={(text) => {setUser(text)}}
            value={user}
            placeholder ={"Name"}
              />
            <TouchableOpacity style = {styles.loginBtn} onPress = {() => {setIsLogin(false)}}>
              <Text style = {{color:'white',letterSpacing:1}}>Login</Text>
            </TouchableOpacity>
          </View>

      </View>
    )
  }else{
    return (
      <View style = {styles.container}>
        <View style = {styles.flatList}>
          <FlatList
          data={messages}
          inverted = {true}
          style = {{width:'100%',marginTop:'5%'}}
          keyExtractor={(item, index) => item.toString() + index.toString()}
          renderItem={({ item }) => (
            <View key = {item.time.toString()} style = {styles.messageView}>
            <Text style = {styles.messageOwnerText}>{item.messageOwner}</Text>
            <Text style = {styles.messageTextColor}>{item.message}</Text>
            <Text></Text>
            <Text style = {styles.messageTimeText}>{item.timeString}</Text>
          </View>
          )}
        />
        </View>
      <View style = {styles.bottomBar}>
        <View style = {styles.bottomBarContent}>
          <View style = {styles.textInputFieldView}>
          <TextInput
            style={styles.textInputField}
            onChangeText={(text) => {setText(text)}}
            value={text}
        />
          </View>
          <View style = {styles.sendBtnView}>
            <TouchableOpacity style = {styles.sendBtn} onPress = {() => {sendMessage()}}>
              <Text style = {{color:'white',letterSpacing:1}}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </View>
    );
  };
  }


const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  bottomBar: {
    position:"absolute",
    height:'8%',
    width:'100%',
    backgroundColor:'grey',
    bottom:0
  },
  bottomBarContent: {
    flex:8,
    flexDirection:'row'
  },
  textInputFieldView:{
    flex:6,
    justifyContent: 'center',
    alignItems:'center'
  },
  sendBtnView: {
    flex:2,
    justifyContent: 'center',
    alignItems:'center'
  },
  sendBtn: {
    backgroundColor:'#006994',
    height:'70%',
    width:'80%',
    borderRadius:8,
    justifyContent: 'center',
    alignItems:"center"
  },
  textInputField: {
    height:'70%',
    width:'95%',
    backgroundColor:'white',
    borderRadius:8,
  },
  flatList: {
    width:'100%',
    height:'92%',
    alignItems:'center',
  },
  messageView: {
    width:'85%',
    backgroundColor:'grey',
    padding:'2%',
    borderRadius:5,
    marginBottom:'5%',
    alignSelf:'center'
  },
  messageTextColor: {
    color:'white',
  },
  messageOwnerText: {
    color:'#6200b3'
  },
  messageTimeText: {
    color:"#444444",
    position:'absolute',
    bottom:0,
    right:0,
    padding:'1.5%'
  },
  content: {
    justifyContent: 'center',
    alignItems:"center",
    height:'100%',
    width:'100%'
  },
  loginTextInput: {
    height:'6%',
    width:'40%',
    borderColor:'grey',
    borderWidth:2,
    marginBottom:'5%'
  },
  loginBtn: {
    backgroundColor:'#006994',
    height:'6%',
    width:'40%',
    borderRadius:8,
    justifyContent: 'center',
    alignItems:"center"
  }
});

export default App;

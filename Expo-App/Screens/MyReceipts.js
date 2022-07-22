import React, { useState, Component, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, TextInput, View, Button, Text, SafeAreaView, FlatList } from 'react-native';
import { DataTable } from 'react-native-paper';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { NFTCard, HomeHeader, FocusedStatusBar, CircleButton, Loading } from "../components";
import { COLORS, NFTData, assets } from "../constants";
import { event } from 'react-native-reanimated';
import  {firebase} from '../firebase';
import { NavigationHelpersContext } from '@react-navigation/native';


const MyReceiptsScreen = ({navigation, route}) => {
  // const isCancelled = React.useRef(false);
  const[updateScreen,setUpdateScreen]=useState(true)
  const [found, setFound]= useState(false);
  const [filter, setFilter]= useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [userKey, setuserKey] = useState('');
  // 33310727751848c19a8877140d3ce3ac
  const [fromDate, setfromDate] = useState('1/1/1950');
  const [toDate, settoDate] = useState('1/1/2023');
  const [JsonData, setJsonData] = useState([]);
  const [original, setOriginal] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [image, setImage] = useState(null)

  useFocusEffect(
    React.useCallback(()=>{
      setFilter(false)
      setJsonData([]);
      if (userKey==''){
        getIdandReceipts();
      }
      else {
        getAllReceipts(userKey);
        getStores(userKey);
      }
    
    },[updateScreen]));

  // useEffect(()=>{
  //     setAll([]);
  //     if (userKey==''){
  //       getIdandReceipts();
  //     }
  //     else {
  //       getAllReceipts(userKey);
  //       getStores(userKey);
  //     }
  //     return () => {
  //       isCancelled.current = true;
  //     };
  //   },[]);


    // useEffect(()=>{
    //   console.log("333333333333333333333333333333",JsonData);
    // },[updateScreen])



//   useEffect(()=>{
//     if (userKey==''){
//       getIdandReceipts();
//     }
//     else {
//       getAllReceipts(userKey);
//       getStores(userKey);
//     }
//  },[]);
 
  // get id of user and all his receipts
  const getIdandReceipts = async () => {
    try {
      const value = await AsyncStorage.getItem('userId')
      if(value !== null) {
        console.log("getdata: ",value);
        setuserKey(value);
        getAllReceipts(value);
        getStores(value);
      }
    } catch(e) {
      console.log(e);
      // error reading value
    }
    // setuserKey("c590e1226f184638bb3753188e37917a");
    // getAllReceipts("c590e1226f184638bb3753188e37917a");
    // getStores("c590e1226f184638bb3753188e37917a");
    // setuserKey(userKey)
    // getAllReceipts(userKey)
    // getStores(userKey);
  }


  // set all variables:
  const setAll = (data)=>{
    let len = (Object.keys(data)).length;
    if (len==0){
      setFound(false);
    }
    else {
      setJsonData(data);
      setFound(true);
    }
    setisLoading(false);
  }


  // default receipts view -  by date_of_receipt
  async function getReceiptsByDate() {
    setisLoading(true);
    fetch(`http://${route.params.url}/scan_receipt_controller/get_receipt_by_date`, {
        method: 'GET',
        headers: {
            'content-type': 'aplication/json',
            'user_key': userKey,
            'from_date': fromDate,
            'to_date': toDate,
        },
    }).then(res => res.json()).then(data => {
      setAll(data);
    });
  }
    
    const searchName = (s)=> {
      // setisLoading(true);
      console.log(s);
      fetch(`http://${route.params.url}/scan_receipt_controller/get_receipt_by_name`, {
          method: 'GET',
          headers: {
              'content-type': 'aplication/json',
              'user-key': userKey,
              'name_search' : s,
          },
      }).then(res => res.json()).then(data => {
        setAll(data);
        setFilter(true);
    });
  }

  const getStores = (val)=> {
    fetch(`http://${route.params.url}/scan_receipt_controller/get_markets`, {
        method: 'GET',
        headers: {
            'content-type': 'aplication/json',
            'user-key': val,
        },
    }).then(res => res.json()).then(data => {
      setStores(data);
  });
}

const getReceiptsByStore = (val)=> {
  // setisLoading(true);
  fetch(`http://${route.params.url}/scan_receipt_controller/get_receipt_by_market`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user-key': userKey,
          'market' : val
      },
  }).then(res => res.json()).then(data => {
    setAll(data);
    setFilter(true);
});
}

const getAllReceipts = (val)=> {
  fetch(`http://${route.params.url}/scan_receipt_controller/get_all_receipts_user`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user_key' : val,
      },}).then(res=>res.json()).then(data => 
      {
        console.log(data);
    setOriginal(data);
    setAll(data);
    setisLoading(false);
});
}

const getImg =  async (uri)=> {
  setImage(uri);
  navigation.navigate("ScanedImage", {uri})
  // // setisLoading(true);
  // const res = await fetch(uri)
  // const blob = await res.blob();
  // const filename = uri.substring(uri.lastIndexOf('/')+1);
  // var ref = firebase.storage().ref().child(filename).put(blob);
  // try {
  //   await ref;
  // } catch (e){
  //   console.log(e);
  // }
  // Alert.alert('Photo uploaded');
  // await firebase.storage().ref().child(filename).getDownloadURL(ref).then( img => {
  //   setImage(img);
  // })
//   fetch(`http://${route.params.url}/scan_receipt_controller/get_image_receipt`, {
//       method: 'GET',
//       headers: {
//           'content-type': 'multipart/form-data',
//           'user_key' : userKey,
//           '_id' : val,
//       },
//   }).then(res => 
//     res.json()).then(res => {
//     const imageBlob = res.blob();
//     const imageObjectURL = URL.createObjectURL(imageBlob);
// });
}

const trashReceipt = (val)=> {
  // console.log("trash");
  console.log("111111111111111111:", JsonData[val]);
  // console.log("22222222222222222222222:", JsonData);
  // delete JsonData[val]
  // console.log("444444444444444444444444444444",JsonData);
  // Object.values(JsonData).map((account)=>{
    //     if (account._id==val){
      //       let x = JsonData[account._id]
      
      //       setJsonData(delete JsonData[val]);
      //       console.log("2222222222222:",JsonData);
      //   }
      //     })
      
      fetch(`http://${route.params.url}/scan_receipt_controller/delete_receipt`, {
        method: 'DELETE',
        body: JSON.stringify({
          'user_key': userKey,
          '_id' : val,
      }),
      headers: {
        'content-type': 'aplication/json',
      },
    }).then(res => res.text()).then(data => {
      console.log("data:", data);
      if (data=='True'){
        console.log(JsonData[val]);
        delete JsonData[val]
        setJsonData(JsonData);
        setUpdateScreen(!updateScreen)
        
      // Object.values(JsonData).map((account)=>{
      //   if (account._id==val){
      //     let x = JsonData[account._id]
      //     delete JsonData[val]
      //     setJsonData(JsonData);
      //     console.log(JsonData);
      // }
      //   })
    }
});
}



  if (!isLoading){
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FocusedStatusBar backgroundColor={COLORS.primary} />
        <View style={{ flex: 1 }}>
          <View style={{ zIndex: 0 }}>
            
            {JsonData?<FlatList
              data={Object.values(JsonData)}
              renderItem={({ item }) => <NFTCard data={item} handlePress={()=>trashReceipt(item._id)} date={item.date_of_receipt.slice(0,16)} price={item.total_price} receipt={true} handleGetImg={(v)=>getImg(v)}/>}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
              <HomeHeader data={stores} searchByName={searchByName} setSearchByName={(val)=>setSearchByName(val)} onSearch={searchName} onSelect={(val)=>getReceiptsByStore(val)} filter={filter} setFilter={setFilter} Type={"Receipt"} setAll={setAll} original={original} setJsonData={setJsonData}/>}/>:<></>}
          </View>
  
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              zIndex: -1,
            }}
          >
            <View
              style={{ height: 300, backgroundColor: COLORS.primary }} />
            <View style={{ flex: 1, backgroundColor: COLORS.white }} />
          </View>
        </View>
      </SafeAreaView>
    )
}
else {
  return (
    <Loading/>
    // <View style={styles.container}> 
    //   <Text>Loading...</Text>
    //   </View>

  )
}
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
  },
  input: {
    width: 250,
    height: 44,
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#e8e8e8'
  },
});

export default MyReceiptsScreen





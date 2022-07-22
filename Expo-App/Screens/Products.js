import React, { useState, useEffect } from "react";

import { COLORS, FONTS, SIZES, assets } from "../constants";
import { StyleSheet, TextInput, View, Button, Text, SafeAreaView, FlatList,TouchableOpacity,Image} from 'react-native';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { ProductCard, HomeHeader, FocusedStatusBar, SearchHeader, Loading } from "../components";
import { useFocusEffect } from '@react-navigation/native';


const Products = ({route, navigation}) => {
  const [found, setFound]= useState(false);
  const [filter, setFilter]= useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [userKey, setuserKey] = useState('');
  const [JsonData, setJsonData] = useState([]);
  const [original, setOriginal] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [image, setImage] = useState(null)
  const [text, setText] = React.useState("waiting...");


  // useEffect(async ()=>{
  //   async function fetchdata() 
  //   if (userKey==''){
  //     try {
  //       const value = await AsyncStorage.getItem('userId')
  //       if(value !== null) {
  //         console.log("getdata: ",value);
  //         setuserKey(value);
  //         getAllProducts(value);
  //       }
  //     } catch(e) {
  //       // error reading value
  //     }
  //   }
  //   else {
  //     setFilter(false)
  //     getAllProducts(userKey);
  //   }
  // },[])

  const getIdandProducts = async () => {
    try {
      const value = await AsyncStorage.getItem('userId')
      if(value !== null) {
        console.log("getdata: ",value);
        setuserKey(value);
        getAllProducts(value);
      }
    } catch(e) {
      // error reading value
    }
   
  }

  useEffect(()=>{
    let isCancelled = false;
   
    
      //setAll([]);
      if (userKey==''){
        getIdandProducts().then(() => {
          if (!isCancelled) {
            setText("done!");
          }
      })}
      else {
         getAllProducts(userKey).then(()=>{
          if (!isCancelled) {
            setText("done!");
          }
         })
      }
    
    return () => {
      isCancelled = true;
    };

    },[]);

  // useFocusEffect(
  //   React.useCallback(async ()=>{
  //     async function fetchdata() {

  //       if (userKey==''){
  //         try {
  //           const value = await AsyncStorage.getItem('userId')
  //           if(value !== null) {
  //             console.log("getdata: ",value);
  //             setuserKey(value);
  //             //getAllProducts(value);
  //             fetch(`http://${route.params.url}/recommendation_system_controller/get_general_recommendation`, {
  //               method: 'GET',
  //               headers: {
  //                   'content-type': 'aplication/json',
  //                   'user_key' : value,
  //               },}).then(res=>res.json()).then(data => 
  //               {
  //             setOriginal(data);
  //             setAll(data);
          
  //         });
  //           }
  //         } catch(e) {
  //           // error reading value
  //         }
  //       }
  //       else {
  //         setFilter(false)
  //         //getAllProducts(userKey);
  //         fetch(`http://${route.params.url}/recommendation_system_controller/get_general_recommendation`, {
  //           method: 'GET',
  //           headers: {
  //               'content-type': 'aplication/json',
  //               'user_key' : userKey,
  //           },}).then(res=>res.json()).then(data => 
  //           {
  //         setOriginal(data);
  //         setAll(data);
      
  //       });
  //     }
  //     } 
  //     fetchdata();
  //   },[]));
 

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
    setisLoading(false)
  }

const getByStore = (val)=> {
  fetch(`http://${route.params.url}/recommendation_system_controller/get_recommendation_for_store`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user_key': userKey,
          'store_name' : val
      },
  }).then(res => res.json()).then(data => {
    setJsonData(data);
    setStoreName('');
    setFilter(true);
});
}



const getAllProducts = (val)=> {
  fetch(`http://${route.params.url}/recommendation_system_controller/get_general_recommendation`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user_key' : val,
      },}).then(res=>res.json()).then(data => 
      {
    setOriginal(data);
    setAll(data);

});
}




  if (!isLoading){
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FocusedStatusBar backgroundColor={COLORS.primary} />
        <View style={{ flex: 1 }}>
          <View style={{ zIndex: 0 }}>
            <FlatList
              data={Object.values(JsonData)}
              renderItem={({ item }) => <ProductCard data={item}/>}
              keyExtractor={(item) => item.itemID}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={<SearchHeader handleSearch={(val)=>getByStore(val)} searchByName={searchByName} setSearchByName={setSearchByName} original={original} setJsonData={setJsonData} filter={filter} setFilter={setFilter}/>}
            />
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
  return null
    // <Loading/>
    // <View style={styles.container}> 
    //   <Text>Loading...</Text>
    //   </View>

  
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
export default Products;

import { View, Text, SafeAreaView, Image, StatusBar, FlatList , StyleSheet} from "react-native";
import React, {useState, useEffect} from "react";
import { COLORS, SIZES, assets, SHADOWS, FONTS } from "../constants";
import { CircleButton, RectButton, SubInfo, DetailsDesc, DetailsBid, FocusedStatusBar } from ".";
import {firebase} from '../firebase'

const DetailsHeader = ({navigation }) => (
  <View style={{ width: "100%", height: 80 }}>
    {/* <Image
      source={assets.nft01}
      resizeMode="cover"
      style={{ width: "100%", height: "100%" }}
    /> */}

    <CircleButton
      imgUrl={assets.left}
      handlePress={() => navigation.navigate("Receipts")}
      right={15}
      top={StatusBar.currentHeight + 10}
    />

    {/* <CircleButton
      imgUrl={assets.heart}
      right={15}
      top={StatusBar.currentHeight + 10}
    /> */}
  </View>
  
);

const DigitalShow= ({ route, navigation }) => {
  const { data } = route.params;
  const [img2 , setImg2] = useState(null)
  const [img , setImg] = useState(null)


  // useEffect(()=> {getBarcode(data.filename);})
  useEffect(()=> {getBarcode('/barcode.png');
getBarcode2('/סופר-פארם-שירות-לקוחות-לוגו.jpg');
// getBarcode2('/Walmart.png');
},[])


  const getBarcode = async (filename)=>{
      var ref = firebase.storage().ref().child(filename)
      await firebase.storage().ref(filename).getDownloadURL(ref).then( x => {
        setImg(x);
      })
  }
  const getBarcode2 = async (filename)=>{
    var ref = firebase.storage().ref().child(filename)
    await firebase.storage().ref(filename).getDownloadURL(ref).then( x => {
      setImg2(x);
    })
}

  return (
    
    img&& img2 ?<SafeAreaView style={{ flex: 1 }}>
      <DetailsHeader data={data} navigation={navigation} />

      <FocusedStatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

     
      
      {/* <Image style={{height:'40%', width:'100%'}} resizeMode='contain' source={{uri: img}}/> */}
      <FlatList
        data={data.items}
        renderItem={({ item }) => <DetailsBid bid={item} />}
        keyExtractor={( item ) =>item.itemID}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: SIZES.extraLarge * 3,
          paddingLeft: SIZES.large*1.5,
          paddingRight: SIZES.large*1.5,
        }}

        ListFooterComponent={()=>(
          <React.Fragment>
            <View
      style={{
        width: "100%",
        // flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: SIZES.base,
        paddingHorizontal: SIZES.base,
      }}>

          <Text
          style={{
            fontFamily: FONTS.semiBold,
            fontSize: SIZES.extraLarge,
            color: COLORS.primary,
            alignContent: "center",
          }}
          >
          Total: {data.total_price.toFixed(2)}$
        </Text>
            <Image style={{height:'10%', width:'60%', paddingBottom:'50%',paddingTop:'10%'}} resizeMode='contain' source={{uri: img}}/>
            
            <RectButton minWidth={170} fontSize={SIZES.large} {...SHADOWS.dark} buttonText={"Download"} />
            
            </View>
          </React.Fragment>
        )
        
      }
        ListHeaderComponent={() => (
          <React.Fragment>
            {/* <SubInfo /> */}
            <View
      style={{
        width: "100%",
        // flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: SIZES.base,
        paddingHorizontal: SIZES.base,
      }}>
        <Image style={{height:'10%', width:'50%', paddingBottom:'20%',paddingTop:'10%'}} resizeMode='contain' source={{uri: img2}}/>
    <Text
          style={{
            fontFamily: FONTS.semiBold,
            fontSize: SIZES.extraLarge+5,
            color: COLORS.primary,
            alignContent: "center"
          }}
        >
          {data.market}
        </Text>
        <Text style={styles.text_header_date}>
          {data.date_of_receipt.slice(0,-13)}
        </Text>
        <Text
          style={styles.text_header_date}>
          {data.date_of_receipt.slice(-13,-7)}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.semiBold,
            fontSize: SIZES.medium,
            color: COLORS.primary,
            alignContent: "center",
            paddingBottom: SIZES.extraLarge,
          }}
        >
          Receipt Number: {data.receiptID}
        </Text>

      </View>
        
            {/* <View style={{ padding: SIZES.font }}>
              <DetailsDesc data={data} />
              
              
            </View> */}
            
          </React.Fragment>
          
          )}
      />
      
    </SafeAreaView>:
     <View
     style={{
       width: "100%",
       // flexDirection: "row",
       // justifyContent: "space-between",
       alignItems: "center",
       marginVertical: SIZES.base,
       padding: SIZES.base,
     }}>
       <Text>Loading...</Text>
     </View>
  );
};


const styles = StyleSheet.create({
  text_header: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
    alignContent: "center",
    paddingBottom: SIZES.extraLarge,
  },
  text_header_date: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.large,
    color: COLORS.primary,
    alignContent: "center"
  }
});

export default DigitalShow;

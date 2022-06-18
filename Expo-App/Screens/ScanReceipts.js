import React, { useState, useEffect, useRef } from 'react'
import {StyleSheet,Text,View,TouchableOpacity,Button,Modal,Image,Animated, TextInput} from 'react-native'
import { Camera } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import MyReceiptsScreen from './MyReceipts'

const ScanReceipts = ({navigation, route}) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null)
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null)
  const [image, setImage] = useState(null)
  const [first, setFirst] = useState(true)
  const [visible, setVisible] = useState(false)
  const [userKey, setuserKey] = useState('')
  const [amount, setAmount] = useState('55')
  const [date, setDate] = useState('')
  const [name, setName] = useState('')
  const [market, setMarket] = useState('')
  const [expireDate, setExpireDate] = useState('')
  const [specUrl, setSpecUrl] = useState('')
  const [isReceipt, setisReceipt] = useState(true)
  const [isUpLoading, setisUpLoading] = useState(true);
  const [imageId, setImageId] = useState('');
  const [JsonData, setJsonData] = useState([]);


  useEffect(() => {
    ;(async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync()
      setHasCameraPermission(cameraStatus.status === 'granted')
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
      setHasGalleryPermission(galleryStatus.status === 'granted')
    })();
    getId();
  }, [])

  const getId = async () => {
    // try {
    //   const value = await AsyncStorage.getItem('userKey')
    //   if(value !== null) {
    //     console.log("getdata: ",value);
    //     setuserKey(value);
    //     getAllCredits(value);
    //   }
    // } catch(e) {
    //   // error reading value
    // }
    setuserKey("ec2eac3508b24882bc45b09dfeee2ee3");
  }

  const setisReceiptData = (bool) => {
    setisReceipt(bool);
    setFirst(false);
    if (bool){
      setSpecUrl('scan_receipt_controller');
    }
    else {
      setSpecUrl('scan_credit_controller');
    }
  }

  // const ModalPoup = ({visible, children}) => {
  //   const [showModal, setShowModal] = React.useState(visible);
  //   const scaleValue = React.useRef(new Animated.Value(0)).current;
  //   React.useEffect(() => {
  //     toggleModal();
  //   }, [visible]);
  //   const toggleModal = () => {
  //     if (visible) {
  //       setShowModal(true);
  //       Animated.spring(scaleValue, {
  //         toValue: 1,
  //         duration: 300,
  //         useNativeDriver: true,
  //       }).start();
  //     } else {
  //       setTimeout(() => setShowModal(false), 200);
  //       Animated.timing(scaleValue, {
  //         toValue: 0,
  //         duration: 300,
  //         useNativeDriver: true,
  //       }).start();
  //     }
  //   };
  // }

  // async function takeAndUploadPhotoAsyncccc() {
  //   // Display the camera to the user and wait for them to take a photo or to cancel
  //   // the action
  //   let result = await ImagePicker.launchCameraAsync({
  //     allowsEditing: true,
  //     base64: true,
  //   })
  //   if (result.cancelled) {
  //     return
  //   }
  
  //   //console.log(result);
  //   //setImage(result.uri);
  //   // ImagePicker saves the taken photo to disk and returns a local URI to it
  //   let localUri = result.uri
  //   console.log(localUri);
  //   let filename = localUri.split('/').pop()
  //   // try {
  //   //   const response = await API.post("/scan_receipt", { "image": result.base64, "user_name" : 'shoval' });
  //   // }
  //   // catch(err){
  //   //   console.log(err);
  //   //   console.log("error sending data");
  //   // }
  //   // Upload the image using the fetch and FormData APIs
  //   // let formData = new FormData();
  //   // // // Assume "photo" is the name of the form field the server expects
  //   // formData.append('image', { uri: localUri, name: 'receipt#1', type: result.type });
  //   // // formData.append('user_name', "shoval");
  //   // return await fetch("http://127.0.0.1:5000/scan_receipt", {
  //   //   method: 'POST',
  //   //   body: JSON.stringify(formData),
  //   //   headers: {
  //   //     'content-type': 'multipart/form-data',
  //   //   },
  //   // });
  //   console.log(result.base64.length)
  //   var base64Icon = `data:image/png;base64,${result.base64}`

  //   setImage(base64Icon)

  //   fetch(
  //     'https://4faeb637-e3f0-403a-ab6c-4b8ab598b196.mock.pstmn.io/scan_receipt',
  //     {
  //       method: 'POST',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         image: result.base64.slice(0,100),
  //         user_name: 'yourOtherValue',
  //       }),
  //     },
  //   )
  //   //   fetch('https://4faeb637-e3f0-403a-ab6c-4b8ab598b196.mock.pstmn.io/scan_receipt', { method: 'POST',
  //   //     headers: {
  //   //     Accept: 'application/json',
  //   //     'Content-Type': 'application/json'
  //   //   },
  //   //   body: JSON.stringify({
  //   //     'image': result.base64.slice(2000000,3000000),
  //   //     'user_name': 'yourOtherValue'
  //   //   })
  //   // });
  // }


  const sendImage= async (local_uri) =>{
    setImage(local_uri);
    setisUpLoading(true);

    // ImagePicker saves the taken photo to disk and returns a local URI to it
    let filename = local_uri.split('/').pop();
    const formData = new FormData();
     // Infer the type of the image
  let match = /\.(\w+)$/.exec(filename);
  let type = match ? `image/${match[1]}` : `image`;
  console.log(match);
    let img = { uri: local_uri, name: filename, type }
    // let img = { uri: local_uri, name: filename, type: 'image/jpeg' }

    formData.append('image', img);
    formData.append('user_key', userKey);
    console.log(`http://${route.params.url}/${specUrl}/scan`);
    fetch(`http://${route.params.url}/${specUrl}/scan`, {
      method: 'POST',
      body:formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    }).then(res => res.json()).then(data => {
      console.log(data);
      setJsonData(data);
      setImageId(data._id);
      setDate(data.date);
      setMarket(data.market);
      setisUpLoading(false);
    });
  }

  async function takeAndUploadPhotoAsync() {
    // Display the camera to the user and wait for them to take a photo or to cancel
    // the action
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
    });
    if (result.cancelled) {
      return;
    }
    sendImage(result.uri);
  }

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    })

    if (result.cancelled) {
      return;
    }
    sendImage(result.uri);
  }

  const sendUpdates = async () => {
    const myHeaders = new Headers();
    myHeaders.append('content-type', 'aplication/json');
    if (!isReceipt){
      JsonData.expire_date = expireDate;
    }
    console.log(myHeaders);
    //const obj = JSON.parse(JsonData)
    console.log("lll");
    JsonData.name = name;
    JsonData.total_price = amount;
    //const newS = JSON.stringify(obj)
    console.log("news: ", JsonData)


    fetch(`http://${route.params.url}/${specUrl}/update`, {
      method: 'PATCH',
      body:JSON.stringify(JsonData),
      headers: {
        'content-type': 'aplication/json',
        'user_key' : userKey,
    },
    }).then(()=>{
      setImage(null);
      setVisible(false); 
      setFirst(true); 
    });
  }

  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>
  }

  return (
    <View style={styles.container}>
      {first && <>
        <Button title="Receipt" onPress={()=>{setisReceiptData(true);}}></Button>
        <Button title="Credit" onPress={()=>{setisReceiptData(false);}}></Button>
      </>}
      {!image && !first && <>
      <Button title="Scan" onPress={()=>takeAndUploadPhotoAsync()}></Button>
      <Button title="Choose From Gallery" onPress={()=> pickImageFromGallery()}></Button>
      </>}
      {image && <>
      <Image source={{ uri: image }} style={{ flex: 1 }} />
      <Button title="Submit" onPress={()=>{setVisible(true); }}></Button>
      </>}
      {visible && <View>
        <View style={{alignItems: 'center'}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Image
                source={require('../Images/x.png')}
                style={{height: 30, width: 30}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          {/* <Image
            source={require('../Images/success.png')}
            style={{height: 150, width: 150, marginVertical: 10}}
          /> */}
          {isUpLoading ? <Text>Uplaoding...</Text>:<>
          <TextInput
              value={name}
              onChangeText={(name) => setName(name)}
              placeholder={'Name'}
              style={styles.input}
            />
          <Text>Store: {market}</Text>
          <Text>Date: {date}</Text>
          {isReceipt && <>
          <Text>Total Amount is: {amount}$</Text>
          </>}
          {!isReceipt && <>
            <Text>Please Enter:</Text>
            <TextInput
              value={expireDate}
              onChangeText={(lname) => setExpireDate(lname)}
              placeholder={'Expiration Date'}
              style={styles.input}
            />
            <TextInput
              value={amount}
              onChangeText={(name) => setAmount(name)}
              placeholder={'Total Amount'}
              style={styles.input}
              />
          </>}
          <Button title="Confirm" onPress={()=>{sendUpdates();}}></Button>
          <Button title="Edit" onPress={()=>{}}></Button>
</>}
        </View>
      </View>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
    // shoval added
    // These below are most important, they center your border view in container
    // ref: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
    alignItems: 'center',
    justifyContent: 'center',
    //
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  button: {
    flex: 1,
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default ScanReceipts


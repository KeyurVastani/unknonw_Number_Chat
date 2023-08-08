import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Platform,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  FlatList,
  TouchableOpacity,
  Linking,
} from 'react-native';

import CallLogs from 'react-native-call-log';
import Icon from 'react-native-vector-icons/Feather';
import SplashScreen from 'react-native-splash-screen';
// import { useIsFocused,NavigationContainer } from '@react-navigation/native';

const App = () => {
  const [listData, setListDate] = useState([]);
  const [fresh, setfresh] = useState(false);
  //   const isFocused = useIsFocused();

  useEffect(() => {
    SplashScreen?.hide();
  }, []);

  async function fetchData() {
    if (Platform.OS != 'ios') {
      try {
        //Ask for runtime permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
          {
            title: 'Call Log Example',
            message: 'Access your call logs',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // CallLogs.loadAll().then((c) => setListDate(c));
          CallLogs.load(40).then(c => {
            setListDate(c);
            setfresh(false);
          });
        } else {
          alert('Call Log permission denied');
        }
      } catch (e) {
        alert(e);
      }
    } else {
      alert(
        'Sorry! You can’t get call logs in iOS devices because of the security concern',
      );
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const ItemView = ({item}) => {
    // Type : {item.type}

    //    DateTime : {item.dateTime}
    console.log('sdsdfsdfsd==', item);

    const lengthOfNumber = item.phoneNumber.length;
    const number = () => {
      if (lengthOfNumber == 13) {
        return item.phoneNumber.slice(3);
      } else if (lengthOfNumber == 12) {
        return item.phoneNumber.slice(2);
      } else {
        return item.phoneNumber;
      }
    };

    return (
      <TouchableOpacity
        style={styles.buttons}
        onPress={() => Linking.openURL(`http://wa.me/91${number()}`)}>
        <Text style={{fontSize: 20, fontWeight: 600, color: 'black'}}>
          {item.name ? item.name : number()}
        </Text>
        <Text
          style={{
            marginBottom: 5,
            color: 'black',
          }}>
          {item.dateTime}
        </Text>
        <Icon
          name={
            item.type === 'OUTGOING'
              ? 'phone-outgoing'
              : item.type === 'INCOMING'
              ? 'phone-incoming'
              : 'phone-missed'
          }
          size={20}
          color={
            item.type === 'OUTGOING'
              ? 'green'
              : item.type === 'INCOMING'
              ? 'black'
              : 'red'
          }
        />
      </TouchableOpacity>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // FlatList Item Separator
      <View
        style={{
          height: 3,
          marginVertical: 10,
          width: '100%',
          //   backgroundColor: 'white',
        }}
      />
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '20%',
            backgroundColor: '#25D366',
            borderBottomLeftRadius: 10,
            marginBottom: 20,
            borderBottomRightRadius: 10,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 24,
              paddingHorizontal: 10,
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            Connect whatsapp with Unknown number
          </Text>
        </View>
        <View
          style={{
            maxHeight: '80%',
          }}>
          <FlatList
            refreshing={fresh}
            data={listData}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
            keyExtractor={(item, index) => index.toString()}
            onRefresh={() => {
              fetchData();
              setfresh(true);
            }}
            ListFooterComponent={() => {
              return (
                <View
                  style={{
                    height: 50,
                  }}
                />
              );
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontWeight: 600,
  },
  buttons: {
    width: '90%',
    marginLeft: '4.5%',
    borderRadius: 10,
    elevation: 5,
    shadowOffset: {height: -1, width: 0},
    padding: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
});

export default App;

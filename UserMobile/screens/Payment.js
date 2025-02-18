import {
  View,
  Text,
  Touchable,
  Pressable,
  Image,
  Button,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useAuthContext} from '../src/Context/AuthContext';
import {useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {StripeProvider, useStripe} from '@stripe/stripe-react-native';
// import {ScrollView} from 'react-native-gesture-handler';

const Payment = () => {
  const route = useRoute();
  const price = route?.params?.price;
  const {tokens, users, name, userId} = useAuthContext();
  const [wallet, setWallet] = useState();
  const [visibility, setVisibility] = useState();
  useEffect(() => {
    visible();
    walletDetail();
  }, []);
  const navigation = useNavigation();
  const onCreateOrder = async () => {
    const response = await axios.post(
      `http://65.0.189.107:8000/api/v1/user/${users}/payWallet`,
      {price: price, canteenName: 'Sachivalaya'},
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    navigation.navigate('OtpScreen');
  };
  const walletDetail = async () => {
    const response = await axios.get(
      `http://65.0.189.107:8000/api/v1/user/${users}/wallet`,
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    // console.log(response.data.data);
    setWallet(response.data.data);
  };

  const visible = async () => {
    const response = await axios.get(
      `http://65.0.189.107:8000/api/v1/user/${users}/payWallet`,
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    setVisibility(response.data.data);
    // console.log(visibility);
  };
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    console.log('id:', users);
    const response = await axios.post(
      `http://65.0.156.10:6990/api/v1/payments/payment-sheet`,
      {userId: users, price: price},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const {paymentIntent, ephemeralKey, customer} = await response.data;
    console.log('response:', customer);
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {paymentIntent, ephemeralKey, customer, publishableKey} =
      await fetchPaymentSheetParams();

    const {error} = await initPaymentSheet({
      merchantDisplayName: 'Sachivalay',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: name,
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);
  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <StripeProvider
        publishableKey="pk_test_51KyqwvSFXhJBixXADhCK7QcvopmkFSi5zg7i2wFLoGvFHYXNb2waPBALIHBoj6ONtR9mZMRAYAi5f5wurs14H1cL00mKeQfwrs"
        // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      >
        <View style={{backgroundColor: 'white', flex: 1}}>
          <View
            style={{
              alignContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Text
              style={{
                fontSize: 22,
                color: 'black',
                fontFamily: 'Fredoka-Regular',
              }}>
              Payment Gateway
            </Text>
          </View>
          <View
            style={{
              alignContent: 'center',
              alignItems: 'center',
              marginTop: 30,
            }}>
            <View style={{alignSelf: 'center'}}>
              <Ionicons
                name="wallet-outline"
                size={60}
                color={visibility ? '#f35858' : 'grey'}
                style={{alignSelf: 'center'}}
              />
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 17,
                  color: 'black',
                  fontFamily: 'Fredoka-Regular',
                }}>
                Current Balance: {'\u20B9'}
                {wallet}
              </Text>
            </View>
            <Pressable
              onPress={onCreateOrder}
              disabled={!visibility}
              style={{
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                backgroundColor: visibility ? '#f7442d' : 'grey',
                borderRadius: 8,
                paddingHorizontal: 15,
                paddingVertical: 8,
                marginTop: 10,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Fredoka-Medium',
                  fontSize: 17,
                }}>
                Pay from your Wallet
              </Text>
            </Pressable>
            <View
              style={{
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: 15,
                opacity: visibility ? 0 : 1,
              }}>
              <Text
                style={{
                  color: 'red',
                  fontSize: 15,
                  fontFamily: 'Fredoka-Regular',
                }}>
                Your Balance is not sufficient
              </Text>
            </View>
          </View>
          <View
            style={{
              alignContent: 'center',
              alignItems: 'center',
              marginTop: 25,
            }}>
            <Text style={{color: 'black'}}>----------</Text>
            <Text
              style={{
                fontFamily: 'Fredoka-Regular',
                color: 'black',
                fontSize: 25,
              }}>
              {''}OR{''}
            </Text>
            <Text style={{color: 'black'}}>----------</Text>
          </View>
          {/* )} */}
          <Image
            source={require('../data/stripepay.png')}
            style={{width: 170, height: 80, alignSelf: 'center', marginTop: 10}}
          />
          <View
            style={{paddingHorizontal: 30, marginTop: 15, borderRadius: 10}}>
            <Button
              variant="primary"
              disabled={!loading}
              title="Checkout"
              onPress={openPaymentSheet}
            />
          </View>
        </View>
      </StripeProvider>
    </ScrollView>
  );
};

export default Payment;

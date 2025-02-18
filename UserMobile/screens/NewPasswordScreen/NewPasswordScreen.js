// import React, {useState} from 'react';
// import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
// import CustomInput from '../../components/CustomInput';
// // import CustomInput from '../../component'
// import CustomButton from '../../components/CustomButton';
// import SocialSignInButtons from '../../components/SocialSignInButtons';
// import {useNavigation} from '@react-navigation/native';
// import {useForm} from 'react-hook-form';
// import {useRoute} from '@react-navigation/native';
// import axios from 'axios';
// // import {Auth} from 'aws-amplify';

// const NewPasswordScreen = () => {
//   const {control, handleSubmit} = useForm();

//   const navigation = useNavigation();
//   const route = useRoute();
//   const email = route?.params.email;
//   const onSubmitPressed = async data => {
//     try {
//       const response = await axios.patch(
//         `http://13.233.214.112:8000/api/v1/user/${email}/updatePassword`,
//         data,
//       );
//       navigation.navigate('SignIn');
//     } catch (e) {
//       Alert.alert('Oops', e.message);
//     }
//   };

//   const onSignInPress = () => {
//     navigation.navigate('SignIn');
//   };

//   return (
//     <ScrollView showsVerticalScrollIndicator={false}>
//       <View style={styles.root}>
//         <Text style={styles.title}>Reset your password</Text>

//         <CustomInput
//           placeholder="Enter your new password"
//           name="password"
//           control={control}
//           secureTextEntry
//           rules={{
//             required: 'Password is required',
//             minLength: {
//               value: 8,
//               message: 'Password should be at least 8 characters long',
//             },
//           }}
//         />

//         <CustomButton text="Submit" onPress={handleSubmit(onSubmitPressed)} />

//         <CustomButton
//           text="Back to Sign in"
//           onPress={onSignInPress}
//           type="TERTIARY"
//         />
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   root: {
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#051C60',
//     margin: 10,
//   },
//   text: {
//     color: 'gray',
//     marginVertical: 10,
//   },
//   link: {
//     color: '#FDB075',
//   },
// });

// export default NewPasswordScreen;
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TextInput,
  Pressable,
} from 'react-native';
import CustomInput from '../../components/CustomInput';
// import CustomInput from '../../component'
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import AppLoader from '../../components/AppLoader';
// import {Auth} from 'aws-amplify';

const NewPasswordScreen = () => {
  const {control, handleSubmit} = useForm();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordWrong, setPasswordWrong] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const email = route?.params.email;
  const onSubmitPressed = async data => {
    if (password.length >= 8) {
      try {
        setLoading(true);
        const response = await axios.patch(
          `http://65.0.189.107:8000/api/v1/user/${email}/updatePassword`,
          {password: password},
        );
        navigation.navigate('SignIn');
        setLoading(false);
      } catch (e) {
        setLoading(false);
        Alert.alert('Oops', e.message);
      }
    } else {
      setPasswordWrong(true);
    }
  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: 'white'}}>
        <View style={styles.root}>
          <Image
            source={require('../../data/reset.png')}
            style={{
              height: 230,
              width: 230,
              borderRadius: 20,
              marginTop: 30,
              alignSelf: 'center',
            }}
          />
          <Text style={styles.title}>Reset your password</Text>

          <Text
            style={{
              color: 'black',
              fontSize: 14,
              fontFamily: 'Fredoka-Regular',
            }}>
            Password:
          </Text>
          <TextInput
            onChangeText={setPassword}
            secureTextEntry={true}
            value={password}
            style={{
              height: 36,
              borderWidth: 0.5,
              borderColor: '#d1cfcf',
              marginTop: 5,
              borderRadius: 8,
              paddingHorizontal: 10,
              fontSize: 13,
              fontFamily: 'Fredoka-Regular',
              color: 'black',
            }}
          />
          <Text
            style={{
              color: 'red',
              fontSize: 12,
              fontFamily: 'Fredoka-Regular',
              opacity: passwordWrong ? 1 : 0,
            }}>
            Password should be minimum of 8 characters
          </Text>
          {/* <CustomInput
            placeholder="Enter your new password"
            name="password"
            control={control}
            secureTextEntry
            rules={{
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password should be at least 8 characters long',
              },
            }}
          /> */}

          {/* <CustomButton text="Submit" onPress={handleSubmit(onSubmitPressed)} /> */}
          <Pressable
            onPress={onSubmitPressed}
            style={{
              alignContent: 'center',
              alignSelf: 'center',
              marginTop: 5,
              backgroundColor: '#f35858',
              paddingVertical: 12,
              borderRadius: 9,
            }}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Fredoka-Medium',
                paddingHorizontal: 127,
                fontSize: 15,
              }}>
              Submit
            </Text>
          </Pressable>
          <Pressable
            onPress={onSignInPress}
            style={{
              alignContent: 'center',
              alignSelf: 'center',
              marginTop: 20,
            }}>
            <Text style={{color: 'black', fontFamily: 'Fredoka-Regular'}}>
              Back to Sign in
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      {loading ? <AppLoader /> : null}
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    color: 'black',
    margin: 10,
    textAlign: 'center',
    fontFamily: 'Fredoka-Medium',
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  },
});

export default NewPasswordScreen;

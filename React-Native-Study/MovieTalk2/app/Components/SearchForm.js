import React, {Component} from 'react';
import styles from '../Styles/Main';
import {
  Text,
  View,
  Image,
  ListView,
  ActivityIndicator,
  TouchableHighlight,
  TextInput,
  AsyncStorage,
} from 'react-native';

import SearchResult from './SearchResult';

class SearchForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      query: '',
      loaded: true,
      opacity: 0,
    }

    // AsyncStorage.setItem('name', 'goze')
    // AsyncStorage.setItem('sex', 'man')
    // AsyncStorage.setItem('age', '12')

    // AsyncStorage.setItem('name', 'movieTalk')
    //   .then(() => {
    //     AsyncStorage.getItem('name')
    //       .then((value) => console.log(value))
    //   })

    // AsyncStorage.setItem('name', 'goze')
    //   .then(() => {
    //     AsyncStorage.getItem('name')
    //       .then((value) => console.log(value))
    //   })
    //   .then(() => {
    //     AsyncStorage.removeItem("name")
    //       .then(() => {
    //         AsyncStorage.getItem("name")
    //           .then((value) => console.log(value))
    //       })
    //   })
    // AsyncStorage.getAllKeys().then((keys) => console.log(keys));
    // AsyncStorage.multiRemove(['name', 'buzhidao']).then(() => {
    //   AsyncStorage.getAllKeys().then((keys) => console.log(keys));
    // })
    // AsyncStorage.clear().then(() => {
    //   AsyncStorage.getAllKeys().then((keys) => console.log(keys));
    // })
    // AsyncStorage.multiGet(['name', 'sex', 'age']).then((value) => {
    //   console.log(value) // [[],[],[]]
    // })
    // AsyncStorage.multiSet([['key1', 'val1'],['key2', 'val2']]).then(() => {
    //   AsyncStorage.getAllKeys().then((keys) => console.log(keys));
    //   AsyncStorage.getItem("key1")
    //             .then((value) => console.log(value))
    // })
  }

  fetchData() {
    this.setState({
      loaded: false,
      opacity: 1,
    })

    fetch(`https://api.douban.com/v2/movie/search?q=${this.state.query}`)
      .then(response => response.json())
      .then(responseData => {
        this.setState({
          loaded: true,
          opacity: 0,
        })

        this.props.navigator.push({
          title: responseData.title,
          component: SearchResult,
          passProps: {
            results: responseData.subjects
          }
        })
      })
  }

  render() {
    return (
      <View style={[styles.container, { paddingTop: 60, }]}>
        <View style={{
          paddingTop: 7,
          paddingLeft: 7,
          paddingRight: 7,
          borderColor: "rgba(100, 53, 201, 0.1)",
          borderBottomWidth: 1,
        }}>
          {/* base */}
          {/*<TextInput style={{ height: 50, }}*/}
          {/*placeholder="Search..."*/}
          {/*placeholderTextColor="#6435c9"*/}
          {/*secureTextEntry*/}
          {/*autoFocus={true}*/}
          {/*autoCorrect={false}*/}
          {/*editable={false}*/}
          {/*keyboardType="web-search"*/}
          {/*multiline={false} />*/}

          {/* ios */}
          {/*<TextInput style={{ height: 50, }} placeholder="search..."*/}
          {/*clearButtonMode="while-editing" clearTextOnFocus={true}*/}
          {/*enablesReturnKeyAutomatically={true} autoFocus={true}*/}
          {/*returnKeyType="search"*/}
          {/*onFocus={() => console.log("onFocus")}*/}
          {/*onBlur={() => console.log("onBlur")}*/}
          {/*onChange={() => console.log("onChange")}*/}
          {/*onChangeText={(text) => console.log(text)}*/}
          {/*onEndEditing={() => console.log("onEndEditing")}*/}
          {/*onSubmitEditing={() => console.log("onSubmitEditing")}*/}
          {/*/>*/}
          <TextInput style={{ height: 50, }} placeholder="search"
                     clearButtonMode="while-editing" returnKeyType="search" onChangeText={(query) => {
                       this.setState({
                         query: query
                       })
                     }}
                     onSubmitEditing={this.fetchData.bind(this)}
          />
          <ActivityIndicator size="small" color="#6435c9" animating={!this.state.loaded}
                             style={{ position: 'absolute', right: 10, top: 20, opacity: this.state.opacity, }}/>
        </View>
        <Text>搜索历史</Text>
      </View>
    )
  }
}

export {SearchForm as default}
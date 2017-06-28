import React, {Component} from 'react';
import styles from '../Styles/Main';
import {
  Text,
  View,
  Image,
  ListView,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';

class HeaderText extends Component {
  render() {
    return (
      <Text style={styles.itemText}>
        {this.props.children}
      </Text>
    )
  }
}

class InTheaters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // movies: ds.cloneWithRows(movies),
      movies: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      loaded: false
    }

    this.fetchData();
  }

  fetchData() {
    fetch("https://api.douban.com/v2/movie/in_theaters")
      .then(response => response.json())
      .then(responseData => {
        this.setState({
          movies: this.state.movies.cloneWithRows(responseData.subjects),
          loaded: true
        })
      })
  }

  renderMovieList(movie) {
    return (
      <TouchableHighlight underlayColor="rgba(34, 26, 38, 0.1)" onPress={() => {
        console.log(`<${movie.title}>被点击了`);
      }}>
        <View style={styles.item}>
          <View style={styles.itemImage}>
            <Image source={{uri: movie.images.large}} style={styles.image}/>
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemHeader}>{movie.title}</Text>
            <Text style={styles.itemMeta}>
              {movie.original_title}({movie.year})
            </Text>
            <Text style={styles.redText}>
              {movie.rating.average}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    if (!this.state.loaded) {
      return (
        <View style={styles.container}>
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#6435c9" />
          </View>
        </View>
      )
    }
    return (
      <View style={[styles.container, { paddingTop: 70, }]}>
        <ListView dataSource={this.state.movies} renderRow={this.renderMovieList}/>
      </View>
    )
  }
}

export { InTheaters as default };
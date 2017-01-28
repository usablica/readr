import React, { Component } from 'react'
import { ScrollView, TouchableHighlight, View, StyleSheet, Platform, Image } from 'react-native'
import colors from 'HSColors'
import socialColors from 'HSSocialColors'
import fonts from 'HSFonts'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {
  Text,
  Button,
  SearchBar,
  Grid,
  Card,
  Col,
  Row
} from 'react-native-elements'

let styles = {}

class Home extends Component {
  constructor() {
    super();

    this.state = {
      stories: [],
      loaded: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    fetch('https://sandbox.aylien.com/newsapi/stories?published_at.start=NOW-90DAYS&published_at.end=NOW')
      .then((response) => response.json())
      .then((resp) => {
        console.log('done')
        console.log(resp)

        this.setState({
          loaded: true,
          stories: resp.stories
        });
      }).catch((err) => {
        console.warn(err);
      }).done();
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          Loading...
        </Text>
      </View>
    );
  }

  search() {
    fetch
  }

  render () {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    let stories = this.state.stories;

    console.log('stories', stories)

    return (
      <View style={styles.container}>
        <SearchBar
          round
          onChangeText={search}
          placeholder='Search here...' />

        <ScrollView style={{backgroundColor: 'white'}}>

          {stories.map(function(object, i){
            return <Card key={object.id}
              title={object.title}
              image={{uri: object.media.length > 0 ? object.media[0].url : ''}}>

              <Text style={{marginBottom: 10}}>
                {object.body.replace('/n', '').replace('/r', '').substring(0, 100)}
              </Text>
            </Card>
          })}
        </ScrollView>
      </View>
    )
  }
}

styles = StyleSheet.create({
  container: {
    marginTop: 21,
  },
  heading: {
    color: 'white',
    marginTop: 10,
    fontSize: 22
  },
  hero: {
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: colors.primary2
  },
  titleContainer: {
  },
  button: {
    marginTop: 15
  },
  title: {
    textAlign: 'center',
    color: colors.grey2,
    ...Platform.select({
      ios: {
        fontFamily: fonts.ios.black
      }
    })
  }
})

export default Home

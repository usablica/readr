import React, { Component } from 'react'
import { ScrollView, TouchableHighlight, View, StyleSheet, Platform, Image, ListView } from 'react-native'
import colors from 'HSColors'
import socialColors from 'HSSocialColors'
import fonts from 'HSFonts'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {debounce} from 'throttle-debounce'

import {
  Text,
  Button,
  SearchBar,
  Grid,
  Card,
  Col,
  Row
} from 'react-native-elements'

import NewsAPIQuery from '../lib/newsapi/query'
import NewsAPI from '../lib/newsapi/newsapi'

let styles = {}

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stories: [],
      cursor: null,
      loaded: false,
      query: {}
    };

    this.ds = new ListView.DataSource({
      rowHasChanged: this._rowHasChanged.bind(this),
    });
  }

  componentDidMount() {
    this.fetchData();
  }


  fetchData(next = false) {
    debounce(500, this.rawFetchData(next));
  }

  _rowHasChanged(r1, r2) {
    // You might want to use a different comparison mechanism for performance.
    return JSON.stringify(r1) !== JSON.stringify(r2);
  }

  rawFetchData(next = false) {
    let apiQuery = new NewsAPIQuery();

    if (next) {
      apiQuery.cursor(this.state.cursor);
    }

    apiQuery.mergeQuery(this.state.query);

    console.log(this.state.query)
    let newsAPI = new NewsAPI(apiQuery);

    newsAPI.stories()
      .then((resp) => {
        let stories = [];

        if (this.state.stories.length > 0 && next) {
          stories = this.state.stories.concat(resp.stories);
        } else {
          stories = resp.stories;
        }

        this.setState({
          loaded: true,
          cursor: resp.next_page_cursor,
          stories: stories,
          dataSource: this.ds.cloneWithRows(stories),
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

  setQuery(obj) {
    Object.assign(this.state.query, obj);
    this.refs.stories.scrollTo({y: 0});
    this.fetchData();
  }

  onEndReached() {
    console.log('loading more')

    if (this.state.loading) {
      return;
    }

    this.fetchData(true);
  }

  render () {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <View style={styles.container}>
        <SearchBar
          round
          onChangeText={(text) => this.setQuery({text})}
          placeholder='Search here...' />

        <ListView
          ref="stories"
          dataSource={this.state.dataSource}
          renderRow={(object) =>
            <Card key={object.id}
              title={object.title}
              image={{uri: object.media.length > 0 ? object.media[0].url : ''}}>

              <Text style={{marginBottom: 10}}>
              {object.body.replace('/n', '').replace('/r', '').substring(0, 100)}
              </Text>
            </Card>
          }
          style={{backgroundColor: 'white'}}
          onEndReached={this.onEndReached.bind(this)}
        />
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

import NewsAPIQuery from './query'

export default class NewsAPI {
  constructor(apiQuery) {
    this._q = apiQuery;
    this._headers = new Headers();
    // to set necessary headers
    this.setInitialHeaders();
  }

  get newsAPIQuery() {
    return this._q;
  }

  setInitialHeaders() {
    this._headers.append('referer', 'http://newsapi.aylien.com/');
  }

  stories() {
    return fetch(
      this._q.url + '/stories?' + this._q.serialize(),
      {
        method: 'GET',
        headers: this._headers
      }
    ).then((res) => res.json());
  }
}

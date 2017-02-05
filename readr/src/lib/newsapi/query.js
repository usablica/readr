export default class NewsAPIQuery {
  constructor() {
    this._url = "https://sandbox.aylien.com/newsapi";
    this._query = {};
    this.defaultQuery();
  }

  get query() {
    return this._query;
  }

  get url() {
    return this._url;
  }

  defaultQuery() {
    this.published_at_start();
    this.published_at_end();
  }

  stories() {
    return this.url + '/stories?' + this.serialize();
  }

  append(key, value) {
    if (!key)
      throw TypeError('Key cannot be empty.');

    this._query[key] = value;
    return this;
  }

  serialize() {
    let str = [];

    for (const i in this._query) {
      let p = this._query[i];
      str.push(encodeURIComponent(i) + "=" + encodeURIComponent(p));
    }

    return str.join("&");
  }

  published_at_start(param = "NOW-90DAYS") {
    return this.append('published_at.start', param);
  }

  published_at_end(param = "NOW") {
    return this.append('published_at.end', param);
  }
}

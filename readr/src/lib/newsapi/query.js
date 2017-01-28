class NewsAPIQuery {
  constructor() {
    this._url = "https://sandbox.aylien.com";
    this._query = {};
  }

  get query() {
    return this._query;
  }

  get url() {
    return this._url;
  }

  /**
   * HTTP GET
   */
  get() {
    return this.url + '?' + this.serialize();
  }

  append(key, value) {
    if (!key)
      throw TypeError('Key cannot be empty.');

    this._query[key] = value;
    return this;
  }

  serialize() {
    let str = [];

    for (const p of this.query) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(p));
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

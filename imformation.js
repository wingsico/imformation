new Vue({
  el: '#body',
  data: {
    message: '综合要闻',
    newsShow: true,
    surveyShow: false,
    noticeShow: false,
    lists: {},
    showA: false,
    article: {},
    loading: false
  },
  methods: {
    ajax: function (method, url, cb, data, dataType) {
      var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
      xhr.open(method.toUpperCase(), url, true)
      if (method.toLowerCase() == 'get') {
        xhr.send(data)
      } else {
        var contentType = 'application/json'
        if (dataType) {
          if (dataType.toLowerCase() == 'json') {
            contentType = 'application/json'
          }
        }
        xhr.setRequestHeader("Content-type", contentType)
        xhr.send(data)
      }
      xhr.onreadystatechange = function () {
        this.showA = true
        this.loading = true
        if (xhr.readyState === 4) {
          this.showA = false
          this.loading = false
          if (xhr.status === 500 || xhr.status === 404) {
            console.log('请求错误:' + xhr.status) // 跳转至错误页面。可以自己定义
          }
          if (xhr.status === 200) {

            cb(xhr.responseText)
          }
        }
      }
    },

    newsStyle: function () {
      this.newsShow = true
      this.surveyShow = false
      this.noticeShow = false
      this.showA = false
      this.message = '综合要闻'
      this.ajax('get', 'newsData.json', this.getNews)
    },
    surveyStyle: function () {
      this.newsShow = false
      this.surveyShow = true
      this.noticeShow = false
      this.showA = false
      this.message = '科学调研'
      this.ajax('get', 'surveyData.json', this.getNews)
    },
    noticeStyle: function () {
      this.newsShow = false
      this.surveyShow = false
      this.noticeShow = true
      this.showA = false
      this.message = '教务通知'
      this.ajax('get', 'noticeData.json', this.getNews)
    },
    getNews: function (data) {
      var jsonData = JSON.parse(data)
      this.lists = jsonData
    },
    getArticle: function (article) {
      console.log(article.title)
      var articleId = article["news_id"]
      this.ajax('get', articleId + '.json', this.showArticle)
    },
    showArticle: function (data) {
      var jsonObj = JSON.parse(data)
      this.article = jsonObj
      this.showA = true
    }
  },
  mounted: function () {
    this.newsStyle()
  }
})
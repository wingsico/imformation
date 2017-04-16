var vm = new Vue({
  el: '#body',
  data: {
    message: '综合要闻',
    newsShow: true,
    surveyShow: false,
    noticeShow: false,
    newsLists: {},
    surveyLists: {},
    noticeLists: {},
    showA: false,
    article: {},
    loading: false,
    tips: '已获取最新列表',
    showTips: false,
    newsRead: [],
    surveyRead: [],
    noticeRead: []
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

    },

    surveyStyle: function () {
      this.newsShow = false
      this.surveyShow = true
      this.noticeShow = false
      this.showA = false
      this.message = '科学调研'
    },

    noticeStyle: function () {
      this.newsShow = false
      this.surveyShow = false
      this.noticeShow = true
      this.showA = false
      this.message = '教务通知'

    },

    getNews: function (data) {
      var jsonData = JSON.parse(data)
      this.newsLists = jsonData
      this.showTips = true
      setTimeout(function () {
        vm.showTips = false
      }, 1200)
    },

    getSurvey: function (data) {
      var jsonData = JSON.parse(data)
      this.surveyLists = jsonData
      this.showTips = true
      setTimeout(function () {
        vm.showTips = false
      }, 1200)
    },

    getNotice: function (data) {
      var jsonData = JSON.parse(data)
      this.noticeLists = jsonData
      this.showTips = true
      setTimeout(function () {
        vm.showTips = false
      }, 1200)
    },

    setReadItems: function (name, nameId,itemName) {
      name = JSON.parse(name)
      if (name.length === 0) {
        name.push(nameId)
        var Read = JSON.stringify(name)
        localStorage.setItem(itemName, Read)
      } else {
        for (var i = 0; i < name.length; i++) {
          if (name[i] == nameId)
            console.log('重复！')
          else {
            name.push(nameId)
            var Read = JSON.stringify(name)
            localStorage.setItem(itemName, Read)          }
        }
      }
    },

    getNewsArticle: function (article) {
      console.log(article.title)
      var articleId = article["news_id"]
      var newsRead = localStorage.getItem('newsRead')
      this.setReadItems(newsRead, articleId,'newsRead')
      this.ajax('get', '01.json', this.showArticle)
    },

    getSurveyArticle: function (article) {
      console.log(article.title)
      var articleId = article["news_id"]
      var surveyRead = localStorage.getItem('surveyRead')
      surveyRead = JSON.parse(surveyRead)

    },

    getNoticeArticle: function (article) {
      console.log(article.title)
      var articleId = article["news_id"]
      var noticeRead = localStorage.getItem('noticeRead')
      noticeRead = JSON.parse(noticeRead)
      for (var i = 0; i < noticeRead.length; i++) {
        if (noticeRead[i] === articleId)
          return false
        else
          noticeRead.push(articleId)
      }
      this.ajax('get', '/TeachingNotice/' + articleId, this.showArticle)
    },
    showArticle: function (data) {
      var jsonObj = JSON.parse(data)
      this.article = jsonObj
      this.showA = true
    },

    backToIndex: function () {
      this.showA = !this.showA
    },

  },
  mounted: function () {
    this.ajax('get', 'newsData.json', this.getNews)
    this.ajax('get', 'surveyData.json', this.getSurvey)
    this.ajax('get', 'noticeData.json', this.getNotice)
    localStorage.setItem('newsRead', '[]')
    localStorage.setItem('surveyRead', '[]')
    localStorage.setItem('noticeRead', '[]')
  }
})
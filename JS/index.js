window.onload = function () {
  require('../CSS/index.css')
  var imgSrc = require('../images/heart.png');
  var redHeatImg = require('../images/red-heart.png');
  var stopImg = require('../images/stop.png');
  var playImgs = require('../images/play.png');
  var circImg = require('../images/circ.png');
  var oneImg = require('../images/one.png');
  var autoImg = require('../images/auto.png');
  var $ = require('jquery');

  var musicPattern = [
    // 列表
    {
      name: 'list',
      title: '列表循环',
      url: circImg,
      pirce: 0
  
    },
    // 单曲
    {
      name: 'single',
      title: '单曲循环',
      url: oneImg,
      pirce: 1
    },
    // 随机
    {
      name: 'random',
      title: '随机播放',
      url: autoImg,
      pirce: 2
    }
  ]
  
  var timer;
  var latelyArr = [];
  var num = 0;
  //默认列表加载歌曲数量
  var start = 0;
  var count = 15;
  // 绑定事件层
  // 获取元素
  var music = {
    // 获取元素
    query: function (element) {
      return document.querySelectorAll(element)
    },
    // 事件格式化
    formaTime: function (sec) {
      // sec:秒

      var minute = Math.floor(sec / 60);
      minute = minute < 10 ? '0' + minute : minute;

      var second = Math.floor(sec % 60);
      second = second < 10 ? '0' + second : second;

      return minute + '.' + second;
    },
    // 进度条滑动事件
    Slide: function (duration) {
      var self = this;
      // 当鼠标按下时

      // 获取元素
      var layer = this.query('.plan-layer')[0];
      // 滑块
      var layerBtn = this.query('.plan-btn')[0];

      // 激活层
      var planActive = this.query('.plan-active')[0];

      // 进度条
      var planBox = this.query('.plan-box')[0];

      // 激活按钮
      var layerBtn = this.query('.plan-btn')[0];

      // 获取audio
      var musics = this.query('audio')[0];

      // 规定最大范围
      var max = planBox.offsetWidth - layerBtn.offsetWidth;

      // 鼠标按下
      layer.onmousedown = function (e) {
        // 清除定时器
        clearInterval(timer);
        // 获取鼠标按下时坐标
        var x = e.offsetX;
        // 设置滑块的left值
        layerBtn.style.left = x - (layerBtn.offsetWidth) + 'px';
        // 设置激活条宽度
        planActive.style.width = x + 'px';

        // 设置滑块移动距离
        if (layerBtn.offsetLeft < 0) {
          layerBtn.style.left = 0;
        } else {
          layerBtn.style.left = x - (layerBtn.offsetWidth) + 'px';
        }

        // 鼠标滑动
        layer.onmousemove = function (e) {
          x = e.offsetX;

          // 阻止浏览器默认行为
          e.preventDefault();

          // 设置滑块移动距离
          if (layerBtn.offsetLeft < 0) {
            layerBtn.style.left = 0;
          } else {
            layerBtn.style.left = x - (layerBtn.offsetWidth) + 'px';
          }

          // 设置激活的进度条
          planActive.style.width = x + 'px'

        }

      }
      // 鼠标抬起事件
      layer.onmouseup = function () {
        // 清空定时器
        layer.onmousemove = null;

        // 获取每像素移动距离
        var moveWidth = max / duration;

        // 跳转音乐时间
        musics.currentTime = Math.floor(layerBtn.offsetLeft / moveWidth);
        var time = Math.floor(layerBtn.offsetLeft / moveWidth);

        var RicList = self.query('.lyric-box li')

        for (var i = 0; i < RicList.length; i++) {
          RicList[i].className = ''
        }
        // 鼠标滑动或点击时音乐跳转到相对应的位置
        self.sliderMove(musics, duration, time);


      }

      // 鼠标抬起事件
      layer.onmouseout = function () {
        // 清空定时器
        layer.onmousemove = null;
      }

    },
    // 进度条随音乐时间走动
    sliderMove: function (mus, duration, num) {
      var num = num == undefined ? 0 : num;
      var self = this;
      // 获取进度条元素
      var planBox = this.query('.plan-box')[0];
      // 获取事件层元素
      var layerBtn = this.query('.plan-btn')[0];
      // 获取激活层元素
      var planActive = this.query('.plan-active')[0];
      // 获取当前播放时长元素
      var realTime = this.query('.real-time')[0]
      // 获取总时长节点
      var totalTime = this.query('.total-time')[0];
      var RicBox = self.query('.lyric-box ul')[0]
      var RicList = self.query('.lyric-box li')
      var lyricBox = self.query('.lyric-box')[0]
      // 规定最大范围
      var max = planBox.offsetWidth - layerBtn.offsetWidth;
      // 设置总时长
      totalTime.innerHTML = self.formaTime(duration)


      // 设置定时器
      timer = setInterval(function () {
        //获取音频当前播放时间
        var currentTime = mus.currentTime;
        // 获取进度条百分比
        var percent = currentTime / duration;

        // 设置播放时长
        realTime.innerHTML = self.formaTime(currentTime)

        // 设置按钮移动距离
        layerBtn.style.left = max * percent + 'px';

        // 记录已经播放的距离
        planActive.style.width = max * percent + 'px';

        // 如果大于最大范围，清除定时器
        if (max * percent >= max) {
          clearInterval(timer)
        }

        // RicBox.style.top = -RicList[num].offsetTop + 'px';
        num++;
        for (var i = 0; i < RicList.length; i++) {
          var RicTime = Number(RicList[i].getAttribute('data-time'));
          // console.log(num)
          if (i + 1 > RicList.length - 1) {
            RicBox.style.top = -RicList[RicList.length - 1].offsetTop + 'px';
            continue
          }

          var nextTime = Number(RicList[i + 1].getAttribute('data-time'));
          RicList[i].setAttribute('class', '')
          if (num >= RicTime && num < nextTime) {
            RicList[i].setAttribute('class', 'now')
            var height = RicList[i].offsetTop;
            // lyricBox.scrollTop = height + 'px';
            RicBox.style.top = -height + 'px';
            break;
          }
        }
      }, 1000)

    },
    // 播放音乐
    autoplay: function () {
      var self = this;
      // 获取元素
      // 获取audio
      var musics = this.query('audio')[0];
      var playImg = this.query('.play>.img')[0];
      var playmus = this.query('.play')[0];
      var playLayer = self.query('.plan-layer')[0];
      musics.addEventListener("canplay", function () {

        var duration = musics.duration;
        if (playmus.getAttribute('state') === 'stop') {
          // 激活进度条
          self.sliderMove(musics, duration);
          // 播放音乐
          musics.play();

          music.Slide(duration);

          playmus.setAttribute('state', 'play');

          playLayer.style.zIndex = 4;

          playImg.innerHTML = '<img class="auto-img" src="'+stopImg+'">'
        }

        self.defaultPlay(musics);

      })

      musics.onended = function () {
        // 设置当前状态为停止播放
        playmus.setAttribute('state', 'stop');

        // 获取歌曲信息框
        var musicMessage = self.query('.music-message')[0];
        // 获取本地音乐列表
        var musicMessageList = musicMessage.children;

        self.autoCutMusic(musicMessageList);
        var now = self.query('audio')[0]
        self.musicRic(now)
      }

    },
    // 点击播放音乐
    playMusic: function () {
      var self = this;
      // 获取元素
      // 获取audio
      var play = self.query('.play')[0];

      // 当音乐可播放时获取音乐总时长
      play.onclick = function () {
        clearInterval(timer);
        var playImg = self.query('.play>.img')[0];
        var playLayer = self.query('.plan-layer')[0];
        var play = self.query('.play')[0];
        // 获取audio
        var musics = self.query('audio')[0];
        // 激活按钮
        var layerBtn = self.query('.plan-btn')[0];
        // 获取进度条元素
        var planBox = self.query('.plan-box')[0];
        // 规定最大范围
        var max = planBox.offsetWidth - layerBtn.offsetWidth;

        // 获取元素
        var duration = musics.duration;

        // 获取每像素移动距离
        var moveWidth = max / duration;

        if (play.getAttribute('state') === 'stop') {
          var time = Math.floor(layerBtn.offsetLeft / moveWidth);
          // 激活进度条
          self.sliderMove(musics, duration, time);
          // 播放音乐
          musics.play();
          music.Slide(duration);
          playLayer.style.zIndex = 4;
          play.setAttribute('state', 'play');
          playImg.innerHTML = '<img class="auto-img" src="'+stopImg+'">'
        } else {

          playLayer.style.zIndex = -1;
          //调用音频停止方法
          musics.pause()
          play.setAttribute('state', 'stop');
          playImg.innerHTML = '<img class="auto-img" src="'+playImgs+'">'
        }

        musics.onended = function () {
          // 设置当前状态为停止播放
          play.setAttribute('state', 'stop');
          // 更换图片
          playImg.innerHTML = '<img class="auto-img" src="'+playImgs+'">'
          self.autoCutMusic(musicMessageList);

        }

      }

    },
    // 点击生成音乐列表
    localMusicList: function () {
      // 保存this指向
      var self = this;
      // 获取歌曲信息框
      var musicMessage = self.query('.music-message')[0];
      var musicData =JSON.parse(localStorage.getItem('musicData')) ;

      //每次截取20条数据

      var songData = musicData.slice(start, start + count);
      start += count
      // 生成歌曲信息
      for (var i = 0; i < songData.length; i++) {
        // 创建ul标签
        var ul = document.createElement('ul');
        ul.className = 'clear';
        // ul.setAttribute('id', '' + songData[i].id + '')
        // 遍历对象
        for (var k in songData[i]) {
          ul.setAttribute('data-src', songData[i].url)
          ul.setAttribute('data-id', songData[i].id)
          ul.setAttribute('data-img', songData[i].pic);
          ul.setAttribute('data-lrc', songData[i].lrc);
          var num = i < 9 ? '0' + (i + 1) : i + 1;
          // 设置li内容
          ul.innerHTML = `<li>${num}</li>
                                <li>${songData[i].name}</li>
                                <li>${songData[i].singer}</li>
                                <li>${self.formaTime(songData[i].time)}</li>
                                <li>2.5MB</li>
                                <li><img class="collect-img" num = 0 src="${imgSrc}"></li>`;

        }
        // 将ul元素添加到musicMessage 中  
        musicMessage.append(ul);

      }
      // 获取本地音乐列表
      var musicMessageList = musicMessage.children;

      // 播放栏
      var audiosMusic = self.query('.audios-music')[0];
      audiosMusic.innerHTML = `<div class = 'audios'><audio data-lrc = '${musicMessageList[0].getAttribute('data-lrc')}' src = '${musicMessageList[0].getAttribute('data-src')}'></audio></div>`;
      // 默认播放
      self.defaultPlay();
      // 播放列表双击播放
      music.dbClickPlay(musicMessageList)
      // 收藏音乐
      music.collectLikeMusic()

      music.refreshLikeList()

      music.initialLike(musicMessageList)

      self.dbClickPlay(likeMusic.children);

    },
    // 点击左右箭头切换歌曲
    cutMusic: function () {
      var self = this;

      // 获取下一个按钮
      var next = this.query('.next')[0];
      var prev = this.query('.prev')[0];
      self.cutArrows(next)

      self.cutArrows(prev)

    },
    // 默认播放
    defaultPlay: function (musics) {
      var musics = musics == undefined ? '' : musics
      var self = this;
      // 获取当前播放歌曲
      var current = self.query('audio')[0];
      var currentSrc = current.getAttribute('src');
      // 获取歌曲信息框
      var musicMessage = self.query('.music-message')[0];
      // 获取本地音乐列表
      var musicMessageList = musicMessage.children;
      var message = self.query('.message')[0];
      var musicImg = self.query('.music-img>img')[0];

      for (var i = 0; i < musicMessageList.length; i++) {

        var dataSrc = musicMessageList[i].getAttribute('data-src');
        var dataImg = musicMessageList[i].getAttribute('data-img')
        if (dataSrc == currentSrc) {
          var dataImg = musicMessageList[i].getAttribute('data-img')
          musicImg.setAttribute('src', dataImg)
          var li = musicMessageList[i].children;
          message.children[0].innerHTML = li[1].innerHTML;
          message.children[1].innerHTML = li[2].innerHTML;
        }

      }
      // self.autoplay()
      musics.onended = function () {
        // 设置当前状态为停止播放
        // playmus.setAttribute('state', 'stop');

        // 获取歌曲信息框
        var musicMessage = self.query('.music-message')[0];
        // 获取本地音乐列表
        var musicMessageList = musicMessage.children;

        self.autoCutMusic(musicMessageList);
        var now = self.query('audio')[0]
        self.musicRic(now)
      }
    },
    // 点击切换播放模式
    cutPattern: function () {

      // 获取元素
      var defaultIcon = this.query('.default-icon')[0];
      var defaultImg = this.query('.default-icon>img')[0];

      var num = 0;
      defaultIcon.onclick = function () {
        num++;

        num = num >= musicPattern.length ? 0 : num;

        defaultIcon.setAttribute('data-pattern', musicPattern[num].pirce)

        defaultImg.setAttribute('src', musicPattern[num].url)

        defaultImg.setAttribute('title', musicPattern[num].title)

      }


    },
    // 歌曲切换
    replay: function (num) {
      var self = this;
      var play = self.query('.play')[0];
      // 获取歌曲信息框
      var musicMessage = self.query('.music-message')[0];
      // 获取本地音乐列表
      var musicMessageList = musicMessage.children;
      var audiosMusic = self.query('.audios-music')[0];
      var playImg = this.query('.play>.img')[0];

      var nextData = musicMessageList[num].getAttribute('data-src');
      var nextId = musicMessageList[num].getAttribute('data-id')
      var nextLrc = musicMessageList[num].getAttribute('data-lrc')
      musicMessageList[num].setAttribute('index', 1)
      play.setAttribute('state', 'stop');
      playImg.innerHTML = `<img class="auto-img" src="${playImgs}">`;
      audiosMusic.innerHTML = '';
      audiosMusic.innerHTML = `<div class = 'audios'><audio data-lrc = '${nextLrc}' data-id = '${nextId}' src = '${nextData}'></audio></div>`;
      self.autoplay();
    },
    // 封装左右箭头切换
    cutArrows: function (ele) {
      // ele  绑定事件元素
      var self = this;

      ele.onclick = function () {
        var listId = self.query('.active')[0].getAttribute('id');

        // 获取歌曲信息框
        var musicMessage = self.query('.' + listId)[0].children[1];
        // console.log(musicMessage.children[1].children)
        // 获取本地音乐列表
        var musicMessageList = musicMessage.children;
        // console.log(musicMessageList)

        // 清除定时器
        clearInterval(timer);
        // 获取当前播放歌曲
        var current = self.query('audio')[0];
        // // 获取当前播放连接
        var currentSrc = current.getAttribute('src');

        // 获取当前播放模式
        var defaultIcon = self.query('.default-icon')[0];
        // 当前模式
        var dataPattern = defaultIcon.getAttribute('data-pattern');

        // 如果当前值是0,则列表循环
        if (dataPattern == 0) {
          for (var i = 0; i < musicMessageList.length; i++) {
            var dataSrc = musicMessageList[i].getAttribute('data-src');
            if (dataSrc == currentSrc) {

              num = i;
              if (this.getAttribute('class') == 'prev') {
                num -= 1;
                if (num < 0) {
                  num = musicMessageList.length - 1;
                }
              } else {
                num += 1;
                if (num >= musicMessageList.length) {
                  num = 0;
                }
              }

              self.replay(num)
            }
          }
        } else if (dataPattern == 1) {
          // 如果等于1，则是单曲循环
          // var play = self.query('.play')[0];

          for (var i = 0; i < musicMessageList.length; i++) {
            var dataSrc = musicMessageList[i].getAttribute('data-src');
            if (dataSrc == currentSrc) {
              self.replay(i)
            }
          }
        } else if (dataPattern == 2) {

          // 设置随机数
          var random = Math.floor(Math.random() * musicMessageList.length);

          self.replay(random)
        }
        self.latelyList()
        self.musicRic();

      }
    },
    // 匹配模式切换歌曲
    autoCutMusic: function (musicList) {
      var self = this;

      // 清除定时器
      clearInterval(timer);
      // 获取当前播放歌曲
      var current = self.query('audio')[0];
      // // 获取当前播放连接
      var currentSrc = current.getAttribute('src');

      // 获取当前播放模式
      var defaultIcon = self.query('.default-icon')[0];
      // 当前模式
      var dataPattern = defaultIcon.getAttribute('data-pattern')
      // 如果当前值是0,则列表循环
      if (dataPattern == 0) {
        for (var i = 0; i < musicList.length; i++) {
          var dataSrc = musicList[i].getAttribute('data-src');
          if (dataSrc == currentSrc) {
            num = i;
            num += 1;
            if (num >= musicList.length) {
              num = 0;
            }

            self.replay(num)
          }
        }
      } else if (dataPattern == 1) {
        // 如果等于1，则是单曲循环

        for (var i = 0; i < musicList.length; i++) {
          var dataSrc = musicList[i].getAttribute('data-src');
          if (dataSrc == currentSrc) {
            self.replay(i)
          }
        }
      } else if (dataPattern == 2) {

        // 设置随机数
        var random = Math.floor(Math.random() * musicList.length);

        self.replay(random)
      }

    },
    // 左侧列表点击切换事件
    listCut: function () {
      var self = this;
      // 获取左侧列表
      var leftList = self.query('.list>ul')[0].children;
      var lyric = self.query('.lyric')[0];
      for (var i = 0; i < leftList.length; i++) {
        leftList[i].onclick = function () {    
          lyric.style.display = 'none';
          // 如果本身是激活状态，则直接return
          if (this.getAttribute('class') === 'active') {
            var activeId = this.getAttribute('id')
            self.query('.' + activeId)[0].style.display = 'block';
            return;
          }
          // 否则显示相对应的列表
          for (var j = 0; j < leftList.length; j++) {
            var activeId = this.getAttribute('id');
            // 先清空
            leftList[j].setAttribute('class', '');
            self.query('.myMusic-local')[j].style.display = 'none';
            // 后设置
            this.className = 'active';
            self.query('.' + activeId)[0].style.display = 'block';
          }

        }
      }
    },
    // 双击播放
    dbClickPlay: function (ele) {
      var self = this;
      var play = self.query('.play')[0];
      // 播放栏
      var musicImg = self.query('.music-img>img')[0];


      // 播放栏
      var audiosMusic = self.query('.audios-music')[0];
      for (var j = 0; j < ele.length; j++) {

        // 给每个ul绑定双击事件
        ele[j].ondblclick = function () {
          play.setAttribute('state', 'stop');
          clearInterval(timer);

          // 先清空已经存在的audio
          audiosMusic.innerHTML = '';

          // musicImg.innerHTML = '';
          // 获取src属性值
          var src = this.getAttribute('data-src');
          var imgSrc = this.getAttribute('data-img');
          var Id = this.getAttribute('data-img');
          var lrc = this.getAttribute('data-lrc');
          this.setAttribute('index', 1)

          // 创建音频元素
          var div = document.createElement('div');
          // 设置类名
          div.className = 'audios';
          // 设置内容
          div.innerHTML = `<audio data-lrc = '${lrc}' data-id = '${Id}'  src="${src}" ></audio>`;

          // 将元素添加到播放栏中
          audiosMusic.append(div);
          // var html = `<img class="auto-img" src = "${imgSrc}">`
          musicImg.setAttribute('src', imgSrc)

          self.autoplay();
          self.musicRic();
        }
        self.RicShow()
      }
    },
    // 左侧likeMusic取消收藏事件
    cancelHeart: function () {
      var self = this;
      var likeImg = self.query('.likeMusic .collect-img');
      var localImg = self.query('.localMusic .local-down>ul');
      for (var i = 0; i < likeImg.length; i++) {
        likeImg[i].onclick = function () {
          var dataId = this.parentNode.parentNode.getAttribute('data-id');
          this.parentNode.parentNode.remove()
          for (var j = 0; j < localImg.length; j++) {
            if (localImg[j].getAttribute('data-id') === dataId) {
              localImg[j].children[5].children[0].setAttribute('src', imgSrc)
            }
          }
        }
      }
    },
    // 初始化likeLocal列表
    initialLike: function (List) {
      var self = this;
      var likeData = JSON.parse(localStorage.getItem('likeMusic'));
      var likeMusic = self.query('.right .likeMusic .local-down')[0]
      // 如果本地存储中没有数据，则直接return
      if (likeData == null) {
        return;
      }

      // 将已经点击收藏的信息添加到喜欢的音乐框
      for (var i = 0; i < likeData.length; i++) {
        var ul = document.createElement('ul');
        ul.className = 'clear';
        ul.setAttribute('data-id', likeData[i].id);
        ul.setAttribute('data-img', likeData[i].img);
        ul.setAttribute('data-src', likeData[i].src);
        var num = i < 9 ? '0' + (i + 1) : i + 1;
        ul.innerHTML = `<li>${num}</li>
                        <li>${likeData[i].name}</li>
                        <li>${likeData[i].singer}</li>
                        <li>${likeData[i].time}</li>
                        <li>2.5MB</li>
                        <li><img class="collect-img" src="${redHeatImg}"></li>`

        likeMusic.appendChild(ul);
        var likeId = likeMusic.children[i].getAttribute('data-id');
        for (var j = 0; j < List.length; j++) {

          var localId = List[j].getAttribute('data-id');

          if (localId == likeId) {
            var heartIcon = List[j].children[5].children[0];
            heartIcon.setAttribute('src', redHeatImg)
          }
        }
      }


    },
    // 收藏爱心音乐
    collectLikeMusic: function (collectImg) {
      var self = this;
      // 点击爱心收藏歌曲
      var collectImg = self.query('.localMusic .collect-img');

      var likeMusic = self.query('.likeMusic .local-down')[0];
      for (var k = 0; k < collectImg.length; k++) {
        // 绑定点击事件       
        collectImg[k].onclick = function () {
          var selfId = this.parentNode.parentNode.getAttribute('data-id');
          var src = this.getAttribute('src');
          if (src == redHeatImg) {
            // 取消点亮小红心
            this.setAttribute('src', imgSrc);
            // 遍历喜欢的音乐列表
            for (var c = 0; c < likeMusic.children.length; c++) {
              // 如果该列表中有跟点击的小红心相同的，则移除节点
              if (likeMusic.children[c].getAttribute('data-id') === selfId) {
                likeMusic.children[c].remove()
              }
            }

          } else {
            this.setAttribute('src', redHeatImg);
            // 赋值父节点的所有属性及标签
            var like = this.parentNode.parentNode.cloneNode(true);
            // 添加data属性，于本地存储属性值一致
            like.setAttribute('data-id', selfId);
            // 移除复制的id属性
            // like.removeAttribute('id');
            // 将元素添加到喜欢音乐列表中
            likeMusic.append(like)

          }
          var likeList = likeMusic.children;

          // 改变顺序
          for (var a = 0; a < likeList.length; a++) {

            var num = a < 9 ? '0' + (a + 1) : a + 1;

            likeList[a].children[0].innerHTML = num;

          }

          music.cancelHeart();
        }

      }
    },
    // 刷新本地存储数据
    refreshLikeList: function () {
      var self = this;
      // 定时器刷新收藏列表信息
      setInterval(function () {
        // 点击爱心收藏歌曲
        var collectImg = self.query('.localMusic .local-down .collect-img');
        var newArr = [];
        for (var j = 0; j < collectImg.length; j++) {
          var redHeat = collectImg[j].getAttribute('src');
          if (redHeat == redHeatImg) {
            var parent = collectImg[j].parentNode.parentNode;

            var likeId = parent.getAttribute('data-id');

            var src = parent.getAttribute('data-src');
            var img = parent.getAttribute('data-img');
            var singer = parent.children[2].innerHTML;
            var name = parent.children[1].innerHTML;
            var time = parent.children[3].innerHTML;
            newArr.push({
              id: likeId,
              src: src,
              singer: singer,
              name: name,
              time: time,
              img: img
            });
            localStorage.setItem('likeMusic', JSON.stringify(newArr))
          } else if (newArr[0] == undefined) {
            // 如果newArr中没有值则清空本地存储中的内容
            localStorage.setItem('likeMusic', '[]')
          }

        }
        // 获取本地存储收藏音乐信息
      }, 1000)
    },
    // 初始化最近播放列表
    latelyList: function () {
      var self = this;
      var latelyLocal = JSON.parse(localStorage.getItem('latelyData'));
      var latelyList = self.query('.recentlyMusic .local-down')[0];
      // console.log(latelyList)
      // 获取歌曲信息框
      var musicMessage = self.query('.localMusic')[0].children[1];
      //获取本地音乐列表
      var musicMessageList = musicMessage.children;
      latelyList.innerHTML = ''
      // 如果本地存储中没有数据，则直接return
      if (latelyLocal == null) {
        return;
      }


      // 将已经点击收藏的信息添加到最近播放的音乐框
      for (var j = 0; j < musicMessageList.length; j++) {
        var messageId = musicMessageList[j].getAttribute('data-id');
        for (var i = 0; i < latelyLocal.length; i++) {
          var latelyId = latelyLocal[i].id
          if (latelyId == messageId) {
            var clone = musicMessageList[j].cloneNode(true);
            var num = i < 9 ? '0' + (i + 1) : i + 1;
            clone.children[0].innerHTML = num;
            latelyList.appendChild(clone);

          }
        }

      }


    },
    // 设置本地存储
    refreshLately: function () {
      var self = this;

      setInterval(function () {
        // 获取元素
        var latelyList = self.query('.localMusic .local-down')[0];
        var listChild = latelyList.children;
        // 每次执行都先清空数组，再设置
        latelyArr = []
        // 更新数据
        for (var k = 0; k < listChild.length; k++) {
          if (listChild[k].getAttribute('index') == 1) {
            // 获取键值
            var allId = listChild[k].getAttribute('data-id');
            var allSrc = listChild[k].getAttribute('data-src');
            var allImg = listChild[k].getAttribute('data-img');
            var allName = listChild[k].children[1].innerHTML;
            var allSinger = listChild[k].children[2].innerHTML;
            var allTime = listChild[k].children[3].innerHTML;
            // 将键值添加到数组中
            latelyArr.push({
              id: allId,
              src: allSrc,
              singer: allSinger,
              name: allName,
              time: allTime,
              img: allImg
            })
            // 添加本地存储
            localStorage.setItem('latelyData', JSON.stringify(latelyArr));
          }
        }
        self.latelyList()

      }, 1000)

    },
    // 更新列表
    update: function () {
      var self = this;
      // 获取歌曲信息框
      var musicMessage = self.query('.localMusic')[0].children[1];
      // // 获取本地音乐列表
      var musicMessageList = musicMessage.children;

      var latelyData = JSON.parse(localStorage.getItem('latelyData'));
      if(latelyData == null){
        return;
      }

      for (var i = 0; i < musicMessageList.length; i++) {
        var MessageId = musicMessageList[i].getAttribute('data-id');
        for (var j = 0; j < latelyData.length; j++) {
          var latelyId = latelyData[j].id
          if (MessageId === latelyId) {
            musicMessageList[i].setAttribute('index', 1)
          }
        }
      }

    },
    // 歌曲歌词
    musicRic: function (audios) {
      var self = this;
      // 获取歌曲信息框
      var musicMessage = self.query('.localMusic .music-message')[0];
      var musicList = musicMessage.children;
      // 当前播放音乐歌词链接
      var audios = self.query('audio')[0];
      var musicRic = audios.getAttribute('data-lrc');
      // var title = self.query('.lyric-title')[0]
      // var playing = self.query('.music-name .message p')[0]

      var RicBox = self.query('.lyric-box')[0];
      RicBox.innerHTML = ''

      self.getMusicRic(musicRic, function (data) {
        var Ric = [];
        var ricString = data.split(/\[/);
        for (var i = 0; i < ricString.length; i++) {
          var ricArr = ricString[i].split(/\]/);
          if (ricArr[0] == '' || ricArr[0].search(/([a-z\u4e00-\u9fa5])/) === 0) {
            continue;
          }

          var times = ricArr[0].split(':');
          var minute = parseFloat(times[0]);
          var second = parseFloat(times[1]);
          Ric.push({
            time: Number((minute * 60 + second).toFixed(2)),
            text: ricArr[1]
          })
        }
        RicBox.innerHTML = ''
        // 根据歌词列表生成歌词
        var ul = document.createElement('ul')
        for (var j = 0; j < Ric.length; j++) {
          var li = document.createElement('li');
          if (j == 0) {
            li.className = 'now'
          }
          if (Ric[j].text == '') {
            continue;
          }
          li.setAttribute('data-time', Ric[j].time)
          li.innerHTML = `${Ric[j].text}`
          ul.appendChild(li)
        }
        RicBox.appendChild(ul)
        // title.innerHTML = playing.innerHTML;
      });


    },
    getMusicRic: function (url, fn) {
      $.ajax({
        type: 'get',
        url: url,
        success: function (data) {

          //将data缓存在浏览器的本地存储
          // console.log('ajax data ==> ', data);

          fn(data)


        }
      })
    },
    // 点击显示歌词
    RicShow: function () {
      var self = this;
      // 获取元素
      // 放大层
      var largen = self.query('.largen')[0];
      // 歌词面板
      var lyric = self.query('.lyric')[0];
      // 隐藏面板
      var closeRic = self.query('.closeRic')[0];
      // 显示列表
      var activeList = self.query('.myMusic-local')
      var active = self.query('.active')[0]
      largen.onclick = function () {
        lyric.style.display = 'block';
        for (var i = 0; i < activeList.length; i++) {
          activeList[i].style.display = 'none'
        }
      }
      closeRic.onclick = function () {
        lyric.style.display = 'none';
        var activeId = active.getAttribute('id');
        self.query('.' + activeId)[0].style.display = 'block'
      }
    },
    // 歌曲懒加载
    // lazyIdle:function(){

    //   var self = this;

    //   // 获取播放列表音乐信息
    //   var localMusic = self.query('.localMusic')[0];
    //   var height = localMusic.offsetHeight;
    //   // 绑定事件
    //   // localMusic.onscroll = function(){
    //   //   var localDown = self.query('.localMusic .local-down')[0];
    //   //   if(localMusic.scrollTop + height >= localDown.offsetHeight){
    //   //     start += count;
    //   //     self.localMusicList(start,start + count);
    //   //   }
    //   // }

    // }

  }
  music.cutPattern()
  music.playMusic();
  music.localMusicList();
  music.cutMusic();
  music.listCut();
  music.cancelHeart();
  music.latelyList();
  music.refreshLately()
  music.update();
  music.musicRic();
  // 点击显示歌词

  music.RicShow();

  // 歌曲懒加载
  // music.lazyIdle()

}
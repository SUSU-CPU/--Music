

var $ = require('jquery');
//初始化默认列表
  //判断是否存在缓存数据
  var musicData = localStorage.getItem('musicData');

  //如果不存在缓存数据
  if (musicData === null) {
    //发起ajax请求

    $.ajax({
      type: 'get',
      url: 'https://v1.itooi.cn/netease/songList',
      data: {
        // cat:'全部',
        // orderType:'hot',
        id: 141998290,
        format: 1
      },
      success: function (data) {

        //将data缓存在浏览器的本地存储
        // console.log('ajax data ==> ', data);
        localStorage.setItem('musicData', JSON.stringify(data.data));

        history.go(0)
      }
    })

  } else {

    //在缓存获取音乐数据
    musicData = JSON.parse(musicData);

  }

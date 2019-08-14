// components/pkloading/pkloading.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content:{
      type:Array,
      observer:'formatContent'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageWs:{},
    carr:[]   
  },

  /**
   * 组件的方法列表
   */
  methods: {
    autoImgWidth(e) {
      var that = this;
      var width = e.detail.width;   //获取图片真实宽度
      var src = e.target.dataset.src;
      that.data.imageWs[src] = { w: width,lhide:true };
      console.log(that.data.imageWs);
      that.setData({
        imageWs: that.data.imageWs
      });
    },
    formatContent: function (content){     
      this.data.carr=[];    
      for (var i = 0; i < content.length; i++) {
        if (content[i].type == 'text') {
          var temp = content[i].content;
          temp = temp.replace(/\\n/g, "\n");
          temp = temp.replace(/<br>/g, "\n");
          this.data.carr.push({ type: 'text', content: temp });
        } else if (this.properties.content[i].type == 'image' || this.properties.content[i].type == 'math') {
          this.data.carr.push({ type: this.properties.content[i].type, src: content[i].src });
        }
      }     
      this.setData({
        carr: this.data.carr
      });
    }
  }
})

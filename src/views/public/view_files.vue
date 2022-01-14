<template>
  <div style="overflow-x: auto;text-align: left">
    <div v-for="file in fileList" class="file-list">
      <div class="file-info">
        <div class="file-icon" :class="{cursor:file.trueName.indexOf('.jpg')>0||file.trueName.indexOf('.png')>0||file.trueName.indexOf('.bmp')>0||file.trueName.indexOf('.gif')>0}">
          <img :src="(file.trueName.indexOf('.jpg')>0||file.trueName.indexOf('.png')>0||file.trueName.indexOf('.bmp')>0||file.trueName.indexOf('.gif')>0)?url+file.filePath+file.fileName:(file.trueName.indexOf('.doc')>0||file.trueName.indexOf('.docx')>0)?'/static/img/fileIcons/word.png':(file.trueName.indexOf('.xls')>0||file.trueName.indexOf('.xlsx')>0)?'/static/img/fileIcons/excel.png':(file.trueName.indexOf('.ppt')>0||file.trueName.indexOf('.pptx')>0)?'/static/img/fileIcons/ppt.png':'/static/img/fileIcons/default.png'">
          <a class="mask no-print" v-if="file.trueName.indexOf('.jpg')>0||file.trueName.indexOf('.png')>0||file.trueName.indexOf('.bmp')>0||file.trueName.indexOf('.gif')>0" @click="preView(file)">查看</a>
        </div>
        <div class="file-content">
          <a class="file-name" :href="url+file.filePath+file.fileName" :download="file.trueName" target="_blank">
            <span>{{file.trueName}}</span></br>
            <span>上传人：{{file.createName}}&nbsp;&nbsp;</span>
            <span>上传时间：{{file.createDate}}&nbsp;&nbsp;</span>
            <span>大小：{{(file.size/Math.pow(1024, parseInt(Math.floor(Math.log(file.size) / Math.log(1024))))).toFixed(1) + ' ' + sizes[parseInt(Math.floor(Math.log(file.size) / Math.log(1024)))]}}&nbsp;&nbsp;</span>
          </a>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="imgModal" :modal-append-to-body=false title="图片预览" id="imgPreView">
      <img :src="imgSrc">
    </el-dialog>
  </div>
</template>

<script>
  import {getOaFormFileListByIds} from '@/api/upload'
  export default {
    name:'view_files',
    props: {
      name: '',
      val:''
    },
    created:function(){
      this.init();
    },
    methods:{
      init(){
        let _this=this;
        getOaFormFileListByIds(this.val).then(
          function (res) {
            //处理成功结果
            // console.log(res.data.data)
            _this.fileList = res.data;
          }
        ).catch(function (error) {
          console.log(error);
        });
      },
      preView(file){
        this.imgModal = true;
        this.imgSrc = this.url+file.filePath+file.fileName;
      }
    },
    data(){
      return{
        names:this.name,
        vals:this.val,
        fileList:[],
        sizes:['Bytes', 'KB', 'MB'],
        imgModal:false,
        imgSrc:''
      }
    },
    watch:{
      val:{
        handler(newVal) {
          this.vals = newVal
          if(newVal){
            this.init();
          }else{
            this.fileList = [];
          }


        },
        immediate: true,

      }
    }
  }
</script>

<style scoped>
  .file-list{
    font-size:14px;
    color: #606266;
    line-height:25px;
    width:800px;
  }
  .file-name{
    color: #606266;
    text-decoration:none;
  }
  .file-name:hover{
    color:#409EFF;
  }
  .file-icon {
    width: 50px;
    height: 50px;
    overflow: hidden;
    margin-right: 5px;
    float: left;
    position: relative;
  }
  .cursor{
    cursor: pointer;
  }
  .file-icon > .mask {
    position: absolute;
    content: '查看';
    color: #fff;
    text-align: center;
    line-height: 50px;
    background: rgba(0, 0, 0, .4);
    left: 0;
    top: 0;
    width: 50px;
    height: 50px;
    border-radius: 3px;
    display: none;
  }
  .file-icon:hover > .mask {
    display: block;
  }
  .file-icon > img {
    width: 50px;
    height:50px;
    border: 1px solid #eee;
    border-radius: 3px;
  }
  .file-content{
    float: left;
  }
  #imgPreView /deep/ .el-dialog__body{
    text-align: center;
  }
  .file-info{
    height:50px;
    clear: both;
    margin-top: 10px;
  }
</style>

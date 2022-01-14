<template>
  <el-upload
    class="upload-demo"
    :action="urls"
    :before-upload="beforeAvatarUpload"
    :headers="headers"
    :on-remove="removefile"
    :on-success="uploadSuccess"
    :on-error="uploadError"
    multiple
    :file-list="fileList"
  >
    <el-button size="small" type="primary">上传附件</el-button>
  </el-upload>
</template>
  
<script>
import Cookies from 'js-cookie'
import { getOaFormFileListByIds } from '@/api/upload'
export default {
  name: "upload",
  props: {
    name: "",
    val: ""
  },
  created: function() {
    this.init();
  },
  
  data() {
    return {
      names: this.name,
      vals: this.val,
      fileList: [],
      urls: "/dev-api/usermanage/api/OaFormFile/uploadImg",
      headers: {
        token: Cookies.get('token')
      },
      fileIds: []
    };
  },
  methods: {
    init() {
      console.log(this.val);
      if (this.val) {
        let _this = this;
        getOaFormFileListByIds(this.val)
          .then(function(res) {
            //处理成功结果
            res.data.forEach(file => {
              file.name = file.fileName;
              _this.fileIds.push(file.id);
            });
            _this.fileList = res.data;
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        this.fileList = [];
      }
    },
    uploadSuccess(response, file, fileList) {
      file.id = response.data.id;
      this.fileIds.push(response.data.id);
      this.vals = this.fileIds.join(",");
    },
    uploadError(err, file, fileList) {
      console.log(err);
      this.$message.error("上传失败");
    },
    removefile(file, fileList) {
      this.fileIds = [];
      fileList.forEach(file => {
        this.fileIds.push(file.id);
      });
      this.vals = this.fileIds.join(",");
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 50;
      if (!isLt2M) {
        this.$message.error("上传附件大小不能超过 50MB!");
      }
      return isLt2M;
    }
  },

  watch: {
    vals: function(newValue) {
      //每当str的值改变则发送事件update:word , 并且把值传过去
      console.log(newValue);
      this.$emit("update:val", newValue);
    }
  }
};
</script>

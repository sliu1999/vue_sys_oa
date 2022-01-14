<template>
  <div class="picture-card">
    <div class="el-upload-list--picture-card">
      <!-- 文件显示 -->
      <div>
        <div v-for="(item,index) in multipleFiles" :key="index" class="el-upload-list__item is-ready">
          <img class="el-upload-list__item-thumbnail" :src="$fileUrl+item.fileName" alt="">
          <span class="el-upload-list__item-actions">
            <!-- <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                <i class="el-icon-zoom-in"></i>
                            </span>
                            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                                <i class="el-icon-download"></i>
                            </span> -->
            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(item)">
              <i class="el-icon-delete" />
            </span>
          </span>
        </div>
      </div>
    </div>
    <!-- 上传图标+ 当多文件上传的文件没达到限制时 或者 单文件上传 singleFile为{} 时显示 -->
    <el-upload v-show="(multipleFiles.length < limit&&limit!=1) || (multipleFiles.length==0&&limit==1)" :show-file-list="false" :http-request="upload" action="#" list-type="picture-card" accept="image/*">
      <i slot="default" class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { batchUploadImg } from '@/api/upload'
export default {
  name: 'ElUploadImgTwo',
  props: {
    //编辑的时候用files用于赋值
    files: {
      type: Array
    },
    isDelete: {
      type: Boolean
    },
    limit: {
      type: [Number, String],
      default: 1
    }
  },
  data() {
    return {
      multipleFiles: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false
    }
  },
  watch: {
    //监听属性
    files: {
      //组件创建时立即触发一次函数
      immediate: true,
      //当监听的属性变化时会触发
      handler: function(nVal) {
        console.log(nVal,"files")
        this.multipleFiles = nVal ? nVal : []
      }
    },
    isDelete: {
      immediate: true,
      handler: function(nVal) {
        console.log(nVal,"isDelete")
        this.disabled = nVal ? true : false
      }
    }

  },
  created() {

  },
  methods: {
    upload(param) {
      if (this.multipleFiles.length >= this.limit) {
        this.$message.warning('只能上传' + this.limit + '个文件')
        return
      }

      // FormData 对象
      var form = new FormData()
      // 文件对象
      form.append('file', param.file)
      // 其他参数
      //   form.append("xxx", xxx);
      batchUploadImg(form).then(res => {
        if (res.data) {
          let newFile = {
              fileName: '/files/' + res.data.fileName,
              saveName: res.data.saveName,
              fileType: res.data.fileType,
              dir: res.data.dir,
              systemName: "userManage"
            }
            this.multipleFiles.push(newFile)
            this.$emit('upload', newFile, this.multipleFiles)

        }
      })
    },
    //文件删除
    handleRemove(file) {
      this.multipleFiles.forEach((val, idx) => {
        if (val.saveName == file.saveName) {
          this.multipleFiles.splice(idx, 1)
        }
      })
      this.$emit('remove', file, this.multipleFiles)
    },
    close() {
      this.multipleFiles = []
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .picture-card .el-upload--picture-card {
    width: 147px;
    height: 147px;
    line-height: 149px;
}

.picture-card {
    display: flex;
    flex-wrap: wrap;
}

// .picture-card >>> .el-upload--picture-card {
//     width: 100px;
//     height: 100px;
//     line-height: 98px;
// }

.el-upload-list--picture-card {
    margin: 0;
    display: inline;
    vertical-align: top;
    display: flex;
    flex-wrap: wrap;
}
.el-upload-list__item {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    /* width: 100px;
    height: 100px; */
    /* width: 148px;
    height: 148px; */
    margin: 0 8px 8px 0;
    display: inline-block;
}

.el-upload-list__item-thumbnail {
    width: 100%;
    height: 100%;
}

.el-upload-list__item-actions span {
    display: none;
    cursor: pointer;
}

.el-upload-list__item-actions:hover {
    opacity: 1;
}

.el-upload-list__item-delete {
    position: absolute;
    right: 10px;
    top: 0;
    font-size: 12px;
    color: #606266;
    display: none;
}

.el-upload-list__item-actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s;
}
</style>

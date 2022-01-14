<template>
  <div class="picture-card">
    <div class="el-upload-list--picture-card">
      <div v-if="limit==1">
        <!-- 当singleFile有值时显示 -->
        <div v-if="singleFile != null" class="el-upload-list__item is-ready">
          <img class="el-upload-list__item-thumbnail" :src="$fileUrl+singleFile.fileName" alt="">
          <span class="el-upload-list__item-actions">
            <!-- <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                <i class="el-icon-zoom-in"></i>
                            </span>
                            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                                <i class="el-icon-download"></i>
                            </span> -->
            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove2">
              <i class="el-icon-delete" />
            </span>
          </span>
        </div>
      </div>
      <!-- 多文件显示 -->
      <div v-else>
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
    <el-upload v-show="(multipleFiles.length < limit&&limit!=1) || (singleFile==null&&limit==1)" :show-file-list="false" :http-request="upload" action="#" list-type="picture-card" accept="image/*">
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
  name: 'ElUploadImg',
  props: {
    //编辑的时候用files用于赋值
    files: {
      type: Array
    },
    limit: {
      type: [Number, String],
      default: 1
    }
  },
  data() {
    return {
      singleFile: null,
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
        console.log(nVal,"nval")
        if(this.limit==1){
          this.singleFile = nVal ? nVal[0] : null
        }else{
          this.multipleFiles = nVal ? nVal : []
        }
      }
    }

  },
  created() {
    // console.log((this.multipleFiles.length < this.limit&&this.limit!=1) || (this.singleFile==''&&this.limit==1))
    // console.log(this.singleFile)
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
          if (this.limit == 1) {
            this.singleFile = newFile
            this.$emit('upload', newFile, [newFile])
          } else { 
            this.multipleFiles.push(newFile)
            this.$emit('upload', newFile, this.multipleFiles)
          }
        }
      })
    },
    //多文件删除
    handleRemove(file) {
      // console.log(file);
      this.multipleFiles.forEach((val, idx) => {
        if (val.saveName == file.saveName) {
          this.multipleFiles.splice(idx, 1)
        }
      })

      this.$emit('remove', file, this.multipleFiles)
    },
    //单文件删除
    handleRemove2() {
      this.singleFile = null
      this.$emit('remove', this.singleFile, [])
    },
    close() {
      this.singleFile = null
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

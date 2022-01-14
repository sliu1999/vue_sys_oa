<template>
  <div>
    <el-dialog :visible.sync="addDictionaryModel" @close="closeDialog()" :close-on-click-modal=false
               :modal-append-to-body=false title="流程列表" :width=width>
      <el-form :model="sysDictionary" :rules="rules" ref="sysDictionaryAddForm" label-width="100px"
               class="demo-ruleForm">
               <div style="display:flex">
                 <el-input v-model="flowName" placeholder="请输入流程模型名称查询" style="width:300px;margin-right:20px"></el-input>
                 <el-button size="small" type="primary" @click="sousuo">搜索</el-button>
                 <el-button size="small" type="primary" @click="chongzhi">重置</el-button>
               </div>
        <div class="">
          <el-tag class="listbox" v-for="(item,index) in list" :key="index" @click="append(item)">{{item.flowName}}</el-tag>
        </div>
        <el-form-item class="modal-footer">
          <div class="modal-btn" style="margin-top:20px">
            <!-- <el-button type="primary"  @click="save()">提交</el-button> -->
            <el-button @click="addDictionaryModel = false">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import flowApi from '@/api/flow/index'
  // import dictionaryApi from '@/api/system/dictionary'
  export default {
    name: 'dictionaryAdd',
    data() {
      return {
        addDictionaryModel: false,
        width: null,
        list: [],
        flowName:null,
        sysDictionary: {
          loginName: "",
          mobile: "",


        },
        rules: {
          loginName: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {min: 1, max: 10, message: '长度在10个字符', trigger: 'blur'}
          ],

        }
      }
    },

    methods: {
      sousuo(){
        this.init()
      },
      chongzhi(){
        this.flowName = null
        this.init()
      },
      openDialog(width) {
        this.addDictionaryModel = true
        this.width = width === undefined ? '500px' : width
        this.init()

      },
      append(data) {
        // console.log(data)
        this.$emit('flowdetail', data.id)
        this.addDictionaryModel = false
      },
      init() {
        let obj = {}
        obj.flowName = this.flowName
        flowApi.getList(obj)
          .then(res => {
            this.list = res.data
          })

      },
      closeDialog() {
        this.$refs['sysDictionaryAddForm'].resetFields()
      },

    }
  }
</script>

<style scoped>
  .listbox {
    /* display: flex; */
    margin: 10px 20px 0 0;
    cursor: pointer;
  }

  .listitem {
    border: 1px solid #e5e5e5;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    margin-left: 10px;
    margin-top: 10px;
  }
</style>

<template>
  <div>
    <el-dialog :visible.sync="addRemindModal" :close-on-click-modal=false :show-close="false"
               :modal-append-to-body=false title="流程提醒" :width=width>
      <el-form :model="remindData" ref="remindData" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题">
          <el-input v-model="remindData.notifyTitle" placeholder="请输入标题" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="被提醒人" id="remindForm">
          <users v-if="addRemindModal" :config.sync="userConfig" :val.sync="remindData.notifiedId"></users>
        </el-form-item>
        <el-form-item class="modal-footer">
          <el-button type="primary" @click="confirm()">确认</el-button>
          <el-button @click="closeDialog()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
    import users from '@/views/public/users' //人员选择框
    export default {
        name: "add",
        components:{
          users
        },
        props:{
          data:{}
        },
        data(){
          return{
            addRemindModal:false,
            remindData:this.data,
            userConfig: {
              multiple: true
            },
            width:null,
            // rules:{
            //   remindName:[
            //     {required: true, message: '请输入标题', trigger: 'blur'}
            //   ],
            //   remindUsers:[
            //     {required: true, message: '请选择被提醒人', trigger: ['blur', 'change']}
            //   ]
            // }
          }
        },
        methods:{
          closeDialog(){
            // if(this.$refs['remindData']) this.$refs['remindData'].resetFields();
            this.$parent.resetRemindData();
            this.addRemindModal = false;
          },
          openDialog(width){
            this.addRemindModal = true;
            this.width = width === undefined ? '500px' : width
          },
          confirm(){
            // this.$refs['remindData'].validate((valid) => {
            //   if (valid) {
            //     this.$refs['remindData'].resetFields();
            console.log(this.remindData)
            this.$parent.setNewRemindData();
            this.addRemindModal = false;
              // } else {
              //   return false
              // }
            // })
          }
        },
        watch:{
          remindData: function (newValue) {
            // console.log(newValue)
            //每当str的值改变则发送事件update:word , 并且把值传过去
            this.$emit('update:data', newValue);
          },
          data (newVal) {
            this.remindData = newVal
          }
        }
    }
</script>

<style scoped>
  #remindForm /deep/ .el-form-item__content{
    line-height:30px;
  }
</style>

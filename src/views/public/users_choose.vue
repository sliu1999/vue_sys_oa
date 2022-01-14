<template>
  <el-dialog title="选择人员" :visible.sync="dialogFormVisible">
    <el-form id="usersChoose">
      <el-form-item label="选择人员" style="display: flex;justify-content: flex-start;align-items: center;">
        <el-checkbox-group v-model="multiSelectedItem" style="line-height: 40px;" v-if="multiple">
          <el-checkbox border v-for="item in users" :label="item" :key="item.id">{{item.trueName}}</el-checkbox>
        </el-checkbox-group>
        <el-radio-group v-model="selectedItem" v-if="!multiple" style="line-height: 40px;">
          <el-radio border v-for="item in users" :label="item" :key="item.id">{{item.trueName}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="choosePeople">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name:'usersChoose',
    data() {
      return {
        dialogFormVisible: false,
        multiple:false,
        users: [],
        selectedItem:{},
        payload:{},
        multiSelectedItem:[],
        type:''
      }
    },
    methods: {
      openDialog(users,payload,handlerSelectConfig,type){
        this.multiSelectedItem = [];
        this.selectedItem = {};
        this.multiple = handlerSelectConfig==2?true:false;
        this.users = JSON.parse(JSON.stringify(users))
        this.payload = JSON.parse(JSON.stringify(payload))
        this.type = type;
        this.dialogFormVisible = true;
      },
      choosePeople() {
        let payload = JSON.parse(JSON.stringify(this.payload));
        if(this.multiple){
          payload.assignee = JSON.parse(JSON.stringify(this.multiSelectedItem))
        }else{
          payload.assignee = [];
          if(this.selectedItem.id) payload.assignee.push(this.selectedItem)
        }if(payload.assignee&&payload.assignee.length){
          if(this.type=='submit'){
            this.dialogFormVisible = false;
            this.$parent.submitForm(payload);
          }else if(this.type=='handle'){
            this.dialogFormVisible = false;
            this.$parent.approve(payload);
          }
        }else{
          this.$message({
            duration: 2000,
            message: '请选择审批人',
            type: 'error'
          });
        }
      }
    }
  };
</script>

<style scoped>

</style>

<template>
  <div class="currentuser-ctrl-group">
    <label class="currentuser-ctrl-label">表达式</label>
    <el-select v-model="configs.display" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  export default {
    name: "currentuserConfig",
    props: {
      config:{}
    },
    created:function(){
      this.init();
    },
    methods:{
      init(){

      }
    },
    data(){
      return{
        configs:this.config,
        options:[
          {
            value: 'trueName',
            label: '姓名'
          },{
            value: 'deptName',
            label: '部门'
          },{
            value: 'roleName',
            label: '岗位'
          },{
            value: 'id',
            label: 'id'
          }
        ]
      }
    },
    watch: {
      config(newVal){
        this.configs = newVal
      },
      configs: function(newValue) {
        //每当str的值改变则发送事件update:word , 并且把值传过去
        this.$emit('update:config', newValue)
      }
    }
  }
</script>

<style scoped>
  .currentuser-ctrl-group{
    width: 100%;
    margin: 15px 0;
  }
  .currentuser-ctrl-label{
    font-weight: bold;
  }
</style>

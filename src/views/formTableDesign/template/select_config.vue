<template>
  <div>
    <div class="select-ctrl-group">
      <label class="select-ctrl-label">数据源</label>
      <el-select v-model="configs.source" placeholder="请选择" filterable>
        <el-option
          v-for="option in options"
          :key="option.id"
          :label="option.name"
          :value="option.id">
        </el-option>
      </el-select>
    </div>
    <div class="select-ctrl-group">
      <el-checkbox v-model="configs.multiple">是否多选</el-checkbox>
    </div>
  </div>
</template>

<script>
  export default {
    name: "selectConfig",
    props: {
      config:{}
    },
    created:function(){
      this.init();
    },
    methods:{
      init(){
        console.log(this.configs)
      }
    },
    data(){
      return{
        configs:this.config,
        options:[
          {
            id:'groups',
            name:'部门'
          },{
            id:'roles',
            name:'岗位'
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
  .select-ctrl-group{
    width: 100%;
    margin: 15px 0;
  }
  .select-ctrl-label{
    font-weight: bold;
  }
</style>

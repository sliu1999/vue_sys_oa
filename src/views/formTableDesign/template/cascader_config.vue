<template>
  <div>
    <div class="cascader-ctrl-group">
      <label class="cascader-ctrl-label">选择字典</label>
      <el-select v-model="configs.dicParentId" placeholder="请选择" filterable>
        <el-option
          v-for="dictionary in dictionarys"
          :key="dictionary.id"
          :label="dictionary.name"
          :value="dictionary.id">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
  export default {
    name: "cascaderConfig",
    props: {
      config:{},
      dictionarys:''
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
        configs:this.config
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
  .cascader-ctrl-group{
    width: 100%;
    margin: 15px 0;
  }
  .cascader-ctrl-label{
    font-weight: bold;
  }
</style>

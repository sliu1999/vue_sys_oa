<template>
  <div class="users-ctrl-group">
    <el-checkbox v-model="configs.multiple">是否多选</el-checkbox>
  </div>
</template>

<script>
  export default {
    name: "usersConfig",
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
  .users-ctrl-group{
    width: 100%;
    margin: 15px 0;
  }
</style>

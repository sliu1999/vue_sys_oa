<template>
  <div class="formula-ctrl-group">
    <label class="formula-ctrl-label">填写计算公式</label>
    <input type="text" class="ctrl" v-model="configs.formula"/>
  </div>
</template>

<script>
  export default {
    name: "formulaConfig",
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
  .formula-ctrl-group{
    width: 100%;
    margin: 15px 0;
  }
  .formula-ctrl-label{
    font-weight: bold;
  }
</style>

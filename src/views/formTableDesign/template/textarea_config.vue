<template>
  <div>
    <div class="textarea-ctrl-group">
      <label class="textarea-ctrl-label">最小行数设置</label>
      <input type="text" class="ctrl" v-model="configs.minRows"/>
    </div>
    <div class="textarea-ctrl-group">
      <label class="textarea-ctrl-label">最大行数设置</label>
      <input type="text" class="ctrl" v-model="configs.maxRows"/>
    </div>
  </div>
</template>

<script>
    export default {
      name: "textarea_config",
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
  .textarea-ctrl-group{
    width: 100%;
    margin: 15px 0;
  }
  .textarea-ctrl-label{
    font-weight: bold;
  }
</style>

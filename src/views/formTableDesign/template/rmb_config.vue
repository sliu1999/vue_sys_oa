<template>
  <div class="rmb-ctrl-group">
    <label class="rmb-ctrl-label">对应金额字段</label>
    <el-select v-model="configs.related" placeholder="请选择">
      <el-option
        v-for="item in fields"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  export default {
    name: "rmbConfig",
    props: {
      config:{},
      allfields:'',
      isdetail:'',
      detailfields:''
    },
    created:function(){
      this.init();
    },
    methods:{
      init(){
        if(this.isdetail){
          this.fields = this.allfields.concat(this.detailfields);
        }else{
          this.fields = this.allfields;
        }
      }
    },
    data(){
      return{
        configs:this.config,
        fields:''
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
  .rmb-ctrl-group{
    width: 100%;
    margin: 15px 0;
  }
  .rmb-ctrl-label{
    font-weight: bold;
  }
</style>

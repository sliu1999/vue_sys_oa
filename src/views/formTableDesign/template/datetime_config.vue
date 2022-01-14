<template>
  <div class="datetime-ctrl-group">
    <label class="datetime-ctrl-label">显示精度</label>
    <el-select v-model="configs.type" placeholder="请选择">
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
    name: "datetimeConfig",
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
            value: 'datetime',
            label: '日期加时间'
          }, {
            value: 'date',
            label: '仅日期'
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
  .datetime-ctrl-group{
    width: 100%;
    margin: 15px 0;
  }
  .datetime-ctrl-label{
    font-weight: bold;
  }
</style>

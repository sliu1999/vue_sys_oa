<template>
  <div>
    <div class="datediff-ctrl-group">
      <label class="datediff-ctrl-label">对应开始时间字段</label>
      <el-select v-model="configs.start" placeholder="请选择">
        <el-option
          v-for="item in fields"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="datediff-ctrl-group">
      <label class="datediff-ctrl-label">对应结束时间字段</label>
      <el-select v-model="configs.end" placeholder="请选择">
        <el-option
          v-for="item in fields"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="datediff-ctrl-group">
      <label class="datediff-ctrl-label">时间精度</label>
      <el-select v-model="configs.unit" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
  export default {
    name: "datediffConfig",
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
          this.fields = this.detailfields;
        }else{
          this.fields = this.allfields;
        }
      }
    },
    data(){
      return{
        configs:this.config,
        fields:'',
        options:[
          {
            value: 'day',
            label: '天'
          }, {
            value: 'hour',
            label: '小时'
          }, {
            value: 'minute',
            label: '分钟'
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
  .datediff-ctrl-group{
    width: 100%;
    margin: 15px 0;
  }
  .datediff-ctrl-label{
    font-weight: bold;
  }
</style>

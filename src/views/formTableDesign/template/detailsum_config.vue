<template>
  <div>
    <div class="detailsum-ctrl-group">
      <label class="detailsum-ctrl-label">对应明细表</label>
      <el-select v-model="configs.detailKey" placeholder="请选择" :change="changeDetail(configs.detailKey)">
        <el-option
          v-for="item in details"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="detailsum-ctrl-group">
      <label class="detailsum-ctrl-label">对应明细表字段</label>
      <el-select v-model="configs.fieldId" placeholder="请选择">
        <el-option
          v-for="item in detailFields"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="detailsum-ctrl-group">
      <label class="detailsum-ctrl-label">汇总种类选择</label>
      <div style="margin-top: 10px;">
        <el-radio v-model="configs.type" label="sum">合计</el-radio>
        <el-radio v-model="configs.type" label="avg">平均</el-radio>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "detailsumConfig",
    props: {
      config:{},
      detail:'',
      detailmap:''
    },
    created:function(){
      this.init();
    },
    methods:{
      init(){
        this.details = this.detail
        this.detailsmap = this.detailmap
      },
      changeDetail(detailKey){
        this.detailFields = this.detailsmap[detailKey]
      }
    },
    data(){
      return{
        configs:this.config,
        details:'',
        detailsmap:'',
        detailKey:'',
        detailFields:[]
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
  .detailsum-ctrl-group{
    width: 100%;
    margin: 15px 0;
  }
  .detailsum-ctrl-label{
    font-weight: bold;
  }
</style>

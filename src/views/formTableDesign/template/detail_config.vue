<template>
  <div>
    <div class="detail-ctrl-group">
      <el-checkbox v-model="configs.flagSum">是否分类汇总</el-checkbox>
    </div>
    <div class="detail-ctrl-group" v-if="configs.flagSum">
      <label class="detail-ctrl-label">分类字段</label>
      <el-select v-model="configs.catsField" multiple placeholder="请选择">
        <el-option v-for="item in fields" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>
    <div class="detail-ctrl-group" v-if="configs.flagSum">
      <label class="detail-ctrl-label">汇总字段</label>
      <el-select v-model="configs.sumField" multiple placeholder="请选择">
        <el-option v-for="item in fields" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
  export default {
    name: "detail_config",
    props: {
      config:{},
      detailfields:''
    },
    created:function(){
      this.init();
    },
    methods:{
      init(){
        this.fields = this.detailfields
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
  .detail-ctrl-group{
    width: 100%;
    margin: 15px 0;
  }
  .detail-ctrl-label{
    font-weight: bold;
  }
</style>

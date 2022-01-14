<template>
  <el-cascader
    :options="options"
    v-model="vals"
    change-on-select
    show-all-levels
    filterable
    clearable
  >
  </el-cascader>
</template>

<script>
  import DictionaryApi from '@/api/dictionary'
  export default {
    name: "cascader",
    props: {
      name: '',
      val:'',
      config:{}
    },
    created:function(){
      this.init();
    },
    methods:{
      init(){
        let dicParentId = this.config.dicParentId;
        let _this = this;
        console.log(this.val,"this.val")
        if(this.val) this.vals = this.val.split(',')
        DictionaryApi.getTreeDictionary(dicParentId).then(
          function (res) {
            // 处理成功的结果
            console.log(res.data,"dic.res.data")
            if(res.errorCode == 0){
              _this.options = res.data.children;
            }
          }
        ).catch(function (error) {
          console.log(error);
        });
      }
    },
    data(){
      return{
        names:this.name,
        vals:[],
        configs:this.config,
        options: []
      }
    },
    watch: {
      val(newVal){
        console.log(newVal)
        if(newVal) this.vals = newVal.split(',');
      },
      vals: function(newValue) {
        //每当str的值改变则发送事件update:word , 并且把值传过去
        if(newValue){
          let val = newValue.join(',')
          this.$emit('update:val', val)
        }
      }
    }
  }
</script>

<style scoped>

</style>

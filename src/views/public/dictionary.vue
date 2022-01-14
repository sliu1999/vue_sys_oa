<template>
  <el-select v-model="vals" filterable :multiple="multiple" :clearable="!multiple" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    >
    </el-option>
  </el-select>
</template>

<script>
  import DictionaryApi from '@/api/dictionary'
  export default {
    name: "dictionary",
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
        this.multiple = this.configs.multiple?true:false;
        if(this.val){
          this.vals = this.configs.multiple?this.val.split(','):this.val;
        }
        let dicId = this.config.dicId != undefined ? this.config.dicId : 0;
        let _this = this;
        DictionaryApi.getDictionaryListNoPage(dicId).then(
          function (res) {
            // 处理成功的结果
            if(res.errorCode == 0){
              _this.options = [];
              if(res.data.children.length){
                _this.options = res.data.children
              }
            }
          }
        ).catch(function (error) {
          console.log(error);
        });
      },
    },
    data(){
      return{
        names:this.name,
        vals:'',
        configs:this.config,
        options: []
      }

    },
    watch: {
      val(newVal){
        if(newVal){
          this.vals = this.configs.multiple?newVal.split(','):newVal;
        }
      },
      vals: function(newValue) {
        //每当str的值改变则发送事件update:word , 并且把值传过去
        if(newValue){
          if(this.configs.multiple){
            let val = newValue.join(',')
            this.$emit('update:val', val)
          }else{
            this.$emit('update:val', newValue)
          }
        }else{
          this.$emit('update:val', newValue)
        }
      }
    }
  }
</script>

<style scoped>

</style>

<template>
  <el-date-picker
    v-model="vals"
    :type="type"
    :value-format="formart"
    :format="formart"
    :placeholder="placeholder">
  </el-date-picker>
</template>

<script>
  import Bus from '@/vuex/bus.js'
  export default {
    name: "datePicker",
    props: {
      name: '',
      val:'',
      config:{},
      id:'',
      index:''
    },
    created:function(){
    if(this.val==''){
      this.$emit("update:val", null);
    }
      this.init();
    },
    methods:{
      init(){
        this.type = this.configs.type||'date';
        this.placeholder = this.configs.type=='datetime'?'选择日期时间':'选择日期';
        this.formart = this.configs.type=='datetime'?'yyyy-MM-dd HH:mm':'yyyy-MM-dd';
      }
    },
    data(){
      return{
        names:this.name,
        vals:this.val,
        configs:this.config,
        ids:this.id,
        indexs:this.index
      }
    },
    watch: {
      val(newVal){
        this.vals = newVal
      },
      vals: function(newValue) {
        //每当str的值改变则发送事件update:word , 并且把值传过去
        this.$emit('update:val', newValue);
        Bus.$emit(this.ids,{                                  //值改变时把该值和对应下标（明细表有，主表没有）传给其他组件
          index:this.indexs,
          value:newValue
        })
      }
    }
  }
</script>

<style scoped>

</style>

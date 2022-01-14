<template>
  <span :id="ids">{{displayName}}</span>
</template>

<script>
  import Bus from '@/vuex/bus.js'
  import DictionaryApi from '@/api/dictionary'
  export default {
    name: "convert_dictionary",
    props: {
      id: '',
      val:'',
      index:''
      // state:''
    },
    created:function(){
      this.init()
    },
    methods:{
      init(){
        //请求接口，根据id获取name
        let _this=this;
        if(this.val){
          DictionaryApi.getDictionaryName(_this.val).then(
            function (res) {
              _this.displayName = res.data.join(',')
            }
          ).catch(function (error) {
            console.log(error);
          });
        }
      }
    },
    data(){
      return{
        ids:this.id,
        vals:'',
        indexs:this.index,
        displayName:'',
        dics:[]
        // states:this.state,
      }

    },
    watch: {
      val(newVal){
        //请求接口，根据id获取name
        this.init()
      },
      // vals: function(newValue) {
      //   //每当str的值改变则发送事件update:word , 并且把值传过去
      //   this.$emit('update:val', newValue);
      //   Bus.$emit(this.ids,{                                 //值改变时把该值和对应下标（明细表有，主表没有）传给其他组件
      //     index:this.indexs,
      //     value:newValue
      //   })
      // }
    }
  }
</script>

<style scoped>

</style>

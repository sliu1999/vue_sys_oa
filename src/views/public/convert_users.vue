<template>
  <span :id="ids">{{displayName}}</span>
</template>

<script>
  import Bus from '@/vuex/bus.js'
  import {getListById} from '@/api/system/user'
  export default {
    name: "convert_users",
    props: {
      id: '',
      val:'',
      index:'',
      config:{}
    },
    created:function(){
      this.init()
    },
    methods:{
      init(){
        //请求接口，根据id获取name
        let _this=this;
        if(this.val){
          getListById(this.val).then(
            function (res) {
              //处理成功结果
              _this.users = []
              res.data.forEach(user=>{
                _this.users.push(user.trueName);
              })
              _this.displayName = _this.users.join(',')
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
        vals:this.val,
        indexs:this.index,
        configs:this.config,
        displayName:'',
        users:[]
      }

    },
    watch: {
      val(newVal){
        //请求接口，根据id获取name
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

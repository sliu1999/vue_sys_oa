<template>
  <span :id="ids">{{displayName}}</span>
</template>

<script>
  import Bus from '@/vuex/bus.js'
  import {getRoleListByIds} from '@/api/system/role'
  import {getDepartListByIds} from '@/api/organization/department'
  export default {
    name: "convert_select",
    props: {
      id: '',
      val:'',
      index:'',
      config:{}
    },
    created:function(){
		console.log(this.val,this.config)
      this.init()
    },
    methods:{
      init(){
        //请求接口，根据id获取name
        if(this.val){
          if(this.config.source == 'roles'){
            let _this=this;
            getRoleListByIds(_this.val).then(
              function (res) {
                //处理成功结果
                let displayName = [];
                res.data.forEach(role=>{
                  displayName.push(role.name)
                })
                _this.displayName = displayName.join(',')
              }
            ).catch(function (error) {
              console.log(error);
            });
          }else if(this.config.source == 'groups'){
            let _this=this;
            getDepartListByIds(_this.val).then(
              function (res) {
                //处理成功结果
                let displayName = [];
                res.data.forEach(role=>{
                  displayName.push(role.name)
                })
                _this.displayName = displayName.join(',')
              }
            ).catch(function (error) {
              console.log(error);
            });
          }
        }
      }
    },
    data(){
      return{
        ids:this.id,
        vals:'',
        indexs:this.index,
        configs:this.config,
        displayName:''
      }

    },
    watch: {
      val(newVal){
        //请求接口，根据id获取name
        this.displayName=""
        this.init()
      },
      vals: function(newValue) {
        //每当str的值改变则发送事件update:word , 并且把值传过去
        this.$emit('update:val', newValue);
        Bus.$emit(this.ids,{                                 //值改变时把该值和对应下标（明细表有，主表没有）传给其他组件
          index:this.indexs,
          value:newValue
        })
      }
    }
  }
</script>

<style scoped>

</style>

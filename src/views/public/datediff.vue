<template>
  <div>{{vals}}</div>
</template>

<script>
  import Bus from '@/vuex/bus.js'
  export default {
    name: "datediff",
    props: {
      val:'',
      config:{},
      index:''
    },
    created:function(){

    },
    mounted:function(){
      this.init();
    },
    methods:{
      init(){
        var startTime = this.config.start||'';
        var endTime = this.config.end||'';
        Bus.$on(startTime,(message)=>{
          if(message.index&&message.index==this.indexs){
            startTime = message.value||'';
            this.fSetDiff(startTime,endTime)
          }else if(!message.index){
            startTime = message.value||'';
            this.fSetDiff(startTime,endTime)
          }
        });
        Bus.$on(endTime,(message)=>{
          if(message.index&&message.index==this.indexs){
            endTime = message.value||'';
            this.fSetDiff(startTime,endTime)
          }else if(!message.index){
            endTime = message.value||'';
            this.fSetDiff(startTime,endTime)
          }
        })
      },
      fSetDiff(startRef, endRef){
        var startDate = new Date(startRef).getTime();
        var endDate = new Date(endRef).getTime();
        var cModel;
        var unit = this.config.unit || 'day';
        if (startDate > endDate)
          this.vals = '开始时间不得大于结束时间'
        else if (unit == 'day') {
          cModel = parseInt((endDate - startDate) / 86400000);
          isNaN(cModel) && (cModel = 0)
          this.vals = cModel + '天';
        }
        else if (unit == 'hour') {
          cModel = parseInt((endDate - startDate) / 3600000);
          isNaN(cModel) && (cModel = 0)
          this.vals = cModel + '小时';
        }
        else if (unit == 'minute') {
          cModel = parseInt((endDate - startDate) / 60000);
          isNaN(cModel) && (cModel = 0)
          this.vals = cModel + '分钟';
        }
      }
    },
    data(){
      return{
        vals:this.val,
        configs:this.config,
        indexs:this.index
      }

    },
    watch: {
      val(newVal){
        this.vals = newVal
      },
      vals: function(newValue) {
        //每当str的值改变则发送事件update:word , 并且把值传过去
        this.$emit('update:val', newValue)
      }
    }
  }
</script>

<style scoped>

</style>

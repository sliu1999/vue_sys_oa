<template>
  <el-input type="textarea" v-model="vals" :autosize="rows" readonly></el-input>
</template>

<script>
    export default {
      name: "textarea_readonly",
      props: {
        id: '',
        val:'',
        index:'',
        config:{}
        // state:''
      },
      created:function(){
        this.vals = this.val;
      },
      data(){
        return{
          ids:this.id,
          vals:'',
          indexs:this.index,
          rows:{
            minRows:this.config.minRows?this.config.minRows:'3',
            maxRows:this.config.maxRows?this.config.maxRows:'5'
          }
          // states:this.state,
        }

      },
      watch: {
        val(newVal){
          console.log(newVal)
          this.vals = newVal
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

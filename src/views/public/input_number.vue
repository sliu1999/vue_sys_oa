<template>
  <div :id="ids">
    <el-input :placeholder="placeholders" v-model="vals" type="number"></el-input>
  </div>
</template>

<script>
  import Bus from '@/vuex/bus.js'
  export default {
    name: "inputNumber",
    props: {
      name: '',
      val:'',
      id:'',
      index:''
    },
    created:function(){
      this.vals = this.val;
    },
    data(){
      return{
        ids:this.id,
        vals:'',
        placeholders:'在此输入'+this.name,
        indexs:this.index
      }
    },
    watch: {
      val(newVal){
        this.vals = newVal
      },
      vals: function(newValue) {
        //每当str的值改变则发送事件update:word , 并且把值传过去
        // if(newValue){
					this.$emit('update:val', newValue);
					Bus.$emit(this.ids,{                                  //值改变时把该值和对应下标（明细表有，主表没有）传给其他组件
					  index:this.indexs,
					  value:newValue
					})
				// }
      }
    }
  }
</script>

<style scoped>

</style>

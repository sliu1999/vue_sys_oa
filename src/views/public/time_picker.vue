<template>
  <el-time-picker
    v-model="vals"
    :picker-options="{
      selectableRange: '00:00:00 - 23:59:59'
    }"
    format='HH:mm'
    value-format="HH:mm"
    placeholder="选择时间">
  </el-time-picker>
</template>

<script>
  export default {
    name: "timePicker",
    props: {
      name: '',
      val:'',
      config:{}
    },
    data(){
      return{
        names:this.name,
        vals:this.val,
        configs:this.config
      }
    },
    created() {
      if(this.val==''){
        this.$emit("update:val", null);
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

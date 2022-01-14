<template>
  <!--<el-form-item :label="placeholders">-->
    <el-input type="textarea" :placeholder="placeholders" v-model="vals" :autosize="rows"></el-input>
  <!--</el-form-item>-->
</template>

<script>
    export default {
        name: "input_text",
        props: {
          name: '',
          val:'',
          config:{}
        },
        data(){
          return{
            // names:this.name,
            vals:this.val,
            placeholders:'在此输入'+this.name,
            rows:{
              minRows:this.config.minRows?this.config.minRows:'3',
              maxRows:this.config.maxRows?this.config.maxRows:'5'
            }
            // states:this.state,
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

<template>
  <!--<el-form-item :label="placeholders" >-->
    <!--<el-input v-model="vals"></el-input>-->
  <!--</el-form-item>-->
  <div style="width:100%">{{names}}</div>
  <!--<el-form :inline="true" size="mini">-->
      <!--<el-input v-model="vals"></el-input>-->
  <!--</el-form>-->
</template>

<script>
  export default {
    name: "test",
    props: {
      name: '',
      // val:'',
      // placeholder:'',
      // state:''
    },
    data(){
      return{
        names:this.name
        // vals:this.val,
        // placeholders:this.placeholder,
        // states:this.state,
      }

    },
    watch: {

    }
  }
</script>

<style scoped>

</style>

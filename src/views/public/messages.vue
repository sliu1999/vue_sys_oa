<template>
  <div>
    <el-timeline>
      <el-timeline-item
        v-for="(obj, index) in log"
        v-if="obj.curNode!='startElement'"
        :key="index"
        :timestamp="obj.createDate">
        <h3>{{obj.message?obj.message:(obj.actionId==2||obj.actionId==5)?'通过':obj.actionId==3?'拒绝':obj.actionId==7?'撤回':obj.actionId==4?'转交':''}}</h3>
        <div>由{{obj.curAssigneeName}}{{(obj.actionId==2||obj.actionId==5)?'通过':obj.actionId==3?'拒绝':obj.actionId==7?'撤回':obj.actionId==4?'转交':''}}</div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
    export default {
      name: "messages",
      props:{
        log:''
      },
      created:function () {
        console.log(this.log)
      }
    }
</script>

<style scoped>

</style>

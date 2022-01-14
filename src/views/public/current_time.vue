<template>
  <span>{{vals}}</span>
</template>

<script>
  import Bus from '@/vuex/bus.js'
  import {
    formatDate
  } from '@/javascript/format.js'
  export default {
    name: "currentTime",
    props: {
      name: '',
      val: '',
      config: {},
      id: '',
      index: ''
    },
    created: function() {
      let _this = this
      _this.init()
      setInterval(function() {
        _this.init();
      }, 1000)
    },
    methods: {
      init() {
        this.vals = formatDate(new Date(), 'yyyy-MM-dd HH:mm')
      }
    },
    data() {
      return {
        names: this.name,
        vals: this.val,
        configs: this.config,
        ids: this.id,
        indexs: this.index
      }
    },
    watch: {
      val(newVal) {
        this.vals = newVal
      },
      vals: function(newValue) {
        //每当str的值改变则发送事件update:word , 并且把值传过去
        this.$emit('update:val', newValue);
        Bus.$emit(this.ids, { //值改变时把该值和对应下标（明细表有，主表没有）传给其他组件
          index: this.indexs,
          value: newValue
        })
      }
    }
  }
</script>

<style scoped>

</style>

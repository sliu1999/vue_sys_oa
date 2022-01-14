<template>
  <div>{{vals}}</div>
</template>

<script>
  import Bus from '@/vuex/bus.js'
  export default {
    name: "detailsum",
    props: {
      val: '',
      config: {},
      index: '',
      id: '',
      parent: {}
    },
    created: function() {

    },
    mounted: function() {
      this.init();
    },
    methods: {
      init() {
        let _this = this
        this.fieldId = this.config.fieldId;
        this.detailKey = this.config.detailKey;
        let fields = [];
        Bus.$on(this.fieldId, (message) => { //需要合计的值如果发生变化，重新计算
          let sum = 0;
          _this.num = 0
          if (this.parent[this.detailKey].some(detail => (detail[this.fieldId] > 0 && detail[this.fieldId] >=
              9007199254740992) || (detail[this.fieldId] < 0 && detail[this.fieldId] <= -9007199254740992))) {
            _this.$message({
              message: '明细表字段中有值超过范围(-9007199254740991,9007199254740991)，请修改',
              type: 'warning'
            });
            _this.vals = ''
            _this.isOk = false
          } else {
            _this.isOk = true
          }
          if (this.isOk) {
            this.parent[this.detailKey].forEach(detail => {
              if (detail[this.fieldId]) {
                if (detail[this.fieldId].indexOf(".") != -1) {
                  if (detail[this.fieldId].split('.')[1].length > _this.num) {
                    _this.num = JSON.parse(JSON.stringify(detail[this.fieldId].split('.')[1].length))
                  }
                }
              }
            })
            if (this.parent[this.detailKey].some(detail => (detail[this.fieldId] > 0 && detail[this.fieldId] * Math
                .pow(10, _this.num) >=
                999999999999999) || (detail[this.fieldId] < 0 && detail[this.fieldId] * Math
                .pow(10, _this.num) <= -999999999999999))) {
              _this.$message({
                message: '浮点数整数部分加小数部分位数不能超过15位，请修改',
                type: 'warning'
              });
              _this.vals = ''
            } else {
              this.parent[this.detailKey].forEach(detail => {
                sum += Number(detail[this.fieldId]) || 0;
              })
              if(this.config.type&&this.config.type == 'avg'){
                this.vals = (isNaN(sum/this.parent[this.detailKey].length) ? '' : sum/this.parent[this.detailKey].length).toFixed(2)
              }else{
                this.vals = (isNaN(sum) ? '' : sum).toFixed(_this.num);
              }
            }
          } else {
            _this.vals = ''
          }
        })
        Bus.$on(this.detailKey, (message) => { //明细表长度变化，重新计算（防止删除一张明细表时因需要合计的值没有变化而没有触发重新计算）
          let sum = 0;
          _this.num = 0
          if (this.parent[this.detailKey].some(detail => (detail[this.fieldId] > 0 && detail[this.fieldId] >=
              9007199254740992) || (detail[this.fieldId] < 0 && detail[this.fieldId] <= -9007199254740992))) {
            _this.$message({
              message: '明细表字段中有值超过范围(-9007199254740991,9007199254740991)，请修改',
              type: 'warning'
            });
            _this.vals = ''
            _this.isOk = false
          } else {
            _this.isOk = true
          }
          if (this.isOk) {
            this.parent[this.detailKey].forEach(detail => {
              if (detail[this.fieldId]) {
                if (detail[this.fieldId].indexOf(".") != -1) {
                  if (detail[this.fieldId].split('.')[1].length > _this.num) {
                    _this.num = JSON.parse(JSON.stringify(detail[this.fieldId].split('.')[1].length))
                  }
                }
              }
            })
            if (this.parent[this.detailKey].some(detail => (detail[this.fieldId] > 0 && detail[this.fieldId] * Math
                .pow(10, _this.num) >=
                999999999999999) || (detail[this.fieldId] < 0 && detail[this.fieldId] * Math
                .pow(10, _this.num) <= 999999999999999))) {
              _this.$message({
                message: '浮点数整数部分加小数部分位数不能超过15位，请修改',
                type: 'warning'
              });
              _this.vals = ''
            } else {
              this.parent[this.detailKey].forEach(detail => {
                sum += Number(detail[this.fieldId]) || 0;
              })
              if(this.config.type&&this.config.type == 'avg'){
                this.vals = (isNaN(sum/this.parent[this.detailKey].length) ? '' : sum/this.parent[this.detailKey].length).toFixed(2)
              }else{
                this.vals = (isNaN(sum) ? '' : sum).toFixed(_this.num);
              }
            }
          } else {
            _this.vals = ''
          }
        })
      }
    },
    data() {
      return {
        vals: this.val,
        configs: this.config,
        indexs: this.index,
        ids: this.id,
        parents: this.parent,
        isOk: true,
        num: 0
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

<template>
  <div>{{vals}}</div>
</template>

<script>
  import Bus from '@/vuex/bus.js'
  export default {
    name: "exceed",
    props: {
      val: '',
      config: {},
      index: ''
    },
    created: function() {
      var refField = this.config.ref || '';
      Bus.$on(refField, (message) => {
        this.time = message
      })
      this.setTimer = setInterval(() => {
        this.init();
      }, 1000)
    },
    beforeDestroy() {
      clearInterval(this.setTimer)
    },
    mounted: function() {

    },
    methods: {
      init() {
        let _this = this
        console.log(_this.time)
        if (_this.time.index != undefined && _this.time.index == _this.indexs) {
          _this.vals = _this.calculate(_this.time.value)
        } else if (_this.time.index == undefined) {
          _this.vals = _this.calculate(_this.time.value)
        }
      },
      calculate(ref) {
        var refDate
        if (ref) {
          if (typeof ref == 'number') {
            refDate = Number(ref);
          } else if (typeof ref == 'string') {
            refDate = +new Date(ref);
          }
          var diff = (+new Date) - refDate;
          var unit = this.config.unit || 'day';
          var result = '0' + unit == 'year&month' || unit == 'year' ? '年' : unit == 'hour' ? '小时' : unit == 'minute' ?
            '分钟' : unit == 'month' ? '月' : '天';
          if (diff > 0) {
            if (unit == 'minute') {
              var number = parseInt(diff / 60000)
              isNaN(number) && (number = 0)
              result = number + '分钟'
            } else if (unit == 'day') {
              var number = parseInt(diff / 86400000)
              isNaN(number) && (number = 0)
              result = number + '天'
            } else if (unit == 'hour') {
              var number = parseInt(diff / 3600000)
              isNaN(number) && (number = 0)
              result = number + '小时'
            } else if (unit == 'month') {
              var number = parseInt(diff / (86400000 * 30))
              isNaN(number) && (number = 0)
              result = number + '月'
            } else if (unit == 'year') {
              var number = parseInt(diff / (86400000 * 365))
              isNaN(number) && (number = 0)
              result = number + '年'
            } else if (unit == 'year&month') {
              var years = parseInt(diff / (86400000 * 365));
              var months = parseInt((diff - years * (86400000 * 365)) / (86400000 * 30));
              if (months == 0) {
                months++
              }
              result = years + '年' + months + '月'
            }
          } else {
            result = "还未到截止时间"
          }
          return result;
        }
      }
    },
    data() {
      return {
        vals: this.val,
        configs: this.config,
        indexs: this.index,
        time: {
          index: undefined,
          value: null
        }
      }

    },
    watch: {
      val(newVal) {
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

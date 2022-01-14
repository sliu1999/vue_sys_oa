<template>
  <div>{{vals}}</div>
</template>

<script>
  import Bus from '@/vuex/bus.js'
  export default {
    name: "rmb",
    props: {
      val: '',
      config: {},
      index: ''
    },
    created: function() {

    },
    mounted: function() {
      this.init();
    },
    methods: {
      init() {
        let _this = this
        var relatedField = this.config.related || '';
        let strLimit = /^(-?\d+)(\.\d+)?$/
        Bus.$on(relatedField, (message) => {
          console.log(message)
          if (message.index != undefined && message.index == _this.indexs) {
            if (message.value) {
              var value = Number(message.value)
              if (message.value.length > 1 && message.value.substring(0, 1) == '0' && message.value.substring(0, 2) !=
                '0.') {
                _this.$message({
                  message: '请输入正确金额',
                  type: 'warning'
                });
                _this.vals = ''
              }else if (strLimit.test(value)) {
                if (value >= 0) {
                  if (value < 1000000000000) {
                    value = Math.round(value * 100) / 100
                    _this.vals = _this.fParseRmb(value)
                  } else {
                    _this.$message({
                      message: '输入金额大于万亿，显示错误！',
                      type: 'warning'
                    });
                    _this.vals = ''
                  }
                } else {
                  _this.vals = '金额不可为负数'
                }
              } else {
                _this.$message({
                  message: '请输入正确金额',
                  type: 'warning'
                });
                _this.vals = ''
              }
            } else {
              _this.vals = ''
            }
          } else if (message.index == undefined) {
            if (message.value) {
              var value = Number(message.value)
              if (message.value.length > 1 && message.value.substring(0, 1) == '0' && message.value.substring(0, 2) !=
                '0.') {
                _this.$message({
                  message: '请输入正确金额',
                  type: 'warning'
                });
                _this.vals = ''
              }else if (strLimit.test(value)) {
                if (value >= 0) {
                  if (value < 1000000000000) {
                    value = Math.round(value * 100) / 100
                    _this.vals = _this.fParseRmb(value)
                    console.log(_this.vals)
                  } else {
                    _this.$message({
                      message: '输入金额大于万亿，显示错误！',
                      type: 'warning'
                    });
                    _this.vals = ''
                  }
                } else {
                  _this.vals = '金额不可为负数'
                }
              } else {
                _this.$message({
                  message: '请输入正确金额',
                  type: 'warning'
                });
                _this.vals = ''
              }
            } else {
              _this.vals = ''
            }
          }
        })
      },
      fParseRmb(n) {
        var fraction = ['角', '分'];
        var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        var unit = [
          ['元', '万', '亿'],
          ['', '拾', '佰', '仟']
        ];
        var head = n < 0 ? '欠' : '';
        // n = Math.abs(n);
        var stringN = n.toString();
        var decimals = stringN.split('.');
        if (decimals[1]) {
          var decimalsNum = decimals[1].split('');
          console.log(decimalsNum)
        }
        var s = '';
        if (decimalsNum) {
          var length = decimalsNum.length > 2 ? 2 : decimalsNum.length;
          for (var i = 0; i < length; i++) {
            console.log(digit[decimalsNum[i]] + fraction[i])
            s += (digit[decimalsNum[i]] + fraction[i]);
            console.log(s);
          }
        }
        s = s || '整';
        n = Math.floor(n);
        for (var i = 0; i < unit[0].length && n > 0; i++) {
          var p = '';
          for (var j = 0; j < unit[1].length && n > 0; j++) {
            if (digit[n % 10] == '零' && unit[1][j] != '元') {
              if (p[0] == '零') p = '' + p
              else p = '零' + p;
            } else {
              p = digit[n % 10] + unit[1][j] + p;
            }
            n = Math.floor(n / 10);
          }
          s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        }
        return head + s.replace(/^整$/, '零元整');
      }
    },
    data() {
      return {
        vals: this.val,
        configs: this.config,
        indexs: this.index
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

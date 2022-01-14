<template>
  <div>{{vals}}</div>
</template>

<script>
  import Bus from '@/vuex/bus.js'
  export default {
    name: "formula",
    props: {
      val: '',
      config: {},
      index: '',
      id: ''
    },
    created: function() {

    },
    mounted: function() {
      this.init();
    },
    methods: {
      init() {
        let _this = this
        this.formula = this.config.formula;
        var fields = this.formula.match(/[a-zA-Z]\w+/g);
        let result = 0;
        console.log(fields)
        fields.forEach((field) => {
          window[field] = window[field] ? window[field] : [] //在window里定义字段变量，以数组形式
          console.log(window[field])
          Bus.$on(field, (message) => { //监控每个计算变量的值，如果改变则更新值重新计算
            if (!message.value) {       //当没有值过来的时候需要找到对应位置再计算，不会影响其他位置的组件
              if(message.index == undefined){
                window[field][-1] = ''
                _this.vals = ""
              }else if(message.index != undefined && message.index == this.indexs){
                window[field][ message.index] = '';
                _this.vals = ""
              }
            } else {
              if ((message.value > 0 && message.value >= 9007199254740992) || (message.value < 0 && message.value <=
                  -9007199254740992)) {
                _this.$message({
                  message: '输入的值应在(-9007199254740991,9007199254740991)范围中',
                  type: 'warning'
                });
                _this.vals = ""
              } else {
                if (message.value.toString().indexOf('.') != -1 && (message.value * Math.pow(10, message.value.toString().split('.')[
                    1].length) >= 999999999999999 || message.value * Math.pow(10, message.value.toString().split('.')[1]
                    .length) <= -999999999999999)) {
                  _this.$message({
                    message: '浮点数整数部分加小数部分位数不能超过15位，请修改',
                    type: 'warning'
                  });
                  _this.vals = ''
                } else {
                  if (Number(message.value) < 0) {
                    message.value = '(' + message.value + ')'
                  }
                  window[field][message.index != undefined ? message.index : -1] = message.value; //如果值变化，会传新的值和对应的下标（明细表有,主表没有），更新window在对应变量数组中对应下标插入新值，如没有下标则在下标-1位置插值
                  if (message.index != undefined && message.index == this.indexs) { //新传的下标和当前组件下标比较，如果相等才计算，即明细表中同一行计算
                    var formula = this.formula;
                    fields.forEach((value) => {
                      formula = formula.replace(value, window[value][message.index] ? window[value][message
                          .index
                        ] :
                        window[value][-1] ? window[value][-1] : 0) //将公式中的字段替换成对应值然后计算，只对index相同的计算，如果含有主表字段则加上主表字段的值
                    })
                    console.log(formula)
                    if (formula.indexOf('/0') != -1 && formula.indexOf('/0.') == -1) {
                      _this.$message({
                        message: '除数不能为空或0',
                        type: 'warning'
                      });
                      _this.vals = ""
                    } else {
                      result = eval(formula)+'';
                      if(result){
                        if (result.indexOf('.') != -1) {
                          if (result.split('.')[1].indexOf('0000000000') != -1) {
                            result = result.substring(0, result.split('.')[0].length + result.split('.')[1].indexOf(
                              '0000000000') + 1)
                          }
                        }
                      }
                      this.vals = result;
                    }
                  } else if (message.index == undefined) { //如果没有下标则说明该值是主表字段里的值
                    var formula = this.formula;
                    fields.forEach((value1) => {
                      console.log(window[value1][-1])
                      formula = formula.replace(value1, window[value1][this.indexs] ? window[value1][this.indexs] :
                        window[value1][-1] ? window[value1][-1] : 0)
                    })
                    console.log(formula)
                    if (formula.indexOf('/0') != -1 && formula.indexOf('/0.') == -1) {
                      _this.$message({
                        message: '除数不能为空或0',
                        type: 'warning'
                      });
                      _this.vals = ""
                    } else {
                      result = eval(formula)+'';
                      if(result){
                        if (result.indexOf('.') != -1) {
                          if (result.split('.')[1].indexOf('0000000000') != -1) {
                            result = result.substring(0, result.split('.')[0].length + result.split('.')[1].indexOf(
                              '0000000000') + 1)
                          }
                        }
                      }
                      this.vals = result;
                    }
                  }
                }
              }
            }
          })
        })
        result = eval(this.formula) != 'NaN' ? '' : eval(this.formula);
        this.vals = result;
      }
    },
    data() {
      return {
        vals: this.val,
        configs: this.config,
        indexs: this.index,
        ids: this.id,
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

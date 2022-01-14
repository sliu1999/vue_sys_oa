<template>
  <span :id="ids">{{displayName}}</span>
</template>

<script>
  import DictionaryApi from '@/api/dictionary'
  import Bus from '@/vuex/bus.js'
  export default {
    name: "convert_cascader",
    props: {
      id: '',
      val: '',
      index: ''
      // state:''
    },
    created: function() {
      this.init()
    },
    methods: {
      init() {
        //请求接口，根据id获取name
        let _this = this;
        console.log(_this.val)
        // console.log()
        if (this.val) {
          DictionaryApi.getDictionaryLabels(_this.val).then(
            function(res) {
              // 处理成功的结果
              console.log(res)
              if (res.errorCode == 0) {
                _this.dics = []
                res.data.forEach(user => {
                  _this.dics.push(user.dictionaryName);
                })
                _this.displayName = _this.dics.join('')
              }
              console.log(_this.displayName)
            }
          ).catch(function(error) {
            console.log(error);
          });
        } else {
          _this.displayName = ""
        }
      }
    },
    data() {
      return {
        ids: this.id,
        vals: '',
        indexs: this.index,
        displayName: '',
        dics: []
        // states:this.state,
      }

    },
    watch: {
      val(newVal) {
        //请求接口，根据id获取name
        this.init()
      },
      // vals: function(newValue) {
      //   //每当str的值改变则发送事件update:word , 并且把值传过去
      //   this.$emit('update:val', newValue);
      //   Bus.$emit(this.ids,{                                 //值改变时把该值和对应下标（明细表有，主表没有）传给其他组件
      //     index:this.indexs,
      //     value:newValue
      //   })
      // }
    }
  }
</script>

<style scoped>

</style>

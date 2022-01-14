<template>
  <el-select v-model="vals" filterable :multiple="multiple" :clearable="!multiple" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
	import {getAllRole} from '@/api/system/role'
  import {departmentList} from '@/api/organization/department'
  export default {
    name: "selectCommon",
    props: {
      name: '',
      val:'',
      config:{}
    },
    created:function(){
      this.init();
    },
    methods:{
      init(){
        this.multiple = this.configs.multiple?true:false;                         //是否为多选
        if(this.val){
          this.vals = this.configs.multiple?this.val.split(','):this.val;
        }
        if(this.configs.source == 'roles'){
          let _this=this;
          getAllRole()
            .then(function (res) {
							_this.options = [];
							res.data.forEach(value=>{
							  value.name = value.name
							  _this.options.push(value)
							})
            })
        }else if(this.configs.source == 'groups'){
          let _this=this;
          
          departmentList()
            .then(function (res) {
              _this.options = [];
              res.data.forEach(value=>{
                value.name = value.name;
                value.id += '';
                _this.options.push(value)
              })
              console.log(_this.options)
            })
        }
      }
    },
    data(){
      return{
        names:this.name,
        vals:'',
        configs:this.config,
        options: [],
      }
    },
    watch: {
      val(newVal){
        if(newVal){
          this.vals = this.configs.multiple?newVal.split(','):newVal;
        }
      },
      vals: function(newValue) {
        //每当str的值改变则发送事件update:word , 并且把值传过去
        if(newValue){
          if(this.configs.multiple){
            let val = newValue.join(',')
            this.$emit('update:val', val)
          }else{
            this.$emit('update:val', newValue)
          }
        }else{
          this.$emit('update:val', newValue)
        }
      }
    }
  }
</script>

<style scoped>

</style>

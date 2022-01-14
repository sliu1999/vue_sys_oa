<template>
  <div>
    <div class="datecal-ctrl-wrap">
      <label class="datecal-ctrl-label">
        新增参与计算字段
        <el-button type="primary" icon="el-icon-plus" size="mini" style="padding:1px;margin-left:5px;" @click="configs.calItems.push({})"></el-button>
      </label>
      <div style="margin-top: 5px;">
        <div class="col-sm-4">
          <label class="datecal-ctrl-label">类型</label>
        </div>
        <div class="col-sm-5">
          <label class="datecal-ctrl-label">表单字段</label>
        </div>
        <div class="col-sm-2">
          <label class="datecal-ctrl-label">单位</label>
        </div>
      </div>
      <div v-for="(item,index) in configs.calItems">
        <div v-if="index>0">
          <div class="col-sm-4" style="text-align: center">
              运算符
          </div>
          <div class="col-sm-6">
            <label class="datecal-ctrl-label">
              <select class="datecal-ctrl" v-model="item.operator">
                <option v-for="operator in operators" :value="operator.id">{{operator.name}}</option>
              </select>
            </label>
          </div>
        </div>
        <div>
          <div class="col-sm-4">
            <label class="datecal-ctrl-label">
              <select class="datecal-ctrl" v-model="item.type">
                <option v-for="cat in cats" :value="cat.id">{{cat.name}}</option>
              </select>
            </label>
          </div>
          <div class="col-sm-7" :class="{isNumber:item.type=='number'}">
            <label class="datecal-ctrl-label">
              <select class="datecal-ctrl" v-model="item.fieldId">
                <option v-for="field in fields" :value="field.id">{{field.name}}</option>
              </select>
            </label>
          </div>
          <div class="col-sm-2" v-if="item.type=='number'">
            <label class="datecal-ctrl-label">
              <select class="datecal-ctrl" v-model="item.unit">
                <option v-for="option in options" :value="option.id">{{option.name}}</option>
              </select>
            </label>
          </div>
          <div class="col-sm-1" style="float: right">
            <el-button type="danger" icon="el-icon-close" size="mini" :disabled="configs.calItems.length<2" style="padding:1px;" @click="configs.calItems.splice(index,1)"></el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "datecalConfig",
    props: {
      config:{},
      allfields:''
    },
    created:function(){
      this.init();
    },
    methods:{
      init(){
        this.fields = this.allfields;
        this.$set(this.configs,'calItems',this.config.calItems||[{}])
      }
    },
    data(){
      return{
        configs:this.config,
        fields:'',
        options:[
          {
            id: 'day',
            name: '日'
          }, {
            id: 'month',
            name: '月'
          }, {
            id: 'year',
            name: '年'
          }
        ],
        cats:[
          {
            id: 'datetime',
            name: '可选日期'
          }, {
            id: 'number',
            name: '数字'
          }
        ],
        operators:[
          {
            id:'+',
            name:'加'
          },
          {
            id:'-',
            name:'减'
          },
          {
            id:'*',
            name:'乘'
          },
          {
            id:'/',
            name:'除'
          }
        ]
      }
    },
    watch: {
      config(newVal){
        this.configs = newVal
      },
      configs: function(newValue) {
        //每当str的值改变则发送事件update:word , 并且把值传过去
        this.$emit('update:config', newValue)
      }
    }
  }
</script>

<style scoped>
  .datecal-ctrl-wrap{
    padding: 3px;
    box-shadow: 0 1px 4px
    rgba(0, 0, 0, 0.3), 0 0 40px
    rgba(0, 0, 0, 0.1) inset;
    margin-bottom: 5px;
    font-size: 14px;
  }
  .datecal-ctrl-label{
    font-weight: bold;
  }
  .isNumber{
    width:40% !important;
  }
  .col-sm-4{
    width:32%;
    display: inline-block;
  }
  .col-sm-5{
    width:41%;
    display: inline-block;
  }
  .col-sm-1{
    width:8%;
    display: inline-block;
  }
  .col-sm-6{
    width:49%;
    display: inline-block;
  }
  .col-sm-7{
    width:56%;
    display: inline-block;
  }
  .col-sm-3{
    width:24%;
    display: inline-block;
  }
  .col-sm-2{
    width:15%;
    display: inline-block;
  }
  input.datecal-ctrl{
    width: 100%;
    border-style: none;
    border-bottom: 1px solid rgb(221, 221, 221);
    background: transparent;
    outline: none;
    color: inherit;
    font-size: inherit;
    margin-top:10px;
  }
  select.datecal-ctrl{
    width: 100%;
    border-style:none;
    border-bottom: 1px solid rgb(221, 221, 221);
    background:transparent;
    outline: none;
    color:inherit;
    font-size:inherit
  }
</style>

<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="明细列表">
        <div>
          {{names}}
          <el-button type="text" size="mini" @click="addDetail()" v-if="flagStart||flagEditable">添加</el-button>
        </div>
        <div :id="ids" style="width:100%;overflow-x: auto">
          <el-form>
            <table class="detail-table" style="width:100%;">
              <tr style="font-weight: 600;">
                <td v-if="flagStart"></td>
                <td>
                  <div style="width:60px;text-align: center">
                    序号
                  </div>
                </td>
                <td v-for="(field,index) in fieldList" v-if="!field.fieldHide">
                  <div v-if="field.width" :style="{width:field.width+'px'}">
                    {{field.name}}
                  </div>
                  <div v-else style="min-width: 300px;">
                    {{field.name}}
                  </div>
                </td>
              </tr>
              <tr v-for="(detailData,index) in detailDatas">
                <td v-if="flagStart">
                  <div style="width:80px">
                    <el-button type="text" size="mini" @click="delDetail(index)" :disabled="detailDatas.length==1">删除</el-button>
                    <el-button type="text" size="mini" @click="copyDetail(detailData)">复制</el-button>
                  </div>
                </td>
                <td>
                  <div style="width:60px;text-align: center">
                    {{index+1}}
                  </div>
                </td>
                <td v-for="detail in fieldList" v-if="!detail.fieldHide">
                  <span style="color:red;position:absolute;top:0;right:0;font-size: 25px;" v-if="detail.required&&hideDetail.indexOf(detail.id)==-1&&detail.id">*</span>
                  <component v-if="hideDetail.indexOf(detail.id)==-1||!detail.id" :is="detail.html" :val.sync="detailData[detail.id]"
                             :name.sync="detail.name" :config.sync="detail.config" :id.sync="detail.id" :index="index" :parent.sync="detailDatas"
                             :grandparent.sync="parents" :tableKey.sync="tableKey"></component>
                  <!-- is绑定组件名称  val绑定表单字段的值   name绑定表单字段的名称   config绑定各组件的配置信息   id绑定表单字段的id   index绑定明细表的数组下标   parent绑定整个明细表数组的数据    grandparent绑定整个表单数据（如sql表单域里需要主表里的字段数据） tableKey绑定当前表单表名 -->
                  <p v-if="hideDetail.indexOf(detail.id)!=-1&&detail.id" style="color: #ccc;">该节点字段不可见</p>
                </td>
              </tr>
            </table>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="汇总" v-if="configs.flagSum">
        <div style="width:100%;overflow-x: auto">
          <table class="detail-table" style="width:100%;">
            <tr style="font-weight: 600;">
              <td>
                <div style="width:60px;text-align: center">
                  序号
                </div>
              </td>
              <td v-for="(field,index) in fieldList" v-if="!field.fieldHide">
                <div v-if="field.width" :style="{width:field.width+'px'}">
                  {{field.name}}
                </div>
                <div v-else style="min-width: 300px;">
                  {{field.name}}
                </div>
              </td>
            </tr>
            <tr v-for="(detailData,index) in sumDatas">
              <td>
                <div style="width:60px;text-align: center">
                  {{index+1}}
                </div>
              </td>
              <td v-for="detail in fieldList" v-if="!detail.fieldHide">
                <span style="color:red;position:absolute;top:0;right:0;font-size: 25px;" v-if="detail.required&&hideDetail.indexOf(detail.id)==-1&&detail.id">*</span>
                <component v-if="hideDetail.indexOf(detail.id)==-1||!detail.id" :is="detail.sumHtml" :val.sync="detailData[detail.id]"
                           :name.sync="detail.name" :config.sync="detail.config" :id.sync="detail.id" :index="index" :parent.sync="detailDatas"
                           :grandparent.sync="parents" :tableKey.sync="tableKey"></component>
                <!-- is绑定组件名称  val绑定表单字段的值   name绑定表单字段的名称   config绑定各组件的配置信息   id绑定表单字段的id   index绑定明细表的数组下标   parent绑定整个明细表数组的数据    grandparent绑定整个表单数据（如sql表单域里需要主表里的字段数据） tableKey绑定当前表单表名 -->
                <p v-if="hideDetail.indexOf(detail.id)!=-1&&detail.id" style="color: #ccc;">该节点字段不可见</p>
              </td>
            </tr>
          </table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import Bus from '@/vuex/bus.js'
  import inputcommon from '@/views/public/input_common' //文本框
  import inputnumber from '@/views/public/input_number' //数字文本框
  import inputtext from '@/views/public/input_text' //多行文本框
  import test from '@/views/public/test' //表单字段中文名称
  import selectcommon from '@/views/public/select_common' //下拉框
  import datepicker from '@/views/public/date_picker' //日期控件
  import timepicker from '@/views/public/time_picker' //时间控件
  import formula from '@/views/public/formula' //公式计算
  import rmb from '@/views/public/rmb' //人民币大写
  import readonly from '@/views/public/readonly' //展示数据信息（不关联其他组件）
  import displayonly from '@/views/public/displayonly' //只读文本
  import datediff from '@/views/public/datediff' //时间差
  import currenttime from '@/views/public/current_time' //当前时间
  import dictionary from '@/views/public/dictionary' //数据字典
  import cascader from '@/views/public/cascader' //联动字典
  import users from '@/views/public/users' //人员选择框
  import convert_dictionary from '@/views/public/convert_dictionary' //数据字典查看
  import convert_cascader from '@/views/public/convert_cascader' //联动字典查看
  import convert_select from '@/views/public/convert_select' //下拉框查看
  import convert_users from '@/views/public/convert_users' //人员选择框查看
  import exceed from '@/views/public/exceed' //超时时间
  import upload from '@/views/public/upload' //文件上传
  import view_files from '@/views/public/view_files' //文件查看
  import textarea_readonly from '@/views/public/textarea_readonly' //多行文本只读
  export default {
    name: "detail_handle",
    props: {
      name: '',
      fields: '',
      tableData: null,
      id: '',
      val: '',
      parent: '',
      tableKey: '',
      editTableDetail: null,
      hideTableDetail: null,
      flagStart: false,
      config:{}
      // placeholder:'',
      // state:''
    },
    created: function() {
      this.init();
    },
    mounted: function() {

    },
    components: {
      inputcommon,
      inputtext,
      test,
      selectcommon,
      datepicker,
      formula,
      readonly,
      timepicker,
      rmb,
      inputnumber,
      currenttime,
      dictionary,
      users,
      convert_dictionary,
      convert_select,
      convert_users,
      exceed,
      displayonly,
      cascader,
      convert_cascader,
      upload,
      view_files,
      datediff,
      textarea_readonly
    },
    data() {
      return {
        names: this.name,
        fieldList: [],
        ids: this.id,
        detailDatas: this.val,
        sumDatas: [],
        configs:this.config,
        flagEditable: false,
        hideDetail: [],
        originDetail: {},
        parents: this.parent,
        detailLength: this.fields.length * 400,
        // index:1,
        ctrlRef: { //可编辑时对应组件名
          'text': 'inputcommon',
          'textarea': 'inputtext',
          'select': 'selectcommon',
          'datetime': 'datepicker',
          'formula': 'formula',
          'displayonly': 'displayonly',
          'time': 'timepicker',
          'rmb': 'rmb',
          'datediff': 'datediff',
          'number': 'inputnumber',
          'current': 'currenttime',
          'sum': 'detailsum',
          'dictionary': 'dictionary',
          'cascader': 'cascader',
          'sql': 'sql',
          'users': 'users',
          'sequence': 'sequence',
          'exceed': 'exceed',
          'info': 'currentuser',
          'upload': 'upload',
          'history': 'history'
        },
        viewRef: { //查看时对应组件名
          'text': 'readonly',
          'textarea': 'textarea_readonly',
          'select': 'convert_select',
          'datetime': 'readonly',
          'formula': 'readonly',
          'displayonly': 'readonly',
          'time': 'readonly',
          'rmb': 'readonly',
          'datediff': 'readonly',
          'number': 'readonly',
          'current': 'readonly',
          'sum': 'readonly',
          'dictionary': 'convert_dictionary',
          'cascader': 'convert_cascader',
          'sql': 'convert_sql',
          'users': 'convert_users',
          'sequence': 'readonly',
          'exceed': 'readonly',
          'info': 'readonly',
          'upload': 'view_files',
          'history': 'history_view'
        }
      }
    },
    methods: {
      init() {
        let _this = this
        let catsData = JSON.parse(JSON.stringify(this.detailDatas))
        this.sumDatas = [];
        let category = 0;
        catsData.forEach((data,index)=>{
          if(index==0){
            data.category = category;
            category += 1;
            this.sumDatas.push(data)
          }else{
            if(this.config.catsField&&this.config.catsField.length){
              let flagSame = false;
              for(let i = 0;i<this.sumDatas.length;i++){
                let curDataSame = true;
                for(let j = 0;j<this.config.catsField.length;j++){
                  if(data[this.config.catsField[j]]!=this.sumDatas[i][this.config.catsField[j]]){
                    curDataSame = false;
                    break;
                  }
                }
                if(curDataSame){
                  if(this.config.sumField&&this.config.sumField.length){
                    this.config.sumField.forEach( field => {
                      this.sumDatas[i][field] = Number(this.sumDatas[i][field]) + Number(data[field])
                    })
                    flagSame = true;
                    break;
                  }
                }
              }
              if(!flagSame){
                data.category = category;
                category += 1;
                this.sumDatas.push(data)
              }
            }
          }
        })
        _this.hideTableDetail.forEach(res => {
          if (res.hostId == _this.ids) {
            _this.hideDetail = res.orderId
          }
        })
        this.fields.forEach(field => {
          if (!field.flagHide) {
            this.fieldList.push(field)
          }
          if (field.default) {
            this.detailDatas[0][field.id] = this.detailDatas[0][field.id] || field.default;
            this.originDetail[field.id] = field.default;
          }
        })
        this.fieldList.forEach((field, key) => {
          if (_this.flagStart) {
            field.html = _this.ctrlRef[field.ctrl];
            field.html = field.flagEdit ? this.ctrlRef[field.ctrl] : this.viewRef[field.ctrl];
          } else {
            console.log(_this.fieldList)
            _this.editTableDetail.forEach(value => {
              if (value.hostId == _this.ids) {
                _this.flagEditable = true;
                field.html = value.orderId.indexOf(field.id) != -1 ? _this.ctrlRef[field.ctrl] :
                  _this.viewRef[field.ctrl];
              } else {
                _this.flagEditable = false;
                field.html = _this.viewRef[field.ctrl];
              }
            })
          }
          field.sumHtml = this.viewRef[field.ctrl];
          field.config = field.config ? field.config : {};
        })
        this.fieldList.forEach(res => {
          if (res.flagField) {
            if (res.toggleField === false) {
              if (res.relatedFieldValue === _this.detailDatas[0][res.relatedField]) {
                res.fieldHide = true
                _this.detailDatas[0][res.id] = ""
                _this.tableData.forEach(item => {
                  if (item.fields) {
                    item.fields.forEach(field => {
                      if (field.id == res.id) {
                        field.required = false
                      }
                    })
                  }
                })
              } else {
                res.fieldHide = false
                _this.tableData.forEach(item => {
                  if (item.fields) {
                    item.fields.forEach(field => {
                      if (field.id == res.id) {
                        field.required = field.isRequired
                      }
                    })
                  }
                })
              }
            } else if (res.toggleField === true) {
              if (res.relatedFieldValue === _this.detailDatas[0][res.relatedField]) {
                res.fieldHide = false
                _this.tableData.forEach(item => {
                  if (item.fields) {
                    item.fields.forEach(field => {
                      if (field.id == res.id) {
                        field.required = field.isRequired
                      }
                    })
                  }
                })
              } else {
                res.fieldHide = true
                _this.detailDatas[0][res.id] = ""
                _this.tableData.forEach(item => {
                  if (item.fields) {
                    item.fields.forEach(field => {
                      if (field.id == res.id) {
                        field.required = false
                      }
                    })
                  }
                })
              }
            }
          }
        })
      },
      addDetail() {
        let originDetail = {};
        originDetail = JSON.parse(JSON.stringify(this.originDetail));
        // this.index++;
        // originDetail.$index = this.index;
        this.detailDatas.push(originDetail);
      },
      delDetail(index) {
        this.detailDatas.splice(index, 1);
      },
      copyDetail(detailData) {
        let itemCopy = {};
        itemCopy = JSON.parse(JSON.stringify(detailData));
        // this.index++;
        // itemCopy.$index = this.index;
        this.detailDatas.push(itemCopy);
      }
    },
    watch: {
      detailDatas: {
        handler: function(newValue) {
          //每当str的值改变则发送事件update:word , 并且把值传过去
          let _this = this
          this.detailDatas = newValue
          console.log(this.fields)
          this.$emit('update:val', newValue);
          Bus.$emit(this.ids, { //值改变时把该值和对应下标（明细表有，主表没有）传给其他组件
            length: newValue.length
          })
          let catsData = JSON.parse(JSON.stringify(this.detailDatas))
          this.sumDatas = [];
          let category = 0;
          catsData.forEach((data,index)=>{
            if(index==0){
              data.category = category;
              category += 1;
              this.sumDatas.push(data)
            }else{
              if(this.config.catsField&&this.config.catsField.length){
                let flagSame = false;
                for(let i = 0;i<this.sumDatas.length;i++){
                  let curDataSame = true;
                  for(let j = 0;j<this.config.catsField.length;j++){
                    if(data[this.config.catsField[j]]!=this.sumDatas[i][this.config.catsField[j]]){
                      curDataSame = false;
                      break;
                    }
                  }
                  if(curDataSame){
                    if(this.config.sumField&&this.config.sumField.length){
                      this.config.sumField.forEach( field => {
                        this.sumDatas[i][field] = Number(this.sumDatas[i][field]) + Number(data[field])
                      })
                      flagSame = true;
                      break;
                    }
                  }
                }
                if(!flagSame){
                  data.category = category;
                  category += 1;
                  this.sumDatas.push(data)
                }
              }
            }
          })
          this.fieldList.forEach(res => {
            if (res.flagField) {
              if (res.toggleField === false) {
                if (res.relatedFieldValue === newValue[0][res.relatedField]) {
                  res.fieldHide = true
                  newValue[0][res.id] = ""
                  _this.tableData.forEach(item => {
                    if (item.fields) {
                      item.fields.forEach(field => {
                        if (field.id == res.id) {
                          field.required = false
                        }
                      })
                    }
                  })
                  // _this.fields.forEach(item => {
                  //   if (item.id == res.id) {
                  //     item.required = false
                  //   }
                  // })
                } else {
                  res.fieldHide = false
                  _this.tableData.forEach(item => {
                    if (item.fields) {
                      item.fields.forEach(field => {
                        if (field.id == res.id) {
                          field.required = field.isRequired
                        }
                      })
                    }
                  })
                }
              } else if (res.toggleField === true) {
                if (res.relatedFieldValue === newValue[0][res.relatedField]) {
                  res.fieldHide = false
                  _this.tableData.forEach(item => {
                    if (item.fields) {
                      item.fields.forEach(field => {
                        if (field.id == res.id) {
                          field.required = field.isRequired
                        }
                      })
                    }
                  })
                } else {
                  res.fieldHide = true
                  newValue[0][res.id] = ""
                  _this.tableData.forEach(item => {
                    if (item.fields) {
                      item.fields.forEach(field => {
                        if (field.id == res.id) {
                          field.required = false
                        }
                      })
                    }
                  })
                }
              }
            }
          })
          _this.$emit('update:tableData', _this.tableData)
        },
        deep: true
      }
    }
  }
</script>

<style scoped>

</style>

<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="明细列表">
        <div>
          {{names}}
          <span v-if="detailDatas.length==0" style="color: #ccc;font-size: 14px;margin-left: 10px;">用户无权限</span>
        </div>
        <div :id="ids" style="width:100%;overflow-x: auto" v-if="detailDatas.length!=0">
          <el-form>
            <table class="detail-table" style="min-width:1400px;width:100%;">
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
              <tr v-for="(detailData,index) in detailDatas">
                <td>
                  <div style="width:60px;text-align: center">
                    {{index+1}}
                  </div>
                </td>
                <td v-for="detail in fieldList" v-if="!detail.fieldHide">
                  <component v-if="hideDetail.indexOf(detail.id)==-1||!detail.id" :is="detail.html" :val.sync="detailData[detail.id]" :name.sync="detail.name" :config.sync="detail.config"
                             :id.sync="detail.id" :index="index" :parent.sync="detailDatas" :grandparent.sync="parents"
                             :tableKey.sync="tableKey"></component>
                  <!-- is绑定组件名称  val绑定表单字段的值   name绑定表单字段的名称   config绑定各组件的配置信息   id绑定表单字段的id   index绑定明细表的数组下标   parent绑定整个明细表数组的数据    grandparent绑定整个表单数据（如sql表单域里需要主表里的字段数据）-->
                  <p v-if="!detailData.hasOwnProperty(detail.id)&&detail.id" style="color: #ccc;">用户无权限</p>
                  <p v-if="hideDetail.indexOf(detail.id)!=-1&&detail.id" style="color: #ccc;">该节点字段不可见</p>
                </td>
              </tr>
            </table>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="汇总" v-if="configs.flagSum">
        <div style="width:100%;overflow-x: auto">
          <table class="detail-table" style="min-width:1400px;width:100%;">
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
                <component v-if="hideDetail.indexOf(detail.id)==-1||!detail.id" :is="detail.sumHtml" :val.sync="detailData[detail.id]" :name.sync="detail.name" :config.sync="detail.config"
                           :id.sync="detail.id" :index="index" :parent.sync="detailDatas" :grandparent.sync="parents"
                           :tableKey.sync="tableKey"></component>
                <!-- is绑定组件名称  val绑定表单字段的值   name绑定表单字段的名称   config绑定各组件的配置信息   id绑定表单字段的id   index绑定明细表的数组下标   parent绑定整个明细表数组的数据    grandparent绑定整个表单数据（如sql表单域里需要主表里的字段数据）-->
                <p v-if="!detailData.hasOwnProperty(detail.id)&&detail.id" style="color: #ccc;">用户无权限</p>
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
  import inputcommon from '@/views/public/input_common'
  import inputnumber from '@/views/public/input_number'
  import inputtext from '@/views/public/input_text'
  import test from '@/views/public/test'
  import detail from '@/views/public/detail'
  import selectcommon from '@/views/public/select_common'
  import datepicker from '@/views/public/date_picker'
  import formula from '@/views/public/formula'
  import readonly from '@/views/public/readonly' //展示数据信息（不关联其他组件）
  import displayonly from '@/views/public/displayonly' //只读文本
  import timepicker from '@/views/public/time_picker'
  import rmb from '@/views/public/rmb'
  import currenttime from '@/views/public/current_time'
  import dictionary from '@/views/public/dictionary'
  import users from '@/views/public/users' //人员选择框
  import convert_dictionary from '@/views/public/convert_dictionary' //数据字典查看
  import convert_select from '@/views/public/convert_select' //下拉框查看
  import convert_users from '@/views/public/convert_users' //人员选择框查看
  import exceed from '@/views/public/exceed' //超时时间
  import upload from '@/views/public/upload' //文件上传
  import view_files from '@/views/public/view_files' //文件查看
  import textarea_readonly from '@/views/public/textarea_readonly' //多行文本只读
  export default {
    name: "detail_check",
    props: {
      name: '',
      fields: '',
      id: '',
      val: '',
      parent: '',
      tableKey: '',
      hideTableDetail: null,
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
      detail,
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
      upload,
      view_files,
      textarea_readonly
    },
    data() {
      return {
        names: this.name,
        fieldList: [],
        hideDetail: [],
        ids: this.id,
        detailDatas: this.val,
        sumDatas: [],
        configs:this.config,
        originDetail: {},
        parents: this.parent,
        detailLength: this.fields.length * 300,
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
          'sql': 'convert_sql',
          'users': 'convert_users',
          'sequence': 'readonly',
          'exceed': 'readonly',
          'info': 'readonly',
          'upload': 'view_files',
          'history': 'history_view',
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
        })
        console.log(this.fieldList)
        this.fieldList.forEach((field, key) => {
          field.html = this.viewRef[field.ctrl];
          field.sumHtml = this.viewRef[field.ctrl];
          field.config = field.config ? field.config : {}
          // if(field.default){
          //   this.detailDatas[0][field.id] = field.default;
          //   this.originDetail[field.id] = field.default;
          // }
        })
        this.fieldList.forEach(res => {
          if (res.flagField) {
            if (res.toggleField === false) {
              if (res.relatedFieldValue === _this.detailDatas[0][res.relatedField]) {
                res.fieldHide = true
                _this.detailDatas[0][res.id] = ""
              } else {
                res.fieldHide = false
              }
            } else if (res.toggleField === true) {
              if (res.relatedFieldValue === _this.detailDatas[0][res.relatedField]) {
                res.fieldHide = false
              } else {
                res.fieldHide = true
                _this.detailDatas[0][res.id] = ""
              }
            }
          }
        })
      },
    },
    watch: {
      detailDatas:{
        handler:function(newValue){
          this.detailDatas = newValue;
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
        },
        deep: true
      },
      val: function(newValue) {
        this.detailDatas = newValue
      }
    }
  }
</script>

<template>
  <table id="newForm" class="newForm" cellspacing="0" cellpadding="0">
    <tr v-for="(html,index) in htmls">
      <td v-for="(content,index) in html.content" :colspan="content.colspan" :rowspan="content.rowspan" :style="content.contentStyle"
        :class="{formLabel:content.html=='test'}" v-if="!content.fieldHide">
        <span style="color:red;position:absolute;top:0;right:0;font-size: 25px;" v-if="content.required&&tableHide.indexOf(content.id)==-1&&content.id">*</span>
        <component v-if="tableHide.indexOf(content.id)==-1||!content.id" :is="content.html" :val.sync="formData[content.id]" :name.sync="content.name" :config.sync="content.config"
          :fields.sync="content.fields" :id.sync="content.id" :parent.sync="formData" :tableKey.sync="tableKey" :hideTableDetail="tableDetailHide" :log.sync="log"></component>
        <!-- is绑定组件名称  val绑定表单字段的值   name绑定表单字段的名称   config绑定各组件的配置信息   fields绑定明细表的所有字段及其字段信息   id绑定表单字段的id   parent绑定整个表单对象的数据   tableKey绑定当前表单表名 -->
        <p v-if="!formData.hasOwnProperty(content.id)&&content.id" style="color: #ccc;">用户无权限</p>
        <p v-if="tableHide.indexOf(content.id)!=-1&&content.id" style="color: #ccc;">该节点字段不可见</p>
      </td>
    </tr>
  </table>
</template>

<script>
  import test from '@/views/public/test' //表单字段中文名称
  import readonly from '@/views/public/readonly' //展示数据信息（不关联其他组件）
  import convert_dictionary from '@/views/public/convert_dictionary' //数据字典查看
  import convert_cascader from '@/views/public/convert_cascader' //联动字典查看
  import convert_select from '@/views/public/convert_select' //下拉框查看
  import detail_check from '@/views/public/detail_check' //明细表查看
  import convert_users from '@/views/public/convert_users' //人员选择框查看
  import view_files from '@/views/public/view_files' //文件查看
  import messages from '@/views/public/messages' //审批意见汇总
  import textarea_readonly from '@/views/public/textarea_readonly' //多行文本只读
  export default {
    name: 'renderView',
    props: {
      tableSchema: '',
      formView: '',
      formData: {},
      tableKey: '',
      log:'',
      hideTable: null,
      hideTableDetail: null,
      pageAccess:false
    },
    watch: {
      formData(val) {
        console.log(val)
        this.init()
      }
    },
    created: function() {
      this.init();
    },
    components: {
      test,
      readonly,
      convert_dictionary,
      convert_cascader,
      convert_select,
      detail_check,
      convert_users,
      view_files,
      messages,
      textarea_readonly
    },
    methods: {
      init() {
        let _this = this
        this.tableHide = this.hideTable ? this.hideTable : [];
        this.tableDetailHide = this.hideTableDetail ? this.hideTableDetail : [];
        let formView = typeof this.formView === "string" ? JSON.parse(this.formView) : this.formView;
        let tableSchema = typeof this.tableSchema === "string" ? JSON.parse(this.tableSchema) : this.tableSchema;
        formView.forEach((item, index) => {
          item.content.forEach((content) => {
            content.contentStyle = {
              width: content.id ? 100 / Number(item.content.length * content.colspan) + 10 + '%' : 100 /
                Number(item.content.length * content.colspan) - 10 + '%'
            }
            tableSchema.forEach((field, key) => {
              if (field.id == content.id) {
                if (field.flagDetail) {
                  content.fields = field.fields;
                  content.html = 'detail_check';
                  content.config = field.config ? field.config : {};
                  if(!_this.pageAccess){
                    this.$set(this.formData, field.id, this.formData[field.id] || [{}])
                  }
                } else {
                  content.html = this.viewRef[field.ctrl];
                  content.config = field.config ? field.config : {};
                  if(!_this.pageAccess){
                    if (this.formData[field.id] || this.formData[field.id] == 0) {
                      this.$set(this.formData, field.id, this.formData[field.id])
                    } else {
                      if (field.default) {
                        this.$set(this.formData, field.id, field.default)
                      } else {
                        this.$set(this.formData, field.id, null)
                      }
                    }
                    // this.$set(this.formData, field.id, this.formData[field.id] ? this.formData[field.id] :
                    //   field.default ? field.default : null) //初始化formData值，包括隐藏字段，触发视图更新
                  }
                }
              } else {
                if(!_this.pageAccess){
                  if (this.formData[field.id] || this.formData[field.id] == 0) {
                    this.$set(this.formData, field.id, this.formData[field.id])
                  } else {
                    if (field.default) {
                      this.$set(this.formData, field.id, field.default)
                    } else {
                      this.$set(this.formData, field.id, null)
                    }
                  }
                  // this.$set(this.formData, field.id, this.formData[field.id] ? this.formData[field.id] :
                  //   field.default ? field.default : null)
                }
              }
            })
          })
        });
        formView.forEach(res => {
          for (let i = 0; i < res.content.length; i++) {
            if (res.content[i].typeText && res.content[i].html != "detail") {
              if (res.content[i].flagField) {
                if (res.content[i].toggleField === false) {
                  if (res.content[i].relatedFieldValue === _this.formData[res.content[i].relatedField]) {
                    res.content[i].fieldHide = true
                    res.content[i - 1].fieldHide = true
                    _this.formData[res.content[i].id] = ""
                  } else {
                    res.content[i].fieldHide = false
                    res.content[i - 1].fieldHide = false
                  }
                } else if (res.content[i].toggleField === true) {
                  if (res.content[i].relatedFieldValue === _this.formData[res.content[i].relatedField]) {
                    res.content[i].fieldHide = false
                    res.content[i - 1].fieldHide = false
                  } else {
                    res.content[i].fieldHide = true
                    res.content[i - 1].fieldHide = true
                    _this.formData[res.content[i].id] = ""
                  }
                }
              }
            }
          }
        })
        console.log(formView)
        console.log(this.formData)
        this.htmls = formView;
      }
    },
    data() {
      return {
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
          'datecal': 'readonly',
          'upload': 'view_files',
          'messages': 'messages',
          'history': 'history_view'
        },
        htmls: [],
        tableHide: [],
        tableDetailHide: []
      }
    }
  }
</script>

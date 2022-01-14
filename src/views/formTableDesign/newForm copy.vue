<template>
  <div id="formDesigner">
    <el-container>
      <!-- 左侧 打开，保存 ，新建 ，表单名称 -->
      <el-aside width="80px" id="leftAside">
        <div class="imgbox">
          <img src="../../../static/images/xf1.png" alt="打开" @click="openModules">
        </div>
        <div class="imgbox">
           <img src="../../../static/images/xf1.png" alt="保存" @click="saveForm">
        </div>
        <div class="imgbox">
          <img src="../../../static/images/xz2.png" alt="新建" @click="openCreate">
        </div>
        <div id="modName" style="width: 20px;margin: 0 auto;margin-top: 32vh;margin-bottom:0vh">{{modName}}</div>
      </el-aside>
      <!-- 右侧所有内容 -->
      <el-container>
        <!-- 头部视图，源码tab -->
        <el-header id="formDesignerTab">
          <el-tabs v-model="activeName2" type="border-card">
            <el-tab-pane label="视图编辑" name="edit"></el-tab-pane>
            <el-tab-pane label="控件组源码" name="source"></el-tab-pane>
          </el-tabs>
        </el-header>
        <!-- 表单主体 和 右侧表单配置 -->
        <el-main>
          <el-container>
            
            <div class="back-drop" @click="clearOptions()"></div>
            <!-- 表单的自定义编辑视图，自定义布局 -->

            <div id="menu-friend" class="menu">
              <ul id="mouseDownMenu">
                <li v-for="(menu,index) in menuList" :key="index">
                  <p @mouseover="showMenuList(index)" @click="chooseMenu(menu.type)">
                    {{menu.name}}
                    <i class="icon"></i>
                  </p>
                  <ul v-show="menuListShow === index">
                    <li v-for="(child,index) in menu.children" @click="chooseMenu(child.type)" :key="index">{{child.name}}</li>
                  </ul>
                </li>
              </ul>
            </div>
            <el-main v-if="activeName2=='preview'"></el-main>
            <el-main v-if="activeName2=='source'">
              <el-input style="position: relative;z-index:5;" :rows="30" type="textarea" v-model="JSON.stringify(tableSchema)"
                :readonly="true"></el-input>
              <el-input style="position: relative;z-index:5;" :rows="30" type="textarea" v-model="JSON.stringify(newForm)" :readonly="true"></el-input>
            </el-main>
            <el-main v-if="activeName2=='edit'" style="padding:20px;background:#fff;">
              <div id="drag-area"></div>
              <table style="position:relative;z-index:10;" id="formDesigners" class="formDesigner" cellspacing="0" cellpadding="0">
                <tr v-for="(form,index) in newForm">
                  <td v-for="(cont,ind) in form.content" @mouseover="renderTd($event)" @mousedown="selectTd($event)"
                    @mouseup="selectTdConfirm($event)" v-mousemenu="{set:setData}" @dblclick="setFieldName(cont)"
                    :data-tr="index" :data-td="ind" class="new_form_child" :colspan="cont.colspan" :rowspan="cont.rowspan"
                    :class="{formLabel:cont.html=='test'}">
                    <div v-if="cont.state" :data-html="cont.html">
                      <span class="title" v-show="cont.typeText" :class="{detailbg:cont.html=='detail'}">{{cont.typeText}}</span>
                      <span class="placeholder">{{cont.name}}</span>
                    </div>
                    <div v-if="!cont.state" style="width:100%">
                      <el-input v-model="cont.name" @blur="fieldNameConfirm(cont)"></el-input>
                    </div>
                  </td>
                </tr>
              </table>
            </el-main>

            <!-- 选择表单的列表弹框 -->
            <el-dialog title="选择表单" :visible.sync="dialogSelectVisible">
              <div>
                <el-input placeholder="在此搜索" v-model="query"></el-input>
              </div>
              <div>
                <el-tabs v-model="activeName" v-if="!query">
                  <el-tab-pane v-for="(tab,index) in cats" :key="index" :label="tab.name" :name="tab.id.toString()">
                    <el-row>
                      <el-button style="margin-bottom:10px;" v-for="(item,index) in catsMap[tab.id]" :key="index" type="primary" plain
                        @click="selectMod(item.id)">{{item.name}}</el-button>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-if="query" v-model="activeName3">
                  <el-tab-pane label="搜索结果" name="queryResult">
                    <el-row>
                      <el-button  style="margin-bottom:5px;" v-for="(mod,index) in filteredMods" :key="index" type="primary" @click="selectMod(mod.id)" plain>{{mod.name}}</el-button>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-dialog>
            <!-- 新建表单的弹框 -->
            <el-dialog title="新建表单" :visible.sync="dialogCreateVisible" :close-on-click-modal="false">
              <el-form :model="newFormData" :rules="FormDataRules" ref="newFormData">
                <el-form-item label="模块名称" prop="name">
                  <el-input autocomplete="off" v-model="newFormData.name"></el-input>
                </el-form-item>
                <el-form-item label="模块表名（字母或数字）" prop="tableKey">
                  <el-input autocomplete="off" v-model="newFormData.tableKey"></el-input>
                </el-form-item>
                <el-form-item label="模块表类型" prop="type">
                  <el-select v-model="newFormData.type" placeholder="请选择模块表类型">
                    <el-option v-for="item in modTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所属分类" v-if="dialogCreateVisible" prop="formType">
                  <el-select v-model="newFormData.formType" placeholder="请选择所属分类">
                    <el-option v-for="item in cats" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="cancelForm('newFormData')">取 消</el-button>
                <el-button type="primary" @click="createForm()">确 定</el-button>
              </div>
            </el-dialog>
            <!-- 点击保存时，此次修改自动再次确认的弹框 -->
            <el-dialog :visible.sync="dialogConfirmVisible">
              <div v-if="!flagFieldsPrin">
                <div>
                  <h4>新增的字段</h4>
                  <span v-for="item in addFields">{{item.name}}</span>
                </div>
                <div>
                  <h4>修改的字段</h4>
                  <span v-for="item in updateFields">{{item.name}}</span>
                </div>
                <div>
                  <h4>移除的字段</h4>
                  <span v-for="item in removeFields">{{item.name}}</span>
                </div>
              </div>
              <div v-if="flagFieldsPrin">
                <h4>未更改主表字段</h4>
              </div>
              <div v-if="!flagDetailsPrin">
                <div>
                  <h4>新增的明细表</h4>
                  <span v-for="item in addDetails">{{item.name}}</span>
                </div>
                <div>
                  <h4>修改的明细表</h4>
                  <div style="margin-left: 30px" v-for="item in updateDetails">
                    {{item.name}}
                    <div>
                      <strong>新增的字段</strong>
                      <span v-for="obj in item.addFields">{{obj.name}}</span>
                    </div>
                    <div>
                      <strong>修改的字段</strong>
                      <span v-for="obj in item.updateFields">{{obj.name}}</span>
                    </div>
                    <div>
                      <strong>移除的字段</strong>
                      <span v-for="obj in item.removeFields">{{obj.name}}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4>移除的明细表</h4>
                  <span v-for="item in removeDetails">{{item.name}}</span>
                </div>
              </div>
              <div v-if="flagDetailsPrin">
                <h4>未更改明细表字段</h4>
              </div>
              <div class="designer-modal-btn">
                <el-row :gutter="10">
                  <el-form>
                    <el-form-item class="designer-modal-footer my-modal-footer">
                      <el-button type="primary" @click="saveConfig()">确定</el-button>
                      <el-button @click="dialogConfirmVisible = false">取消</el-button>
                    </el-form-item>
                  </el-form>
                </el-row>
              </div>
            </el-dialog>

            <!-- 表字段配置 -->
            <div id="fieldConfig" :class="{active:flagMask}" style="padding: 20px;box-sizing: border-box;">
              <div>
                <div class="designer-ctrl-group">
                  <label class="designer-ctrl-label">字段序号</label>
                  <input type="number" class="designer-ctrl" v-model="curField.index" />
                </div>
                <div class="designer-ctrl-group">
                  <label class="designer-ctrl-label">{{curField.flagDetail?'明细表':'字段'}}名称</label>
                  <input type="text" class="designer-ctrl" v-model="curField.name" />
                </div>
                <div class="designer-ctrl-group">
                  <label class="designer-ctrl-label">{{curField.flagDetail?'明细表':'字段'}}id</label>
                  <input type="text" class="designer-ctrl" v-model="curField.id" />
                </div>
                <div class="designer-ctrl-group" v-if="!curField.flagDetail">
                  <label class="designer-ctrl-label">默认值</label>
                  <input type="text" class="designer-ctrl" v-model="curField.default" />
                </div>
                <div class="designer-ctrl-group" v-if="flagDetail&&!curField.flagDetail">
                  <label class="designer-ctrl-label">字段长度</label>
                  <input type="text" class="designer-ctrl" v-model="curField.width" />
                </div>
                <div class="designer-ctrl-group" v-if="curField.flagDetail">
                  <detailConfig :config="curField.config" :detailfields="curField.fields"></detailConfig>
                </div>
                <div class="designer-ctrl-group" v-if="!curField.flagDetail">
                  <label class="designer-ctrl-label">字段控件</label>
                  <el-select v-model="curField.ctrl" style="margin-top:5px;" @change="clearConfig(curField)">
                    <el-option-group v-for="group in ctrlList" :key="group.label" :label="group.label">
                      <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-option-group>
                  </el-select>
                </div>
                <div class="designer-ctrl-group" v-if="curField.ctrl=='formula'">
                  <formulaConfig :config="curField.config"></formulaConfig>
                </div>
                <div class="designer-ctrl-group" v-if="curField.ctrl=='textarea'">
                  <textareaConfig :config="curField.config"></textareaConfig>
                </div>
                <div class="designer-ctrl-group" v-if="curField.ctrl=='rmb'">
                  <rmbConfig :config="curField.config" :allfields="mainField" :isdetail="flagDetail" :detailfields="curDetail"></rmbConfig>
                </div>
                <div class="designer-ctrl-group" v-if="curField.ctrl=='datetime'">
                  <datetimeConfig :config="curField.config"></datetimeConfig>
                </div>
                <div class="designer-ctrl-group" v-if="curField.ctrl=='datediff'">
                  <datediffConfig :config="curField.config" :allfields="mainField" :isdetail="flagDetail" :detailfields="curDetail"></datediffConfig>
                </div>
                <div class="designer-ctrl-group" v-if="curField.ctrl=='users'">
                  <usersConfig :config="curField.config"></usersConfig>
                </div>
                <div class="designer-ctrl-group" v-if="curField.ctrl=='sum'">
                  <detailsumConfig :config="curField.config" :detail="details" :detailmap="detailsMap"></detailsumConfig>
                </div>
                <div class="designer-ctrl-group" v-if="curField.ctrl=='exceed'">
                  <exceedConfig :config="curField.config" :allfields="mainField"></exceedConfig>
                </div>
                <div class="designer-ctrl-group" v-if="curField.ctrl=='info'">
                  <currentuserConfig :config="curField.config"></currentuserConfig>
                </div>
                <div class="designer-ctrl-group" v-if="curField.ctrl=='dictionary'">
                  <dictionaryConfig :config="curField.config" :dictionarys="alldictionarys"></dictionaryConfig>
                </div>
                <div class="designer-ctrl-group" v-if="curField.ctrl=='cascader'">
                  <cascaderConfig :config="curField.config" :dictionarys="alldictionarys"></cascaderConfig>
                </div>
                <div class="designer-ctrl-group" v-if="curField.ctrl=='select'">
                  <selectConfig :config="curField.config"></selectConfig>
                </div>
                <!-- 表单可配置内容 -->
                <div class="designer-ctrl-group" v-if="!curField.flagDetail">
                  <!-- 字段是否必填 -->
                  <el-checkbox v-model="curField.required" @change="changeStatus('required')">是否必填</el-checkbox>
                  <!-- 字段是否隐藏 -->
                  <el-checkbox v-model="curField.flagHide">是否隐藏</el-checkbox>
                  <!-- 字段是否独占一行 -->
                  <el-checkbox v-model="curField.flagRow">独占一行</el-checkbox>
                  <!-- 字段是否可编辑，默认可以 -->
                  <el-checkbox v-model="curField.flagEdit">是否可编辑</el-checkbox>
                  <!-- 将此字段设为通过其他字段触发 某个值来控制是否显示，默认其他字段触发某个值后此字段不显示，可通过勾选“是否显示关联字段” 设置此字段初始化是否显示 -->
                  <el-checkbox v-model="curField.flagField">是否关联字段</el-checkbox>
                  <el-checkbox v-model="curField.toggleField" :disabled="!curField.flagField">是否显示关联字段</el-checkbox>
                </div>
                <div class="designer-ctrl-group" v-if="curField.flagField">
                  <label class="designer-ctrl-label">关联字段</label>
                  <el-select v-model="curField.relatedField" placeholder="请选择">
                    <el-option v-for="item in flagDetail?curDetail:mainField" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </div>
                <div class="designer-ctrl-group" v-if="curField.flagField">
                  <label class="designer-ctrl-label">关联字段触发值</label>
                  <input type="text" class="designer-ctrl" v-model="curField.relatedFieldValue" />
                </div>
                <div class="designer-ctrl-group" v-if="curField.flagDetail">
                  <el-button type="info" style="width:100%;background-color: #21d866;border-color: #21d866" @click="openDetail(curField)">编辑明细表</el-button>
                </div>
              </div>
            </div>
            <!-- 右侧 -->
            <el-aside width="250px" id="formAside">
              <!-- 明细表配置弹框 -->
              <div id="detailConfig" :class="{active:detailOpened}">
                <el-button type="primary" style="width:100%" @click="returnMain()">返回主表</el-button>
                <div style="position:absolute;top:40px;bottom:40px;overflow-y: auto;background: white;z-index:100;color:black;">
                  <table class="formDesigner" cellspacing="0" cellpadding="0">
                    <tr v-for="(field,index) in curDetail">
                      <td style="display:flex;align-items: center;">
                        <img src="../../../static/images/sz1.png" alt="设置" @click="selectField(field)">
                        <div class="drag" :id="'drag'+index" :data-html="field.ctrl" data-type-text="文本" data-type>
                          <span class="title" data-html="inputtext">{{ctrlMap[field.ctrl]}}</span>
                          <span class="placeholder">{{field.name}}</span>
                        </div>
                          <img src="../../../static/images/sc1.png" alt="删除" @click="deleteDetailField(index)" style="position:absolute;right: 5px;">
                      </td>
                    </tr>
                  </table>
                </div>
                <el-button type="success" style="position:absolute;bottom:0px;width:100%;left:0" @click="addDetailField()">新增明细表字段</el-button>
              </div>
              <!-- 右侧 生成视图，字段列表，新增按钮 -->
              <div id="rightSide" >
                <el-button id="createDefaultView" type="warning" @click="setDefaultView()">生成默认视图</el-button>
                <div class="main-table-content">
                  <table class="formDesigner" id="formDesignerComponents" cellspacing="0" cellpadding="0">
                    <tr v-for="(field,index) in tableSchema">
                      <td style="display:flex;align-items: center;">
                        <img src="../../../static/images/sz1.png" alt="设置" @click="selectField(field)">
                        <div @mousedown="drag($event)" class="drag" :id="'drag'+index" :data-html="field.flagDetail?'detail':field.ctrl"
                          :data-typeText="field.flagDetail?'明细表':ctrlMap[field.ctrl]" :data-name="field.name" :data-id="field.id"
                          :data-flagField="field.flagField" :data-toggleField="field.toggleField" :data-relatedField="field.relatedField"
                          :data-relatedFieldValue="field.relatedFieldValue">
                          <span class="title" :class="{detailbg:field.flagDetail}" data-html="inputtext">{{field.flagDetail?'明细表':ctrlMap[field.ctrl]}}</span>
                          <span class="placeholder">{{field.name}}</span>
                        </div>
                        <img src="../../../static/images/sc1.png" alt="删除"  @click="deleteField(field,index)" style="position:absolute;right: 5px;">
                        
                      </td>
                    </tr>
                  </table>
                </div>
                <div class="bottom">
                  <el-button type="primary" class="margin-zero bottom-btn" @click="addField()">新增字段</el-button>
                  <el-button class="margin-zero bottom-btn" @click="addDetail()">新增明细</el-button>
                </div>
              </div>
            </el-aside>
          </el-container>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import DictionaryApi from '@/api/dictionary'
  import formTableDesignApi from "@/api/formTableDesign/formTableDesign";
  import formulaConfig from "@/views/formTableDesign/template/formula_config";
  import rmbConfig from "@/views/formTableDesign/template/rmb_config";
  import datetimeConfig from "@/views/formTableDesign/template/datetime_config";
  import datediffConfig from "@/views/formTableDesign/template/datediff_config";
  import usersConfig from "@/views/formTableDesign/template/users_config";
  import detailsumConfig from "@/views/formTableDesign/template/detailsum_config";
  import detailConfig from "@/views/formTableDesign/template/detail_config";
  import exceedConfig from "@/views/formTableDesign/template/exceed_config";
  import currentuserConfig from "@/views/formTableDesign/template/currentuser_config";
  import datecalConfig from "@/views/formTableDesign/template/datecal_config";
  import dictionaryConfig from "@/views/formTableDesign/template/dictionary_config";
  import selectConfig from "@/views/formTableDesign/template/select_config";
  import cascaderConfig from "@/views/formTableDesign/template/cascader_config";
  import textareaConfig from "@/views/formTableDesign/template/textarea_config";

  export default {
    name: "newForm",
    created: function() {
      this.init();
    },
    mounted: function() {

    },
    computed: {
      filteredMods: function() {
        var self = this;
        return self.mods.filter(function(mod) {
          return mod.name.indexOf(self.query) !== -1;
        });
      }
    },
    components: {
      formTableDesignApi,
      formulaConfig,
      rmbConfig,
      datetimeConfig,
      datediffConfig,
      usersConfig,
      detailsumConfig,
      detailConfig,
      exceedConfig,
      currentuserConfig,
      datecalConfig,
      dictionaryConfig,
      selectConfig,
      cascaderConfig,
      textareaConfig
    },
    data() {
      return {
        activeName2: "edit", //tab页绑定的model
        activeName3: "queryResult",
        cats: [],
        catsMap: {},
        mods: [],
        activeName: "",
        flagFieldsPrin: true, // 判断是否改变主表字段
        flagDetailsPrin: true, // 判断是否改变明细表字段
        detailOpened: false, // 控制编辑明细表字段页面收起展开
        flagMask: false, // 控制右侧字段详情页面收起展开
        originFields: [], // 最初所有字段（包括明细表）集合
        originDetailsMap: {}, // 最初所有明细表包含所有字段集合
        detailsMap: {}, // 当前所有明细表包含所有字段集合
        originDetails: [], // 最初明细表集合
        details: [], // 当前明细表集合
        curDetail: [], // 编辑当前明细表集合
        mainField: [], // 所有主表字段集合
        flagDetail: false, // 判断当前选择字段是否是明细表中字段
        flagInput: false, // 判断td里是否有input
        curModId: "", // 当前已选择的表单id
        updateInfo: {}, // 编辑表单之后记录的改变信息
        modName: "",
        alldictionarys: [],
        dialogConfirmVisible: false,
        dialogCreateVisible: false,
        dialogSelectVisible: false,
        flagDrag: false,
        dragArea: "", // 覆盖选择td的div
        startTrIndex: 0, // 鼠标点下时的tr下标
        startTdIndex: 0, // 鼠标点下时的td下标
        endTrIndex: 0, // 鼠标松开时的tr下标
        endTdIndex: 0, // 鼠标松开时的td下标
        currentTdWidth: "",
        currentTdHeight: "",
        currentRowspan: "",
        currentColspan: "",
        downX: 0,
        downY: 0,
        query: "",
        newFormData: {},
        dialogImageUrl: "",
        dialogVisible: false,
        FormDataRules: {
          name: [{
              required: true,
              message: '请输入模块名称',
              trigger: 'blur'
            },
            {
              pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
              message: '请输入汉字或字母或数字'
            }
          ],
          tableKey: [{
              required: true,
              message: '请输入模块表名',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度在 1 到 20 个字符',
              trigger: 'blur'
            }
          ],
          type: [{
            required: true,
            message: '请选择模块表类型',
            trigger: "change"
          }],
          formType: [{
            required: true,
            message: '请选择所属分类',
            trigger: "change"
          }]
        },
        ctrlMap: {
          // 右侧字段所用组件名称
          text: "文本",
          textarea: "多行文本",
          select: "下拉框",
          datetime: "日期",
          formula: "公式计算",
          displayonly: "只读文本",
          time: "时间",
          rmb: "人民币大写",
          datediff: "时间差",
          number: "数字",
          current: "当前时间",
          sum: "明细表汇总",
          dictionary: "数据字典",
          cascader: "联动字典",
          users: "人员选择",
          messages:"意见汇总",
          exceed: "超时时间",
          info: "信息",
          upload: "文件上传"
        },
        modTypes: [{
            id: 1,
            name: "普通表"
          },
          {
            id: 2,
            name: "任务表"
          },
          {
            id: 3,
            name: "系统表"
          }
        ],
        tableSchema: [],
        formChangeInfo: {
          state: true,
          html: "",
          name: "",
          id: "",
          val: "",
          typeText: "",
          rowspan: 1
        },
        formIndex: {
          tr: "",
          td: ""
        },
        newForm: [{
          content: [{
              state: true,
              html: "",
              name: "",
              val: "",
              typeText: "",
              rowspan: 1,
              colspan: 1
            },
            {
              state: true,
              html: "",
              name: "",
              val: "",
              typeText: "",
              rowspan: 1,
              colspan: 1
            },
            {
              state: true,
              html: "",
              name: "",
              val: "",
              typeText: "",
              rowspan: 1,
              colspan: 1
            },
            {
              state: true,
              html: "",
              name: "",
              val: "",
              typeText: "",
              rowspan: 1,
              colspan: 1
            }
          ]
        }],
        menuListShow: "",
        menuList: [{
            name: "新增",
            children: [{
                name: "新增一行",
                type: "xzyh"
              },
              {
                name: "新增一列",
                type: "xzyl"
              },
              {
                name: "新增单元格（右）",
                type: "xzdygy"
              },
              {
                name: "新增单元格（左）",
                type: "xzdygz"
              }
            ]
          },
          {
            name: "删除",
            children: [{
                name: "删除一行",
                type: "scyh"
              },
              {
                name: "删除一列",
                type: "scyl"
              },
              {
                name: "删除单元格",
                type: "scdyg"
              }
            ]
          },
          {
            name: "清除内容",
            type: "qcnr"
          },
          {
            name: "合并",
            type: "hb"
          },
          {
            name: "拆分",
            type: "cf"
          }
        ],
        curField: {},
        ctrlList: [{
            label: "文本输入",
            options: [{
                value: "text",
                label: "文本框"
              },
              {
                value: "textarea",
                label: "多行文本框"
              }
            ]
          },
          {
            label: "数字计算",
            options: [{
                value: "number",
                label: "数字|金额"
              },
              {
                value: "rmb",
                label: "人命币大写"
              },
              {
                value: "formula",
                label: "公式计算"
              },
              {
                value: "sum",
                label: "明细表字段汇总"
              }
            ]
          },
          {
            label: "日期和时间",
            options: [{
                value: "datetime",
                label: "可选日期"
              },
              {
                value: "time",
                label: "可选时间"
              },
              {
                value: "datediff",
                label: "时间差"
              },
              {
                value: "exceed",
                label: "超时时间"
              }
            ]
          },
          {
            label: "数据选择",
            options: [{
                value: "select",
                label: "下拉框"
              },
              {
                value: "dictionary",
                label: "数据字典"
              },
              {
                value: "cascader",
                label: "联动字典"
              },
              {
                value: "users",
                label: "人员选择框"
              },
              {
                value: "upload",
                label: "文件上传"
              }
            ]
          },
          {
            label: "展示信息",
            options: [
              {
                value: "current",
                label: "当前时间"
              },
              {
                value: "messages",
                label: "审批意见汇总"
              },
              {
                value: "displayonly",
                label: "只读文本"
              },
            ]
          }
        ]
      };
    },
    directives: {
      // 自定义指令--设置自定义右击菜单
      mousemenu: function(divObj, binding) {
        // divObj.style.background = "red";
        document.oncontextmenu = function(e) {
          // 阻止执行浏览器默认右击事件
          e.preventDefault();
        };
        let menu1 = document.getElementById("menu-friend");
        divObj.onmousedown = function(_e) {
          let ev = ev || window.event;
          let target = ev.target || ev.srcElement; // 菜单定位
          binding.value.set(
            target.getAttribute("data-tr"),
            target.getAttribute("data-td")
          );
          if (target.nodeName.toLowerCase() == "td") {
            console.log(menu1);
            menu1.style.left = _e.screenX + "px";
            menu1.style.top =
              document.documentElement.scrollTop + _e.clientY + "px";
            if (divObj) {
              if (_e.button == 2) {
                // button == 2 代表右击
                menu1.style.visibility = "visible";
              } else {
                menu1.style.visibility = "hidden";
              }
            }
          }
        };
      }
    },
    methods: {
      init() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        let _this = this;
        //获取所有表单列表
        formTableDesignApi
          .getFormMods()
          .then(function(res) {
            // 处理成功的结果
            _this.cats = res.data.cats;
            _this.catsMap = res.data.catsMap;
            _this.mods = res.data.mods;
            _this.activeName = _this.cats[0].id.toString();
            // console.log(_this.activeName);
            loading.close();
            _this.dialogSelectVisible = true;
            console.log(6666);
            console.log(_this.catsMap);
          })
          .catch(function(error) {
            console.log(error);
          });
        DictionaryApi.getDictionaryListNoPage( 0)
          .then(function(res) {
            // 处理成功的结果
            if (res.errorCode == 0) {
              _this.alldictionarys = [];
              if (res.data.children.length) {
                res.data.children.forEach(item => {
                  if (item.parentId == 0) {
                    _this.alldictionarys.push(item);
                  }
                });
              }
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      },
      _getFinalFields(fields, originFields) {
        let addFields = [];
        if (fields.length) {
          fields.forEach((field, key) => {
            if (!field.flagDetail) addFields.push(field);
          });
        }
        let updateFields = [],
          removeFields = [];
        originFields.forEach(pField => {
          // 用当前修改完成的字段集合和最初字段集合比较，得出添加了，删除了或修改的字段
          if (!pField.flagDetail) {
            if (addFields.length) {
              for (let i = 0; i < addFields.length; i++) {
                let curField = addFields[i];
                if (curField.id == pField.id) {
                  addFields.splice(i, 1);
                  curField.ctrl != pField.ctrl && updateFields.push(curField);
                  break;
                } else if (i == addFields.length - 1) {
                  removeFields.push(pField);
                }
              }
            } else {
              removeFields.push(pField);
            }
          }
        });
        if (addFields.length || updateFields.length || removeFields.length) {
          return {
            addFields: addFields.length ? addFields : null,
            updateFields: updateFields.length ? updateFields : null,
            removeFields: removeFields.length ? removeFields : null
          };
        } else {
          return false;
        }
      },
      _getFinalDetails() {
        var addDetails = JSON.parse(JSON.stringify(this.details)),
          updateDetails = [],
          removeDetails = [];
        this.originDetails.forEach(detailKey => {
          // 用当前修改完成的明细表字段集合和最初明细表字段集合比较，得出添加了，删除了或修改的明细表字段
          if (addDetails.length) {
            for (var i = 0; i < addDetails.length; i++) {
              var curDetail = addDetails[i];
              if (detailKey.id == curDetail.id) {
                var modifiedFields = this._getFinalFields(
                  curDetail.fields,
                  this.originDetailsMap[detailKey.id]
                );
                if (modifiedFields) {
                  modifiedFields.id = detailKey.id;
                  modifiedFields.name = curDetail.name;
                  modifiedFields.fields = curDetail.fields;
                  updateDetails.push(modifiedFields);
                }
                addDetails.splice(i, 1);
                break;
              } else if (i == addDetails.length - 1) {
                removeDetails.push(detailKey);
              }
            }
          } else {
            removeDetails.push(detailKey);
          }
        });
        if (addDetails.length || updateDetails.length || removeDetails.length) {
          var detailKeys = [];
          this.details.forEach(detail => {
            detailKeys.push(detail.id);
          });
          return {
            detailKeys: detailKeys + "",
            addDetails: addDetails.length ? addDetails : null,
            updateDetails: updateDetails.length ? updateDetails : null,
            removeDetails: removeDetails.length ? removeDetails : null
          };
        } else {
          return false;
        }
      },
      clearConfig(curField) {
        curField.config = {};
      },
      openDetail(curField) {
        console.log(curField);
        this.detailOpened = true;
        this.flagDetail = true;
        this.curDetail = curField.fields;
      },
      returnMain() {
        if (this.flagMask) this.flagMask = false;
        this.detailOpened = false;
        this.flagDetail = false;
      },
      addField() {
        if (this.curModId) {
          let length = this.tableSchema.length;
          let field = {
            id: "field" + length,
            index: length,
            name: "未命名字段" + length,
            ctrl: "text",
            flagEdit: true,
            required: false,
            flagHide: false,
            flagRow: false,
            flagField: false,
            relatedField: "",
            relatedFieldValue: "",
            fieldHide: false,
            toggleField: false
          };
          this.tableSchema.push(field);
          this.mainField.push(field);
        }
      },
      addDetail() {
        if (this.curModId) {
          let length = this.tableSchema.length;
          let detail = {
            id: "detail" + this.details.length,
            index: length,
            name: "未命名明细表" + this.details.length,
            flagDetail: true,
            fields: [],
            config:{}
          };
          this.details.push(detail);
          this.tableSchema.push(detail);
          this.detailsMap[detail.id] = detail.fields;
        }
      },
      addDetailField() {
        let length = this.curDetail.length;
        let field = {
          id: "dField" + length,
          index: length,
          name: "明细表字段" + length,
          ctrl: "text",
          flagEdit: true,
          required: false,
          flagHide: false,
          flagRow: false,
          flagField: false,
          relatedField: "",
          relatedFieldValue: "",
          fieldHide: false,
          toggleField: false
        };
        this.curDetail.push(field);
      },
      setData(trIndex, tdIndex) {
        this.formIndex.tr = trIndex;
        this.formIndex.td = tdIndex;
      },
      chooseMenu(type) {
        // 单击自定义菜单触发事件
        let trIndex = this.formIndex.tr;
        let tdIndex = this.formIndex.td;
        let _this = this;
        let newTr = {
          content: []
        };
        switch (type) {
          case "xzyh":
            {
              // 新增一行
              let n = _this.newForm[trIndex].content.length;
              _this.newForm[trIndex].content.forEach(td => {
                if (td.colspan > 1) n += td.colspan - 1;
              });
              for (let i = 0; i < n; i++) {
                newTr.content.push({
                  state: true,
                  html: "",
                  name: "",
                  val: "",
                  rowspan: 1,
                  colspan: 1
                });
              }
              _this.newForm.splice(Number(trIndex) + 1, 0, newTr);
              if (this.dragArea) {
                this.dragArea.style.width = 0;
                this.dragArea.style.height = 0;
                this.dragArea.style.left = 0;
                this.dragArea.style.top = 0;
              }
              break;
            }
          case "xzyl":
            {
              // 新增一列
              _this.newForm.forEach(tr => {
                tr.content.splice(Number(tdIndex) + 1, 0, {
                  state: true,
                  html: "",
                  name: "",
                  val: "",
                  rowspan: 1,
                  colspan: 1
                });
              });
              if (this.dragArea) {
                this.dragArea.style.width = 0;
                this.dragArea.style.height = 0;
                this.dragArea.style.left = 0;
                this.dragArea.style.top = 0;
              }
              break;
            }
          case "xzdygy":
            {
              // 新增单元格（右）
              _this.newForm[trIndex].content.splice(Number(tdIndex) + 1, 0, {
                state: true,
                html: "",
                name: "",
                val: "",
                rowspan: 1,
                colspan: 1
              });
              if (this.dragArea) {
                this.dragArea.style.width = 0;
                this.dragArea.style.height = 0;
                this.dragArea.style.left = 0;
                this.dragArea.style.top = 0;
              }
              break;
            }
          case "xzdygz":
            {
              // 新增单元格（左）
              _this.newForm[trIndex].content.splice(Number(tdIndex), 0, {
                state: true,
                html: "",
                name: "",
                val: "",
                rowspan: 1,
                colspan: 1
              });
              if (this.dragArea) {
                this.dragArea.style.width = 0;
                this.dragArea.style.height = 0;
                this.dragArea.style.left = 0;
                this.dragArea.style.top = 0;
              }
              break;
            }
          case "scyh":
            {
              // 删除一行
              _this.newForm.splice(_this.formIndex.tr, 1);
              if (this.dragArea) {
                this.dragArea.style.width = 0;
                this.dragArea.style.height = 0;
                this.dragArea.style.left = 0;
                this.dragArea.style.top = 0;
              }
              break;
            }
          case "scyl":
            {
              // 删除一列
              _this.newForm.forEach(tr => {
                tr.content.splice(Number(tdIndex), 1);
              });
              if (this.dragArea) {
                this.dragArea.style.width = 0;
                this.dragArea.style.height = 0;
                this.dragArea.style.left = 0;
                this.dragArea.style.top = 0;
              }
              break;
            }
          case "scdyg":
            {
              // 删除单元格
              _this.newForm[trIndex].content.splice(Number(tdIndex), 1);
              if (this.dragArea) {
                this.dragArea.style.width = 0;
                this.dragArea.style.height = 0;
                this.dragArea.style.left = 0;
                this.dragArea.style.top = 0;
              }
              break;
            }
          case "qcnr":
            {
              // 清除内容
              _this.newForm[trIndex].content[tdIndex].html = "";
              _this.newForm[trIndex].content[tdIndex].name = "";
              _this.newForm[trIndex].content[tdIndex].typeText = "";
              if (this.dragArea) {
                this.dragArea.style.width = 0;
                this.dragArea.style.height = 0;
                this.dragArea.style.left = 0;
                this.dragArea.style.top = 0;
              }
              break;
            }
          case "hb":
            {
              // 合并
              let maxRowspan = parseInt(
                this.dragArea.style.height.replace("px", "") /
                parseInt(this.currentTdHeight / this.currentRowspan)
              ); // 计算出需要合并行数
              let maxColspan = parseInt(
                this.dragArea.style.width.replace("px", "") /
                parseInt(this.currentTdWidth / this.currentColspan)
              ); // 计算出需要合并列数
              let tds = document.getElementsByClassName("new_form_child");
              let TABLEX = 56,
                TABLEY = 46;
              let dragAreaTop = Number(this.dragArea.style.top.replace("px", ""));
              let dragAreaLeft = Number(this.dragArea.style.left.replace("px", ""));
              let dragAreaBottom =
                dragAreaTop + Number(this.dragArea.style.height.replace("px", "")); // 定义dragArea最底部的位置
              let dragAreaRight =
                dragAreaLeft + Number(this.dragArea.style.width.replace("px", "")); // 定义dragArea最右侧的位置
              let allRangedTds = [];
              for (let i = 0; i < tds.length; i++) {
                // 遍历所有td，找出在dragArea范围内的td，满足td左侧离最左侧距离大于dragArea左侧离最左侧距离，td顶部离最顶部距离大于dragArea顶部离最顶部距离，td右侧离最左侧距离小于dragArea右侧离最左侧距离，td底部离最顶部距离小于dragArea底部离最顶部距离
                if (
                  tds[i].offsetLeft + TABLEX >= dragAreaLeft &&
                  tds[i].offsetTop + TABLEY >= dragAreaTop &&
                  tds[i].offsetLeft + TABLEX + tds[i].offsetWidth <=
                  dragAreaRight &&
                  tds[i].offsetTop + TABLEY + tds[i].offsetHeight <= dragAreaBottom
                ) {
                  let curCellIndex = [];
                  curCellIndex.push(tds[i].getAttribute("data-tr"));
                  curCellIndex.push(tds[i].getAttribute("data-td"));
                  allRangedTds.push(curCellIndex); // 获取所有td的trIndex和tdIndex
                }
              }
              console.log(allRangedTds);
              let prevTr = -1;
              let prevTd = -1;
              allRangedTds.forEach(allRangedTd => {
                // 删除所有dragArea范围内的td
                if (allRangedTd[0] == prevTr)
                  _this.newForm[allRangedTd[0]].content.splice(prevTd, 1);
                else {
                  _this.newForm[allRangedTd[0]].content.splice(allRangedTd[1], 1);
                  prevTd = allRangedTd[1];
                }
                prevTr = allRangedTd[0];
              });
              _this.newForm[this.startTrIndex].content.splice(
                this.startTdIndex,
                0, {
                  // 在一开始的td位置添加根据需要合并的行和列数的td
                  state: true,
                  html: "",
                  name: "",
                  val: "",
                  rowspan: maxRowspan,
                  colspan: maxColspan
                }
              );
              if (this.dragArea) {
                this.dragArea.style.width = 0;
                this.dragArea.style.height = 0;
                this.dragArea.style.left = 0;
                this.dragArea.style.top = 0;
              }
              break;
            }
          case "cf":
            {
              // 拆分
              let colspan = Number(
                _this.newForm[this.startTrIndex].content[this.startTdIndex].colspan
              );
              let rowspan = Number(
                _this.newForm[this.startTrIndex].content[this.startTdIndex].rowspan
              );
              _this.newForm[this.startTrIndex].content.splice(this.startTdIndex, 1);
              for (
                let i = this.startTrIndex; i < Number(this.startTrIndex) + rowspan; i++
              ) {
                for (
                  let j = this.startTdIndex; j < Number(this.startTdIndex) + colspan; j++
                ) {
                  _this.newForm[i].content.splice(j, 0, {
                    state: true,
                    html: "",
                    name: "",
                    val: "",
                    rowspan: 1,
                    colspan: 1
                  });
                }
              }
              if (this.dragArea) {
                this.dragArea.style.width = 0;
                this.dragArea.style.height = 0;
                this.dragArea.style.left = 0;
                this.dragArea.style.top = 0;
              }
              break;
            }
        }
        let menu1 = document.getElementById("menu-friend");
        menu1.style.visibility = "hidden";
      },
      clearOptions() {
        this.flagMask = false; //控制字段配置页面收起
        if (this.dragArea) {
          this.dragArea.style.width = 0;
          this.dragArea.style.height = 0;
          this.dragArea.style.left = 0;
          this.dragArea.style.top = 0;
        }
        let menu1 = document.getElementById("menu-friend");
        if (menu1 && menu1.style.visibility == "visible")
          menu1.style.visibility = "hidden";
      },
      changeStatus(key) {
        console.log(this.curField[key]);
      },
      setFieldName(cont) {
        cont.state = false;
        this.flagInput = true;
        if (this.dragArea) {
          this.dragArea.style.width = 0;
          this.dragArea.style.height = 0;
          this.dragArea.style.left = 0;
          this.dragArea.style.top = 0;
        }
      },
      fieldNameConfirm(cont) {
        cont.state = true;
        this.flagInput = false;
        if (cont.name) cont.html = "test";
      },
      showMenuList(index) {
        this.menuListShow = index;
      },
      saveForm() {
        if (this.tableSchema.length == 0) {
          this.$message({
            showClose: true,
            message: '无表单字段，无法保存！',
            type: 'warning'
          });
        } else {
          console.log(this.newForm);
          this.updateInfo = {};
          let finalFields, finalDetails;
          this.flagFieldsPrin = this.flagDetailsPrin = true;
          this.addFields = this.updateFields = this.removeFields = "";
          finalFields = this._getFinalFields(this.tableSchema, this.originFields);
          if (finalFields) {
            this.updateInfo.addFields = this.addFields = finalFields.addFields;
            this.updateInfo.updateFields = this.updateFields =
              finalFields.updateFields;
            this.updateInfo.removeFields = this.removeFields =
              finalFields.removeFields;

            this.flagFieldsPrin = false;
          }
          if (
            this.details.length ||
            (!this.details.length && this.originDetails.length)
          ) {
            finalDetails = this._getFinalDetails();
            if (finalDetails) {
              this.updateInfo.detailKeys = this.detailKeys =
                finalDetails.detailKeys;
              this.updateInfo.addDetails = this.addDetails =
                finalDetails.addDetails;
              this.updateInfo.updateDetails = this.updateDetails =
                finalDetails.updateDetails;
              this.updateInfo.removeDetails = this.removeDetails =
                finalDetails.removeDetails;
              this.flagDetailsPrin = false;
            }
          }
          console.log(this.updateInfo);
          console.log(this.details);
          console.log(this.detailsMap);
          console.log(this.curDetail);
          this.dialogConfirmVisible = true;
        }
      },
      //编辑表单
      saveConfig() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        let payload = {};
        payload = JSON.parse(JSON.stringify(this.updateInfo));
        payload.id = this.curModId;
        payload.tableSchema = JSON.stringify(
          this.tableSchema.sort(this.compare("index"))
        );
        payload.formView = JSON.stringify(this.newForm);
        payload.details = this.details;
        let _this = this;
        formTableDesignApi
          .edit(payload)
          .then(function(res) {
            // 处理成功的结果
            loading.close();
            if (res.errorCode == 0) {
              _this.$message({
                message: res.data.message,
                type: "success"
              });
            } else {
              _this.$message.error(res.data.message);
            }
            _this.selectMod(_this.curModId);
            _this.dialogConfirmVisible = false;
          })
          .catch(function(error) {
            console.log(error);
          });
      },
      compare(property) {
        return function(a, b) {
          let value1 = a[property];
          let value2 = b[property];
          return value1 - value2;
        };
      },
      deleteField(field, index) {
        if (this.flagMask) this.flagMask = false;
        this.tableSchema.splice(index, 1);
        if (field.flagDetail) {
          this.details.forEach((detailField, key) => {
            if (detailField.id == field.id) {
              this.details.splice(key, 1);
            }
          });
        }
      },
      deleteDetailField(index) {
        this.curDetail.splice(index, 1);
      },
      selectField(field) {
        this.curField = {};
        this.flagMask = true;
        console.log(field);
        setTimeout(()=>{
          this.curField = field;
        })
      },
      openCreate() {
        this.newFormData = {};
        if (this.$refs["newFormData"]) this.$refs["newFormData"].resetFields();
        this.dialogCreateVisible = true;
      },
      cancelForm(formName) {
        this.dialogCreateVisible = false;
        this.$refs[formName].resetFields();
      },
      //新增表单
      createForm() {
        this.$refs["newFormData"].validate((valid) => {
          if (valid) {
            console.log(this.newFormData);
            const loading = this.$loading({
              lock: true,
              text: "Loading",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            let _this = this;
            formTableDesignApi
              .add(this.newFormData)
              .then(function(res) {
                // 处理成功的结果
                loading.close();
                _this.dialogCreateVisible = false;
                if (res.errorCode == 0) _this.selectMod(res.data.id);
                else _this.$message.error(res.data.message);
              })
              .catch(function(error) {
                console.log(error);
              });
          } else {
            return false;
          }
        });
      },
      //打开表单列表弹框
      openModules() {
        this.activeName = this.cats[0].id.toString();
        this.query = "";
        this.dialogSelectVisible = true;
      },
      //获取详情
      selectMod(id) {
        console.log(id);
        this.curModId = id;
        let _this = this;
        formTableDesignApi
          .select(id)
          .then(function(res) {
            // 处理成功的结果

              _this.tableSchema = [];
              _this.tableSchema = JSON.parse(res.data.tableSchema) || [];
              _this.detailsMap = {};
              _this.details = [];
              _this.mainField = [];
              _this.modName = res.data.name;
              _this.originFields = JSON.parse(JSON.stringify(_this.tableSchema)); // 将最初的tableSchema深拷贝到originFields中
              _this.tableSchema.forEach(field => {
                if (field.flagDetail) {
                  _this.details.push(field);
                  _this.detailsMap[field.id] = field.fields;
                } else {
                  _this.mainField.push(field);
                }
              });
              _this.originDetailsMap = JSON.parse(
                JSON.stringify(_this.detailsMap)
              ); // 将最初未修改的detailsMap深拷贝到originDetailsMap中
              _this.originDetails = JSON.parse(JSON.stringify(_this.details));
              _this.newForm = [];
              _this.newForm = res.data.formView ?
                JSON.parse(res.data.formView) : [{
                  content: [{
                      state: true,
                      html: "",
                      name: "",
                      val: "",
                      typeText: "",
                      rowspan: 1,
                      colspan: 1
                    },
                    {
                      state: true,
                      html: "",
                      name: "",
                      val: "",
                      typeText: "",
                      rowspan: 1,
                      colspan: 1
                    },
                    {
                      state: true,
                      html: "",
                      name: "",
                      val: "",
                      typeText: "",
                      rowspan: 1,
                      colspan: 1
                    },
                    {
                      state: true,
                      html: "",
                      name: "",
                      val: "",
                      typeText: "",
                      rowspan: 1,
                      colspan: 1
                    }
                  ]
                }];
              _this.dialogSelectVisible = false;

          })
          .catch(function(error) {
            console.log(error);
          });
      },
      setDefaultView() {
        if (this.curModId) {
          let flagTd = 0;
          this.newForm = [{
            content: []
          }];
          this.tableSchema = this.tableSchema.sort(this.compare("index"));
					this.tableSchema.forEach(res => {
					  if (res.fields) {
					    res.fields = res.fields.sort(this.compare("index"));
					  }
					})
					this.tableSchema.forEach(res => {
					  if (res.fields) {
					    res.fields = res.fields.sort(this.compare("index"));
					  }
					})
          this.tableSchema.forEach(field => {
            if (!field.flagDetail) {
              field.toggleField = field.toggleField || false;
              field.isRequired = field.required || false
            } else {
              field.fields.forEach(item => {
                item.toggleField = item.toggleField || false;
                item.isRequired = item.required || false;
              });
            }
            if (!field.flagHide) {
              if (field.flagRow || field.ctrl == "textarea") {
                this.newForm.push({
                  content: [{
                      state: true,
                      html: "test",
                      name: field.name,
                      val: "",
                      rowspan: 1,
                      colspan: 1,
                      fieldHide: false
                    },
                    {
                      state: true,
                      html: field.ctrl,
                      name: field.name,
                      id: field.id,
                      val: "",
                      typeText: this.ctrlMap[field.ctrl],
                      rowspan: 1,
                      colspan: 3,
                      flagField: field.flagField || false,
                      relatedField: field.relatedField || "",
                      relatedFieldValue: field.relatedFieldValue || "",
                      fieldHide: false,
                      toggleField: field.toggleField || false
                    }
                  ]
                });
                this.newForm.push({
                  content: []
                });
                flagTd = 0;
              } else if (field.flagDetail) {
                this.newForm.push({
                  content: [{
                    state: true,
                    html: "detail",
                    id: field.id,
                    name: field.name,
                    typeText: "明细表",
                    val: "",
                    rowspan: 1,
                    colspan: 4
                  }]
                });
                this.newForm.push({
                  content: []
                });
                flagTd = 0;
              } else {
                if (flagTd == 4) {
                  this.newForm.push({
                    content: []
                  });
                  flagTd = 0;
                }
                this.newForm[this.newForm.length - 1].content.push({
                  state: true,
                  html: "test",
                  name: field.name,
                  val: "",
                  rowspan: 1,
                  colspan: 1,
                  fieldHide: false
                });
                this.newForm[this.newForm.length - 1].content.push({
                  state: true,
                  html: field.ctrl,
                  id: field.id,
                  name: field.name,
                  typeText: this.ctrlMap[field.ctrl],
                  val: "",
                  rowspan: 1,
                  colspan: 1,
                  flagField: field.flagField || false,
                  relatedField: field.relatedField || "",
                  relatedFieldValue: field.relatedFieldValue || "",
                  fieldHide: false,
                  toggleField: field.toggleField || false
                });
                flagTd += 2;
              }
            }
          });
        }
      },
      renderTd(e) {
        if (this.flagDrag) {
          // 当拖拽到其他td时改变drag-area的宽和高
          let offsetX = e.offsetX,
            offsetY = e.offsetY,
            clientX = e.clientX,
            clientY = e.clientY,
            width = e.target.offsetWidth,
            height = e.target.offsetHeight;
          this.dragArea.style.width =
            clientX - offsetX + width - this.downX + "px";
          this.dragArea.style.height =
            clientY - offsetY + height - this.downY + "px";
        }
      },
      selectTd(e) {
        if (e.button == 0 && !this.flagInput) {
          this.dragArea = document.getElementById("drag-area"); // 选择td时取drag-area覆盖所选td
          this.flagDrag = true;
          let offsetX = e.offsetX,
            offsetY = e.offsetY,
            clientX = e.clientX,
            clientY = e.clientY,
            width = e.target.offsetWidth,
            height = e.target.offsetHeight,
            left = clientX - offsetX,
            top = clientY - offsetY;
          this.currentTdWidth = width;
          this.currentTdHeight = height;
          this.currentRowspan = e.target.rowSpan;
          this.currentColspan = e.target.colSpan;
          this.dragArea.style.width = width + "px"; // drag-area的宽和高等于td的宽和高
          this.dragArea.style.height = height + "px";
          this.dragArea.style.left = left + "px"; // drag-area定位的left值为鼠标clientX减offsetX
          this.dragArea.style.top = top + "px"; // drag-area定位的top值为鼠标clientY减offsetY
          this.downX = left; // 记录当前drag-area的定位left和top的值
          this.downY = top;
          this.startTrIndex = e.target.getAttribute("data-tr");
          this.startTdIndex = e.target.getAttribute("data-td");
          console.log(e.target.getAttribute("data-tr"));
          console.log(e.target.getAttribute("data-td"));
        }
      },
      selectTdConfirm(e) {
        this.flagDrag = false;
        this.endTrIndex = e.target.getAttribute("data-tr");
        this.endTdIndex = e.target.getAttribute("data-td");
        console.log(e.target.getAttribute("data-tr"));
        console.log(e.target.getAttribute("data-td"));
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      drag(e1) {
        let _this = this;
        let drag = e1.currentTarget;
        _this.formChangeInfo.html = drag.getAttribute("data-html");
        _this.formChangeInfo.typeText = drag.getAttribute("data-typeText");
        _this.formChangeInfo.name = drag.getAttribute("data-name");
        _this.formChangeInfo.id = drag.getAttribute("data-id");
        _this.formChangeInfo.flagField = drag.getAttribute("data-flagField");
        _this.formChangeInfo.toggleField = drag.getAttribute("data-toggleField");
        _this.formChangeInfo.relatedField = drag.getAttribute(
          "data-relatedField"
        );
        _this.formChangeInfo.relatedFieldValue = drag.getAttribute(
          "data-relatedFieldValue"
        );
        let newdrag = drag.cloneNode(true);
        let oft =
          drag.offsetTop +
          drag.offsetParent.offsetTop +
          drag.offsetParent.offsetParent.offsetTop;
        let ofl =
          drag.offsetLeft +
          drag.offsetParent.offsetLeft +
          drag.offsetParent.offsetParent.offsetLeft;
        drag.parentNode.appendChild(newdrag);
        newdrag.style.cssText = "position:fixed;";
        newdrag.style.top = oft;
        newdrag.style.left = ofl;
        newdrag.style.cursor = "move";
        let e = e1 || window.event; // 兼容ie浏览器
        let diffX = e.clientX - ofl; // 鼠标点击物体那一刻相对于物体左侧边框的距离=点击时的位置相对于浏览器最左边的距离-物体左边框相对于浏览器最左边的距离
        let diffY = e.clientY - oft;
        if (typeof drag.setCapture !== "undefined") {
          drag.setCapture();
        }
        document.onmousemove = function(_e) {
          let e = _e || window.event; // 兼容ie浏览器
          let left = e.clientX - 80;
          let top = e.clientY - 10;
          // 控制拖拽物体的范围只能在浏览器视窗内，不允许出现滚动条
          if (left < 0) {
            left = 0;
          } else if (left > window.innerWidth - drag.offsetWidth) {
            left = window.innerWidth - drag.offsetWidth;
          }
          if (top < 0) {
            top = 0;
          } else if (top > window.innerHeight - drag.offsetHeight) {
            top = window.innerHeight - drag.offsetHeight;
          }
          // 移动时重新得到物体的距离，解决拖动时出现晃动的现象
          newdrag.style.left = left + "px";
          newdrag.style.top = top + "px";
        };
        document.onmouseup = function(_E) {
          // 当鼠标弹起来的时候不再移动
          this.onmousemove = null;
          this.onmouseup = null; // 预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
          newdrag.parentNode.removeChild(newdrag);
          let e = _E || window.event; // 兼容ie浏览器
          let tdall = document.getElementsByClassName("new_form_child");
          for (let i = 0; i < tdall.length; i++) {
            let box_x =
              tdall[i].offsetLeft +
              tdall[i].offsetParent.offsetLeft +
              tdall[i].offsetParent.offsetParent.offsetLeft;
            let box_y =
              tdall[i].offsetTop +
              tdall[i].offsetParent.offsetTop +
              tdall[i].offsetParent.offsetParent.offsetTop;
            let box_width = tdall[i].offsetWidth; // 容器宽
            let box_height = tdall[i].offsetHeight;
            if (
              e.clientX > box_x &&
              e.clientX < box_x - 0 + box_width &&
              e.clientY > box_y &&
              e.clientY < box_y - 0 + box_height
            ) {
              if (box_x !== ofl || box_y !== oft) {
                let father = tdall[i].parentElement;
                let index2 = [].indexOf.call(
                  tdall[i].parentNode.querySelectorAll(tdall[i].tagName),
                  tdall[i]
                );
                let index1 = [].indexOf.call(
                  father.parentNode.querySelectorAll(father.tagName),
                  father
                );
                console.log("当前第" + index1 + "行"); // 第n行
                console.log("当前第" + index2 + "列"); // 第n列
                _this.newForm[index1].content[index2].html =
                  _this.formChangeInfo.html;
                _this.newForm[index1].content[index2].typeText =
                  _this.formChangeInfo.typeText;
                _this.newForm[index1].content[index2].name =
                  _this.formChangeInfo.name;
                _this.newForm[index1].content[index2].id =
                  _this.formChangeInfo.id;
                _this.newForm[index1].content[index2].flagField =
                  _this.formChangeInfo.flagField;
                _this.newForm[index1].content[index2].toggleField =
                  _this.formChangeInfo.toggleField;
                _this.newForm[index1].content[index2].relatedField =
                  _this.formChangeInfo.relatedField;
                _this.newForm[index1].content[index2].relatedFieldValue =
                  _this.formChangeInfo.relatedFieldValue;
              }
            }
          }
          // 修复低版本ie bug
          if (typeof drag.releaseCapture !== "undefined") {
            drag.releaseCapture();
          }
        };
      }
    }
  };
</script>

// scoped 可以避免父组件样式影响到子组件
// /deep/ 可以在父组件修改子组件样式
// !importanrt 可以让浏览器优先选择，来覆盖父组件样式
<style  scoped>
#formDesigner{
  background:rgba(244,248,249,1);
}
#leftAside {
    display: flex;
    flex-direction: column;
    background-color: #302F3A;
    color: #fff;
/* vh就是当前屏幕可见高度的1%；当元素有内容时：100vh=100%,但当元素无内容时：height:100%，该元素不会被撑开，此时高度为0，height:100vh，该元素会被撑开屏幕高度一致。 */
    height: 100vh;  
    text-align: center;
  }
   .imgbox{
    width: 30px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .imgbox>img{
    /* 鼠标变小手 */
    cursor: pointer;
  }
  #formDesigner /deep/ .el-header {
    height: 40px !important;
    color: #333;
    padding: 0;
    text-align: center;
    line-height: 40px;
  }

  #formDesignerTab .el-tabs--border-card {
    border: 1px solid #333d49;
  }

  #formDesignerComponents {
    background: white;
  }

  

  #formDesigners {
    background: white;
  }

  #formDesigner /deep/ .el-main {
    /* background-color: #fff; */
    color: #333;
    text-align: left;
    /*line-height: 160px;*/
    padding: 0;
  }
  #formDesigner /deep/ .el-container:nth-child(5) .el-aside,
  #formDesigner /deep/ .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  #formDesigner /deep/ .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .new_form_child>div {
    display: inline-block;
  }

  .formDesigner .drag {
    display: inline-block;
  }


  /* 视图操作工具 */
  .menu {
    display: block;
    width: 150px;
    /*background-color: white;*/
    visibility: hidden;
    position: absolute;
    z-index: 105;
    /*box-shadow: 0px 0px 10px #D1CEBC*/
  }

  .menu-item {
    background-color: #fff;
    margin: 0;
  }

  .title {
   padding: 5px;
background:rgba(33,216,102,0.2);
border-radius:2px;


    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    color: #21D866;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25em;
    margin-right: 1em;
  }

  #mouseDownMenu li {
    height: 40px;
    width: 60px;
    line-height: 26px;
    color: #000;
    font-size: 0.9em;
    cursor: pointer;
    list-style: none;
    /*padding: 0.2em 1.3em 0.2em 1.3em;*/
  }

  #mouseDownMenu>li>p {
    color: #fff;
    position: absolute;
    display: inline-block;
    width: 110px;
    text-align: center;
    /*padding: 12px 4px;*/
    background-color: #11284c;
    line-height: 40px;
  }

  #mouseDownMenu>li>ul {
    /*float: right;*/
    position: absolute;
    left: 110px;
  }

  #mouseDownMenu>li>ul>li {
    padding-left: 2px;
    line-height: 40px;
    width: 105px;
    color: #fff;
    background-color: #006c9d;
  }

  #fieldConfig {
    width: 250px;
    position: absolute;
    top: 40px;
    bottom: 0;
    background: white;
    right: 0px;
    transition: right 0.5s;
    border: 1px solid #ddd;
    border-right: 0;
    line-height: normal;
    overflow-y: auto;
    z-index: 20;
  }

  #fieldConfig.active {
    right: 250px;
  }

  #detailConfig {
    width: 250px;
    position: fixed;
    top: 40px;
    bottom: 0;
    background: white;
    right: -260px;
    transition: right 0.5s;
    border: 1px solid #ddd;
    border-right: 0;
    line-height: normal;
    z-index: 101;
  }

  #detailConfig.active {
    right: 0px;
  }

  #formAside {
    background: white !important;
    z-index: 100;
    height: 64vh;
    /*position:relative;*/
    overflow: hidden;
  }

  .back-drop {
    position: absolute;
    /* 去掉左侧 */
    left: 80px; 
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 0;
  }

  .bottom-btn {
    width: 46%;
    display: inline-block;
  }

  #rightSide{
    /* position: fixed; */
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 250px;
  }

  #createDefaultView{  
    height: 5vh;
    width:18em;
    background:#21D866;
    border-color:#21D866;
  }

  .bottom {
    /* 让按钮始终在底部 */
    border: #21D866 1px solid;
    position: fixed;
    bottom: 0px;
    padding-left: 6px;
    width: 250px;
    background: #F2F7F8;
  }

  .main-table-content {
    height: 70vh;
    overflow-y: auto;
    background: white;
    z-index: 100;
    background: #F2F7F8;
    padding: 5px;
  }

  .aside-btn {
    width: 40px;
    padding: 8px 0 10px;
    margin: 5px;
    height: 40px;
    font-size: 23px;
  }

  .designer-ctrl-group .el-checkbox {
    margin: 5px !important;
  }
  main section{
    height: 100%;
  }
  #drag-area {
    position: absolute;
    background: #faa06c;
    opacity: 0.3;
    pointer-events: none;
    z-index: 11;
  }

  .placeholder {
    font-size: 14px;
  }
  .formDesigner{
    width: 100%;
    table-layout: fixed;
    font-size:15px;
  }
  .formDesigner td {
    position: relative;
    border: 1px solid #aaa;
    /*width: 50%;*/
    height: 38px;
    /*line-height: 38px;*/
  }

  #formDesigner td{
    border: 1px solid #DFE5E7;
    padding: 5px;

  }
  .formDesigner /deep/ .el-form-item__label{
    float: left;
    width: 12em;
    background: #f8f8f8;
    text-align: left;
    height: 100%;
    line-height: 40px;
    padding-left: 1em;
    margin-right: 0.8em;
  }
  .formDesigner /deep/ .el-input{
    width: 97% !important;
  }
  .formDesigner /deep/ .el-cascader{
    width: 97% !important;
  }
  .formDesigner /deep/ .el-form-item__content{
    line-height: 40px;
  }
  #formDesignerComponents .drag{
    cursor: pointer;
    display: inline-block;
    margin-left: 0.6em;
  }
  .formDesigner /deep/ .el-textarea{
    width: 100% !important;
  }
  .formDesigner /deep/ .el-form-item{
    height: 100%;
  }
  .formDesigner /deep/ .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    border-color: #fff;
  }
  #formDesignerTab /deep/ .el-tabs__content{
    padding:0 !important;
  }
  #formDesignerTab /deep/ .el-tabs--border-card>.el-tabs__header{
    background-color: #F2F7F8 !important;
  }
  #formDesigners td{
    border: 1px solid #EEEEEE;
    padding-left: 20px;
  }
  .designer-modal-btn /deep/ .el-button{
    padding: 0;
    width: 120px;
    height: 34px;
    line-height:34px;
  }
  .designer-modal-footer>div{
    text-align: center;
    margin: 0 !important;
  }
  .designer-ctrl-group{
    width: 100%;
    margin: 15px 0;
  }
  .designer-ctrl-label{
    /* font-weight: bold; */
    color:#565E66;
    font-size: 20px;
  }
  input.designer-ctrl{
    width: 100%;
    border-style: none;
    border-bottom: 1px solid rgb(221, 221, 221);
    background: transparent;
    outline: none;
    color: #8E93A0;
    font-size: 16px;
    margin-top:10px;
    padding-bottom: 10px;
  }
  select.designer-ctrl{
    width: 100%;
    border-style:none;
    border-bottom: 1px solid rgb(221, 221, 221);
    background:transparent;
    outline: none;
    color:inherit;
    font-size:inherit
  }
 
</style>

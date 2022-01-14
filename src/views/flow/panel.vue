<template>
  <div v-if="easyFlowVisible">
    <div class="top-bar">
      <div class="bar-title">
        <img src="../../../static/images/bar_title_img.png" class="bar-title-img"/>
        <span class="bar-title-text">流程设计</span>
      </div>
      <div class="bar-buttons">
        <div class="bar-button" @click="addflw">
          <img src="../../../static/images/bar_button_new.png" class="bar-button-img"/>
          <p class="bar-button-text">新建流程</p>
        </div>
        <div @click="getList" class="bar-button">
          <img src="../../../static/images/bar_button_open.png" class="bar-button-img"/>
          <p class="bar-button-text">打开流程</p>
        </div>
        <!-- <div class="bar-button">
          <img src="../../../static/images/bar_button_type.png" class="bar-button-img" />
          <p class="bar-button-text">分类管理</p>
        </div> -->
        <!-- <div @click="dataInfo" class="bar-button">
          <img src="../../../static/images/code.png" class="bar-button-img"/>
          <p class="bar-button-text">数据源码</p>
        </div> -->
         <!-- <div class="bar-button" @click="getList2">
          <img src="../../../static/images/bar_button_open.png" class="bar-button-img" />
          <p class="bar-button-text">复制模板</p>
        </div> -->
        <div class="bar-button" style="margin-left:60px">
          <input class="bar_button_selector" v-model="data.width">
          <!-- <div id="contentWidth" class="bar_button_selector_text">1000px</div> -->
          <!-- <div class="bar_button_selector_arrow">
            <div class="bar_button_selector_arrow_up"></div>
            <div class="bar_button_selector_arrow_down"></div>
          </div> -->
          <!-- </el-input> -->
          <p class="bar-button-text">W</p>
        </div>
        <div class="bar-button">
          <input class="bar_button_selector" v-model="data.height">
          <!-- <div id="contentHeight" class="bar_button_selector_text">800px</div> -->
          <!-- <div class="bar_button_selector_arrow">
            <div class="bar_button_selector_arrow_up"></div>
            <div class="bar_button_selector_arrow_down"></div>
          </div> -->
          <!-- </div> -->
          <p class="bar-button-text">H</p>
        </div>
      </div>

      <div class="bar-nodes">
        <div
          :style="!start ? '':'pointer-events: none;'"
          @click="addStart"
          class="bar-node"
          id="addStartBtn"
        >
          <img src="../../../static/images/bar_node_start.png" class="bar-node-img"/>
          <p class="bar-node-text">开始节点</p>
        </div>
        <div @click="addTask" class="bar-node" id="addTaskBtn">
          <img src="../../../static/images/bar_node_task.png" class="bar-node-img" style="width:26px"/>
          <p class="bar-node-text">任务节点</p>
        </div>
        <div
          :style="!end ? '':'pointer-events: none;'"
          @click="addEnd"
          class="bar-node"
          id="addEndBtn"
        >
          <img src="../../../static/images/bar_node_end.png" class="bar-node-img"/>
          <p class="bar-node-text">结束节点</p>
        </div>
      </div>
    </div>
    <div class="flow-info">
      <!-- <div class="flow-info-content">
        <div class="flow-info-content-title">分类</div>
        <div class="flow-info-content-name"></div>````
      </div> -->
      <div class="flow-info-content" @click="showFlowNames">
        <div class="flow-info-content-title">流程</div>
        <div class="flow-info-content-name">{{data.flowName}}</div>
      </div>
      <div class="flow-info-content" @click="showTab">
        <div class="flow-info-content-title">表单</div>
        <div class="flow-info-content-name">{{data.module.name}}</div>
      </div>
      <div class="flow-action2">
        <button class="orange2" id="saveBtn" v-if="data.id" @click="del">删 除</button>
      </div>
      <div class="flow-action">
        <button class="orange" id="saveBtn" @click="add">保 存</button>
      </div>
    </div>
    <el-row>
      <!-- <el-col :span="3" ref="flowTool">
        <flowTool @addNode="addNode"></flowTool>
      </el-col>-->
      <el-col :span="21">
        <!-- <el-row>
          <div>{{data.nodeList}}</div>
        </el-row>-->
        <el-row>
          <el-col :span="24">
            <!--画布-->
            <div id="flowContainer" class="container" :style="'width:'+data.width+';height:'+data.height">
              <!--{{data}}-->
              <template v-for="node in data.modElements">
                <!--{{node}}-->
                <flow-node
                  :id="node.code"
                  :key="node.code"
                  :node="node"
                  @deleteNode="deleteNode"
                  @changeNodeSite="changeNodeSite"
                  @nodeRightMenu="nodeRightMenu"
                  @editNode="editNode"
                ></flow-node>
              </template>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog title="流程名称" :visible.sync="showFlowName" width="30%">
      <!-- <span>这是一段信息</span> -->
      <el-input type="text" v-model="flowName"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showFlowName = false">取 消</el-button>
        <el-button type="primary" @click="updateFlowName">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择表单" :visible.sync="dialogSelectVisible">
      <div>
        <el-input placeholder="在此搜索" v-model="query"></el-input>
      </div>
      <div>
        <el-tabs v-model="activeName" v-if="!query">
          <el-tab-pane v-for="(tab,index) in cats" :label="tab.name" :key="index" :name="tab.id.toString()">
            <el-row>
              <el-button
                style="margin-bottom:10px;"
                v-for="(item,index) in catsMap[tab.id]"
                type="primary"
                plain
                :key="index"
                @click="selectMod(item)"
              >{{item.name}}
              </el-button>
            </el-row>
          </el-tab-pane>
        </el-tabs>
        <el-tabs v-if="query" v-model="activeName3">
          <el-tab-pane label="搜索结果" name="queryResult">
            <el-row>
              <el-button
                style="margin-bottom:5px;"
                v-for="(mod,index) in filteredMods"
                type="primary"
                plain
                :key="index"
              >{{mod.name}}
              </el-button>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>

    <flow-info v-if="flowInfoVisible" ref="flowInfo" :data="data"></flow-info>
    <flow-node-form v-if="nodeFormVisible" ref="nodeForm"></flow-node-form>
    <lcList ref="listDialog" @flowdetail="flowdetail"></lcList>
     <lcList2 ref="listDialog2" @flowdetail="flowdetail"></lcList2>

  </div>
</template>

<script>
  import draggable from "vuedraggable"
  import {jsPlumb} from "jsplumb"
  import flowNode from "@/views/flow/node"
  import flowTool from "@/views/flow/tool"
  import FlowInfo from "@/views/flow/info.vue"
  import FlowNodeForm from "./node_form"
  import flowApi from "@/api/flow/index"
  import lcList from "./list"
  import lcList2 from "./list2"

  export default {
    name: "easyFlow",
    data() {
      return {
        jsPlumb: null, // jsPlumb 实例
        easyFlowVisible: true,
        flowInfoVisible: false,
        dialogSelectVisible: false,
        showFlowName: false,
        nodeFormVisible: false,
        index: 0,
        start: false,
        end: false,
        flowName: "",

        cats: [],
        catsMap: {},
        mods: [],
        query: "",
        activeName: "",
        endpoint: {
          isSource: true,
          isTarget: true,
          connector: [
            "Flowchart",
            {gap: 10, cornerRadius: 5, alwaysRespectStubs: true}
          ],
          endpoint: [
            "Dot",
            {
              radius: 8,
              fill: "#ffffff"
            }
          ],

          paintStyle: {
            strokeStyle: "#299EFD",
            stroke: "#299EFD",
            fill: "#ffffff",
            fillStyle: "#ffffff",
            strokeWidth: 9,
            radius: 6,
            lineWidth: 3
          },
          hoverPaintStyle: {stroke: "#299EFD"},
          connectorStyle: {
            outlineStroke: "#299EFD",
            strokeWidth: 1
          },
          connectorHoverStyle: {
            strokeWidth: 2
          },
          maxConnections: -1, // 设置连接点最多可以连接几条线
          connectorOverlays: [
            [
              "Arrow",
              {
                width: 10,
                length: 10,
                location: 1
              }
            ],
            [
              "Arrow",
              {
                width: 10,
                length: 10,
                location: 0.2
              }
            ],
            [
              "Arrow",
              {
                width: 10,
                length: 10,
                location: 0.7
              }
            ]
          ]
        },
        data: {
          flowName: "",
          module: {
            catId: '',
            detailKeys: "",
            id: '',
            name: "",
            tableKey: "",
          },
          modType: 3,
          width: "1200px",
          height: "700px",
          modElements: [],
          modSequenceElements: [],
        }
      };
    },
    components: {
      draggable,
      flowNode,
      flowTool,
      FlowInfo,
      FlowNodeForm,
      lcList,
      lcList2
    },
    mounted() {
      this.jsPlumb = jsPlumb.getInstance();

      this.init();

      this.data.width = window.innerWidth + 'px'

    },
    watch: {
      data: {
        //深度监听，可监听到对象、数组的变化
        handler(newVal, oldVal) {
        this.$forceUpdate();
        },
        deep: true
      }
    },

    methods: {
      fatherMethod(data) {
        for (let i = 0; i < this.data.modElements.length; i++) {
          if (data.code == this.data.modElements[i].code) {
            this.data.modElements[i] = data
          }
        }

      },
      selectMod(data) {
        // console.log(data)
        this.data.module = data
        this.dialogSelectVisible = false
      },
      showTab() {
        this.dialogSelectVisible = true
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        let _this = this;
        flowApi
          .getMods()
          .then(function (res) {
            // 处理成功的结果
            _this.cats = res.data.cats;
            _this.catsMap = res.data.catsMap;
            _this.mods = res.data.mods;
            _this.activeName = _this.cats[0].id.toString();
            loading.close();
            _this.dialogSelectVisible = true;
          })
          .catch(function (error) {
            console.log(error);
          });
        // DictionaryApi.getDictionaryListNoPage(this.url + this.curVersion, 0)
        //   .then(function (res) {
        //     // 处理成功的结果
        //     if (res.data.code == 10000) {
        //       _this.alldictionarys = [];
        //       if (res.data.data.childSysDictionary.length) {
        //         res.data.data.childSysDictionary.forEach(item => {
        //           if (item.parentId == 0) {
        //             _this.alldictionarys.push(item);
        //           }
        //         });
        //       }
        //     }
        //   })
          // .catch(function (error) {
          //   console.log(error);
          // });

      },
      editNode(nodeId) {
        this.nodeFormVisible = true
        this.$nextTick(function () {
          this.$refs.nodeForm.init(nodeId, this.data.modElements, this.data.modSequenceElements,this.data.module.id)
        })
      },
      showFlowNames() {
        this.flowName = this.data.flowName;
        this.showFlowName = true;
      },
      updateFlowName() {
        var re = /^[\u4E00-\u9FA5a-zA-Z0-9]{1,250}$/; //只能输入汉字和英文字母
      if (!re.test(this.flowName)) {
        this.$message({
          message: "流程名称不能输入特殊字符或者为空",
          type: "error"
        });
        return;
      }
        this.data.flowName = this.flowName;
        this.showFlowName = false;
      },
      del() {
        this.$confirm("确定要删除流程?删除流程后若有进行中的历史以及待办事项将全部删除请慎重考虑!", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        })
          .then(() => {
            flowApi.del(this.data.id)
              .then(res => {
                if (res.errorCode == 0) {
                  this.$message({
                    message: "删除成功",
                    type: "success"
                  });
                  this.$router.go(0)
                } else {
                  this.$message({
                    message: res.message,
                    type: "error"
                  });
                }
              })
              .catch(error => {
                console.log(error);
              });
          })
          .catch(() => {
          });

      },
      add() {
        var isStart = false
        var isEnd = false
        for(var i=0;i<this.data.modElements.length;i++){
          if(this.data.modElements[i].code=="startElement"){
            isStart = true
          }
          if(this.data.modElements[i].code=="endElement"){
            isEnd = true
          }
          if(this.data.modElements[i].code!="startElement"&&this.data.modElements[i].code!="endElement"){
            // console.log(111)
            if(this.data.modElements[i].modElementConfig.isSelect==false){
              this.$message({
                message: "请检查"+this.data.modElements[i].name+"是否配置审批人",
                type: "error"
              });
              // console.log(this.data.modElements[i])
              return
            }

          }
        }
        if(isStart==false){
           this.$message({
                message: "请添加开始节点",
                type: "error"
              });
              return
        }
        if(isEnd==false){
           this.$message({
                message: "请添加结束节点",
                type: "error"
              });
              return
        }
        // return
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        flowApi
          .add(this.data)
          .then(res => {
            // console.log(res)
            if (res.errorCode == 0) {
              this.$message({
                message: "保存成功",
                type: "success"
              });
              loading.close();
              this.flowdetail(res.data.id)
            } else {
              this.$message({
                message: res.msg,
                type: "error"
              });
              loading.close();
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      addflw() {
        this.start = false;
        this.end = false;
        for (var i = 0; i < this.data.modElements.length; i++) {
          let node = this.data.modElements[i];

          jsPlumb.remove(node.code);
        }
        this.data = {
          flowName: "",
          modType: 3,
          module: {
            catId: '',
            detailKeys: "",
            id: '',
            name: "",
            tableKey: "",
          },
          width: window.innerWidth + 'px',
          height: "700px",
          modElements: [],
          modSequenceElements: [],

        }
      },
      flowdetail(flowId,isShow) {
        var _this = this;
      this.start = false;
      this.end = false;
      for (var i = 0; i < this.data.modElements.length; i++) {
        let node = this.data.modElements[i];

        jsPlumb.remove(node.code);
      }
      this.data = {
        flowName: "",
        modType: 3,
        module: {
          catId: "",
          detailKeys: "",
          id: "",
          name: "",
          tableKey: ""
        },
        width: window.innerWidth + "px",
        height: "700px",
        modElements: [],
        modSequenceElements: []
      };
      flowApi.getDetail(flowId).then(res => {
        var datas = res.data;
        this.data = res.data;
        if (isShow) {
          this.data.module.id = "";
          this.data.module.name = "";
           this.data.module.tableKey = ""
           this.data.id=''
          for (var i = 0; i < this.data.modElements.length; i++) {

            this.data.modElements[i].modElementConfig.hideTable = "";
            this.data.modElements[i].modElementConfig.editTable = "";
            this.data.modElements[i].modElementConfig.hideTableDetail = [
              {
                hostId: "",
                list: [],
                orderId: ""
              }
            ];
            this.data.modElements[i].modElementConfig.editTableDetail = [
              {
                hostId: "",
                list: [],
                orderId: ""
              }
            ];
             this.data.modElements[i].modElementConfig.showTableDetail=[];
          this.data.modElements[i].modElementConfig.noEditTableDetail= [];
          }
        }

        this.$nextTick(() => {
          for (var i = 0; i < this.data.modElements.length; i++) {
            let node = this.data.modElements[i];

            if (node.code == "endElement") {
              var uuidl = node.code + "l";

              jsPlumb.addEndpoint(
                node.code,
                { anchors: "Left", uuid: uuidl },
                _this.endpoint
              );

              jsPlumb.draggable(node.code, { containment: "parent" });
              this.end = true;
            } else if (node.code == "startElement") {
              var uuidr = node.code + "r";

              jsPlumb.addEndpoint(
                node.code,
                { anchors: "Right", uuid: uuidr },
                _this.endpoint
              );
              jsPlumb.draggable(node.code, { containment: "parent" });
              this.start = true;
            } else {
              var uuidr = node.code + "r";
              var uuidl = node.code + "l";

              jsPlumb.addEndpoint(
                node.code,
                { anchors: "Right", uuid: uuidr },
                _this.endpoint
              );
              jsPlumb.addEndpoint(
                node.code,
                { anchors: "Left", uuid: uuidl },
                _this.endpoint
              );
              jsPlumb.draggable(node.code, { containment: "parent" });
            }
          }
          datas.modSequenceElements = datas.modSequenceElements.filter(function(
            line
          ) {
            return jsPlumb.connect({
              uuids: [line.fromNodeCode + "r", line.toNodeCode + "l"]
            });
          });
        });
      });
      },
      getList() {
        this.$refs.listDialog.openDialog("700px");
      },
      getList2() {
      this.$refs.listDialog2.openDialog("700px");
    },
      save() {
      },
      getUuid(len, radix) {
        var CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
          ""
        );
        var chars = CHARS,
          uuid = [],
          i;
        radix = radix || chars.length;
        if (len) {
          for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
        } else {
          var r;
          uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
          uuid[14] = "4";
          for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
              r = 0 | (Math.random() * 16);
              uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
            }
          }
        }

        return uuid.join("");
      },
      delLine(beginId, endId) {
        // console.log(beginId, endId);
      },
      init() {
        let _this = this;
        jsPlumb.bind("connection", function (evt) {
          // console.log("connection", evt);
          let from = evt.source.id;
          let to = evt.target.id;
          if (from === to) {
            _this.$message.error("不能连接自己");
          } else
            _this.data.modSequenceElements.push({
              fromNodeCode: from,
              toNodeCode: to
            });
          // console.log(_this.data.modElements)
          let mdList = _this.data.modElements
          var name = ""
          for (let k = 0; k < mdList.length; k++) {

            if (to == mdList[k].code) {
              name = mdList[k].name
            }
          }
          for (let i = 0; i < mdList.length; i++) {

            if (from == mdList[i].code) {

              if (mdList[i].modElementConfig.toNode.length > 0) {
                let isPush = false
                for (let j = 0; j < mdList[i].modElementConfig.toNode.length; j++) {
                  if (to == mdList[i].modElementConfig.toNode[j].code) {
                    isPush = true
                  }
                }
                if (!isPush) {
                  mdList[i].modElementConfig.toNode.push(
                    {
                      name: name,
                      code: to,
                      condition: "default",
                    }
                  )
                }
              } else {
                // console.log("空")
                mdList[i].modElementConfig.toNode.push(
                  {
                    name: name,
                    code: to,
                    condition: "default",
                  }
                )
              }

            } else {
              // console.log(2222)
            }
          }
        });
        jsPlumb.bind("click", function (conn, originalEvent) {
          // console.log("click", conn);

          _this
            .$confirm("确定删除所点击的线吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
            .then(() => {

              let nolist = _this.data.modElements
              for (let j = 0; j < nolist.length; j++) {
                if (nolist[j].code == conn.sourceId) {
                  for (let k = 0; k < nolist[j].modElementConfig.toNode.length; k++) {
                    if (nolist[j].modElementConfig.toNode[k].code == conn.targetId) {
                      // console.log(11122)
                      nolist[j].modElementConfig.toNode.splice(k, 1)
                    }
                  }
                }
              }
              jsPlumb.deleteConnection(conn);
              for (let i = 0; i < _this.data.modSequenceElements.length; i++) {
                if (
                  _this.data.modSequenceElements[i].fromNodeCode ==
                  conn.sourceId &&
                  _this.data.modSequenceElements[i].toNodeCode == conn.targetId
                ) {
                  _this.data.modSequenceElements.splice(i, 1);
                }
              }
            })
            .catch(() => {
            });
        });
        jsPlumb.bind("beforeDrop", function (evt) {

          let from = evt.sourceId;
          let to = evt.targetId;
          if (from === to) {
            _this.$message.error("不能连接自己");
            return false;
          }
          if (_this.hasLine(from, to)) {
            // console.log(from, to);
            _this.$message.error("不能重复连线");
            return false;
          }
          if (from == "endElement") {
            _this.$message.error("结束节点不能回环哦");
            return false;
          }
          return true;
        });
      },
      //删除节点
      deleteNode(nodeId, name) {
        this.$confirm("确定要删除节点" + name + "?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        })
          .then(() => {
            var arr = this.data.modElements;

            for (let i = 0; i < arr.length; i++) {
              for (let j = 0; j < arr[i].modElementConfig.toNode.length; j++) {
                if (arr[i].modElementConfig.toNode[j].code == nodeId) {
                  console.log(arr[i].modElementConfig.toNode[j])
                  arr[i].modElementConfig.toNode.splice(j, 1)
                  console.log(arr[i].modElementConfig.toNode)
                }
              }
              if (arr[i].code === nodeId) {
                if (arr[i].code == "endElement") {
                  this.end = false;
                }
                if (arr[i].code == "startElement") {
                  this.start = false;
                }
                jsPlumb.remove(nodeId);
                jsPlumb.repaintEverything();
                this.data.modElements.splice(i, 1);
                this.data.modSequenceElements = this.data.modSequenceElements.filter(
                  function (line) {
                    return (
                      line.fromNodeCode != nodeId && line.toNodeCode != nodeId
                    );
                  }
                );
              }
            }
          })
          .catch(() => {
          });
        return true;
      },
      addEnd() {
        const _this = this;
        var node = {
          code: "endElement",
          name: "结束节点",
          startX: "150px",
          startY: "150px",
          modElementConfig: {
            userIds: [],
            groupIds: [],
            roleIds: [],
            toNode: [],
            hideTable:"",
            editTable:"",
            showTableDetail:[],
            noEditTableDetail:[],
            hideTableDetail:[
              {
                hostId:"",
                list:[],
                orderId:""
              }
            ],
            editTableDetail:[
              {
                hostId:"",
                list:[],
                orderId:""
              }
            ],
            isSelect:false,
            isRequired:false,
            designee:"",
            initiator:false,
            isShowBackLsit: false,
            handlerSelectable: false,
            removeDuplicate:false,
            submitInitiator:false,
            groupRoleIds: [
              {
                isShowDepartments: false,
                deptAndParent: false,
                isShowPost: false,
                groupId: "",
                roleId: ""
              }
            ]
          },
        };
        this.data.modElements.push(node);
        this.$nextTick(function () {
          jsPlumb.addEndpoint(
            "endElement",
            {
              anchors: "Left",
              overlays: [["Arrow", {width: 12, length: 12, location: 0.5}]]
            },
            this.endpoint
          );
          jsPlumb.draggable("endElement", {containment: "parent"});
        });
        this.end = true;
      },
      addStart() {
        const _this = this;
        var node = {
          code: "startElement",
          name: "开始节点",
          startX: "150px",
          startY: "150px",
          modElementConfig: {
            userIds: [],
            groupIds: [],
            roleIds: [],
            toNode: [],
            hideTable:"",
            editTable:"",
            showTableDetail:[],
            noEditTableDetail:[],
            hideTableDetail:[
              {
                hostId:"",
                list:[],
                orderId:""
              }
            ],
            editTableDetail:[
              {
                hostId:"",
                list:[],
                orderId:""
              }
            ],
            isSelect:false,
            isRequired:false,
            designee:"",
            initiator:false,
            isShowBackLsit: false,
            handlerSelectable: false,
            removeDuplicate:false,
            submitInitiator:false,
            groupRoleIds: [
              {
                isShowDepartments: false,
                deptAndParent: false,
                isShowPost: false,
                groupId: "",
                roleId: ""
              }
            ]
          },
        };
        this.data.modElements.push(node);
        this.$nextTick(function () {
          jsPlumb.addEndpoint(
            "startElement",
            {
              anchors: "Right",
              overlays: [["Arrow", {width: 12, length: 12, location: 0.5}]]
            },
            this.endpoint
          );
          jsPlumb.draggable("startElement", {containment: "parent"});
        });
        this.start = true;
      },
      hasLine(from, to) {
        for (var i = 0; i < this.data.modSequenceElements.length; i++) {
          var line = this.data.modSequenceElements[i];
          if (line.fromNodeCode === from && line.toNodeCode === to) {
            return true;
          }
        }
        return false;
      },
      addTask() {
        const _this = this;
        var uuid = this.getUuid();
        this.index++;
        // var names = "task" + this.index;
        var node = {
          code: uuid,
          name: "任务节点"+this.index,
          startX: "150px",
          startY: "150px",
          modElementConfig: {
            userIds: [],
            groupIds: [],
            roleIds: [],
            toNode: [],
            hideTable:"",
            editTable:"",
            showTableDetail:[],
            noEditTableDetail:[],
            hideTableDetail:[
              {
                hostId:"",
                list:[],
                orderId:""
              }
            ],
            editTableDetail:[
              {
                hostId:"",
                list:[],
                orderId:""
              }
            ],
            isSelect:false,
            isRequired:false,
            designee:"",
            initiator:false,
            isShowBackLsit: false,
            handlerSelectable: false,
            removeDuplicate:false,
            submitInitiator:false,
            groupRoleIds: [
              {
                isShowDepartments: false,
                deptAndParent: false,
                isShowPost: false,
                groupId: "",
                roleId: ""
              }
            ]
          },
          // show: true
        };
        this.data.modElements.push(node);
        this.$nextTick(function () {
          jsPlumb.addEndpoint(
            uuid,
            {
              anchors: "Right",
              overlays: [["Arrow", {width: 12, length: 12, location: 0.5}]]
            },
            this.endpoint
          );
          jsPlumb.addEndpoint(
            uuid,
            {
              anchors: "Left",
              overlays: [["Arrow", {width: 12, length: 12, location: 0.5}]]
            },
            this.endpoint
          );
          jsPlumb.draggable(uuid, {containment: "parent"});
        });
      },
      dataInfo() {
        this.flowInfoVisible = true;
        this.$nextTick(function () {
          this.$refs.flowInfo.init();
        });
      },
      changeNodeSite(data) {
        // console.log(data);
        for (var i = 0; i < this.data.modElements.length; i++) {
          let node = this.data.modElements[i];
          if (node.code === data.nodeId) {
            node.startX = data.left;
            node.startY = data.top;
          }
        }
      },
      nodeRightMenu(nodeId, evt) {
        this.menu.show = true;
        this.menu.curNodeId = nodeId;
        this.menu.startX = evt.x + "px";
        this.menu.startY = evt.y + "px";
      }
    }
  };
</script>

<style>
  #flowContainer {
    background-image: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.15) 10%,
      rgba(0, 0, 0, 0) 10%
    ),
    linear-gradient(rgba(0, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%);
    background-size: 10px 10px;
    /* height: 700px; */
    background-color: rgb(251, 251, 251);
    /*background-color: #42b983;*/
    position: relative;
    /* width: 100%; */
    margin-top: 20px;
  }

  .labelClass {
    background-color: white;
    padding: 5px;
    opacity: 0.7;
    border: 1px solid #346789;
    /*border-radius: 10px;*/
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .topbox {
    display: flex;
    justify-content: space-between;
  }

  .top-bar {
    /* position: fixed; */
    top: 0px;
    left: 0px;
    width: 100%;
    height: 80px;
    z-index: 999;
    background: #f7f7f7;
    border-bottom: #cccccc 1px solid;
    text-align: center;
    vertical-align: middle;
    padding: 0 15px 0 15px;
    box-sizing: border-box;
  }

  .top-bar .bar-title {
    display: inline-block;
    float: left;
    width: 200px;
    text-align: left;
    line-height: 80px;
    vertical-align: middle;
  }

  .top-bar .bar-title-img {
    display: inline-block;
    width: 26px;
    height: 26px;
    vertical-align: middle;
    margin-top: -5px;
  }

  .top-bar .bar-title-text {
    display: inline-block;
    font-size: 20px;
    font-weight: bold;
    color: #2f2f2f;
    margin-left: 10px;
    letter-spacing: 2px;
    line-height: 20px;
  }

  .top-bar .bar-buttons {
    float: left;
    height: 80px;
    display: inline-block;
    vertical-align: middle;
    margin-left: 200px;
  }

  .top-bar .bar-button {
    height: 40px;
    width: 70px;
    display: inline-block;
    vertical-align: middle;
    margin-top: 22px;
    cursor: pointer;
  }

  .top-bar .bar-button .bar-button-img {
    height: 18px;
    width: 25px;
  }

  .top-bar .bar-button .bar-button-text {
    font-size: 10px;
    color: #707070;
    margin: 0;
  }

  .top-bar .bar-button .bar_button_selector {
    border: #d7d7d7 1px solid;
    width: 60px;
    display: inline-block;
    color: #707070;
    padding: 5px;
  }

  .top-bar .bar-button .bar_button_selector_text {
    dispaly: inline-block;
    width: 50px;
    height: 18px;
    float: left;
    background: #fff;
    font-size: 10px;
    color: #707070;
  }

  .top-bar .bar-button .bar_button_selector_arrow {
    dispaly: inline-block;
    width: 9px;
    height: 18px;
    float: left;
    border-left: #d7d7d7 1px solid;
  }

  .flow-info {
    /* position: fixed; */
    background: #f7f7f7;
    top: 100px;
    left: 0px;
    width: 100%;
    height: 80px;
    line-height: 80px;
    z-index: 999;
    vertical-align: middle;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .flow-info-content {
    /* margin-top: 24px; */
    height: 30px;
    display: inline-block;
    border: #bdbdbd 1px solid;
    border-radius: 3px;
    background: #fff;
    float: left;
    margin: 24px 15px 0 0;
    line-height: 30px;
    padding: 0;
  }

  .flow-info-content-title {
    display: inline-block;
    background: #e5e5e5;
    float: left;
    font-size: 14px;
    color: #707070;
    margin: 0;
    line-height: 30px;
    padding: 0 10px;
    text-align: center;
  }

  .flow-action {
    display: inline-block;
    float: right;
    padding-right: 40px;
    box-sizing: border-box;
  }

  .flow-action2 {
    display: inline-block;
    float: right;
    padding-right: 40px;
    box-sizing: border-box;
  }

  .flow-action2 .orange2 {
    height: 30px;
    color: #fff;
    font-size: 12px;
    border-radius: 3px;
    text-align: center;
    line-height: 30px;
    background: red;
    border: 0;
    width: 80px;
  }

  .flow-action .orange {
    height: 30px;
    color: #fff;
    font-size: 12px;
    border-radius: 3px;
    text-align: center;
    line-height: 30px;
    background: -webkit-linear-gradient(left, #ff9400, #da8e0d) no-repeat;
    border: 0;
    width: 80px;
  }

  .flow-info-content-name {
    min-width: 50px;
    display: inline-block;
    border-left: #bdbdbd 1px solid;
    background: #fff;
    float: left;
    font-size: 14px;
    color: #707070;
    margin: 0;
    line-height: 30px;
    cursor: pointer;
    padding: 0 10px;
    text-align: center;
  }

  .top-bar .bar-button .bar_button_selector_arrow_up {
    background-image: url(/images/bar_button_selsctor_arrow_up.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 5px 3px;
    height: 9px;
    width: 9px;
    cursor: pointer;
  }

  .top-bar .bar-button .bar_button_selector_arrow_down {
    background-image: url(/images/bar_button_selsctor_arrow_down.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 5px 3px;
    height: 9px;
    width: 9px;
    cursor: pointer;
  }

  .top-bar .bar-nodes {
    float: left;
    height: 80px;
    display: inline-block;
    vertical-align: middle;
    margin-left: 50px;
    cursor: pointer;
  }

  .top-bar .bar-node {
    height: 60px;
    width: 80px;
    display: inline-block;
    border: #bdbdbd 1px solid;
    border-radius: 3px;
    background: #fff;
    margin-top: 7px;
  }

  .top-bar .bar-node .bar-node-img {
    height: 20px;
    width: 20px;
    margin-top: 10px;
  }

  .top-bar .bar-node .bar-node-text {
    font-size: 10px;
    color: #707070;
    margin: 0;
    line-height: 26px;
  }

  .top-bar .bar-action {
    display: inline-block;
    float: right;
    width: 200px;
    height: 100%;
  }

  .top-bar .bar-action .orange {
    height: 26px;
    color: #fff;
    font-size: 12px;
    border-radius: 3px;
    text-align: center;
    line-height: 26px;
    background: -webkit-linear-gradient(left, #ff9400, #da8e0d) no-repeat;
    border: 0;
    width: 80px;
    margin-top: 25px;
  }
</style>

<template>
  <el-dialog title="节点信息" :show-close="true" :close-on-click-modal="false" :visible.sync="visible">
    
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- 基础配置 -->
      <el-tab-pane label="基本配置" name="first">
        <el-form :model="node" ref="dataForm" label-width="80px">
          <el-form-item label="UUID">
            <el-input v-model="node.code" disabled></el-input>
          </el-form-item>
          <el-form-item label="节点名称">
            <el-input v-model="node.name"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- 审批配置 -->
      <el-tab-pane
        label="审批配置"
        name="second"
        v-if="node.code!='startElement'&&node.code!='endElement'"
      >
        <el-form :model="node" ref="dataForm" label-width="110px">
          <el-form-item label="指定人员">
            <div style="display: flex">
              <el-button type="primary" size="small" @click="getNameList">选择人员</el-button>
              <!--<div >-->
              <div>
                <el-tag
                  v-for="(selectedGroup,index) in multipleSelection"
                  :key="selectedGroup.loginId"
                  closable
                  @close="handleClose(selectedGroup,index)"
                  style="margin-left: 2px;"
                >{{selectedGroup.loginId}}</el-tag>
              </div>
              <!--</div>-->
            </div>
          </el-form-item>
          <el-row>
            <el-form-item label="指定部门">
              <!--<div>{{node.modElementConfig.groupIds}}</div>-->
              <div>
                <bumenList v-if="visible" :val.sync="node.modElementConfig.groupIds"></bumenList>
              </div>
            </el-form-item>
          </el-row>
          <el-form-item label="指定岗位">
            <div>
              <el-select v-model="node.modElementConfig.roleIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="部门岗位">
            <div
              style="display: flex;align-items: center;margin-bottom:10px"
              v-for="(item2,index) in node.modElementConfig.groupRoleIds"
              :key="index"
            >
              <div style="margin-right:10px">
                <el-checkbox
                  v-model="item2.isShowDepartments"
                  @change="isShowDepartments(item2)"
                >发起人部门</el-checkbox>
                <el-checkbox v-model="item2.deptAndParent" @change="changeDept(item2)">发起人部门及上级部门</el-checkbox>
                <el-checkbox v-model="item2.isShowPost" @change="isShowPost(item2)">发起人岗位</el-checkbox>
              </div>
              <div v-if="item2.isShowDepartments==false&&item2.deptAndParent==false">
                <bumen-list2 v-if="visible" :val.sync="item2.groupId" ref="groupId"></bumen-list2>
              </div>
              <div style="margin-left: 10px;width:150px" v-if="item2.isShowPost==false">
                <el-select v-model="item2.roleId" clearable placeholder="请选择岗位">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
              <div style="margin-left: 10px">
                <el-button size="small" @click="addgwbm">+</el-button>
              </div>
              <div style="margin-left: 10px">
                <el-button size="small" @click="removebumw(index)">-</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="审批人可选">
            <el-checkbox
              v-model="node.modElementConfig.handlerSelectable"
              @change="handlerSelect(node.modElementConfig)"
            ></el-checkbox>
            <el-radio
              v-show="node.modElementConfig.handlerSelectable"
              v-model="node.modElementConfig.handlerSelectConfig"
              :label="1"
            >单选</el-radio>
            <el-radio
              v-show="node.modElementConfig.handlerSelectable"
              v-model="node.modElementConfig.handlerSelectConfig"
              :label="2"
            >多选</el-radio>
          </el-form-item>
          <el-form-item label="审批意见必填">
            <el-checkbox v-model="node.modElementConfig.isRequired"></el-checkbox>
          </el-form-item>
          <el-form-item label="提交给发起人">
            <el-checkbox v-model="node.modElementConfig.submitInitiator"></el-checkbox>
          </el-form-item>
          <el-form-item label="排除重复审批人">
            <el-checkbox v-model="node.modElementConfig.removeDuplicate"></el-checkbox>
          </el-form-item>
          <el-form-item label="通知发起人">
            <el-checkbox v-model="node.modElementConfig.initiator"></el-checkbox>
          </el-form-item>
            <el-form-item label="通知指定人">
            <!-- <users :config.sync="userConfig" :val.sync="node.modElementConfig.designee"></users> -->
          </el-form-item>
         
          <!--<div>{{node.modElementConfig.groupRoleIds}}</div>-->
        </el-form>
      </el-tab-pane>
      <!-- 审批节点配置 -->
      <el-tab-pane label="审批节点配置" v-if="node.code!='endElement'" name="third">
        <el-form :model="node.modElementConfig" ref="node.modElementConfig" label-position>
          <el-form-item v-for="(item,index) in node.modElementConfig.toNode" :label="item.name" :key="index">
            <el-input type="textarea" v-model="item.condition" placeholder="请输入通过条件"></el-input>
          </el-form-item>
          <el-form-item label="返回节点可选" v-if="node.code!='startElement'&&node.code!='endElement'">
            <el-checkbox v-model="node.modElementConfig.isShowBackLsit"></el-checkbox>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- 表单配置 -->
      <el-tab-pane
        label="表单配置"
        name="five"
        v-if="moduleId!=''&&node.code!='endElement'"
      >
        <el-form
          :model="node.modElementConfig"
          ref="node.modElementConfig"
          label-width="130px"
          class="demo-ruleForm"
          size="mini"
        >
          <el-form-item label="不可见主表字段">
            <el-select v-model="node.modElementConfig.hideTable" multiple placeholder="请选择">
              <el-option v-for="item in Table" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="可编辑主表字段">
            <el-select v-model="node.modElementConfig.editTable" multiple placeholder="请选择">
              <el-option v-for="item in Table" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="不可见明细表字段">
            <div
              style="display: flex;align-items: center;margin-bottom:10px"
              v-for="(item2,index) in node.modElementConfig.hideTableDetail"
              :key="index"
            >
              <div style="width:200px">
                <el-select
                  clearable
                  v-model="item2.hostId"
                  placeholder="请选择明细表"
                  @change="((val)=>{addTableDel(val, index)})"
                >
                  <el-option
                    v-for="item in TableDetail"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
              <div style="margin-left: 10px;width:400px">
                <el-select
                  v-model="item2.orderId"
                  multiple
                  placeholder="请选择"
                  @change="removShowDel(index)"
                >
                  <el-option
                    v-for="item in item2.list"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
              <div style="margin-left: 10px">
                <el-button size="small" @click="addHideTable">+</el-button>
              </div>
              <div style="margin-left: 10px">
                <el-button size="small" @click="removHideTabl(index)">-</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="可编辑明细表字段">
            <div
              style="display: flex;align-items: center;margin-bottom:10px"
              v-for="(item2,index) in node.modElementConfig.editTableDetail"
              :key="index"
            >
              <div style="width:200px">
                <el-select
                  clearable
                  v-model="item2.hostId"
                  placeholder="请选择明细表"
                  @change="((val)=>{addTableDels(val, index)})"
                >
                  <el-option
                    v-for="item in TableDetail"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
              <div style="margin-left: 10px;width:400px">
                <el-select
                  v-model="item2.orderId"
                  multiple
                  placeholder="请选择"
                  @change="removNoEndDel(index)"
                >
                  <el-option
                    v-for="item in item2.list"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
              <div style="margin-left: 10px">
                <el-button size="small" @click="addedTable">+</el-button>
              </div>
              <div style="margin-left: 10px">
                <el-button size="small" @click="removedTabl(index)">-</el-button>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <!--<el-button @click="visible = false" icon="el-icon-close">取消</el-button>-->
      <el-button type="primary" @click="getList" icon="el-icon-check">确定</el-button>
    </span>
    <el-dialog title="人员列表" :visible.sync="showFlowName" width="50%" append-to-body>
      <!-- <span>这是一段信息</span> -->
      <div style="display: flex;margin-bottom: 20px;">
        <el-input style="width: 300px;" v-model="search"></el-input>
        <el-button style="margin-left: 10px" type="primary" @click="searchs" size="small">搜索</el-button>
        <el-button style="margin-left: 10px" type="primary" @click="getNameList" size="small">重置</el-button>
      </div>
      <div>
        <el-checkbox-group v-model="list2">
          <el-checkbox
            style="margin-top:10px;margin-bottom:10px"
            border
            v-for="(item,index) in pageData.list"
            :key="index"
            :label="item.id"
            :value="item.id"
          >{{item.loginId+'('+item.roleNames+')' }}</el-checkbox>
        </el-checkbox-group>
      </div>

      <div class="pageContent">
        <el-pagination
          :model="pageData"
          background
          @current-change="handleCurrentChange"
          :current-page="pageData.current"
          :page-size="pageData.size"
          layout="total, prev, pager, next, jumper"
          :total="pageData.total"
        ></el-pagination>
      </div>
      <!--<div>-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUser" type="primary" icon="el-icon-check">确 定</el-button>
        <!--<el-button type="primary" @click="updateFlowName" icon="el-icon-check">确 定</el-button>-->
      </span>
      <!--</div>-->
    </el-dialog>
  </el-dialog>
</template>

<script>
import flowApi from "@/api/flow/index";
import bumenList from "./handlegroups";
import bumenList2 from "./handlegroups2";
// import users from '@/components/system/access/users'

export default {
  components: {
    bumenList,
    bumenList2,
    // users
  },
  created: function() {
    this.getScriptsList();
  },
  data() {
    return {
      moduleId: "",
      name: "111",
      visible: false,
      node: {},
      nodes: {},
      nodeLists: [],
      showFlowName: false,
      flowName: "",
      search: "",
      options: [],
      Lists: "",
      Table: [],
      TableDetail: [],
      userConfig: {
          multiple: true
        },

      // modElementConfig:{
      //   userIds:[],
      //   groupIds:"",
      //   roleIds:"",
      //   groupRoleIds:""
      // },
      multipleSelection: [],
      pageData: {
        list: [],
        current: 1,
        pages: 0,
        size: 10,
        total: 0
      },
      list2: [],
      activeName: "first",
      scripts: []
    };
  },
  watch: {
    // node: {
    //   //深度监听，可监听到对象、数组的变化
    //   handler(newVal, oldVal) {
    //     console.log(newVal);
    //     console.log(oldVal)
    //     // this.node.groupRoleIds = []
    //     this.node.groupRoleIds = newVal.groupRoleIds
    //     this.$forceUpdate();
    //   },
    //   deep: true
    // }
  },

  methods: {
    removNoEndDel(index) {
      var arr = this.node.modElementConfig.editTableDetail;
      for (
        var i = 0;
        i < this.node.modElementConfig.noEditTableDetail.length;
        i++
      ) {
        if (
          this.node.modElementConfig.noEditTableDetail[i].id ==
          arr[index].hostId
        ) {
          this.node.modElementConfig.noEditTableDetail[i].list = [];
          if (arr[index].list.length != arr[index].orderId.length) {
            if (arr[index].orderId.length == 0) {
              for (var f = 0; f < arr[index].list.length; f++) {
                this.node.modElementConfig.noEditTableDetail[i].list.push(
                  arr[index].list[f].id
                );
              }
            } else {
              var arr2 = JSON.parse(JSON.stringify(arr[index].list));
              for (var k = 0; k < arr[index].orderId.length; k++) {
                for (var j = 0; j < arr2.length; j++) {
                  if (arr2[j].id == arr[index].orderId[k]) {
                    arr2.splice(j, 1);
                    j = j - 1;
                    var arr3 = [];
                    for (var y = 0; y < arr2.length; y++) {
                      arr3.push(arr2[y].id);
                      this.node.modElementConfig.noEditTableDetail[
                        i
                      ].list = arr3;
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    removShowDel(index) {
      var arr = this.node.modElementConfig.hideTableDetail;
      for (
        var i = 0;
        i < this.node.modElementConfig.showTableDetail.length;
        i++
      ) {
        if (
          this.node.modElementConfig.showTableDetail[i].id == arr[index].hostId
        ) {
          this.node.modElementConfig.showTableDetail[i].list = [];
          if (arr[index].list.length != arr[index].orderId.length) {
            if (arr[index].orderId.length == 0) {
              for (var f = 0; f < arr[index].list.length; f++) {
                this.node.modElementConfig.showTableDetail[i].list.push(
                  arr[index].list[f].id
                );
              }
            } else {
              var arr2 = JSON.parse(JSON.stringify(arr[index].list));
              for (var k = 0; k < arr[index].orderId.length; k++) {
                for (var j = 0; j < arr2.length; j++) {
                  if (arr2[j].id == arr[index].orderId[k]) {
                    arr2.splice(j, 1);
                    j = j - 1;
                    var arr3 = [];
                    for (var y = 0; y < arr2.length; y++) {
                      arr3.push(arr2[y].id);
                      this.node.modElementConfig.showTableDetail[i].list = arr3;
                    }
                  }
                }
              }
            }
          }
        }
      }
      console.log(this.node.modElementConfig.showTableDetail);
    },
    addedTable() {
      this.node.modElementConfig.editTableDetail.push({
        hostId: "",
        list: [],
        orderId: ""
      });
    },
    addHideTable() {
      this.node.modElementConfig.hideTableDetail.push({
        hostId: "",
        list: [],
        orderId: ""
      });
    },
    removedTabl(index) {
      // console.log(index);
      if (this.node.modElementConfig.editTableDetail.length > 1) {
        this.node.modElementConfig.editTableDetail.splice(index, 1);
      }
    },
    removHideTabl(index) {
      // console.log(index);
      if (this.node.modElementConfig.hideTableDetail.length > 1) {
        this.node.modElementConfig.hideTableDetail.splice(index, 1);
      }
    },
    addTableDels(value, index) {
      // console.log(value)
      if (value == "") {
        this.node.modElementConfig.editTableDetail[index].list = [];
      } else {
        for (var i = 0; i < this.TableDetail.length; i++) {
          if (this.TableDetail[i].id == value) {
            this.node.modElementConfig.editTableDetail[
              index
            ].list = this.TableDetail[i].fields;
          }
        }
      }
      // return
    },
    addTableDel(value, index) {
      if (value == "") {
        this.node.modElementConfig.hideTableDetail[index].list = [];
      } else {
        for (var i = 0; i < this.TableDetail.length; i++) {
          if (this.TableDetail[i].id == value) {
            this.node.modElementConfig.hideTableDetail[
              index
            ].list = this.TableDetail[i].fields;
          }
        }
      }
    },
    isShowDepartments(data) {
      if (data.isShowDepartments) {
        data.groupId = ["byCreator"];
        if (data.deptAndParent) {
          data.deptAndParent = false;
        }
      } else {
        data.groupId = [];
      }
    },
    changeDept(data) {
      if (data.deptAndParent) {
        data.groupId = ["groupIdAndParent"];
        if (data.isShowDepartments) {
          data.isShowDepartments = false;
        }
      } else {
        data.groupId = [];
      }
    },
    isShowPost(data) {
      // console.log(data)
      if (data.isShowPost) {
        data.roleId = "byCreator";
      } else {
        data.roleId = "";
      }
    },
    handlerSelect(data) {
      if (!data.handlerSelectable) {
        data.handlerSelectConfig = null;
      }
    },

    addUser() {
      if (this.list2.length > 0) {
        var data = JSON.parse(JSON.stringify(this.list2));
        var data2 = data.join(",");

        flowApi.getUser(data2).then(res => {
          console.log(res);
          this.multipleSelection = res.data;
        });
      } else {
        this.multipleSelection = [];
      }

      this.node.modElementConfig.userIds = this.list2;
      this.showFlowName = false;
    },
    handleClose(selectedGroup, index) {
      this.multipleSelection.splice(index, 1);
      this.node.modElementConfig.userIds.splice(index, 1);
    },

    addgwbm() {
      this.node.modElementConfig.groupRoleIds.push({

      });
      let arr = this.node.modElementConfig.groupRoleIds;
      this.$set(arr[arr.length - 1], "isShowDepartments", false);
      this.$set(arr[arr.length - 1], "deptAndParent", false);
      this.$set(arr[arr.length - 1], "isShowPost", false);
      this.$set(arr[arr.length - 1], "groupId", []);
      this.$set(arr[arr.length - 1], "roleId", "");
    },
    removebumw(index) {
      var _this = this;


      if (this.node.modElementConfig.groupRoleIds.length > 1) {
        // this.node.modElementConfig.groupRoleIds.splice(index,1)
        var _this = this;
        var data = JSON.parse(
          JSON.stringify(this.node.modElementConfig.groupRoleIds)
        );
        this.node.modElementConfig.groupRoleIds = [];
        // console.log(data)

        var data2 = data.filter(function(line, indexs) {
          // console.log(index)
          //  console.log(indexs)

          return indexs != index;
        });
        // console.log(data2)

        setTimeout(function() {
          // console.log(data2)
          // console.log(_this.node.modElementConfig.groupRoleIds)
          _this.node.modElementConfig.groupRoleIds = data2;
        });
      }
    },
    getList() {
      if (
        (this.node.modElementConfig.groupRoleIds[0].groupId[0] != "" &&
          this.node.modElementConfig.groupRoleIds[0].groupId.length != 0) ||
        this.node.modElementConfig.groupRoleIds[0].roleId != "" ||
        this.node.modElementConfig.groupRoleIds[0].isShowDepartments == true ||
        this.node.modElementConfig.groupRoleIds[0].deptAndParent == true ||
        this.node.modElementConfig.groupRoleIds[0].isShowPost == true ||
        this.node.modElementConfig.userIds.length > 0 ||
        this.node.modElementConfig.groupIds.length > 0 ||
        this.node.modElementConfig.roleIds.length > 0 ||
        (this.node.modElementConfig.handlerSelectable &&
          this.node.modElementConfig.handlerSelectConfig != null) ||
        this.node.modElementConfig.submitInitiator
      ) {
        this.node.modElementConfig.isSelect = true;
      } else {
        this.node.modElementConfig.isSelect = false;
      }
      console.log(this.node.modElementConfig.isSelect);

      var groupRoleIdsArr = this.node.modElementConfig.groupRoleIds;
      for (var i = 0; i < groupRoleIdsArr.length; i++) {
        // console.log(groupRoleIdsArr[i])
        if (
          groupRoleIdsArr[i].isShowDepartments == false &&
          groupRoleIdsArr[i].deptAndParent == false &&
          groupRoleIdsArr[i].isShowPost == false
        ) {
          console.log(222);
          if (
            (groupRoleIdsArr[i].groupId[0] == "" ||
              groupRoleIdsArr[i].groupId.length == 0) &&
            groupRoleIdsArr[i].roleId != ""
          ) {
            this.$message({
              message: "请将指定部门岗位的部门信息填写完整",
              type: "error"
            });
            return;
          } else if (
            groupRoleIdsArr[i].groupId[0] != "" &&
            groupRoleIdsArr[i].groupId[0] &&
            groupRoleIdsArr[i].roleId == ""
          ) {
            this.$message({
              message: "请将指定部门岗位的岗位信息填写完整",
              type: "error"
            });
            return;
          }
        } else if (
          groupRoleIdsArr[i].isShowDepartments == true &&
          groupRoleIdsArr[i].isShowPost == false
        ) {
          if (groupRoleIdsArr[i].roleId == "") {
            this.$message({
              message: "请将指定部门岗位的岗位信息填写完整",
              type: "error"
            });
            return;
          }
        } else if (
          groupRoleIdsArr[i].deptAndParent == true &&
          groupRoleIdsArr[i].isShowPost == false
        ) {
          if (groupRoleIdsArr[i].roleId == "") {
            this.$message({
              message: "请将指定部门岗位的岗位信息填写完整",
              type: "error"
            });
            return;
          }
        } else if (
          groupRoleIdsArr[i].isShowDepartments == false &&
          groupRoleIdsArr[i].deptAndParent == false &&
          groupRoleIdsArr[i].isShowPost == true
        ) {
          if (
            groupRoleIdsArr[i].groupId[0] == "" ||
            groupRoleIdsArr[i].groupId.length == 0
          ) {
            this.$message({
              message: "请将指定部门岗位的部门信息填写完整",
              type: "error"
            });
            return;
          }
        }
      }
      // return
      var arr = this.node.modElementConfig.groupRoleIds;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].groupId[0]) {
          arr[i].groupId = arr[i].groupId[0];
        } else {
          arr[i].groupId = "";
        }
      }

      for (let i = 0; i < this.nodeLists.length; i++) {
        if (this.nodeLists[i].modElementConfig.toNode.length > 0) {
          for (
            let j = 0;
            j < this.nodeLists[i].modElementConfig.toNode.length;
            j++
          ) {
            if (
              this.nodeLists[i].modElementConfig.toNode[j].code ==
              this.node.code
            ) {
              this.nodeLists[i].modElementConfig.toNode[
                j
              ].name = this.node.name;
            }
          }
        }
      }
      // console.log(this.node);
      if (this.node.modElementConfig.editTable.length > 0) {
        this.node.modElementConfig.editTable = this.node.modElementConfig.editTable.join(
          ","
        );
      } else {
        this.node.modElementConfig.editTable = "";
      }
      if (this.node.modElementConfig.hideTable.length > 0) {
        this.node.modElementConfig.hideTable = this.node.modElementConfig.hideTable.join(
          ","
        );
      } else {
        this.node.modElementConfig.hideTable = "";
      }
      // console.log(this.$parent)

      for (let i = 0; i < this.$parent.data.modElements.length; i++) {
        if (this.node.code == this.$parent.data.modElements[i].code) {
          Object.keys(this.node).forEach((key, value) => {
            this.$parent.data.modElements[i][key] = this.node[key];
          });
        }
      }
      // console.log(this.$parent.data.modElements[0]);
      // this.$parent.fatherMethod(this.node);
      // console.log(this.node);
      this.visible = false;
    },
    handleCurrentChange(val) {
      // console.log(val)
      this.pageData.current = val;
      let data = {};
      data.trueName = this.search;
      data.pageNum = this.pageData.current;
      data.pageSize = this.pageData.size;
      flowApi
        .getNameList(
          data
        )
        .then(res => {
          // console.log(res)
          this.pageData = res.data;
        });
      // this.init(this.isActive)
    },
    searchs() {
      this.pageData.current = 1;
      let data = {};
      data.trueName = this.search;
      data.pageNum = this.pageData.current;
      data.pageSize = this.pageData.size;
      flowApi
        .getNameList(
          data
        )
        .then(res => {
          // console.log(res)
          this.pageData = res.data;
        });
    },
    getNameList() {
      this.search = "";
      this.pageData.current = 1;
      let data = {};
      data.pageNum = this.pageData.current;
      data.pageSize = this.pageData.size;
      flowApi
        .getNameList(
          data
        )
        .then(res => {
          // console.log(res)
          this.pageData = res.data;
        });
      this.list2 = this.node.modElementConfig.userIds;

      this.showFlowName = true;
    },
    init(data, list, list2, moduleId) {
      console.log(data);
      this.TableDetail = [];
      this.Table = [];
      // this.Lists = datas
      var box = {};
      flowApi.getGwList(box).then(res => {
        this.options = res.data;

      });
      this.moduleId = moduleId;

      console.log(data);
      this.visible = true;
      // console.log(moduleId);
      this.node = JSON.parse(JSON.stringify(data));
      if (moduleId != "") {
        flowApi.getModule(moduleId).then(res => {
          var list = JSON.parse(res.data.tableSchema);
          for (var i = 0; i < list.length; i++) {
            if (list[i].flagDetail) {
              this.TableDetail.push(list[i]);
            } else {
              this.Table.push(list[i]);
            }
          }
          if (
            this.node.modElementConfig.showTableDetail.length !=
              this.TableDetail.length &&
            this.TableDetail.length > 0
          ) {
            console.log(111);
            for (var j = 0; j < this.TableDetail.length; j++) {
              this.node.modElementConfig.showTableDetail.push({
                id: this.TableDetail[j].id,
                list: []
              });
              for (var k = 0; k < this.TableDetail[j].fields.length; k++) {
                this.node.modElementConfig.showTableDetail[j].list.push(
                  this.TableDetail[j].fields[k].id
                );
              }
            }
            this.node.modElementConfig.noEditTableDetail = JSON.parse(
              JSON.stringify(this.node.modElementConfig.showTableDetail)
            );
          }
        });
      }
      console.log(this.node);
      for (var i = 0; i < this.node.modElementConfig.groupRoleIds.length; i++) {
        console.log(this.node.modElementConfig.groupRoleIds[i]);
        this.node.modElementConfig.groupRoleIds[
          i
        ].groupId = this.node.modElementConfig.groupRoleIds[i].groupId.split(
          ","
        );
      }
      // this.nodes = data;
      if (this.node.modElementConfig.editTable != "") {
        this.node.modElementConfig.editTable = this.node.modElementConfig.editTable.split(
          ","
        );
      } else {
        this.node.modElementConfig.editTable = [];
      }
      if (this.node.modElementConfig.hideTable != "") {
        this.node.modElementConfig.hideTable = this.node.modElementConfig.hideTable.split(
          ","
        );
      } else {
        this.node.modElementConfig.hideTable = [];
      }
      this.nodeLists = list;

      if (this.node.modElementConfig.userIds.length > 0) {
        var data = JSON.parse(
          JSON.stringify(this.node.modElementConfig.userIds)
        );
        var data2 = data.join(",");

        flowApi.getUser(data2).then(res => {
          console.log(res);
          this.multipleSelection = res.data;
        });
      } else {
        this.multipleSelection = [];
      }
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    getScriptsList() {
      // scriptApi.getScriptList(this.url + this.curVersion, {}).then(res => {
      //   this.scripts = res.data.data;
      // });
    }
  }
};
</script>

<style scoped>
.el-form-item {
  margin-top: 5px;
}
</style>

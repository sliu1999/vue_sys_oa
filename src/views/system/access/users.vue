<template>
  <div>
    <el-button type="primary" size="small" @click="openModal()" style="float: left;">选择人员</el-button>
    <div style="float: left;">
      <div v-if="!flagMultiple" style="margin-left: 5px;line-height: 32px;"><span>{{displayName}}</span><i v-if="displayName"
          class="el-icon-error" @click="doRemove()" style="margin-left:10px;color: #F56C6C"></i></div>
      <div v-if="flagMultiple">
        <el-tag v-for="(selectedUser,index) in multipleSelection" :key="selectedUser.trueName" closable @close="handleClose(selectedUser,index)"
          type="" style="margin-left: 2px;line-height:32px;">
          {{selectedUser.trueName}}
        </el-tag>
      </div>
    </div>
    <el-dialog title="请选择人员" append-to-body :visible.sync="dialogTableVisible" id="selectUser" width="900px" @close="closeModal()">
      <el-row>
        <el-col :span="7">
          <el-scrollbar style="height:60%;overflow-y: auto">
            <el-tree :data="groups" node-key="id" :expand-on-click-node="false" @node-click="selectGroup" accordion
              :props="defaultProps">
            </el-tree>
          </el-scrollbar>
        </el-col>
        <el-col :span="17">
          <el-form :inline="true" :model="searchStr" size="mini" @submit.native.prevent>
            <el-form-item label="姓名">
              <el-input v-model="searchStr.trueName" placeholder="请输入姓名" size="mini " style="width:100px"></el-input>
            </el-form-item>
            <el-form-item label="工号">
              <el-input v-model="searchStr.jobNumber" placeholder="请输入工号" size="mini " style="width:100px"></el-input>
            </el-form-item>
            <el-form-item style="margin-top: 0px">
              <el-button type="primary" @click="getUser" icon="el-icon-search">查询</el-button>
            </el-form-item>
            <el-form-item style="margin-top: 0px">
              <el-button type="primary" @click="refresh" icon="el-icon-refresh">重置</el-button>
            </el-form-item>
          </el-form>
          <el-table :ref="multiple" :data="tableData" :highlight-current-row="true" :row-key="checkbox?'id':''" height="300"
            border @current-change="handleCurrentChange" @select="handleSelectionChange" @select-all="flagSelectAll"
            style="width: 100%">
            <el-table-column v-if="checkbox" type="selection" :reserve-selection="true" width="50">
            </el-table-column>
            <el-table-column prop="trueName" label="姓名" width="80">
            </el-table-column>
            <el-table-column prop="roleName" label="岗位" width="100">
            </el-table-column>
            <el-table-column prop="deptName" label="部门">
            </el-table-column>
          </el-table>
          <div class="pageContent" id="userPage">
            <el-pagination :model="pageData" background @current-change="handlePageChange" :current-page="pageData.currentPage"
              :page-size="pageData.pageSize" layout="total, prev, pager, next, jumper" :total="pageData.total">
            </el-pagination>
            <el-button type="primary" size="mini" class="orgaOk" style="margin-left:60px">确定</el-button>
          </div>
          <div class="modal-btn">
            <el-row :gutter="10">
              <el-form>
                <el-form-item class="modal-footer my-modal-footer">
                  <el-button type="primary" @click="selectConfirm()">确定</el-button>
                  <el-button @click="closeModal()">取消</el-button>
                </el-form-item>
              </el-form>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <div style="clear:both;"></div>
  </div>
</template>

<script>
  import Bus from '@/vuex/bus.js'
  import {getListById,queryUserDetailPage} from '@/api/system/user'
  import {getDepartTree} from '@/api/organization/department'
  export default {
    name: "users",
    props: {
      id: '',
      val: '',
      name: '',
      index: '',
      config: {}
    },
    created: function() {
      //初始化部门树，和用户列表
      this.inintData()
    },
     data() {
      return {
        indexs: this.index,
        vals: '',
        displayName: '',
        selectGroupId: '',
        configs: this.config,
        flagMultiple: false,
        ids: this.id,
        currentRow: null,
        groups: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        searchStr: {
          currentDeptId: null,
          currentDeptName: null,
          trueName: null,
          jobNumber: null
        },
        pageData: {
          pageSize: 10,
          pageNum: 1,
          total: 1,
          currentPage: 1,
        },
        userSelections: [],
        tableData: [],
        dialogTableVisible: false,
        multipleSelection: [],
        allSelections: [],
        userGroupName: '',
        flagCreate: false,
        allUsers: [],
        userGroupData: {},
        rules: {
          groupName: [{
            required: true,
            message: '请输入用户组名称',
            trigger: 'blur'
          }],
        },
        filterMethod(query, item) {
          return item.label.indexOf(query) > -1 || item.loginName.indexOf(query) > -1
        }
      }
    },
    watch: {
      val(newVal) {
        console.log(newVal,"WATCH")
        if (newVal != null && newVal != '') {
          console.log(newVal)
          let _this = this;
          getListById(newVal).then(
            function(res) {
              //处理成功结果
              if (_this.configs.multiple) {
                _this.multipleSelection = JSON.parse(JSON.stringify(res.data));
                _this.userSelections = JSON.parse(JSON.stringify(res.data));
              } else {
                _this.displayName = res.data[0].trueName;
              }
            }
          ).catch(function(error) {
            console.log(error);
            _this.multipleSelection = [];
            _this.userSelections = []
          });
        } else {
          this.multipleSelection = [];
          this.userSelections = []
        }
        this.inintData()
      },
      vals: function(newValue) {
        //每当str的值改变则发送事件update:word , 并且把值传过去
        console.log(newValue)
        this.$emit('update:val', newValue);
        if (this.ids) {
          Bus.$emit(this.ids, { //值改变时把该值和对应下标（明细表有，主表没有）传给其他组件
            index: this.indexs,
            value: newValue
          })
        }
      }
    },
    methods: {
      inintData() {
        this.multiple = this.configs.multiple ? 'multipleTable' : 'singleTable'; //是否为多选
        this.checkbox = this.configs.multiple ? true : false; //是否包含checkbox
        this.flagMultiple = this.configs.multiple ? true : false; //展示时是以多个还是单个人展示
        this.vals = this.val;
        console.log(this.vals)
        this.userSelections = [];
        this.init(); //获取用户分页
        this.initGroup();//初始化部门树
        if (this.val != null && this.val != '') { //若加载组件时有传入的值，则根据配置相应显示
          let _this = this;
          getListById(this.val).then(
            function(res) {
              //处理成功结果
              console.log(res.data)
              if (_this.configs.multiple) {
                res.data.forEach(user => {
                  user.id += '';
                })
                _this.multipleSelection = JSON.parse(JSON.stringify(res.data));
                _this.userSelections = JSON.parse(JSON.stringify(res.data));
              } else {
                _this.displayName = res.data[0].trueName;
              }
            }
          ).catch(function(error) {
            console.log(error);
            _this.userSelections = [];
            _this.multipleSelection = []
          });
        } else {
          this.userSelections = [];
          this.multipleSelection = []
        }
      },
      //获取用户分页
      init() {
        let _this = this; 
        const obj = {
          pageNum:this.pageData.pageNum,
          pageSize:this.pageData.pageSize
        }
        queryUserDetailPage(obj).then(
          function(res) {
            //处理成功结果
            let data = res.data;
            _this.pageData.total = parseInt(data.total);
            _this.tableData = data.list;
            console.log(_this.val,"_this.val")
            if (_this.val.length != 0) { //打开模态框如果有值，根据值回显数据
              if (_this.configs.multiple) { //如果是多选，先清空当前页所有选中项再根据值勾选上应选项
                if (_this.$refs.multipleTable) {
                  _this.$refs.multipleTable.clearSelection();
                }
                let vals = _this.val.split(',')
                vals.forEach(val => {
                  _this.tableData.forEach(row => {
                    if (row.id == val) {
                      if (_this.$refs.multipleTable) {
                        _this.$refs.multipleTable.toggleRowSelection(row, true);
                      }
                    }
                  })
                })
              } else { //单选情况下匹配选择项和当前页数据
                _this.tableData.forEach(row => {
                  if (row.id == _this.val) {
                    if (_this.$refs.singleTable) {
                      _this.$refs.singleTable.setCurrentRow(row);
                    }
                  }
                })
              }
            } else {
              if (_this.configs.multiple) {
                if (_this.$refs.multipleTable && !_this.userSelections.length) {
                  _this.$refs.multipleTable.clearSelection();
                }
              }
            }
          }
        ).catch(function(error) {
          console.log(error);
        });
      },
      initGroup() { //初始化部门
        let _this = this;
        getDepartTree().then(function(res) {
          // 处理成功的结果
          _this.groups = res.data;
        }).catch(function(error) {
          console.log(error);
        })
      },
      selectGroup(data) { //选择某一部门取该部门下人员
        this.searchStr.currentDeptId = data.id;
        this.searchStr.currentDeptName = data.deptName;
        this.pageData = {
          pageSize: 10,
          pageNum: 1,
          total: 1,
          currentPage: 1,
        };
        this.init();
      },
      getUser() { //查询人员
        this.pageData = {
          pageSize: 10,
          pageNum: 1,
          total: 1,
          currentPage: 1,
        };
        this.init()
      },
      //重置
      refresh() {
        this.searchStr = {
          currentDeptId: null,
          currentDeptName: null,
          trueName: null,
          jobNumber: null
        };
        this.pageData = {
          pageSize: 10,
          pageNum: 1,
          total: 1,
          currentPage: 1,
        };
        this.init();
      },
      handleCurrentChange(val) { //单选一行，封装到对象里
        this.currentRow = val;
      },
      handlePageChange(val) {
        this.pageData.pageNum = val;
        this.init();
      },
      handleSelectionChange(selection, row) { //多选点击时对已选择的数据进行增删操作                                          //多选多行，封装到数组里
        if (selection.indexOf(row) > -1) {
          this.userSelections.push(row)
        } else {
          this.userSelections.forEach((val, key) => {
            if (val.id == row.id) this.userSelections.splice(key, 1)
          })
        }
        console.log(this.userSelections)
        console.log(this.multipleSelection)
      },
      flagSelectAll(selection) {
        if (selection.length) {
          selection.forEach(row => {
            for (var i = 0; i < this.userSelections.length; i++) {
              if (row.id == this.userSelections[i].id) break
            }
            if (i == this.userSelections.length) this.userSelections.push(row)
          })
        } else {
          this.tableData.forEach(row => {
            for (var i = 0; i < this.userSelections.length; i++) {
              if (row.id == this.userSelections[i].id) {
                this.userSelections.splice(i, 1);
                break;
              }
            }
          })
        }
      },
      openModal() {
        this.dialogTableVisible = true;
        this.refresh();
        this.initGroup();
      },
      closeModal() {
        if (this.configs.multiple) {
          this.userSelections = JSON.parse(JSON.stringify(this.multipleSelection));
        }
        this.dialogTableVisible = false;
      },
      setMultiOutput() {
        var output = [];
        this.multipleSelection = JSON.parse(JSON.stringify(this.userSelections));
        this.multipleSelection.forEach(user => {
          output.push(user.id)
        })
        this.vals = output + '';
      },
      selectConfirm() {
        this.dialogTableVisible = false;
        if (this.configs.multiple) {
          this.setMultiOutput();
          console.log(this.multipleSelection)
          console.log(this.vals)
        } else {
          this.displayName = this.currentRow.trueName;
          this.vals = this.currentRow.id + '';
        }
      },
      handleClose(selectedUser, index) {
        this.multipleSelection.splice(index, 1);
        this.userSelections.splice(index, 1);
        this.setMultiOutput();
      },
      doRemove() {
        this.vals = '';
        this.displayName = '';
        this.currentRow = null;
      }
    }
  }
</script>

<style scoped>
  .add-usergroup {
    float: right;
    padding: 4px 8px;
    margin-right: 5px;
  }

  .edit-usergroup {
    float: right;
    padding: 2px 2px;
    margin-right: 5px;
  }

  .usergroup-name {
    line-height: 20px;
    color: #66B1FF;
  }

  .usergroup-name:hover {
    cursor: pointer;
  }

  .user-group-footer {
    margin-top: 20px;
    text-align: center;
  }

  .role-span {
    float: right;
    display: block;
    text-align: left;
    color: #8492a6;
    font-size: 13px;
    padding-left: 10px;
    width: 100px;
  }

  .dept-span {
    float: right;
    display: block;
    text-align: left;
    color: #8492a6;
    font-size: 13px;
    padding-left: 10px;
    padding-right: 15px;
    width: 150px;
  }
</style>

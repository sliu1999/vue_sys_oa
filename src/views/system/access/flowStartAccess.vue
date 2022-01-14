<template>
  <div>
    <div>
      <div style="display: flex;justify-content: flex-start;align-items: center;margin-bottom: 10px;">
        <h3 style="margin-right: 10px;">发起权限</h3>
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="addCat">新增</el-button>
      </div>
      <el-table :data="catAccessList" stripe border style="width: 100%" v-loading="catLoading">
        <!-- <el-table-column prop="id" label="id" width="120">
        </el-table-column> -->
        <el-table-column prop="name" label="权限组名称">
        </el-table-column>
        <el-table-column prop="typesForms" label="可见类别/模块" width="300">
          <template slot-scope="scope">
            <div v-for="item in scope.row.typesForms" style="border-bottom: 1px solid #ccc;margin-bottom: 5px;">
              <div>
                <strong>类别</strong>:<span v-if="item.typeName">{{item.typeName.join(",")}}</span>
              </div>
              <div>
                <strong>模块({{item.flag?'排除':'选入'}})</strong>:
                <span v-if="item.type">全部模块</span>
                <span v-if="!item.type">
                  <span v-for="val in item.formName">{{val}}&nbsp;&nbsp;</span>
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="authGroup.userNames" label="权限持有人">
          <template slot-scope="scope">
            <p v-if="!scope.row.authAll">{{scope.row.authGroup.userNames}}</p>
            <p v-if="scope.row.authAll">全体人员</p>
          </template>
        </el-table-column>
        <el-table-column prop="authGroup.groupIdNames" label="权限持有部门">
          <template slot-scope="scope">
            <p v-if="!scope.row.authAll">{{scope.row.authGroup.groupIdNames}}</p>
            <p v-if="scope.row.authAll">所有部门</p>
          </template>
        </el-table-column>
        <el-table-column prop="authGroup.roleNames" label="权限持有岗位">
          <template slot-scope="scope">
            <p v-if="!scope.row.authAll">{{scope.row.authGroup.roleNames}}</p>
            <p v-if="scope.row.authAll">所有岗位</p>
          </template>
        </el-table-column>
        <el-table-column prop="authGroup.groupRoleNames" label="权限持有部门岗位">
          <template slot-scope="scope">
            <p v-if="!scope.row.authAll" v-for="item in scope.row.authGroup.groupRoleNames">{{item.groupName}}&nbsp;&nbsp;{{item.roleName}}</p>
            <p v-if="scope.row.authAll">所有部门岗位</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="editCat(scope)" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="delCat(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 新增弹框 -->
    <el-dialog :title="title[titleIndex]" :visible.sync="dialogVisible" width="60%" style="padding: 0;" id="dialog-access">
      <div style="display: flex;justify-content: flex-start;align-items: flex-start;">
        <!-- 可见模块 -->
        <editMods :formData="formData"></editMods>
        <!-- 权限人员选择 -->
        <editPersons :formData="formData"></editPersons>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import AccessApi from "@/api/system/access";
  import editMods from '@/views/system/access/editMods'
  import editPersons from '@/views/system/access/editPersons'
  export default {
    created() {
      this.initStart()
    },
     components: {
      editMods,
      editPersons,
    },
    data() {
      return {
        titleIndex: 0, //控制权限编辑弹出框标题
        catLoading: true,
        catRepLoading: true,
        hisLoading: true,
        title: ["新增类别发起权限", "编辑类别发起权限"],
        dialogVisible: false, //控制权限编辑弹出框
        formData: {},
        apiIndex: -1, //确认调用新增接口还是编辑接口
        catAccessList: [], //发起权限列表
      };
    },
    methods: {
      initStart() {
        let _this = this
        AccessApi.getStartAccessList().then(res => {
          console.log(res)
          if (res.errorCode == 0) {
            _this.catLoading = false
            let catAccessList = res.data
            if (catAccessList) {
              catAccessList.forEach(res => {
                if (typeof JSON.parse(res.authGroup) == "object") {
                  res.authGroup = JSON.parse(res.authGroup)
                  if (res.authGroup.userNames) {
                    res.authGroup.userNames = res.authGroup.userNames.join(",")
                  }
                  if (res.authGroup.groupIdNames) {
                    res.authGroup.groupIdNames = res.authGroup.groupIdNames.join(",")
                  }
                  if (res.authGroup.roleNames) {
                    res.authGroup.roleNames = res.authGroup.roleNames.join(",")
                  }
                }
                if (res.authGroup.groupRoleIds) {
                  res.authGroup.groupRoleIds.forEach(res => {
                    if (typeof res.groupId == "string") {
                      if (res.groupId == '') {
                        res.groupId = []
                      } else {
                        res.groupId = res.groupId.split(",")
                      }
                    }
                  })
                }
                if (typeof JSON.parse(res.typesForms) == "object") {
                  res.typesForms = JSON.parse(res.typesForms)
                }
                res.typesForms.forEach(res => {
                  if (typeof res.typeIds == "object") {
                    res.typeIds = res.typeIds.join(",")
                    res.typeIds = Number(res.typeIds)
                  }
                })
                if (typeof res.authAll == "string") {
                  if (res.authAll == "0") {
                    res.authAll = false
                  } else {
                    res.authAll = true
                    res.authGroup = {
                      userIds: [],
                      groupIds: [],
                      roleIds: [],
                      groupRoleIds: [{
                        groupId: [],
                        roleId: ""
                      }]
                    }
                  }
                }
                res.typesForms.forEach(item => {
                  if (item.type == "1") {
                    item.type = true
                  } else {
                    item.type = false
                  }
                })
                res.typesForms.forEach(item => {
                  if (item.flag == "1") {
                    item.flag = true
                  } else {
                    item.flag = false
                  }
                })
              })
            }
            this.catAccessList = catAccessList
            console.log(this.catAccessList)
          }
        })
      },
     
      addCat() { //新增发起权限
        this.dialogVisible = true
        this.titleIndex = 0
        this.formData = JSON.parse(JSON.stringify({
          formId: null,
          name: "",
          typesForms: [],
          authAll: false,
          authGroup: {
            userIds: [],
            groupIds: [],
            roleIds: [],
            groupRoleIds: [{
              groupId: [],
              roleId: ""
            }]
          }
        }))
        console.log(this.formData)
        this.apiIndex = 0
      },
      editCat(scope) { //编辑发起权限
        let _this = this
        AccessApi.getStartAccess(scope.row.id).then(res => {
          console.log(res)
          if (res.errorCode == 0) {
            let formData = res.data
            if (typeof JSON.parse(formData.authGroup) == "object") {
              formData.authGroup = JSON.parse(formData.authGroup)
            }
            if (formData.authGroup.groupRoleIds) {
              formData.authGroup.groupRoleIds.forEach(item => {
                if (typeof item.groupId == "string") {
                  if (item.groupId == '') {
                    item.groupId = []
                  } else {
                    item.groupId = item.groupId.split(",")
                  }
                }
              })
            }
            if (typeof JSON.parse(formData.typesForms) == "object") {
              formData.typesForms = JSON.parse(formData.typesForms)
            }
            formData.typesForms.forEach(item => {
              if (typeof item.typeIds == "object") {
                item.typeIds = item.typeIds.join(",")
                item.typeIds = Number(item.typeIds)
              }
            })
            if (typeof formData.authAll == "string") {
              if (formData.authAll == "0") {
                formData.authAll = false
              } else {
                formData.authAll = true
                formData.authGroup = {
                  userIds: [],
                  groupIds: [],
                  roleIds: [],
                  groupRoleIds: [{
                    groupId: [],
                    roleId: ""
                  }]
                }
              }
            }
            formData.typesForms.forEach(item => {
              if (item.type == "1") {
                item.type = true
              } else {
                item.type = false
              }
            })
            formData.typesForms.forEach(item => {
              if (item.flag == "1") {
                item.flag = true
              } else {
                item.flag = false
              }
            })
            if (formData.authGroup.groupRoleIds.length == 0) {
              formData.authGroup.groupRoleIds.push({
                groupId: [],
                roleId: ""
              })
            }
            console.log(formData)
            this.formData = formData
            this.dialogVisible = true
            this.titleIndex = 1
            this.apiIndex = 1
          } else {
            _this.$message({
              duration: 2000,
              message: res.msg,
              type: 'error'
            });
          }
        })
      },
      delCat(row) { //删除发起权限
        let _this = this
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          AccessApi.delStartAccess(row.id).then(res => {
            console.log(res)
            if (res.errorCode == 0) {
              _this.$message({
                duration: 2000,
                message: "删除成功",
                type: 'success'
              });
              _this.initStart()
            } else {
              _this.$message({
                duration: 2000,
                message: "删除失败",
                type: 'error'
              });
            }
          })
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
       confirm() { //确认权限设置
        let _this = this
        let isOk = false
        let formData = JSON.parse(JSON.stringify(this.formData))
        formData.authGroup.groupRoleIds.forEach((res, i) => {
          if (typeof res.groupId != "string") {
            res.groupId = res.groupId.join("")
            if (res.groupId == "" && res.roleId == "") {
              formData.authGroup.groupRoleIds.splice(i, 1)
              isOk = true
            } else if (res.groupId == "" || res.roleId == "") {
              _this.$message({
                message: '特权部门岗位中部门或岗位不可为空',
                type: 'warning'
              });
            } else {
              isOk = true
            }
          }
        })
        console.log(isOk)
        if (isOk) {
          formData.typesForms.forEach(res => {
            if (typeof res.typeIds != "object") {
              res.typeIds = res.typeIds.toString()
              res.typeIds = res.typeIds.split(",")
            }
          })
          formData.typesForms.forEach(res => {
            if (res.formIds) {
              res.formIds.forEach(item => {
                item = item.toString()
              })
            }
          })
          formData.typesForms.forEach(res => {
            if (res.type) {
              res.type = "1"
            } else {
              res.type = "0"
            }
          })
          formData.typesForms.forEach(res => {
            if (res.flag) {
              res.flag = "1"
            } else {
              res.flag = "0"
            }
          })
          if (formData.typesForms) {
            formData.typesForms.forEach((item, ind) => {
              if (item.typeIds == null) {
                formData.typesForms.splice(ind, 1)
              }
            })
          }
          if (typeof formData.authAll == "boolean") {
            if (formData.authAll == true) {
              formData.authAll = "1"
              formData.authGroup = {}
            } else {
              formData.authAll = "0"
            }
          }
          if (formData.authGroup.userIds == "") {
            formData.authGroup.userIds = []
          } else {
            if (typeof formData.authGroup.userIds == "string") {
              formData.authGroup.userIds = formData.authGroup.userIds.split(",")
            }
          }
          if (typeof formData.authGroup != "string") {
            formData.authGroup = JSON.stringify(formData.authGroup)
          }
          if (typeof formData.typesForms != "string") {
            formData.typesForms = JSON.stringify(formData.typesForms)
          }
          console.log(formData)
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          if (this.apiIndex == 0) {
            AccessApi.addStartAccess(formData).then(res => {
              console.log(res)
              if (res.errorCode == 0) {
                loading.close();
                _this.$message({
                  duration: 2000,
                  message: res.msg,
                  type: 'success'
                });
                _this.dialogVisible = false
                _this.initStart()
              } else {
                loading.close();
                _this.$message({
                  duration: 2000,
                  message: res.msg,
                  type: 'error'
                });
                _this.dialogVisible = false
              }
            })
          } else if (this.apiIndex == 1) {
            AccessApi.editStartAccess(formData).then(res => {
              console.log(res)
              if (res.errorCode == 0) {
                loading.close();
                _this.$message({
                  duration: 2000,
                  message: res.msg,
                  type: 'success'
                });
                _this.dialogVisible = false
                _this.initStart()
              } else {
                loading.close();
                _this.$message({
                  duration: 2000,
                  message: res.msg,
                  type: 'error'
                });
                _this.dialogVisible = false
              }
            })
          } 
        }
      }

    }
  }
</script>

<style>
  #dialog-access .el-dialog__body {
    padding: 0 !important;
  }
</style>

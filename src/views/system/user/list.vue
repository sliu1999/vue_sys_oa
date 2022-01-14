<template>
  <div style="margin-left:10px">
    <el-row style="margin-top:10px">
      <el-col :span="6">
        <el-row>
          <div class="demo-input-suffix">
            <label style="color:#909399;font-size: 16px;line-height: 1.5; margin-left:20px;margin-right:10px;font-family:Arial;font-weight:normal" >角色:</label>
            <el-select v-model="searchCondition.roleId" clearable  placeholder="请选择" @change="search()">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </el-row> 
      </el-col>
      <el-col :span="6">
        <el-row>
          <div class="demo-input-suffix">
            <label style="color:#909399;font-size: 16px;line-height: 1.5;margin-right:10px;font-family:Arial;font-weight:normal" >账号:</label>
            <el-input
              style="width:200px"
              placeholder="请输入账号"
              prefix-icon="el-icon-search"
              v-model="searchCondition.loginId"
              @change="search()">
            </el-input>
          </div>
        </el-row>
      </el-col>
      <el-col :span="6"><div class="grid-content"></div></el-col>
      <el-col :span="6"><div class="grid-content"></div></el-col>
    </el-row>
    <el-row class="demo-form-inline">
      <el-col :span="12">
        <el-row style="display: flex;justify-content: flex-start;"  class="right_icon">
          <el-button type="primary" @click="add()" >
            <i style="margin-right:5px" class="el-icon-plus" />新增用户
          </el-button>
          <el-button type="primary" @click="batchDel()" >
            <i style="margin-right:5px" class="el-icon-delete" />批量删除
          </el-button>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row style="display: flex;justify-content: flex-end;">

        </el-row>
      </el-col>
    </el-row>

      <el-table
      v-loading="loading"
      :data="pageData.list"
      style="width: 100%"
      :header-cell-style="{ background: '#f7f7f7', color: '#666' }"
      @selection-change="handleSelectionChange">
      <el-table-column
      type="selection"
      width="55">
      </el-table-column>
      <el-table-column
        prop="loginId"
        label="账号"
        style="width: 20%">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
        style="width: 20%">
      </el-table-column>
      <el-table-column
        prop="roleNames"
        label="角色"
        align="center"
        style="width: 20%">
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" style="width: 40%">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="resetPassword(scope.row.id)">重置密码</el-button>
          <el-button type="text" size="mini" @click="edit(scope.row.id)">编辑</el-button>
          <el-button type="text" size="mini" @click="del(scope.row.id)" >删除</el-button>
          <!-- <el-button type="text" size="mini" @click="detail(scope.row.id)" >详情</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="bottom center-text">
      <el-pagination
      :v-model="pageData"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageData.current"
      :page-sizes="[10]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageData.total">
    </el-pagination>
    </div>

    <!-- 重置密码弹窗 -->
    <el-dialog width="400px" title="修改密码" :visible.sync="mimadialog" append-to-body :close-on-click-modal="false">
      <el-form ref="ruleForm4" :model="ruleForm4" class="demo-ruleForm padding20" :rules="rule4">
        <el-form-item label="新密码" prop="password">
          <el-input v-model="ruleForm4.password" type="password" />
        </el-form-item>
        <el-form-item style="width:100%;text-align:center" class="bottomBtn">
          <el-button type="primary" style="background: #25BE88;border-color: #25BE88;" @click="surePassword()">确认修改</el-button>
          <el-button @click="cancelEditPassword">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <UserAdd ref="addDialog" :role-list="roleList"></UserAdd>
    <UserEdit ref="editDialog" :role-list="roleList"></UserEdit>
    <router-view></router-view>
  </div>
</template>



<script>
import { getUserPageList, delUserById, changeOtherPsd } from '@/api/system/user'
import { getUserInfoSession } from '@/utils/auth'
import UserAdd from '@/views/system/user/add'
import UserEdit from '@/views/system/user/edit'
import { getAllRole } from '@/api/system/role'
export default {
  name: 'UserList',
  components: {
    UserAdd,
    UserEdit
  },
  data() {
    return {
      loading: false,
      mimadialog: false,
      ids: '',
      searchCondition: {
        roleId: '',
        loginId: ''
      },
      pageData: {
        list: [],
        current: 1,
        pages: 0,
        total: 0
      },
      ruleForm4: {
        id: '',
        password: '',
        loginId: ''
      },
      rule4: {
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      },
      roleList: null
    }
  },
  created: function() {
    this.init()
  },
  methods: {
    //列表初始化
    init(){
      this.getRoleList()
      this.getUserList()
    },
    //获取用户列表
    getUserList(){
      this.loading = true
      console.log(this.pageData.current, "当前页")
      const obj = {
        pageNum: this.pageData.current,
        pageSize: 10,
        loginId: this.searchCondition.loginId,
        roleId: this.searchCondition.roleId
      }
      getUserPageList(obj)
        .then(response => {
          this.pageData.list = []
          this.pageData.total = response.data.total
          this.pageData.pages = response.data.pages
          this.pageData.current = response.data.prePage + 1
          this.pageData.list = response.data.list
          this.loading = false
        })
        .catch(function(error){
          this.loading = false
        })
    },
    //搜索方法
    search(){
      this.pageData.current = 1
      this.init()
    },
    //修改列表每页显示数量
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    //修改列表当前页是第几页
    handleCurrentChange(val) {
      this.pageData.current = val
      this.init()
    },
    //修改密码
    resetPassword(id){
      this.mimadialog = true
      this.ruleForm4.id = id
      this.ruleForm4.loginId = JSON.parse(getUserInfoSession()).username
    },
    cancelEditPassword(){
      this.mimadialog = false
      this.ruleForm4.id = ""
      this.ruleForm4.password = ""
      this.ruleForm4.loginId = ""
    },
    //修改密码提交
    surePassword() {
      if (!this.ruleForm4.password) {
        this.$message({
          type: 'error',
          message: '密码不能为空!'
        })
      } else {
        this.$refs['ruleForm4'].validate(valid => {
          if (valid) {
            const obj = {
              id: this.ruleForm4.id,
              password: this.ruleForm4.password,
              loginId: this.ruleForm4.loginId
            }
            changeOtherPsd(obj)
              .then(response => {
                if (response.errorCode === 0) {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                  this.mimadialog = false
                } else {
                  this.$message({
                    type: 'error',
                    message: '修改失败，请重试!\r\n' + response.msg
                  })
                }
              })
              .catch(err => {
                console.log(err, "修改密码出错")
              })
          } else {
            return false
          }
        })
      }
    },
    add() {
        this.$refs.addDialog.openDialog('700px')
    },
    //获取角色列表
    getRoleList(){
      this.roleList = null
        //角色下拉框初始化
        getAllRole()
        .then( res => {
            this.roleList = res.data
        }).catch( err => {
            console.log(err, "获取角色下拉出错")
        })
    },
    edit(id) {
      this.roleList = null
      //角色下拉框初始化
        getAllRole()
        .then( res => {
            this.roleList = res.data
        }).catch( err => {
            console.log(err, "获取角色下拉出错")
        })
        this.$refs.editDialog.openDialog(id, '700px')
    },
    //删除用户
    del(id){
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then( () => {
        delUserById(id)
        .then(res => {
          if (res.errorCode === 0) {
            this.$message({
              info: 'success',
              message: '删除成功'
            })
            this.init()
          }
        })
        .catch( err => {
          console.log(err, "删除用户出错")
        })
      })
      .catch( () => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      
    },
    handleSelectionChange(val) {
        this.ids = []
        val.forEach(item => {
          this.ids.push(item.id)
        })
        console.log(this.ids, "选中的数据")
    },
    //批量删除
    batchDel(){
      this.$message({ type: 'info', message: '暂无此接口' })
    },
    //用户详情
    detail(id){
      this.$router.push({
        path: '/system/user/detail',
        query: {
          userId: id,
        }
      })
    },
  }
}
</script>

<style>
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .el-table .warning-row {
    background: oldlace;
  }
  .demo-form-inline {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 10px 0;
  }
  .bottom {
    width: 100%;
    margin-top: 15px;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

<template>
  <div style="margin-left:10px">
    <el-row style="margin-top:10px">
      <el-col :span="6">
       <el-row>
          <div class="demo-input-suffix">
            <label style="color:#909399;font-size: 16px;line-height: 1.5;margin-left:20px;margin-right:10px;font-family:Arial;font-weight:normal" >搜索:</label>
            <el-input
              style="width:200px"
              placeholder="请输入工号/姓名/电话"
              prefix-icon="el-icon-search"
              v-model="searchCondition.staffName"
              @change="search()">
            </el-input>
          </div>
        </el-row>
      </el-col>
      <el-col :span="6">
      </el-col>
      <el-col :span="6"><div class="grid-content"></div></el-col>
      <el-col :span="6"><div class="grid-content"></div></el-col>
    </el-row>
    <el-row class="demo-form-inline">
      <el-col :span="12">
        <el-row style="display: flex;justify-content: flex-start;"  class="right_icon">
          <el-button type="primary" @click="add()" >
            <i style="margin-right:5px" class="el-icon-plus" />新增
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
      :header-cell-style="{ background: '#f7f7f7', color: '#666' }">
      <el-table-column
        prop="name"
        label="姓名"
        style="width: 20%">
      </el-table-column>
      <el-table-column
        prop="loginId"
        label="账号"
        align="center"
        style="width: 15%">
      </el-table-column>
      <el-table-column
        prop="departmentNames"
        label="部门"
        align="center"
        style="width: 15%">
      </el-table-column>
      <el-table-column
        prop="staffNo"
        label="工号"
        align="center"
        style="width: 20%">
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" style="width: 30%">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="edit(scope.row.id)">编辑</el-button>
          <el-button type="text" size="mini" @click="del(scope.row.id)" >删除</el-button>
          <el-button type="text" size="mini" @click="detail(scope.row.id)" >详情</el-button>
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
    <StaffAdd ref="staffAddDialog"></StaffAdd>
    <StaffEdit ref="staffEditDialog"></StaffEdit>
    <router-view></router-view>
  </div>
</template>

<script>
import { getStaffsPage, delStaffById } from '@/api/organization/staffs'
import StaffAdd from '@/views/organization/staff/add'
import StaffEdit from '@/views/organization/staff/edit'
export default {
  name: 'StaffList',
  components: {
    StaffAdd,
    StaffEdit
  },
  data() {
    return {
      loading: false,
      searchCondition: {
        staffName: ''
      },
      pageData: {
        list: [],
        current: 1,
        pages: 0,
        total: 0
      }
    }
  },
  created: function() {
    this.init()
  },
  methods: {
    //列表初始化
    init(){
      this.getStaffPageList()
    },
    //获取角色列表
    getStaffPageList(){
      this.loading = true
      const obj = {
        pageNum: this.pageData.current,
        pageSize: 10,
        keyword: this.searchCondition.staffName
      }
      getStaffsPage(obj)
        .then(res => {
          this.pageData.list = []
          this.pageData.total = res.data.total
          this.pageData.pages = res.data.pages
          this.pageData.current = res.data.prePage + 1
          this.pageData.list = res.data.list
          this.loading = false
        })
        .catch(err => {
          this.loading = false
          console.log(err, "获取列表接口出错")
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
    add() {
        this.$refs.staffAddDialog.openDialog('700px')
    },
    edit(id) {
        this.$refs.staffEditDialog.openDialog(id, '700px')
    },
    //删除用户
    del(id){
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then( () => {
        delStaffById(id)
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
    //用户详情
    detail(id){
      this.$router.push({
        path: '/organization/staff/detail',
        query: {
          staffId: id
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


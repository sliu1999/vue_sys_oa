<template>
    <div>
        <el-container>
            <el-header>Header</el-header>
            <el-container>
                <el-aside width="450px">
                    <el-row>
                        <el-col :span="21">
                            <el-input
                                placeholder="部门名称"
                                v-model="filterText" suffix-icon="el-icon-search">
                            </el-input>
                            </el-col>
                        <el-col :span="3">
                            <span>
                                <el-button size="mini" @click="() => appendParent()" type="primary" icon="el-icon-plus" circle>
                                </el-button>
                            </span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-tree :data="departTree" node-key="id" :expand-on-click-node="false" :props="{ children: 'children', label: 'label' }"
                        @node-click="handleNodeClick"
                        :filter-node-method="filterNode"
                        ref="tree" highlight-current :default-expanded-keys="defaultExpanded" empty-text="暂无数据">
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                                <span>{{ node.label }}</span>
                                <span>
                                    <el-button size="mini" @click.stop="() => append(data)" icon="el-icon-plus" circle>
                                    </el-button>
                                    <el-button size="mini" @click.stop="remove(node, data)" icon="el-icon-delete" circle>
                                    </el-button>
                                </span>
                            </span>
                        </el-tree>  
                    </el-row>  
                </el-aside>
                <el-main>
                    <div>
                        <el-form ref="departmentInfo" :model="departmentInfo" :rules="rules" label-width="80px">
                        <el-form-item label="部门名称" prop="name">
                            <el-input v-model="departmentInfo.name"></el-input>
                        </el-form-item>
                        <el-form-item label="上级部门" prop="parentId">
                            <el-select v-model="departmentInfo.parentId" clearable  placeholder="请选择上级部门">
                            <el-option
                                v-for="item in departParentList"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id">
                            </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="部门负责人" prop="leader">
                           <el-select v-model="departmentInfo.leader" filterable clearable  placeholder="请选择部门负责人">
                            <el-option
                                v-for="item in leaderList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="排序" prop="sort">
                            <el-input type="number" v-model="departmentInfo.sort"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input  v-model="departmentInfo.remark"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">保存</el-button>
                        </el-form-item>
                        </el-form>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import { getDepartTree, saveDepart, queryDepartInfo, deleteDepartInfo, getDepartListExceptMe } from '@/api/organization/department'
import { getStaffsList } from '@/api/organization/staffs'
export default {
    name: 'Department',
    components: {},
    data() {
        return {
            filterText:'',
            departTree: null,
            departParentList: null,
            leaderList: null,
            defaultExpanded: [],
            departmentInfo: {
                id: null,
                name: '',
                parentId: '',
                remark: '',
                sort: '',
                leader: ''
            },
            parentList:null,
            rules: {
                name: [
                    { required: true, message: '请输入部门名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ]
            },
            lastTreeKey:''
        }
    },
    created: function(){
        this.init()
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
        init(){
            this.getdepartTreeApi()       
        },
        //获取菜单树
        getdepartTreeApi(){
            this.departTree = null;
            this.lastTreeKey = null;
            getDepartTree()
                .then(res => {
                    if(res.data != null && res.data.length > 0){
                        this.departTree = res.data
                        this.lastTreeKey = res.data[res.data.length-1].id
                        this.getdepartmentInfo(res.data[0].id)
                        this.defaultExpanded.push(res.data[0].id)
                    }   
                })
                .catch(err => {

                });
        },
        getDepartStaffs(){
            if(this.departmentInfo.id != null && this.departmentInfo.id != undefined){
                getStaffsList({departmentId: this.departmentInfo.id})
                .then(res => {
                    this.leaderList = res.data
                })
            }else{
                this.$message({
                    type: 'error',
                    message: '请选择要查看的部门'
                })
            }
        },
        getParentTree(){
            if(this.departmentInfo.id != null && this.departmentInfo.id != undefined){
                getDepartListExceptMe({departId: this.departmentInfo.id})
                .then(res => {
                    this.departParentList = res.data
                })
            }else{
                this.$message({
                    type: 'error',
                    message: '请选择要查看的部门'
                })
            }
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        getdepartmentInfo(id){
            queryDepartInfo(id)
                .then(response => {
                    this.departmentInfo = response.data
                    this.getParentTree()   
                    this.getDepartStaffs()
                })
                .catch(error => {

                })
        },
        //在最后一个一级菜单后加一个一级菜单
        appendParent(){
             const after = {
                name: '部门',
                remark: '一级部门'
            }
            saveDepart(after)
                .then(res => {
                    const newAfter = { id: res.data.id, label: res.data.name, children: [] };
                    if (this.lastTreeKey != null && this.lastTreeKey != undefined) {
                        this.$refs.tree.insertAfter(newAfter,this.lastTreeKey)
                        //获取菜单详情
                        this.getdepartmentInfo(res.data.id)
                        //设置新增的菜单为选中菜单
                        this.$refs.tree.setCurrentKey(res.data.id)
                        //设置新增的菜单为最新的菜单
                        this.lastTreeKey = res.data.id
                        this.$message({
                            type: 'success',
                            message: '一级部门创建完成'
                        })
                    }else{
                        //新增第一个父级菜单
                        this.init()
                    }
                    
                })
                .catch(err => {

                })
        },
        //给一级菜单新增子菜单
        append(data) {
            const child = {
                parentId: data.id,
                name: '子部门',
                remark: '子部门'
            }
            saveDepart(child)
                .then(res => {
                    const newChild = { id: res.data.id, label: res.data.name, parentId: data.id, children: [] };
                    if (!data.children) {
                    this.$set(data, 'children', []);
                    }
                    data.children.push(newChild);

                    //获取菜单详情
                    this.getdepartmentInfo(res.data.id)
                    //设置新增的菜单为选中菜单
                    this.$refs.tree.setCurrentKey(res.data.id)
                    this.$message({
                        type: 'success',
                        message: '子菜单创建完成'
                    })
                })
                .catch(err => {

                })
        },
        remove(node, data) {
            if(data.children != null && data.children.length > 0){
                this.$message({
                    type: 'info',
                    message: '请先删除子部门'
                })
                return;
            }
            console.log(data.id, "id")
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
            deleteDepartInfo(data.id)
                .then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                })
        },
        handleNodeClick(data) {
            this.getdepartmentInfo(data.id)
        },
        //选择父级部门
        handleNodeClickTwo(data) {
            
        },
        onSubmit() {
            saveDepart(this.departmentInfo)
                .then(res => {
                    this.$message({
                        type: 'success',
                        message: '部门信息更新成功'
                    })
                    this.init()
                })
                .catch(err => {

                })
        }
    }
}
</script>

<style>
 .headdiv {
     height: 100px;
     line-height: 100px;
 }
 .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 80px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
    min-height: 642px;
    width: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  .el-tree-node__label {
    line-height: 40px;
    height: 40px;
    letter-spacing: 1px;
  }
 .custom-tree-node {
    line-height: 40px;
    height: 40px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    margin: 2px;
  }
 /* .el-tree-node.is-current > .el-tree-node__content {
  background: #f0f4ff;
  color: #3c77fe;
  font-weight: bold;
} */

 

</style>
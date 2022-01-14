<template>
    <div>
        <el-container>
            <el-header>Header</el-header>
            <el-container>
                <el-aside width="450px">
                    <el-row>
                        <el-col :span="21">
                            <el-input
                                placeholder="菜单名称"
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
                        <el-tree :data="menuTree" node-key="id" :expand-on-click-node="false" :props="{ children: 'children', label: 'label' }"
                        @node-click="handleNodeClick"
                        :filter-node-method="filterNode"
                        ref="tree" highlight-current :default-expanded-keys="defaultExpanded">
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                                <span>{{ node.label }}</span>
                                <span>
                                <el-button
                                    v-if="data.parentId == null"
                                    size="mini"
                                    @click.stop="() => append(data)" icon="el-icon-plus" circle>
                                </el-button>
                                <el-button
                                    size="mini"
                                    @click.stop="remove(node, data)" icon="el-icon-delete" circle>
                                </el-button>
                                </span>
                            </span>
                        </el-tree>  
                    </el-row>  
                </el-aside>
                <el-main>
                    <div>
                        <el-form ref="menuInfo" :model="menuInfo" :rules="rules" label-width="80px">
                        <el-form-item label="菜单名称" prop="name">
                            <el-input v-model="menuInfo.name"></el-input>
                        </el-form-item>
                        <el-form-item label="路由地址" prop="action">
                            <el-input  v-model="menuInfo.action"></el-input>
                        </el-form-item>
                        <el-form-item label="父级菜单">
                            <el-select v-model="menuInfo.parentId" clearable :disabled="menuInfo.parentId==null" placeholder="请选择父级菜单">
                            <el-option
                                v-for="item in parentList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="菜单类型" prop="menuType">
                            <el-radio-group v-model="menuInfo.menuType">
                                <el-radio :label="0">菜单</el-radio>
                                <el-radio :label="1">子路由</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="排序" prop="sort">
                            <el-input type="number" v-model="menuInfo.sort"></el-input>
                        </el-form-item>
                        <el-form-item label="样式" prop="style">
                            <el-input  v-model="menuInfo.style"></el-input>
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
import { getMenuTree, saveMenu, queryAllStairMenu, queryMenuInfo, deleteMenuInfo } from '@/api/system/menu'
export default {
    name: 'Menu',
    components: {},
    data() {
        return {
            filterText:'',
            menuTree: null,
            defaultExpanded: [],
            menuInfo: {
                id: null,
                name: '',
                action: '',
                menuType: '',
                sort: '',
                style: ''
            },
            parentList:null,
            rules: {
                name: [
                    { required: true, message: '请输入菜单名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                action: [
                    { required: true, message: '菜单路由', trigger: 'blur' },
                ],
                sort: [
                    { pattern: /^[0-9]*$/, message: '请输入数字', trigger: 'blur' }
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
    mounted() {
      this.$nextTick(function(){
        this.$refs['tree'].setCurrentKey("10")
      })
    },
    methods: {
        init(){
            this.getMenuTreeApi()
            this.getParentMenuList()
            
        },
        //获取菜单树
        getMenuTreeApi(){
            this.menuTree = null;
            this.lastTreeKey = null;
            getMenuTree()
                .then(res => {
                    this.menuTree = res.data
                    console.log(res.data[0].id, "默认选中的菜单")
                    this.lastTreeKey = res.data[res.data.length-1].id
                    this.getMenuInfo(res.data[0].id)
                    this.defaultExpanded.push(res.data[0].id)
                })
                .catch(err => {

                });
            
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        getMenuInfo(id){
            queryMenuInfo(id)
                .then(response => {
                    this.menuInfo = response.data
                })
                .catch(error => {

                })
        },
        getParentMenuList(){
            queryAllStairMenu()
                .then(res => {
                    this.parentList = res.data
                })
                .catch(err => {

                })
        },
        //在最后一个一级菜单后加一个一级菜单
        appendParent(){
             const after = {
                name: '菜单',
                menuType: 0
            }
            saveMenu(after)
                .then(res => {
                    const newAfter = { id: res.data.id, label: res.data.name, children: [] };
                    if (this.lastTreeKey != null && this.lastTreeKey != undefined) {
                        this.$refs.tree.insertAfter(newAfter,this.lastTreeKey)
                        //获取菜单详情
                        this.getMenuInfo(res.data.id)
                        //设置新增的菜单为选中菜单
                        this.$refs.tree.setCurrentKey(res.data.id)
                        //设置新增的菜单为最新的菜单
                        this.lastTreeKey = res.data.id
                        this.$message({
                            type: 'success',
                            message: '一级菜单创建完成'
                        })
                        this.parentList.push({id:res.data.id, name:'菜单'})
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
                name: '子菜单',
                menuType: 0
            }
            saveMenu(child)
                .then(res => {
                    const newChild = { id: res.data.id, label: res.data.name, parentId: data.id, children: [] };
                    if (!data.children) {
                    this.$set(data, 'children', []);
                    }
                    data.children.push(newChild);

                    //获取菜单详情
                    this.getMenuInfo(res.data.id)
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
            console.log(data, "要删除的菜单")
            if(data.children != null && data.children.length > 0){
                this.$message({
                    type: 'info',
                    message: '请先删除子菜单'
                })
                return;
            }
            console.log(data.id, "id")
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
            deleteMenuInfo(data.id)
                .then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                })
        },
        handleNodeClick(data) {
            this.getMenuInfo(data.id)
        },
        onSubmit() {
            saveMenu(this.menuInfo)
                .then(res => {
                    this.$message({
                        type: 'success',
                        message: '菜单信息更新成功'
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
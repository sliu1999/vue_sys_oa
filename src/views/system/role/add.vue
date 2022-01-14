<template>
    <div>
        <el-dialog :visible.sync="addRoleModel" @close="closeDialog()" :close-on-click-modal="false" :modal-append-to-body="false" title="新增角色" :width="width">
            <el-form :model="addRoleInfo" :rules="rules" ref="addRoleInfo" label-position="top" class="demo-ruleForm padding20">
                <el-divider content-position="left">角色信息</el-divider>
                 <el-form-item label="用户名" prop="name">
                    <el-input placeholder="请输入角色名" v-model="addRoleInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="addRoleInfo.remark" placeholder="备注"></el-input>
                </el-form-item>
                <el-form-item label="菜单权限">
                    <div class="scrollDiv">
                        <el-tree :data="menuTree" show-checkbox node-key="id" ref="tree" :check-strictly="false"
                         :props="{ children: 'children', label: 'label' }"
                         @check-change="handleCheckChange"
                         @node-click="handleNodeClick">
                        </el-tree>
                    </div>
                </el-form-item>
                <el-form-item class="modal-footer">
                    <div class="modal-btn">
                        <el-button type="primary" style="background: #25BE88;border-color: #25BE88;" @click="save()">提交</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<style>
.scrollDiv {
    overflow: hidden;
    overflow-y: auto;
    height: 300px;
}
</style>
<script>
import { saveRole } from '@/api/system/role'
import { getMenuTree } from '@/api/system/menu'

export default {
    name: "RoleAdd",
    data () {
        return {
            menuTree: null,
            addRoleModel: false,
            width: null,
            addRoleInfo: {
                name: '',
                remark: '',
                menuIds: []
            },
            rules: {
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    created: function(){
        this.init()
    },
    methods: {
        init(){
            this.getMenuTree()
        },
        //获取菜单树
        getMenuTree(){
            getMenuTree()
                .then(res => {
                    this.menuTree = res.data
                })
                .catch(err => {

                })
        },
        //勾选框改变触发的方法
        handleCheckChange(data, checked, indeterminate) {
            //console.log(data,checked,indeterminate)
            this.addRoleInfo.menuIds = []
            const checkKeys = this.$refs.tree.getCheckedKeys()
            checkKeys.forEach(element => {
                if(this.addRoleInfo.menuIds.indexOf(element) == -1){
                    this.addRoleInfo.menuIds.push(element)
                }
            });
            const halfCheckParentKeys = this.$refs.tree.getHalfCheckedKeys()
            halfCheckParentKeys.forEach(element => {
                if(this.addRoleInfo.menuIds.indexOf(element) == -1){
                    this.addRoleInfo.menuIds.push(element)
                }
            });
            console.log(this.addRoleInfo.menuIds);
        },
        //点击文字触发的方法
        handleNodeClick(data) {
            
        },
        //保存角色
        save(){
            this.$refs['addRoleInfo'].validate( valid => {
                if(valid){
                    saveRole(this.addRoleInfo)
                        .then(res => {
                            this.closeDialog()
                            this.$parent.init()
                            this.addRoleModel = false
                            this.$message({ type: 'success', message: '保存成功!' })
                            this.$refs['addRoleInfo'].resetFields()
                            this.$refs.tree.setCheckedKeys([]);
                        })
                        .catch(err => {
                            this.$message({ type: 'error', message: err })
                        })
                }
            })
        },
        closeDialog () {
            console.log("关闭弹框")
            this.$refs['addRoleInfo'].resetFields()
            this.$refs.tree.setCheckedKeys([]);
        },
        openDialog(width) {
            this.width = width === undefined ? '500px' : width
            this.addRoleModel = true
        },
    }
}
</script>
<style>
.modal-footer{
    width: 100%;
    text-align: right;
}

.modal-btn{
  display: flex;
  justify-content: center;
}
</style>

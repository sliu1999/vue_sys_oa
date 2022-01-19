<template>
    <div>
        <el-form :model="roleInfo" ref="roleInfo" label-width="80px" label-position="right" class="demo-ruleForm padding20">
            <el-form-item label="用户名" prop="name">
                <div class="act-content" >{{roleInfo.name}}</div>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                    <div class="act-content" >{{roleInfo.remark}}</div>
            </el-form-item>
            <el-form-item label="菜单权限">
                <div class="scrollDiv">
                    <el-tree :data="menuTree" node-key="id" ref="tree" :check-strictly="false"
                        :props="{ children: 'children', label: 'label' }" default-expand-all>
                    </el-tree>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>
<style>
.act-content{
  line-height:40px;
  color:#6d6d72;
  width: 300px;
}
.scrollDiv {
    overflow: hidden;
    overflow-y: auto;
    height: 300px;
    width: 300px;
}
</style>
<script>
import { getRoleById } from '@/api/system/role'
import { getRoleMenuTree } from '@/api/system/menu'

export default {
    name: "RoleDetail",
    data () {
        return {
            menuTree: null,
            width: null,
            roleInfo: {
                id: this.$route.query.roleId,
                name: '',
                remark: '',
                menuIds: []
            }
        }
    },
    created: function(){
        this.init()
    },
    methods: {
        init(){
            this.getMenuTree()
            this.getRoleInfo(this.roleInfo.id)

        },
        getRoleInfo(id){
            getRoleById(id)
                .then(res => {
                    console.log(res.data)
                    this.roleInfo = res.data
                    this.$refs.tree.setCheckedKeys(res.data.menuIds);
                })
                .catch(err => {

                })
        },
        getMenuTree(){
            getRoleMenuTree(this.roleInfo.id)
                .then(res => {
                    this.menuTree = res.data
                })
                .catch(err => {

                })
        }
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

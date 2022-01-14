<template>
    <div>
        <el-dialog :visible.sync="editUserModel" @close="closeDialog()" :close-on-click-modal="false" :modal-append-to-body="false" title="编辑用户" :width="width">
            <el-form :model="userInfo" :rules="rules" ref="userInfo" label-position="top" class="demo-ruleForm padding20">
                <el-divider content-position="left">用户信息</el-divider>
                 <el-form-item label="用户名" prop="loginId">
                    <el-input placeholder="请输入用户名" v-model="userInfo.loginId"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roles">
                     <el-select v-model="userInfo.roles" multiple placeholder="请选择">
                        <el-option
                        v-for="item in roleList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
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
<script>
import { addUser, getUserInfo } from '@/api/system/user'

export default {
    name: "UserEdit",
    props:['roleList'],
    data () {
        return {
            editUserModel: false,
            width: null,
            userInfo:{
                id: '',
                loginId: '',
                roles: []
            },
            rules: {
                loginId: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                roles: [
                    { type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }
                ]
            }
        }
    },
    created: function(){
        this.init()
    },
    methods: {
        init(){
            
        },
        save(){
            this.$refs['userInfo'].validate( valid => {
                if(valid){
                    var roleL = []
                    var rolesL = this.userInfo.roles
                    for (let i = 0; i < rolesL.length; i++) {
                        if(i === 0){
                            roleL.push({
                                id: rolesL[i],
                                isDefault: 1
                            })
                        }else{
                            roleL.push({
                                id: rolesL[i],
                                isDefault: 0
                            })
                        }
                    }
                    const obj = {
                        id: this.userInfo.id,
                        loginId: this.userInfo.loginId,
                        roles: roleL
                    }
                    addUser(obj)
                        .then(res => {
                            this.closeDialog()
                            this.$parent.init()
                            this.editUserModel = false
                            this.$message({ type: 'success', message: '保存成功!' })
                            this.$refs['userInfo'].resetFields()
                            console.log(this.roleList, "下拉框内容")
                        })
                        .catch(err => {
                            this.$message({ type: 'error', message: err })
                        })
                }
            })
        },
        closeDialog () {
            console.log("关闭弹框")
            this.$refs['userInfo'].resetFields()
        },
        openDialog(id,width) {
            this.width = width === undefined ? '500px' : width
            this.editUserModel = true
            this.userInfo.id = id
            var initRoles = []
            getUserInfo(id)
                .then(res => {
                    this.userInfo.loginId = res.data.loginId
                    initRoles = res.data.roles
                    initRoles.forEach(element => {
                        if(element.isDefault === 1){
                            this.userInfo.roles.push(element.id)
                        }
                    });
                    initRoles.forEach(element => {
                        if(element.isDefault !== 1){
                            this.userInfo.roles.push(element.id)
                        }
                    });
                    console.log(this.userInfo.roles, "初始化角色")
                })
                .catch(err => {
                    console.log(err, "获取用户详情出错")
                })
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

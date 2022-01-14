<template>
    <div>
        <el-dialog :visible.sync="addUserModel" @close="closeDialog()" :close-on-click-modal="false" :modal-append-to-body="false" title="新增用户" :width="width">
            <el-form :model="addUserInfo" :rules="rules" ref="addUserInfo" label-position="top" class="demo-ruleForm padding20">
                <el-divider content-position="left">用户信息</el-divider>
                 <el-form-item label="用户名" prop="loginId">
                    <el-input placeholder="请输入用户名" v-model="addUserInfo.loginId"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input show-password placeholder="请输入密码" v-model="addUserInfo.password"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roles">
                     <el-select v-model="addUserInfo.roles" multiple placeholder="请选择">
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
import { addUser } from '@/api/system/user'

export default {
    name: "UserAdd",
    props:['roleList'],
    data () {
        return {
            addUserModel: false,
            width: null,
            addUserInfo:{
                loginId: '',
                password: '',
                roles: []
            },
            rules: {
                loginId: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
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
            this.$refs['addUserInfo'].validate( valid => {
                if(valid){
                    var roleL = []
                    var rolesL = this.addUserInfo.roles
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
                        loginId: this.addUserInfo.loginId,
                        password: this.addUserInfo.password,
                        roles: roleL
                    }
                    addUser(obj)
                        .then(res => {
                            this.closeDialog()
                            this.$parent.init()
                            this.addUserModel = false
                            this.$message({ type: 'success', message: '保存成功!' })
                            this.$refs['addUserInfo'].resetFields()
                            console.log(this.roleList, "下拉框内容")
                        })
                        .catch(err => {
                            this.$message({ type: 'error', message: err })
                        })
                    this.$refs['addUserInfo'].resetFields()
                }
            })
        },
        closeDialog () {
            console.log("关闭弹框")
            this.$refs['addUserInfo'].resetFields()
        },
        openDialog(width) {
            this.width = width === undefined ? '500px' : width
            this.addUserModel = true
            console.log(this.addUserInfo, "表单信息")
            this.addUserInfo.loginId = ''
            this.addUserInfo.password = ''
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

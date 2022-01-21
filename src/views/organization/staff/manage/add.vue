<template>
    <div>
        <el-dialog :visible.sync="addStaffModel" @close="closeDialog()" :close-on-click-modal="false" :modal-append-to-body="false" title="新增部门员工" :width="width">
            <el-form :model="addStaffInfo" :rules="rules" ref="addStaffInfo" label-position="top" class="demo-ruleForm padding20">
                <el-divider content-position="left">员工信息</el-divider>
                 <el-form-item label="工号" prop="staffNo">
                    <el-input placeholder="请输入工号" v-model="addStaffInfo.staffNo"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addStaffInfo.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="loginId">
                    <el-select v-model="addStaffInfo.loginId" filterable clearable  placeholder="请输入账号">
                        <el-option
                            v-for="item in userList"
                            :key="item.loginId"
                            :label="item.loginId"
                            :value="item.loginId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="addStaffInfo.phone" placeholder="电话"></el-input>
                </el-form-item>
                <el-form-item label="固话" prop="officePhone">
                    <el-input v-model="addStaffInfo.officePhone" placeholder="固话"></el-input>
                </el-form-item>
                <el-form-item label="入职时间" required>
                    <el-col :span="12">
                        <el-form-item prop="entryDate">
                            <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="addStaffInfo.entryDate" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    </el-col>
                </el-form-item>
                <el-form-item label="证件号" prop="identityCard">
                    <el-input v-model="addStaffInfo.identityCard" placeholder="证件号"></el-input>
                </el-form-item>
                <el-form-item label="住址" prop="address">
                    <el-input v-model="addStaffInfo.address" placeholder="住址"></el-input>
                </el-form-item>
                <el-form-item label="生日" required>
                    <el-col :span="12">
                        <el-form-item prop="birthday">
                            <el-date-picker type="date" value-format="yyyy-MM-dd" format="yyyy 年 MM 月 dd 日" placeholder="请选择生日" v-model="addStaffInfo.birthday" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    </el-col>
                </el-form-item>
                <el-form-item label="员工类别" prop="staffType">
                   <el-select v-model="addStaffInfo.staffType" placeholder="请选择">
                        <el-option
                        v-for="item in staffTypeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-select v-model="addStaffInfo.sex" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input type="number" v-model="addStaffInfo.sort" placeholder="排序"></el-input>
                </el-form-item>
                <!-- <el-form-item label="直属领导" prop="leader">
                    <el-input v-model="addStaffInfo.leader" placeholder="直属领导"></el-input>
                </el-form-item> -->
                <el-form-item label="所属部门">
                    <div class="scrollDiv">
                        <el-tree :data="departmentTree" show-checkbox node-key="id" ref="tree" :check-strictly="true"
                         :props="{ children: 'children', label: 'label' }"
                         @check-change="handleCheckChange"
                         @node-click="handleNodeClick"
                         :default-expanded-keys="defaultExpanded">
                        </el-tree>
                    </div>
                </el-form-item>
                <el-form-item label="" prop="iconCard">
                    <div class="right" style="margin-top:15px">
                        <el-form-item label="证件照"><ElUploadImg ref="ImgRef"  @upload="filesUpload" @remove="filesRemove" :limit="3" /></el-form-item>
                    </div>
                </el-form-item>
                <el-form-item label="" prop="iconPhoto">
                    <div class="right" style="margin-top:15px">
                        <el-form-item label="头像"><ElUploadImg ref="ImgRef"  @upload="filesUpload2" @remove="filesRemove2" :limit="1" /></el-form-item>
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
    height: 100px;
}
</style>
<script>
import { saveStaff } from '@/api/organization/staffs'
import { getDepartTree } from '@/api/organization/department'
import { getUserList } from '@/api/system/user'
import ElUploadImg from '@/components/ElUploadImgTwo'
import { selectCommonDic } from '@/api/dic'
export default {
    name: "StaffAdd",
    components: {
        ElUploadImg
    },
    data () {
        return {
            defaultExpanded: [],
            departmentTree: null,
            addStaffModel: false,
            width: null,
            userList: null,
            addStaffInfo: {
                staffNo: '',
                name: '',
                loginId: '',
                phone: '',
                officePhone: '',
                entryDate: '',
                identityCard: '',
                address: '',
                birthday: '',
                sex: '',
                staffType: '',
                sort: '',
                departments: [],
                leader: '',
                iconCard: [],
                iconPhoto: []

            },
            options: [
                {
                value: '0',
                label: '女'
                }, {
                value: '1',
                label: '男'
                }
            ],
            staffTypeList: [],
            rules: {
                staffNo: [
                    { required: true, message: '请输入工号', trigger: 'blur'}
                ],
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                phone: [
                    {pattern: /^1[3|4|5|7|8][0-9]{9}$/ , message: '请输入联系方式', trigger: 'blur'}
                ],
                officePhone: [],
                entryDate: [
                    {required: true, message: '请选择入职时间', trigger: 'change'}
                ],
                identityCard: [
                    {required: true, message: '请输入身份证号', trigger: 'blur'},
                    {pattern: /\d{17}[\d|x]|\d{15}/, message: '请输入正确的身份证号', trigger: 'blur'}
                ],
                address: [
                    {required: true, message: '请输入地址', trigger: 'blur'}
                ],
                birthday: [
                     {required: true, message: '请选择生日', trigger: 'change'}
                ],
                sex: [
                    {required: true, message: '请选择性别', trigger: 'blur'}
                ],
                staffType: [
                    {required: true, message: '请选择员工类型', trigger: 'blur'}
                ],
                sort: [
                    {required: true, message: '请输入排序', trigger: 'blur'}
                ],
                departments: [],
                leader: []

            }
        }
    },
    created: function(){
        this.init()
    },
    methods: {
        init(){
            this.getdepartmentTree()
            this.getUserList()
            this.getStaffTypeList()
        },
        getStaffTypeList(){
            selectCommonDic({tableName: 'tb_dic_staff_type'})
                .then(res => {
                    this.staffTypeList = res.data.content
                })
        },
        // 图片上传回调
        filesUpload(file,multipleFiles) {
            console.log(file,"上传的图片信息")
            console.log(multipleFiles,"列表信息")
            this.addStaffInfo.iconCard = multipleFiles;
        },
        //图片删除回调
        filesRemove(file,multipleFiles) {
            console.log(file,"删除的图片信息")
            console.log(multipleFiles,"列表信息")
            this.addStaffInfo.iconCard = multipleFiles;
        },
        // 图片上传回调
        filesUpload2(file,multipleFiles) {
            console.log(file,"上传的图片信息")
            console.log(multipleFiles,"列表信息")
            this.addStaffInfo.iconPhoto = multipleFiles;
        },
        //图片删除回调
        filesRemove2(file,multipleFiles) {
            console.log(file,"删除的图片信息")
            console.log(multipleFiles,"列表信息")
            this.addStaffInfo.iconPhoto = multipleFiles;
        },
        getUserList(){
            getUserList()
                .then( res => {
                    this.userList = res.data
                })
        },
        //获取部门树
        getdepartmentTree(){
            getDepartTree()
                .then(res => {
                    this.departmentTree = res.data
                    if(res.data!=null){
                        this.defaultExpanded.push(res.data[0].id)
                    }
                })
                .catch(err => {

                })
                
        },
        //给树设置父控件不可选
        setTree(treeData){
            let newChildren = []
            for(var index in treeData){
                if(treeData[index].children != null){
                    treeData[index].disabled = true
                    treeData[index].children = this.setTree(treeData[index].children)
                    newChildren.push(treeData[index])
                }else{
                    newChildren.push(treeData[index])
                }
            }
            return newChildren;
        },
        //勾选框改变触发的方法
        handleCheckChange(data, checked, indeterminate) {
            //console.log(data,checked,indeterminate)
            this.addStaffInfo.departments = []
            const checkKeys = this.$refs.tree.getCheckedKeys()
            checkKeys.forEach(element => {
                console.log(element)
                if(this.addStaffInfo.departments.indexOf(element) == -1){
                    this.addStaffInfo.departments.push({id: element})
                }
            });
            // const halfCheckParentKeys = this.$refs.tree.getHalfCheckedKeys()
            // halfCheckParentKeys.forEach(element => {
            //     if(this.addStaffInfo.departments.indexOf(element) == -1){
            //         this.addStaffInfo.departments.push(element)
            //     }
            // });
            console.log(this.addStaffInfo.departments);
        },
        //点击文字触发的方法
        handleNodeClick(data) {
            
        },
        //保存角色
        save(){
            this.$refs['addStaffInfo'].validate( valid => {
                if(valid){
                    saveStaff(this.addStaffInfo)
                        .then(res => {
                            this.closeDialog()
                            this.$parent.init()
                            this.addStaffModel = false
                            this.$message({ type: 'success', message: '保存成功!' })
                            this.$refs['addStaffInfo'].resetFields()
                            this.$refs.tree.setCheckedKeys([]);

                            this.$refs["ImgRef"].close()
                        })
                        .catch(err => {
                            this.$message({ type: 'error', message: err })
                        })
                }
            })
        },
        closeDialog () {
            console.log("关闭弹框")
            this.$refs['addStaffInfo'].resetFields()
            this.$refs.tree.setCheckedKeys([]);

            this.$refs["ImgRef"].close()
        },
        openDialog(width) {
            this.width = width === undefined ? '500px' : width
            this.addStaffModel = true
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

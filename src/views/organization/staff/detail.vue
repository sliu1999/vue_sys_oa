<template>
    <div>
        <el-form :model="staffInfo"  ref="staffInfo" label-width="80px" label-position="right" class="demo-ruleForm padding20">
            <el-form-item label="工号" prop="staffNo">
                <div class="act-content" >{{staffInfo.staffNo}}</div>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <div class="act-content" >{{staffInfo.name}}</div>
            </el-form-item>
            <el-form-item label="账号" prop="loginId">
                <div class="act-content" >{{staffInfo.loginId}}</div>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
                <div class="act-content" >{{staffInfo.phone}}</div>
            </el-form-item>
            <el-form-item label="固话" prop="officePhone">
                <div class="act-content" >{{staffInfo.officePhone}}</div>
            </el-form-item>
            <el-form-item label="入职时间">
               <div class="act-content" >{{staffInfo.entryDate}}</div>
            </el-form-item>
            <el-form-item label="证件号" prop="identityCard">
                <div class="act-content" >{{staffInfo.identityCard}}</div>
            </el-form-item>
            <el-form-item label="住址" prop="address">
               <div class="act-content">{{staffInfo.address}}</div>
            </el-form-item>
            <el-form-item label="生日">
                <div class="act-content" >{{staffInfo.birthday}}</div>
            </el-form-item>
            <el-form-item label="员工类别" prop="staffType">
                <div class="act-content" >{{staffInfo.staffTypeName}}</div>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <div class="act-content" >{{staffInfo.sexName}}</div>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <div class="act-content" >{{staffInfo.sort}}</div>
            </el-form-item>
            <!-- <el-form-item label="直属领导" prop="leaderName">
                <div class="act-content" >{{staffInfo.leaderName}}</div>
            </el-form-item> --> 
            <el-form-item label="所属部门">
               <div class="act-content" >{{staffInfo.departmentNames}}</div>
            </el-form-item>
            <el-form-item label="" prop="iconCard">
                <div class="act-content" >
                    <el-form-item label="证件照"><ElUploadImg :isDelete="true" :files="staffInfo.iconCard" :limit="staffInfo.iconCard.length" /></el-form-item>
                </div>
            </el-form-item>
            <el-form-item label="" prop="iconPhoto">
                <div class="act-content" >
                    <el-form-item label="头像"><ElUploadImg :isDelete="true" :files="staffInfo.iconPhoto" :limit="staffInfo.iconPhoto.length" /></el-form-item>
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
import ElUploadImg from '@/components/ElUploadImgTwo'
import { getStaffById } from '@/api/organization/staffs'
export default {
    name: "StaffDetail",
    components: {
        ElUploadImg
    },
    data () {
        return {
            departTree: null,
            staffInfo: {
                id: this.$route.query.staffId,
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
                sexName: '',
                staffType: '',
                staffTypeName: '',
                sort: '',
                departments: [],
                departmentNames: '',
                leader: '',
                leaderName: '',
                iconCard: [],
                iconPhoto: []

            }
        }
    },
    created: function(){
        this.init()
    },
    methods: {
         init(){
            this.getStaffInfo(this.staffInfo.id)
        },
        getStaffInfo(id){
            getStaffById(id)
                .then(res => {
                    console.log(res.data)
                    this.staffInfo = res.data
                    if(this.staffInfo.departments != null){
                        var temp = []
                        this.staffInfo.departments.forEach((ele,index) => {
                            temp.push(ele.name)
                        })
                        this.staffInfo.departmentNames = temp.join(',')
                    }
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

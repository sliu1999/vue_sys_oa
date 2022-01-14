<template>
    <div>
        <el-form :model="userInfo" label-width="100px">
            <el-form-item label="账号">
                <div class="act-content">{{userInfo.loginId}}</div>
            </el-form-item>
        </el-form>
    </div>
</template>
<style>
.act-content{
  line-height:40px;
  color:#6d6d72;
}
</style>
<script>
import { getUserInfo } from '@/api/system/user'

export default{
    name: 'UserDetail',
    components: {

    },
    data() {
        return {
            userInfo: {
                id: this.$route.query.userId,
                loginId: ''
            }
        }
        
    },
    created: function(){
        this.init()
    },
    methods: {
        init(){
            getUserInfo(this.userInfo.id)
                .then(res => {
                    this.userInfo.loginId = res.data.loginId
                })
                .catch(err => {

                })
        }
    }
}
</script>

<template>
  <div style="width: 40%;border-left: 1px solid #ccc;height: 400px;box-sizing: border-box;overflow-y: scroll;">
    <div style="display: flex;justify-content: flex-start;align-items: center;padding: 0px 10px;margin: 20px 0 30px 0;">
      <strong style="margin-right: 10px;">权限拥有者:</strong>
      <div style="display: flex;justify-content: flex-start;align-items: center;">
        全体人员
        <el-switch v-model="data.authAll" style="margin-left: 5px;">
        </el-switch>
      </div>
    </div>
    <div v-if="!data.authAll">
      <div class="title-style">
        <h1>特权人员</h1>
      </div>
      
      <users style="padding: 0 10px;margin: 10px 0;" :config.sync="userConfig" :val.sync="data.authGroup.userIds"></users>
      <div class="title-style" style="display: flex;justify-content: space-between;align-items: center;">
        <h1>特权部门岗位</h1>
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="addgwbm">新增部门岗位</el-button>
      </div>
      <div style="padding: 0 10px;margin: 10px 0;">
        <div style="display: flex;align-items: center;justify-content: space-between;padding: 10px;margin-bottom:10px;border: 1px solid #1ab394;border-radius: 4px;"
          v-for="(item,index) in data.authGroup.groupRoleIds" :key="index">
          <div style="width: 90%;">
            <div style="border: 1px solid #DCDFE6;height: 35px;line-height: 30px;border-radius: 4px;display: flex;align-items: center;">
              <bumen-list2 :val.sync="item.groupId" ref="groupId"></bumen-list2>
            </div>
            <div style="margin-top: 5px;">
              <el-select v-model="item.roleId" placeholder="请选择岗位" filterable clearable>
                <el-option v-for="val in roles" :key="val.id" :label="val.name" :value="val.id"></el-option>
              </el-select>
            </div>
          </div>
          <div style="margin-left: 10px">
            <el-button size="small" icon="el-icon-delete" @click="removebumw(index)" style="color: red;font-size: 16px;border: none;padding: 0;"></el-button>
          </div>
        </div>
      </div>
      <div class="title-style">
        <h1>特权部门</h1>
      </div>
      <bumen-list style="margin: 10px 0;padding: 0 10px;" :val.sync="data.authGroup.groupIds"></bumen-list>
      <div class="title-style">
        <h1>特权岗位</h1>
      </div>
      <el-select v-model="data.authGroup.roleIds" filterable multiple placeholder="请选择岗位" style="margin: 10px 0;padding: 0 10px;box-sizing: border-box;">
        <el-option v-for="val in roles" :key="val.id" :label="val.name" :value="val.id"></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
  import users from '@/views/system/access/users' //特权人员选择框
  import bumenList from "@/views/system/access/handlegroups"; //特权部门
  import bumenList2 from "@/views/system/access/handlegroups2"; //特权部门岗位
  import flowApi from "@/api/flow/index";
  export default {
    props: {
      formData: {}
    },
    created() {
      this.init()
    },
    watch: {
      data(newVal) {
        console.log(newVal)
        this.$emit('update:formData', newVal)
      },
      formData(newVal) {
        this.data = newVal
      }
    },
    components: {
      users,
      bumenList,
      bumenList2
    },
    data() {
      return {
        options: [],
        userConfig: {
          multiple: true
        },
        data: this.formData,
        roles: []
      };
    },
    methods: {
      init() {
        let box = {}
        //获取角色列表
        flowApi.getGwList(box).then(res => {
          console.log(res.data,"//获取角色列表")
          this.roles = res.data;
        });
      },
      //新增一条部门岗位
      addgwbm() {
        this.formData.authGroup.groupRoleIds.push({
          // groupId:[],
          // roleId:""
        });
        let arr = this.formData.authGroup.groupRoleIds;
        this.$set(arr[arr.length - 1], "groupId", '');
        this.$set(arr[arr.length - 1], "roleId", "");
      },
      //移除一条部门岗位
      removebumw(index) {
        var _this = this;
        if (this.formData.authGroup.groupRoleIds.length > 1) {
          var _this = this;
          var data = JSON.parse(
            JSON.stringify(this.formData.authGroup.groupRoleIds)
          );
          this.formData.authGroup.groupRoleIds = [];
          var data2 = data.filter(function(line, indexs) {
            return indexs != index;
          });
          setTimeout(function() {
            _this.formData.authGroup.groupRoleIds = data2;
          });
        }
      }
    }
  };
</script>

<style scoped>
  .title-style {
    background: #eee;
    padding: 0px 10px;
    height: 30px;
    line-height: 30px;
    width: 100%;
    box-sizing: border-box;
  }
</style>

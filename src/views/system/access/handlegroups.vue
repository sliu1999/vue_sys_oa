<template>
  <div style="display: flex;align-items: center;">
    <el-button type="primary" size="small" @click="openModal()" style="float: left;">选择部门</el-button>
    <div style="float: left;">
      <div>
        <el-tag v-for="(selectedGroup,index) in multipleSelection" :key="selectedGroup.name" closable @close="handleClose(selectedGroup,index)"
          style="margin-left: 2px;">
          {{selectedGroup.name}}
        </el-tag>
      </div>
    </div>
    <el-dialog title="请选择部门" :visible.sync="dialogTableVisible" append-to-body width="900px">
      <el-input placeholder="在此搜索部门" v-model="filterText">
      </el-input>
      <el-tree
        v-if="dialogTableVisible"
        :data="groups"
        node-key="id"
        accordion
        :props="defaultProps"
        :filter-node-method="filterNode"
        :default-checked-keys="val"
        :default-expanded-keys="val"
        :check-strictly="true"
        @check-change="nodeClick"
        show-checkbox
        v-model="vals"
        ref="tree">
      </el-tree>
      <div class="modal-btn">
        <el-row :gutter="10">
          <el-form>
            <el-form-item class="modal-footer my-modal-footer">
              <el-button type="primary" @click="selectConfirm()">确定</el-button>
            </el-form-item>
          </el-form>
        </el-row>
      </div>
    </el-dialog>
    <div style="clear:both;"></div>
  </div>
</template>

<script>
  import {getDepartTree,queryDepartInfo} from '@/api/organization/department'

  export default {
    name: "handlegroups",
    props: {
      val: ''
    },
    created: function() {
      this.initGroup()
    },
    data() {
      return {
        dialogTableVisible: false,
        multipleSelection: [],
        groups: [],
        filterText: '',
        vals: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      val() {
        this.initGroup()
      },
      vals: function(newValue) {
        // console.log(newValue)
        //每当str的值改变则发送事件update:word , 并且把值传过去
        this.$emit('update:val', newValue);
      }
    },
    methods: {
      initGroup() { //初始化部门
        let _this = this;
        console.log("//初始化部门")
        getDepartTree()
          .then(function(res) {
            _this.groups = res.data;
            if (_this.val.length > 0) {
              console.log(_this.val,"handlegroups._this.val")
              let multipleSelection = []
              for (let i = 0; i < _this.val.length; i++) {
                if (_this.val[i]) {
                  queryDepartInfo( _this.val[i])
                    .then(res => {
                      multipleSelection.push(res.data)
                    })
                }
              }
              _this.multipleSelection = multipleSelection
            } else {
              _this.multipleSelection = []
            }
            
          }).catch(function(error) {
            console.log(error);
          })
      },
      openModal() {
        this.dialogTableVisible = true;

        if (this.vals.length) this.$refs.tree.setCheckedKeys(this.vals);
        else {
          if (this.$refs.tree) this.$refs.tree.setCheckedKeys([]);
        }
      },
      nodeClick(curNode, boolean) { 
          this.$refs.tree.setChecked(curNode, boolean)
      },
      handleClose(selectedGroup, index) {
        this.multipleSelection.splice(index, 1);
        console.log(this.multipleSelection)
        this.vals=[]
        this.multipleSelection.forEach(res=>{
          this.vals.push(res.id)
        })
      },
      selectConfirm() {
        this.vals = this.$refs.tree.getCheckedKeys();
        console.log(this.vals,"selectConfirm")
        this.multipleSelection = this.$refs.tree.getCheckedNodes();
        console.log(this.multipleSelection)
        this.dialogTableVisible = false;
      },
      filterNode(value, data) { // 过滤tree节点
        if (!value) return true;
        return data.deptName.indexOf(value) !== -1;
      },
    }
 
  }
</script>
<style scoped>

</style>

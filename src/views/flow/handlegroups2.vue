<template>
  <div>
    <div style="display: flex;align-items: center;">
      <el-button type="primary" size="small" @click="openModal()" style="float: left;">选择部门</el-button>
      <div style="float: left;">
        <div>
          <!-- {{multipleSelection}} -->
          <el-tag
            v-for="(selectedGroup,index) in multipleSelection"
            :key="selectedGroup.label"
            closable
            @close="handleClose(selectedGroup,index)"
            style="margin-left: 2px;">
            {{selectedGroup.label}}
          </el-tag>
        </div>
      </div>
    </div>

    <el-dialog title="请选择部门" :visible.sync="dialogTableVisible" append-to-body width="900px">
      <el-input
        placeholder="在此搜索部门"
        v-model="filterText">
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
              <!--<el-button @click="dialogTableVisible = false">取消</el-button>-->
            </el-form-item>
          </el-form>
        </el-row>
      </div>
    </el-dialog>
    <div style="clear:both;"></div>
  </div>
</template>

<script>
  import { getDepartTree , queryDepartInfo } from '@/api/organization/department'

  export default {
    name: "handlegroups",
    props: {
      val: '',
      customized: '',                               //定制传参，如有值则执行定制化操作
    },
    created: function () {
      this.initGroup()
    },
    methods: {
      removeMultipleSelection() {
        console.log('zhix')
        this.multipleSelection = []
      },
      initGroup() {                                    //初始化部门
        let _this = this;

        getDepartTree()
          .then(function (res) {
            // 处理成功的结果
            _this.groups = res.data;
            if (_this.val!='') {
              console.log(_this.val,"_this.val")
              if (_this.val.length > 0) {
                for (let i = 0; i < _this.val.length; i++) {
                  
                  queryDepartInfo(_this.val[i].id)
                    .then(res => {
                      console.log(res)
                      _this.multipleSelection.push(res.data)
                    })

                }

              }

            }
          }).catch(function (error) {
          console.log(error);
        })
      },
      openModal() {
        this.dialogTableVisible = true;
       
      },
      nodeClick(data, checked, node) {                           //点击全部大队或者全部派出所，使得相应节点被选中或取消选中（常熟公安定制需求）
        if (checked === true) {
          this.checkedId = data.id;
          this.$refs.tree.setCheckedKeys([data.id]);
        } else {
          if (this.checkedId == data.id) {
            this.$refs.tree.setCheckedKeys([data.id]);
          }
        }
      },
      handleClose(selectedGroup, index) {
        this.multipleSelection.splice(index, 1);
        this.vals.splice(index, 1);
      },
      selectConfirm() {
        this.vals = this.$refs.tree.getCheckedKeys();
        // console.log(this.vals)

        this.multipleSelection = this.$refs.tree.getCheckedNodes();
        // console.log(this.multipleSelection)
        this.dialogTableVisible = false;
      },
      filterNode(value, data) {                       // 过滤tree节点
        if (!value) return true;
        return data.deptName.indexOf(value) !== -1;
      },
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
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      vals: function (newValue) {
        this.$emit('update:val', newValue);
      }
    }
  }
</script>
<style scoped>

</style>

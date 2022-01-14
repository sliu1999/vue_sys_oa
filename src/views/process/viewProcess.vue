<template>
  <div class="box">
    <div
      style="width: 85%;border-right:1px solid rgba(238,238,238,1);padding-right: 20px;
    box-sizing: border-box;"
    >
      <div class="title">
        <div>
          <img src="../../../static/images/biaoti.png" alt style="margin-right: 7px" />
          事项详情
        </div>
        <el-button type="primary" v-print="printMe" size="medium">打印</el-button>
      </div>
      <div id="printMe">
        <div class="mod-name">{{curModName}}</div>
        <renderView
          v-if="curModName"
          :tableSchema.sync="tableSchema"
          :formView.sync="formView"
          :formData.sync="formData"
          :log="logs"
          :tableKey.sync="tableKey"
          :hideTable="hideTable"
          :hideTableDetail="hideTableDetail"
        ></renderView>
        <div
          style="display: flex;justify-content: space-between;align-items: center;margin-top: 20px;"
        ></div>
      </div>
      <!-- 当流程状态没结束，并且没被撤回 并且 当前用户是流程发起人，显示撤回按钮 -->
      <div
        @click="recall()"
        class="ch"
        v-if="flagStart&&(processData.state!='5'&&processData.state!='4')"
      >
        <img src="../../../static/images/jj.png" alt />

        <el-button type="primary">撤回(删除)</el-button>
      </div>
    </div>
    <log v-if="logs" :logData="logs"></log>
  </div>
</template>
<script>
import renderView from "@/views/render/renderView";
import formDataApi from "@/api/formData/formData";
import log from "@/views/public/log";
export default {
  name: "ViewProcess",
  created: function() {
    let _this = this;
    formDataApi.selectHisData(this.id).then(
      // 获取表单
      function(res) {
        console.log(res.data.logs);
        _this.formData = res.data.formData;
        _this.logs = res.data.logs;
        _this.processData = res.data.process;
        if ( _this.processData.createBy == JSON.parse(window.sessionStorage.getItem('user-info-session')).userId) {
          _this.flagStart = true;
        }
        _this.tableSchema = typeof res.data.tableSchema === "string" ? JSON.parse(res.data.tableSchema) : res.data.tableSchema;
        _this.curModName = res.data.name;
        _this.printMe.popTitle = res.data.name;
        _this.tableKey = res.data.tableKey;
        _this.formView = typeof res.data.formView === "string" ? JSON.parse(res.data.formView) : res.data.formView;
        if (res.data.flowFormConfig.hideTable) {
          _this.hideTable = typeof res.data.flowFormConfig.hideTable == "string" ? res.data.flowFormConfig.hideTable.split(",") : res.data.flowFormConfig.hideTable;
        }
        if (res.data.flowFormConfig.hideTableDetail) {
          _this.hideTableDetail = res.data.flowFormConfig.hideTableDetail;
        }
        // 处理成功的结果
      },
      function(res) {
        // 处理失败的结果
      }
    );
  },
  components: {
    renderView,
    log
  },
  data() {
    return {
      flagStart: false,
      processData: null,
      formData: {},
      showLog: false,
      htmls: [],
      tableSchema: [],
      hideTable: [], //无权限主表字段
      hideTableDetail: [], //无权限明细表字段
      tableKey: "",
      formView: [],
      curModName: "",
      printMe: {
        id: "printMe",
        popTitle: ""
      },
      id: this.$route.query.id,
      logs: null
    };
  },
  methods: {
    //流程撤回，目前先调删除接口
    recall() {
      let _this = this;
      this.$confirm("是否确认撤回?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          formDataApi.delHistory(this.id).then(
            // 获取表单
            function(res) {
              if (res.errorCode == 0) {
                _this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                _this.$router.push({
                  path: "/historyProcess"
                });
              } else {
                _this.$message({
                  message: res.data.msg,
                  type: "error"
                });
              }
              // 处理成功的结果
            },
            function(res) {
              // 处理失败的结果
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回"
          });
        });
    }
  }
};
</script>

<style scoped>
.box {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: #ffffff;
  padding: 0 20px 20px 20px;
  height: 100%;
}

.title {
  color: #333333;
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  height: 57px;
  justify-content: space-between;
  background-color: white;
  /* padding: 0 20px; */
  /* border-bottom: 2px solid rgba(243,248,249,1); */
}

.mod-name {
  /* text-align: center;
    width: 100%;
    font-weight: bold;
    font-size: 20px;
    background: #F8F8F8;
    border: 1px solid #e8e8e8;
    font-family: "Microsoft YaHei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif;
    padding: 5px 8px;
    box-sizing: border-box; */
}
</style>

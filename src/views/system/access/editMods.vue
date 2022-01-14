<template>
  <div style="width: 60%;padding: 20px 20px;height: 400px;overflow-y: scroll;">
    <h1 style="margin-bottom: 10px;">权限组名称:</h1>
    <el-input v-model="catsMods.name" placeholder="在此输入权限名称"></el-input>
    <div style="display: flex;justify-content: flex-start;align-items: center;margin-top: 20px;margin-bottom: 10px;">
      <h1>可见类别/模块:</h1>
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
    </div>
    <el-table :data="catsMods.typesForms" border style="width: 100%">
      <el-table-column label="可见类别" width="160">
        <template slot-scope="scope">
          <el-select v-model="scope.row.typeIds" placeholder="请选择" @change="change($event,scope)">
            <el-option v-for="item in cats" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="可见模块">
        <template slot-scope="scope">
          <div style="display: flex;justify-content: flex-start;align-items: center;">
            <el-checkbox v-model="scope.row.type" @change="changeAll($event,scope)" :disabled="scope.row.flag">选择全部模块</el-checkbox>
            <el-checkbox v-model="scope.row.flag" :disabled="scope.row.type">排除所选模块</el-checkbox>
          </div>
          <div v-if="catsMap">
            <el-select v-model="scope.row.formIds" multiple placeholder="请选择" v-if="!scope.row.type">
              <el-option v-for="item in catsMap[scope.row.typeIds]" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="60">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="del(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import formTableDesignApi from "@/api/formTableDesign/formTableDesign";
  export default {
    props: {
      formData: null
    },
    watch: {
      catsMods(newVal) {
        console.log(newVal)
        this.$emit('update:formData', newVal)
      },
      formData(newVal) {
        this.catsMods = newVal
      }
    },
    created() {
      this.init()
    },
    data() {
      return {
        cats: null,
        catsMap: null,
        mods: null,
        activeName: [],
        catsMods: this.formData
      };
    },
    methods: {
      add() {
        this.catsMods.typesForms.push({
          typeIds: null,
          formIds: null,
          type: false,
          flag: false
        })
      },
      del(scope) {
        this.catsMods.typesForms.splice(scope.$index, 1)
      },
      change(e, scope) {
        this.catsMods.typesForms[scope.$index].formIds = []
      },
      changeAll(e, scope) {
        console.log(e)
        if (e) {
          this.catsMods.typesForms[scope.$index].formIds = []
        }
      },
      init() {
        let _this = this;
        formTableDesignApi.getMods().then(function(res) {
          // 处理成功的结果
          _this.cats = res.data.cats;
          _this.catsMap = res.data.catsMap;
          _this.mods = res.data.mods;
        }).catch(function(error) {
          console.log(error);
        });

      },
    }
  };
</script>

<style scoped>

</style>

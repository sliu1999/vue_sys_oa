<template>
	<div class="box">
		<div class="title">
			<img src="../../../static/images/biaoti.png" alt style="margin-right: 7px" />
			我的历史
		</div>
		<div class="back">
			<el-form :inline="true" :model="searchStr" class="demo-form-inline" size="mini">
				<el-form-item label="发起人:" id="creatorSearch">
					<el-input v-model="searchStr.creator" placeholder="请输入发起人" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="名称:" id="nameSearch">
					<el-input v-model="searchStr.processName" placeholder="请输入名称" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="发起日期:">
					<el-date-picker v-model="searchStr.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="结束日期:">
					<el-date-picker v-model="searchStr.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="状态:" id="stateSearch">
					<el-select v-model="searchStr.state" filterable placeholder="请选择" clearable>
						<el-option v-for="item in status" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="search(searchStr)" style="border-radius:15px;">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-refresh" @click="reset" style="border-radius:15px;">重置</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="warning" size="mini" v-show="disabled" @click="delList">批量删除</el-button>
				</el-form-item>
			</el-form>
			<!--历史流程列表-->
			<el-table :data="pageData.list" border size="mini" style="width: 100%" @selection-change="handleSelectionChange"
			 v-loading="loading">
				<el-table-column type="selection" width="50" :selectable='selectInit'></el-table-column>
				<el-table-column prop="state" label="状态" align="center" width="90">
					<template slot-scope="scope">
						<!-- btnName: ['审批中', '已拒绝', '待重审', '待提交', '已结束'], -->
						<!-- <el-button :type="type[scope.row.state]" size="mini">{{btnName[scope.row.state]}}</el-button> -->
						<div class="boxitem">
							<img src="../../../static/images/spz.png" alt="" v-if="btnName[scope.row.state]=='审批中'">
							<img src="../../../static/images/dtj.png" alt="" v-if="btnName[scope.row.state]=='待提交'">
							<img src="../../../static/images/dcs.png" alt="" v-if="btnName[scope.row.state]=='待重审'">
							<img src="../../../static/images/yjs.png" alt="" v-if="btnName[scope.row.state]=='已拒绝'">
							<img src="../../../static/images/yjs.png" alt="" v-if="btnName[scope.row.state]=='已结束'">
							<img src="../../../static/images/sc1.png" alt="" v-if="btnName[scope.row.state]=='已撤回'">
							{{btnName[scope.row.state]}}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="processName" label="名称" align="center" width="220">
				</el-table-column>
				<el-table-column prop="creator" label="发起人" align="center">
				</el-table-column>
				<el-table-column prop="createDate" label="发起时间" align="center">
				</el-table-column>
				<el-table-column prop="lastHandler" label="最后审批人" align="center">
				</el-table-column>
				<el-table-column prop="lastHandleDate" label="最后审批时间" align="center">
				</el-table-column>
				<el-table-column prop="currentHandler" label="当前审批人" align="center">
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template slot-scope="scope">
						<el-button @click="selectPro(scope.row)" type="text" size="small">查看</el-button>
						<el-button type="text" size="small" style="color:red" class="delate" @click="delPro(scope.row)" v-if="scope.row.isDelete=='1'">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!--分页-->
			<div class="pageContent" id="pageContent">
				<el-pagination :model="pageData" background @current-change="handleCurrentChange" :current-page="pageData.current"
				 :page-size="pageData.size" layout="total, prev, pager, next, jumper" :total="pageData.total">
				</el-pagination>
				<!--<el-button  type="primary" size="mini" class="orgaOk">确定</el-button>-->
			</div>
		</div>
	</div>
</template>
<script>
	import formDataApi from '@/api/formData/formData'
	export default {
		name: 'historyProcess',
		mounted: function() {
			this.init()
		},
		components: {
			formDataApi
		},

		data() {
			return {
				searchStr: {
					startTime: null,
					endTime: null,
					processName: null,
					creator: null,
					state: null
				},
				delDialog: false,
				loading: true,
				searchTableData: [], //搜索表格数据
				cats: [{
					id: 10,
					name: '请假申请'
				}, {
					id: 11,
					name: '出差申请'
				}, {
					id: 12,
					name: '加班申请'
				}],
				status: [{
					id: "0",
					name: '审批中'
				}, {
					id: "1",
					name: '已拒绝'
				}, {
					id: "2",
					name: '待重审'
				}, {
					id: "3",
					name: '待提交'
				}, {
					id: "4",
					name: '已结束'
				}, {
					id: "5",
					name: '已撤回'
				}],
				type: ['primary', 'danger', 'warning', 'info', 'success'],
				btnName: ['审批中', '已拒绝', '待重审', '待提交', '已结束', '已撤回'],
				tableData: [],
				sels: [],
				disabled: false,
				pageData: {
					list: [],
					current: 1,
					pages: 0,
					size: 10,
					total: 0
				}
			}
		},
		methods: {
			init() {
				this.loading = true;
				let _this = this;
				const obj = {
					pageNum:this.pageData.current,
					pageSize:this.pageData.size
				}
				formDataApi.getHistoryList(obj)
					.then( // 获取表单
						function(res) {
							console.log(res)			
							_this.loading = false
							_this.pageData.list = []
							_this.pageData.total = res.data.total
							_this.pageData.pages = res.data.pages
							_this.pageData.current = res.data.prePage + 1
							_this.pageData.list = res.data.list
							_this.pageData = res.data
							// 处理成功的结果
						},
						function(res) {
							_this.loading = false
							// 处理失败的结果
						}
					);
			},
			selectInit(row, index) { //控制表格多选框是否可勾选
				if (row.isDelete == '0') {
					return false //不可勾选
				} else {
					return true //可勾选
				}
			},
			handleSelectionChange(val) {
				this.sels = val;
				// console.log(this.sels);
				let ele = this.sels;
				if (ele.length !== 0) {
					this.disabled = true;
				} else {
					this.disabled = false;
				}
			},
			handleCurrentChange(val) {
				console.log(val)
				this.pageData.current = val;
				this.init()
			},
			selectPro(row) {
				console.log(row)
				this.$router.push({
					path: '/process/viewProcess',
					query: {
						id: row.id
					}
				})
				// let routeData = this.$router.resolve({
				// 	name: "viewProcess",
				// 	query: {
				// 		id: row.id
				// 	}
				// });
				// window.open(routeData.href, '_blank');
			},
			delList() {
				console.log(this.sels)
				let idsArr = []
				this.sels.forEach(item => {
					idsArr.push(item.id)
				})
				console.log(idsArr)
				idsArr = idsArr.join(",")
				console.log(idsArr)
				let _this = this;
				this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					formDataApi.delHistory(idsArr).then(
						function(res) {
							console.log(res)
							if (res.errorCode == 0) {
								_this.$message({
									duration: 2000,
									message: '删除成功',
									type: 'success'
								});
								_this.init()
							} else {
								_this.$message({
									duration: 2000,
									message: res.msg,
									type: 'error'
								});
							}
							// 处理成功的结果
						},
						function(res) {
							// 处理失败的结果
						})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			delPro(row) {
				console.log(row.id)
				let _this = this;
				this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					formDataApi.delHistory(row.id).then(
						function(res) {
							console.log(res)
							_this.$message({
								duration: 2000,
								message: '删除成功',
								type: 'success'
							});
							_this.init()
							
							// 处理成功的结果
						},
						function(res) {
							// 处理失败的结果
						});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			search(searchStr) {
				// console.log(searchStr)
				this.pageData.current = 1;
				this.init()
			},
			reset() {
				this.searchStr = {
					startTime: null,
					endTime: null,
					processName: null,
					creator: null,
					state: null
				}
				this.pageData.current = 1;
				this.init()
			}
		}
	}
</script>

<style scoped>
	.box {
		background-color: white;
		height: 100%;
	}

	.title {
		color: #333333;
		display: flex;
		align-items: center;
		font-weight: bold;
		font-size: 18px;
		height: 57px;
		background-color: white;
		padding: 0 20px;
		border-bottom: 2px solid rgba(243, 248, 249, 1);
	}

	.back {
		background-color: white;
		padding: 20px;
	}

	.boxitem {
		display: flex;
		align-items: center;
	}

	.boxitem>img {
		margin-right: 5px;
	}
</style>

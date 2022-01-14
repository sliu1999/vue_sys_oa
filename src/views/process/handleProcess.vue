<template>
	<div class="box">
		<div style="width: 85%; border-right:1px solid rgba(238,238,238,1);">
			<div style="padding:0 20px 10px 20px;">
				<div class="title">
					<div>
						<img src="../../../static/images/biaoti.png" alt style="margin-right: 7px" />
						待办事项
					</div>
					<el-button type="primary" v-print="printMe" size="medium">打印</el-button>
				</div>
				<el-form id="printMe">
					<div class="mod-name">{{curModName}}</div>
					<renderHandle v-if="formView" :tableSchema.sync="tableSchema" :formView.sync="formView" :formData.sync="formData"
					 :tableKey.sync="tableKey" :hideTableDetail="hideTableDetail" :editTableDetail="editTableDetail" :editTable="editTable"
					 :hideTable="hideTable" :flagStart="flagStart" :log="log"></renderHandle>
				</el-form>
			</div>

			<div class="spboxs">
				<div class="spbox" style>
					<div v-if="!flagStart" style="display:flex">
						<div @click="approve('')" class="tg">
							<img src="../../../static/images/tg.png" alt />
							通过
						</div>
						<div @click="reject()" class="jj">
							<img src="../../../static/images/jj.png" alt />
							拒绝
						</div>
						<div @click="transfer()" class="zj">
							<img src="../../../static/images/zj.png" alt />
							转交
						</div>
						<div @click="setReminders()" class="tx">
							<img src="../../../static/images/tx.png" alt />
							通知
						</div>
						<div style="height: 44px;line-height: 44px" v-if="remindOriginData.notifiedId">(已提醒{{remindOriginData.notifiedId.split(',').length}}人)</div>
					</div>
					<div v-if="flagStart">
						<el-button type="primary" @click="approve('')">提交</el-button>
						<el-button @click="setReminders">流程提醒<span v-if="remindOriginData.notifiedId">(已提醒{{remindOriginData.notifiedId.split(',').length}}人)</span></el-button>
					</div>
					<usersChoose ref="openHandlers"></usersChoose>
					<!-- <users v-if="personSelect" :val.sync="personIds" :config.sync="userConfig"></users> -->
					<!-- 转交人员选择 -->
					<el-dialog title="人员选择" :visible.sync="personSelect" width="30%" center>
						<users :config.sync="userConfig" :val.sync="personIds"></users>
						<span slot="footer" class="dialog-footer">
							<el-button @click="personSelect = false">取 消</el-button>
							<el-button type="primary" @click="confirmTransfer">确 定</el-button>
						</span>
					</el-dialog>
					<el-dialog title="节点选择" :visible.sync="codeSelect" width="30%" center>
						<el-radio-group v-model="codeData" v-if="codeMessage">
							<el-radio v-for="(item,index) in codeMessage" :key="index" :label="index">{{item.name}}</el-radio>
						</el-radio-group>
						<span slot="footer" class="dialog-footer">
							<el-button @click="codeSelect = false">取 消</el-button>
							<el-button type="primary" @click="confirmCodeChoose">确 定</el-button>
						</span>
					</el-dialog>
				</div>
				<el-input v-if="!flagStart" type="textarea" :rows="5" placeholder="请输入审批意见" v-model="opinion" style="margin-top: 20px;"></el-input>
			</div>
		</div>
		<remindAdd v-if="tableKey" ref="openReminders" :data.sync="remindData"></remindAdd>
		<log v-if="log" :logData="log"></log>
	</div>
</template>

<script>
	// @desc 统一加载注册组件资源
	import formDataApi from "@/api/formData/formData";
	import log from "@/views/public/log";
	import renderHandle from "@/views/render/renderHandle";
	import usersChoose from "@/views/public/users_choose"; //人员选择
	import users from "@/views/public/users"; //人员选择框
	import remindAdd from '@/views/remind/add'
	export default {
		name: "handleProcess",
		created: function() {
			let _this = this;
			_this.queryDetail();
			
		},
		components: {
			formDataApi,
			renderHandle,
			usersChoose,
			users,
			log,
			remindAdd
		},
		data() {
			return {
				formData: {},
				editTable: [], //可编辑主表字段
				hideTable: [], //无权限主表字段
				hideTableDetail: [], //无权限明细表字段
				editTableDetail: [], //可编辑明细表字段
				showPeopleChoose: false, //判断提交时是否需要选择人员节点
				codeSelect: false, //判断拒绝时是否需要选择回退节点
				interface: "",
				tableSchema: null,
				formView: null,
				payload: null,
				messageRequired: false, //判断审批意见是否必填
				codeMessage: null,
				codeData: null,
				personsData: null,
				curModName: "", //表单名称
				personSelect: false, //人员选择
				userConfig: {
					multiple: false
				},
				printMe: {
					id: "printMe",
					popTitle: "",
				},
				module: null,
				tableKey: "",
				processId: null,
				log: null,
				flagStart: false,
				id: this.$route.query.id,
				personIds: null,
				showLog: false, //查看日志
				opinion: "", //审批意见
				htmls: [],
				remindData: {}, //流程提醒数据
				remindOriginData: {}
				// tableData: this.tableSchema
			};
		},
		methods: {
			init() {
				console.log(this.formData);
			},
			queryDetail(){
				let _this = this;
				formDataApi.selectData(this.id).then(
					function(res) {
						_this.log = res.data.logs;
						if (_this.log[_this.log.length - 1].nextNode == "startElement") {
							_this.flagStart = true;
						}
						_this.processId = res.data.process.id;
						_this.formData = res.data.formData;
						_this.messageRequired = res.data.isRequired;
						_this.curModName = res.data.name;
						_this.printMe.popTitle = res.data.name;
						_this.remindOriginData = {
							notifyTitle: '来自' + (window.sessionStorage.getItem('user-info-session') ? JSON.parse(window.sessionStorage.getItem('user-info-session')).username : '') + '审批的' + _this.curModName + '的提醒',
							notifiedId: ''
						}
						_this.remindData = JSON.parse(JSON.stringify(_this.remindOriginData))
						_this.tableKey = res.data.tableKey;
						_this.module = res.data.module;
						_this.tableSchema = typeof res.data.tableSchema === "string" ? JSON.parse(res.data.tableSchema) : res.data.tableSchema;
						let formView = typeof res.data.formView === "string" ? JSON.parse(res.data.formView) : res.data.formView;
						if (res.data.flowFormConfig.editTable) {
							_this.editTable = typeof res.data.flowFormConfig.editTable == "string" ?
								res.data.flowFormConfig.editTable.split(",") :
								res.data.flowFormConfig.editTable;
						}
						if (res.data.flowFormConfig.hideTable) {
							_this.hideTable = typeof res.data.flowFormConfig.hideTable == "string" ?
								res.data.flowFormConfig.hideTable.split(",") :
								res.data.flowFormConfig.hideTable;
						}
						if (res.data.flowFormConfig.hideTableDetail) {
							_this.hideTableDetail = res.data.flowFormConfig.hideTableDetail;
							_this.hideTableDetail.forEach(val => {
								if (val.hostId.length) {
									val.hostId = val.hostId.split(",")
								} else {
									val.hostId = []
								}
							})
						}
						if (res.data.flowFormConfig.editTableDetail) {
							_this.editTableDetail = res.data.flowFormConfig.editTableDetail;
						}
						_this.formView = formView;
						// 处理成功的结果
					},
					function(res) {
						// 处理失败的结果
					}
				);
			},
			validRequired(flagValidated) {
				for (let i = 0; i < this.tableSchema.length; i++) {
					if (
						this.tableSchema[i].required &&
						this.tableSchema[i].flagEdit &&
						(!this.formData[this.tableSchema[i].id] || ((typeof this.formData[this.tableSchema[
              i].id] != 'number') && (!this.formData[this.tableSchema[i].id].length))) &&
						this.formData.hasOwnProperty(this.tableSchema[i].id)
					) {
						this.$message({
							duration: 2000,
							message: this.tableSchema[i].name + "为必填项",
							type: "error"
						});
						flagValidated = false;
						break;
					}
					if (this.tableSchema[i].flagDetail) {
						for (let j = 0; j < this.tableSchema[i].fields.length; j++) {
							if (this.tableSchema[i].fields[j].required && this.tableSchema[i].fields[j].flagEdit) {
								for (let k = 0; k < this.formData[this.tableSchema[i].id].length; k++) {
									if ((!this.formData[this.tableSchema[i].id][k][this.tableSchema[i].fields[j].id] || ((typeof this.formData[
                      this.tableSchema[i].id][k][this.tableSchema[i].fields[j].id] != 'number') && (!this.formData[this.tableSchema[
                      i].id][k][this.tableSchema[i].fields[j].id].length))) && this.formData[this.tableSchema[i].id][k].hasOwnProperty(
											this.tableSchema[i].fields[j].id)) {
										this.$message({
											duration: 2000,
											message: this.tableSchema[i].fields[j].name + "为必填项",
											type: "error"
										});
										flagValidated = false;
										break;
									}
								}
							}
						}
					}
				}
				return flagValidated
			},
			//审批通过
			approve(originPayload) {
				let flagValidated = true;
				flagValidated = this.validRequired(flagValidated);
				if (flagValidated) {
					if (this.messageRequired) {
						if (!this.opinion) {
							this.$message({
								duration: 2000,
								message: "审批意见必填",
								type: "error"
							});
							return;
						}
					}
					let _this = this;
					let data = {};
					if (originPayload) {
						data = JSON.parse(JSON.stringify(originPayload));
					} else {
						data.tableKey = this.tableKey;
						data.processId = this.processId;
						data.formData = this.formData;
						data.message = this.opinion;
						data.module = this.module;
						data.notifyConfig = this.remindData
					}
					const loading = this.$loading({
						lock: true,
						text: "Loading",
						spinner: "el-icon-loading",
						background: "rgba(0, 0, 0, 0.7)"
					});
					formDataApi.approve(data).then(
						function(res) {
							let message;
							if (res.errorCode == 0) {
								loading.close();
								if (res.data.handlers && res.data.handlers.length) {
									let handlers = [];
									res.data.handlers.forEach(handler => {
										handlers.push(handler.loginId);
									});
									message = res.data.message + ",审批人：" + handlers.join(",");
								} else {
									message = res.data.message;
								}
								_this.$message({
									duration: 2000,
									message: message,
									type: "success"
								});
								_this.$router.push({
									path: "/todoProcess"
								});
							} else if (res.errorCode == 2) {
								loading.close();
								_this.$refs.openHandlers.openDialog(
									res.data.assignee,
									data,
									res.data.handlerSelectConfig,
									"handle"
								);
							} else {
								loading.close();
								_this.$message({
									duration: 2000,
									message: res.msg,
									type: "error"
								});
							}
							// 处理成功的结果
						},
						function(res) {
							// 处理失败的结果
						}
					);
				}
			},
			confirmCodeChoose() {
				this.codeSelect = false;
				let flagValidated = true;
				flagValidated = this.validRequired(flagValidated);
				if (flagValidated) {
					let _this = this;
					let data = {};
					data.tableKey = this.tableKey;
					data.processId = this.processId;
					data.formData = this.formData;
					data.message = this.opinion;
					data.module = this.module;
					data.nodeAssignee = this.codeMessage[this.codeData];
					const loading = this.$loading({
						lock: true,
						text: "Loading",
						spinner: "el-icon-loading",
						background: "rgba(0, 0, 0, 0.7)"
					});
					formDataApi.refuse(data).then(
						// 获取表单
						function(res) {
							let message;
							if (res.errorCode == 0) {
								loading.close();
								if (res.data.handlers && res.data.handlers.length) {
									let handlers = [];
									res.data.handlers.forEach(handler => {
										handlers.push(handler.loginId);
									});
									message = res.data.message + ",审批人：" + handlers.join(",");
								} else {
									message = res.data.message;
								}
								_this.$message({
									duration: 2000,
									message: message,
									type: "success"
								});
								_this.$router.push({
									path: "/todoProcess"
								});
							} else if (res.errorCode == 2) {
								loading.close();
								_this.codeSelect = true;
								_this.codeMessage = res.data;
								
							} else {
								loading.close();
								_this.$message({
									duration: 2000,
									message: res.msg,
									type: "error"
								});
							}
						},
						function(res) {
							// 处理失败的结果
						}
					);
				}
			},
			reject() {
				let flagValidated = true;
				flagValidated = this.validRequired(flagValidated);
				if (flagValidated) {
					if (this.messageRequired) {
						if (!this.opinion) {
							this.$message({
								duration: 2000,
								message: "审批意见必填",
								type: "error"
							});
							return;
						}
					}
					let _this = this;
					let data = {};
					data.tableKey = this.tableKey;
					data.processId = this.processId;
					data.formData = this.formData;
					data.message = this.opinion;
					data.module = this.module;
					const loading = this.$loading({
						lock: true,
						text: "Loading",
						spinner: "el-icon-loading",
						background: "rgba(0, 0, 0, 0.7)"
					});
					formDataApi.refuse(data).then(
						// 获取表单
						function(res) {
							let message;
							if (res.errorCode == 0) {
								loading.close();
								if (res.data.handlers && res.data.handlers.length) {
									let handlers = [];
									res.data.handlers.forEach(handler => {
										handlers.push(handler.loginId);
									});
									message = res.data.message + ",审批人：" + handlers.join(",");
								} else {
									message = res.data.message;
								}
								_this.$message({
									duration: 2000,
									message: message,
									type: "success"
								});
								_this.$router.push({
									path: "/todoProcess"
								});
							} else if (res.errorCode == 2) {
								loading.close();
								_this.codeSelect = true;
								_this.codeMessage = res.data;
							} else {
								loading.close();
								_this.$message({
									duration: 2000,
									message: res.msg,
									type: "error"
								});
							}
							
						},
						function(res) {
							// 处理失败的结果
						}
					);
				}
			},
			transfer() {
				let flagValidated = true;
				flagValidated = this.validRequired(flagValidated);
				if (flagValidated) {
					this.personSelect = true;
				}
			},
			// 确认转发
			confirmTransfer() {
				if (this.personIds) {
					let _this = this;
					let data = {};
					data.tableKey = this.tableKey;
					data.processId = this.processId;
					data.formData = this.formData;
					data.message = this.opinion;
					data.module = this.module;
					data.transferId = this.personIds;
					const loading = this.$loading({
						lock: true,
						text: "Loading",
						spinner: "el-icon-loading",
						background: "rgba(0, 0, 0, 0.7)"
					});
					formDataApi.transfer(data).then(
						// 获取表单
						function(res) {
							let message;
							if (res.errorCode == 0) {
								loading.close();
								if (res.data.handlers && res.data.handlers.length) {
									let handlers = [];
									res.data.handlers.forEach(handler => {
										handlers.push(handler.loginId);
									});
									message = res.msg + ",审批人：" + handlers.join(",");
								} else {
									message = res.msg;
								}
								_this.$message({
									duration: 2000,
									message: message,
									type: "success"
								});
								_this.personSelect = false;
								_this.$router.push({
									path: "/todoProcess"
								});
							} else {
								loading.close();
								_this.$message({
									duration: 2000,
									message: res.msg,
									type: "error"
								});
							}
							// 处理成功的结果
						},
						function(res) {
							// 处理失败的结果
						}
					);
				} else {
					this.$message.error("请选择转发人员");
				}
			},
			setReminders() { //设置流程提醒人
				this.$refs.openReminders.openDialog()
			},
			setNewRemindData() {
				this.remindOriginData = JSON.parse(JSON.stringify(this.remindData))
			},
			resetRemindData() {
				this.remindData = JSON.parse(JSON.stringify(this.remindOriginData))
			}
		}
	};
</script>

<style scoped>
	.title {
		color: #333333;
		display: flex;
		align-items: center;
		font-weight: bold;
		font-size: 18px;
		height: 57px;
		background-color: white;
		justify-content: space-between;
		/* padding: 0 20px; */
		/* border-bottom: 2px solid rgba(243,248,249,1); */
	}

	.box {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		background-color: #fff;
		box-sizing: border-box;
		height: 100%;
		/* padding: 0 20px 20px 20px; */
	}

	#show-log {
		width: 90%;
		margin: 0 auto;
		position: relative;
	}

	#show-log:before {
		content: "";
		position: absolute;
		top: 0;
		left: 18px;
		height: 100%;
		width: 4px;
		background: #f1f1f1;
	}

	#show-log li {
		position: relative;
		margin-bottom: 20px;
	}

	#show-log li .log-logo {
		padding-left: 1px;
		padding-top: 1px;
		background: #ccc;
		position: absolute;
		top: 0;
		left: 0;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		font-size: 16px;
		border: 3px solid #f1f1f1;
		text-align: center;
	}

	#show-log li .log-logo i {
		display: block;
		width: 24px;
		height: 24px;
		position: relative;
		left: 50%;
		top: 50%;
		margin-left: -12px;
		margin-top: -9px;
	}

	#show-log li .log-message {
		background: #f5f5f5;
		position: relative;
		margin-left: 60px;
		border-radius: 0.25em;
		padding: 1em;
	}

	#show-log li .log-message:before {
		content: "";
		position: absolute;
		top: 16px;
		right: 100%;
		height: 0;
		width: 0;
		border: 7px solid transparent;
		border-right: 7px solid white;
		border-color: transparent #f5f5f5 transparent transparent;
	}

	.spbox {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.spboxs {
		padding: 20px;
		box-sizing: border-box;
		border: 1px solid rgba(238, 238, 238, 1);
		border-right: none;
		/* box-shadow:0px 0px 24px 0px rgba(115,115,115,0.14); */
		margin-top: 20px;
	}

	.tg {
		width: 100px;
		height: 44px;
		background: rgba(33, 216, 102, 1);
		border-radius: 4px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		cursor: pointer;
		margin-right: 10px;
	}

	.tg>img {
		margin-right: 5px;
	}

	.jj {
		width: 100px;
		height: 44px;
		background: #FFB11A;
		border-radius: 4px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		cursor: pointer;
		margin-right: 10px;
	}

	.jj>img {
		margin-right: 5px;
	}

	.zj {
		width: 100px;
		height: 44px;
		background: #837AFB;
		border-radius: 4px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		cursor: pointer;
	}

	.tx {
		width: 100px;
		height: 44px;
		background: rgba(0, 130, 253, 1);
		border-radius: 4px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		cursor: pointer;
		margin-left: 10px;
		margin-right: 10px;
	}

	.tx>img {
		margin-right: 5px;
	}

	.zj>img {
		margin-right: 5px;
	}
</style>

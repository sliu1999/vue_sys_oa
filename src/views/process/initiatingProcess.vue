<template>
	<div style="margin-left:10px">
		<div class="mod-btns" style="width: 100%">
			<div style="display: flex;justify-content: space-between">
				<div style="display: flex">
					<el-button type="primary" @click="submitForm('')" size="medium">提交</el-button>
					<div @click="setReminders()" class="tx">
						通知
					</div>
					<div style="height: 44px;line-height: 44px" v-if="remindOriginData.notifiedId">(已提醒{{remindOriginData.notifiedId.split(',').length}}人)</div>
				</div>
				<div>
					<!-- <el-button style="height:44px" type="primary" v-print="printMe" size="medium">打印</el-button> -->
				</div>

			</div>

		</div>
		<usersChoose ref="openHandlers"></usersChoose>
		<remindAdd v-if="tableKey" ref="openReminders" :data.sync="remindData"></remindAdd>
		<div class="mod-body" id="printMe">
			<div class="mod-name">{{curModName}}</div>
			<renderCreated v-if="curModName" :tableSchema.sync="tableSchema" :formView.sync="formView" :formData.sync="formData"
			 :tableKey.sync="tableKey" :hideTable.sync="hideTable" :hideTableDetail.sync="hideTableDetail"></renderCreated>
		</div>
	</div>
</template>

<script>
	/**
	 * @desc 统一加载注册组件资源
	 */
	import renderCreated from '@/views/render/renderCreated' //表单视图渲染
	import usersChoose from '@/views/public/users_choose' //人员选择
	import formTableDesignApi from '@/api/formTableDesign/formTableDesign'
	import formDataApi from '@/api/formData/formData'
	import remindAdd from '@/views/remind/add' //流程通知
	export default {
		name: "initiatingProcess",
		created: function() {
			this.init();
		},
		components: {
			renderCreated,
			formTableDesignApi,
			formDataApi,
			usersChoose,
			remindAdd
		},
		data() {
			return {
				curModId: this.$route.query.id, //获取到发起的表单id
				showPeopleChoose: false, //判断提交时是否需要选择人员节点
				curModName: '',
				tableSchema: '',
				formData: {},
				hideTable: [],
				hideTableDetail: [],
				tableKey: '',
				detailKeys: '',
				formView: [],
				fileList: [],
				fileIds: '',
				interface: "",
				payload: null,
				personsData: null,
				remindData: {}, //流程提醒数据
				remindOriginData: {},
				printMe: {
					id: "printMe",
					popTitle: "",
				},
			}
		},
		watch: {
			$route() {
				this.curModId = this.$route.query.id;
				console.log(this.curModId)
				this.searchData = {};
				this.init();
			}
		},
		methods: {
			init() {
				this.curModName = '';
				let _this = this;
				formTableDesignApi.select(_this.curModId).then( // 获取表单
					function(res) {
						_this.formData = {};
						_this.tableSchema = res.data.tableSchema;
						_this.curModName = res.data.name;
						_this.printMe.popTitle = res.data.name;
						_this.remindOriginData = {
							notifyTitle:
							'来自' + (window.sessionStorage.getItem('user-info-session') ? JSON.parse(window.sessionStorage.getItem(
								'user-info-session')).username : '') + '发起的' + _this.curModName + '的提醒',
							notifiedId: ''
						}
						if (res.data.startNodeConfig.hideTable) _this.hideTable = res.data.startNodeConfig.hideTable.length ?
							res.data.startNodeConfig.hideTable.split(",") : []
						else _this.hideTable = [];
						if (res.data.startNodeConfig.hideTableDetail) {
							_this.hideTableDetail = res.data.startNodeConfig.hideTableDetail
							_this.hideTableDetail.forEach(val => {
								if (val.hostId.length) {
									val.hostId = val.hostId.split(",")
								} else {
									val.hostId = []
								}
							})
						}
						_this.remindData = JSON.parse(JSON.stringify(_this.remindOriginData))
						_this.tableKey = res.data.tableKey;
						_this.formView = res.data.formView;
						_this.detailKeys = res.data.detailKeys;

						console.log(res.data,"res.data")
						// 处理成功的结果
					},
					function(res) {
						// 处理失败的结果
					}
				);
			},

			//提交表单数据，发起流程
			submitForm(originPayload) {
				let flagValidated = true;
				let tableSchema = JSON.parse(this.tableSchema)
				for (let i = 0; i < tableSchema.length; i++) {
					if (tableSchema[i].required && (!this.formData[tableSchema[i].id] || ((typeof this.formData[tableSchema[i].id] !=
							'number') && (!this.formData[tableSchema[i].id].length))) &&
						this.formData.hasOwnProperty(tableSchema[i].id)) {
						this.$message({
							duration: 2000,
							message: tableSchema[i].name + '为必填项',
							type: 'error'
						});
						flagValidated = false;
						break;
					}
					if (tableSchema[i].flagDetail) {
						for (let j = 0; j < tableSchema[i].fields.length; j++) {
							if (tableSchema[i].fields[j].required) {
								for (let k = 0; k < this.formData[tableSchema[i].id].length; k++) {
									if ((!this.formData[tableSchema[i].id][k][tableSchema[i].fields[j].id] || ((typeof this.formData[
											tableSchema[i]
											.id][k][tableSchema[i].fields[j].id] != 'number') && (!this.formData[tableSchema[i]
											.id][k][tableSchema[i].fields[j].id].length))) && this.formData[tableSchema[i].id][k].hasOwnProperty(
											tableSchema[i].fields[j].id)) {
										this.$message({
											duration: 2000,
											message: tableSchema[i].fields[j].name + '为必填项',
											type: 'error'
										});
										flagValidated = false;
										break;
									}
								}
							}
						}
					}
				}
				if (flagValidated) {
					let payload = {};
					if (originPayload) {
						payload = JSON.parse(JSON.stringify(originPayload));
					} else {
						payload.module = {};
						payload.module.tableKey = this.tableKey;
						payload.module.detailKeys = this.detailKeys;
						payload.formData = this.formData;
						payload.notifyConfig = this.remindData;
						payload.module.id = this.curModId
					}
					const loading = this.$loading({
						lock: true,
						text: '提交中',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					let _this = this;
					formDataApi.submit(payload).then( //提交表单
						function(res) {
							let message
							//提交成功
							if (res.errorCode == 0) {
								loading.close();
								console.log(res)
								if (res.data && res.data.handlers && res.data.handlers.length) {
									let handlers = [];
									res.data.handlers.forEach(handler => {
										handlers.push(handler.loginId)
									})
									message = res.data.message + ',审批人：' + handlers.join(',')
								} else {
									message = res.data.message
								}
								_this.$message({
									duration: 2000,
									message: message,
									type: 'success'
								});
								_this.$router.push({
									path: '/historyProcess'
								});
							//流程配置了审批人可选，前端没传审批人，需要前端勾选审批人
							} else if (res.errorCode == 2 ) {
								loading.close();
								_this.$refs.openHandlers.openDialog(res.data.assignee, payload, res.data.handlerSelectConfig,
									'submit')
							} else {
								loading.close();
								_this.$message({
									duration: 2000,
									message: res.data.msg,
									type: 'error'
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
	}
</script>

<style scoped>
	.tx {
		width: 70px;
		height: 44px;
		background: rgba(0, 130, 253, 1);
		border-radius: 4px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		cursor: pointer;
		margin-left: 10px;
		font-size: 14px;
		margin-right: 10px;
	}

	.tx>img {
		width: 18px;
		height: 18px;
	}

	.mod-name {
		height: 50px;
		text-align: center;
		font-weight: bold;
		font-size: 20px;
		background: #F8F8F8;
		border: 1px solid #e8e8e8;
		font-family: "Microsoft YaHei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif;
		padding: 5px 8px;
		margin-top: 10px;
	}


	.formLabel {
		font-weight: 450;
	}

	/* .mod-body {
		position: absolute;
		top: 80px;
		bottom: 0;
		overflow-y: auto;
	} */

	.mod-file {
		font-weight: bold;
		font-size: 18px;
		padding: 5px 8px;
		background: #F8F8F8;
		border-bottom: 1px solid #e8e8e8;
	}
</style>

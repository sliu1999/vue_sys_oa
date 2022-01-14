<template>
	<table id="newForm" class="newForm" cellspacing="0" cellpadding="0">
		<tr v-for="(html,index) in htmls">
			<td v-for="(content,index) in html.content" :colspan="content.colspan" :rowspan="content.rowspan" :style="content.contentStyle"
			 :class="{formLabel:content.html=='test'}" v-if="!content.fieldHide">
				<span style="color:red;position:absolute;top:0;right:0;font-size: 25px;" v-if="content.required&&formData.hasOwnProperty(content.id)&&content.id">*</span>
				<component v-if="formData.hasOwnProperty(content.id)||!content.id" :is="content.html" :val.sync="formData[content.id]"
				 :name.sync="content.name" :config.sync="content.config" :fields.sync="content.fields" :id.sync="content.id"
				 :parent.sync="formData" :tableKey.sync="tableKey" :tableData.sync="tableData"></component>
				<!-- is绑定组件名称  val绑定表单字段的值   name绑定表单字段的名称   config绑定各组件的配置信息   fields绑定明细表的所有字段及其字段信息   id绑定表单字段的id   parent绑定整个表单对象的数据   tableKey绑定当前表单表名 -->
				<p v-if="!formData.hasOwnProperty(content.id)&&content.id" style="color: #ccc;">用户无权限</p>
			</td>
		</tr>
	</table>
</template>

<script>
	// 文本
	import inputcommon from '@/views/public/input_common' //文本框
	import inputtext from '@/views/public/input_text' //多行文本框，可设置最小行和最大行

	//数字
	import inputnumber from '@/views/public/input_number' //数字文本框
	import rmb from '@/views/public/rmb' //人民币大写 要选择对应的人民币字段
	import formula from '@/views/public/formula' //公式计算 要填写计算公式 如字段*0.8 显示公式计算的结果
	import detailsum from '@/views/public/detail_sum' //明细表汇总 要选择明细表及字段 用于显示明细表某个字段的合计或平均

	//时间
	import datepicker from '@/views/public/date_picker' //日期控件 可选精度为日期或日期时间
	import timepicker from '@/views/public/time_picker' //时间控件
	import datediff from '@/views/public/datediff' //时间差 选择计算开始时间字段及结束时间字段及时间精度
	import exceed from '@/views/public/exceed' //超时时间 要选择截止时间字段及精度 用于展示超时的时间结果

	//展示信息
	import selectcommon from '@/views/public/select_common' //部门岗位下拉框 普通下拉框，数据源目前只有部门，岗位内容
	import dictionary from '@/views/public/dictionary' //数据字典  要选择字典
	import cascader from '@/views/public/cascader' //联动字典 要选择联动的字典
	import users from '@/views/public/users' //人员选择框
	import upload from '@/views/public/upload' //文件上传


	import currenttime from '@/views/public/current_time' //当前时间
	import messages from '@/views/public/messages' //审批意见汇总
	import displayonly from '@/views/public/displayonly' //只读文本

	import test from '@/views/public/test' //表单字段中文名称
	import detail_created from '@/views/public/detail_created' //明细表
	import readonly from '@/views/public/readonly' //展示数据信息（不关联其他组件）
	import convert_dictionary from '@/views/public/convert_dictionary' //数据字典查看
	import convert_cascader from '@/views/public/convert_cascader' //联动字典查看
	import convert_select from '@/views/public/convert_select' //岗位部门下拉框查看
	import convert_users from '@/views/public/convert_users' //人员选择框查看
	import view_files from '@/views/public/view_files' //文件查看
  	import textarea_readonly from '@/views/public/textarea_readonly' //多行文本只读

	export default {
		name: 'renderForm',
		props: {
			tableSchema: '',
			formView: '',
			formData: {},
			tableKey: '',
			pageAccess: false,
			hideTableDetail: null,
			hideTable: null
		},
		components: {
			inputcommon,
			inputtext,
			test,
	 		detail_created,
			inputnumber,
	 		selectcommon,
	 		datepicker,
	 		formula,
	 		readonly,
	 		timepicker,
	 		rmb,
	 		datediff,
	 		currenttime,
	 		detailsum,
	 		dictionary,
	 		users,
	 		convert_dictionary,
	 		convert_select,
	 		convert_users,
	 		exceed,
	 		displayonly,
	 		cascader,
	 		convert_cascader,
	 		upload,
	 		view_files,
	 		messages,
    	    textarea_readonly
		},
		watch: {
			// htmls(newVal){
			//   console.log(newVal)
			// },
			tableSchema(newVal) {
				this.tableData = JSON.parse(newVal)
			},
			formData: {
				handler: function(val, oldval) {
					let _this = this
					this.htmls.forEach(res => {
						for (let i = 0; i < res.content.length; i++) {
							if (res.content[i].typeText && res.content[i].html != "detail_created") {
								if (res.content[i].flagField) {
									if (res.content[i].toggleField === false) {
										if (res.content[i].relatedFieldValue === val[res.content[i].relatedField]) {
											res.content[i].fieldHide = true
											res.content[i - 1].fieldHide = true
											val[res.content[i].id] = ""
											_this.tableData.forEach(item => {
												if (item.id == res.content[i].id) {
													item.required = false
												}
											})
										} else {
											res.content[i].fieldHide = false
											res.content[i - 1].fieldHide = false
											_this.tableData.forEach(item => {
												if (item.id == res.content[i].id) {
													item.required = item.isRequired
												}
											})
										}
									} else if (res.content[i].toggleField === true) {
										if (res.content[i].relatedFieldValue === val[res.content[i].relatedField]) {
											res.content[i].fieldHide = false
											res.content[i - 1].fieldHide = false
											_this.tableData.forEach(item => {
												if (item.id == res.content[i].id) {
													item.required = item.isRequired
												}
											})
										} else {
											res.content[i].fieldHide = true
											res.content[i - 1].fieldHide = true
											val[res.content[i].id] = ""
											_this.tableData.forEach(item => {
												if (item.id == res.content[i].id) {
													item.required = false
												}
											})
										}
									}
								}
							}
						}
					})
					for (let key in this.formData) {
						if (this.hideTable.indexOf(key) != -1) {
							delete _this.formData[key]
						}
					}
					if (this.hideTableDetail && this.hideTableDetail.length) {
						this.hideTableDetail.forEach(res => {
							if (res.hostId) {
								res.hostId.forEach(item => {
									console.log(item)
									if (_this.formData[item]) {
										_this.formData[item].forEach(val => {
											console.log(val)
											for (let key in val) {
												if (res.orderId.indexOf(key) != -1) {
													delete val[key]
												}
											}
										})
									}
								})
							}
						})
					}
					_this.$emit('update:tableSchema', JSON.stringify(_this.tableData))
				},
				deep: true
			}
		},
		created: function() {
			this.init();
		},
		
		methods: {
			init() {
				let _this = this
				let formView = JSON.parse(this.formView);
				let tableSchema = JSON.parse(this.tableSchema);
				formView.forEach((item, index) => {
					item.content.forEach((content) => {
						content.contentStyle = {
							width: content.id ? 100 / Number(item.content.length * content.colspan) + 10 + '%' : 100 /
								Number(item.content.length * content.colspan) - 10 + '%'
						}
						tableSchema.forEach((field, key) => {
							if (field.id == content.id) {
								if (field.flagDetail) {
									content.fields = field.fields;
									content.html = 'detail_created';
									content.config = field.config ? field.config : {};
									if (!_this.pageAccess) {
										let detailObj = {}
										field.fields.forEach((value) => {
											detailObj[value.id] = null
										})
										this.$set(this.formData, field.id, this.formData[field.id] || [detailObj])
									}
								} else {
									if (field.required) {
										content.required = true;
									}
									content.html = field.flagEdit ? this.ctrlRef[field.ctrl] : this.viewRef[field.ctrl]; //根据tableSchema里的flagEdit判断使用编辑组件还是查看组件
									content.config = field.config ? field.config : {};
									if (!_this.pageAccess) {
										if (this.formData[field.id] || this.formData[field.id] == 0) {
											this.$set(this.formData, field.id, this.formData[field.id])
										} else {
											if (field.default) {
												this.$set(this.formData, field.id, field.default)
											} else {
												this.$set(this.formData, field.id, null)
											}
										}
										// this.$set(this.formData, field.id, this.formData[field.id] ? this.formData[field.id] :
										//   field.default ? field.default : null) //初始化formData值，包括隐藏字段，触发视图更新
									}
								}
							} else {
								if (!_this.pageAccess) {
									if (this.formData[field.id] || this.formData[field.id] == 0) {
										this.$set(this.formData, field.id, this.formData[field.id])
									} else {
										if (field.default) {
											this.$set(this.formData, field.id, field.default)
										} else {
											this.$set(this.formData, field.id, null)
										}
									}
									// this.$set(this.formData, field.id, this.formData[field.id] ? this.formData[field.id] :
									//   field.default ? field.default : null)
								}
							}
						})
					})
				});
				formView.forEach(res => {
					for (let i = 0; i < res.content.length; i++) {
						if (res.content[i].typeText && res.content[i].html != "detail_created") {
							if (res.content[i].flagField) {
								if (res.content[i].toggleField === false) {
									if (res.content[i].relatedFieldValue === _this.formData[res.content[i].relatedField]) {
										res.content[i].fieldHide = true
										res.content[i - 1].fieldHide = true
										_this.formData[res.content[i].id] = ""
										_this.tableData.forEach(item => {
											if (item.id == res.content[i].id) {
												item.required = false
											}
										})
									} else {
										res.content[i].fieldHide = false
										res.content[i - 1].fieldHide = false
										_this.tableData.forEach(item => {
											if (item.id == res.content[i].id) {
												item.required = item.isRequired
											}
										})
									}
								} else if (res.content[i].toggleField === true) {
									if (res.content[i].relatedFieldValue === _this.formData[res.content[i].relatedField]) {
										res.content[i].fieldHide = false
										res.content[i - 1].fieldHide = false
										_this.tableData.forEach(item => {
											if (item.id == res.content[i].id) {
												item.required = item.isRequired
											}
										})
									} else {
										res.content[i].fieldHide = true
										res.content[i - 1].fieldHide = true
										_this.formData[res.content[i].id] = ""
										_this.tableData.forEach(item => {
											if (item.id == res.content[i].id) {
												item.required = false
											}
										})
									}
								}
							}
						}
					}
				})
				for (let key in this.formData) {
					if (this.hideTable.indexOf(key) != -1) {
						delete _this.formData[key]
					}
				}
				console.log(this.hideTableDetail)
				if (this.hideTableDetail && this.hideTableDetail.length) {
					this.hideTableDetail.forEach(res => {
						if (res.hostId) {
							res.hostId.forEach(item => {
								console.log(item)
								if (_this.formData[item]) {
									_this.formData[item].forEach(val => {
										console.log(val)
										for (let key in val) {
											if (res.orderId.indexOf(key) != -1) {
												delete val[key]
											}
										}
									})
								}
							})
						}
					})
				}
				console.log(this.formData)
				this.htmls = formView;
			}
		},
		data() {
			return {
				ctrlRef: { //可编辑时对应组件名
					'text': 'inputcommon',
					'textarea': 'inputtext',
					'select': 'selectcommon',
					'datetime': 'datepicker',
					'formula': 'formula',
					'displayonly': 'displayonly',
					'time': 'timepicker',
					'rmb': 'rmb',
					'datediff': 'datediff',
					'number': 'inputnumber',
					'current': 'currenttime',
					'sum': 'detailsum',
					'dictionary': 'dictionary',
					'cascader': 'cascader',
					'sql': 'sql',
					'users': 'users',
					'sequence': 'sequence',
					'exceed': 'exceed',
					'info': 'currentuser',
					'datecal': 'datecal',
					'upload': 'upload',
					'messages': 'messages',
					'history': 'history',
				},
				viewRef: { //查看时对应组件名
					'text': 'readonly',
					'textarea': 'textarea_readonly',
					'select': 'convert_select',
					'datetime': 'readonly',
					'formula': 'readonly',
					'displayonly': 'readonly',
					'time': 'readonly',
					'rmb': 'readonly',
					'datediff': 'readonly',
					'number': 'readonly',
					'current': 'readonly',
					'sum': 'readonly',
					'dictionary': 'convert_dictionary',
					'cascader': 'convert_cascader',
					'sql': 'convert_sql',
					'users': 'convert_users',
					'sequence': 'readonly',
					'exceed': 'readonly',
					'info': 'readonly',
					'datecal': 'readonly',
					'upload': 'view_files',
					'messages': 'messages',
					'history': 'history_view'
				},
				htmls: [],
				tableData: JSON.parse(this.tableSchema)
			}
		}
	}
</script>

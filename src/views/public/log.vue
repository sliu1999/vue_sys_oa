<template>
  <div style="padding:30px 10px">
    <ul id="show-log" v-bind:style="styleObj">
      <li v-for="item in logData">
        <div class="log-logo">
          <i style="color:#1989FA ;" v-if="item.actionId==1" class="el-icon-s-help"></i>
          <i style="color:#07c160 ;" v-if="item.actionId==2" class="el-icon-success"></i>
          <i style="color:#EE0A24 ;" v-if="item.actionId==3" class="el-icon-error"></i>
          <i style="color:#1989FA ;" v-if="item.actionId==4" class="el-icon-s-promotion"></i>
          <i style="color:#909399 ;" v-if="item.actionId==5" class="el-icon-s-tools"></i>
					<i style="color:purple ;" v-if="item.actionId==7" class="el-icon-warning-outline"></i>
        </div>
        <div class="log-message">
          <div v-if="item.actionId==1">
            <p style="font-size: 14px;">
              由<strong>{{item.curAssigneeName}}</strong>发起
            </p>
            <p style="font-size: 14px;">
              交由<strong>{{item.nextNodeName}}</strong>由<strong>{{item.nextAssigneeName}}</strong>审批
            </p>
            <p style="font-size: 12px;">{{item.createDate}}</p>
          </div>
          <div v-if="item.actionId==2">
            <p style="font-size: 14px;">
              在<strong>{{item.curNodeName}}</strong>由<strong>{{item.curAssigneeName}}</strong>审批通过
            </p>
            <p style="font-size: 14px;">
              审批意见:{{item.message}}
            </p>
            <p style="font-size: 14px;">
              交由<strong>{{item.nextNodeName}}</strong>由<strong>{{item.nextAssigneeName}}</strong>审批
            </p>
            <p style="font-size: 12px;">{{item.createDate}}</p>
          </div>
          <div v-if="item.actionId==3">
            <p style="font-size: 14px;">
              在<strong>{{item.curNodeName}}</strong>由<strong>{{item.curAssigneeName}}</strong>审批拒绝
            </p>
            <p style="font-size: 14px;">
              审批意见:{{item.message}}
            </p>
            <p style="font-size: 14px;">
              交由<strong>{{item.nextNodeName}}</strong>由<strong>{{item.nextAssigneeName}}</strong>审批
            </p>
            <p style="font-size: 12px;">{{item.createDate}}</p>
          </div>
          <div v-if="item.actionId==4">
            <p style="font-size: 14px;">
              <strong>{{item.curAssigneeName}}</strong>在<strong>{{item.curNodeName}}</strong>转交给<strong>{{item.nextAssigneeName}}</strong>审批
            </p>
            <p style="font-size: 14px;">
              审批意见:{{item.message}}
            </p>
            <p style="font-size: 12px;">{{item.createDate}}</p>
          </div>
          <div v-if="item.actionId==5">
            <p style="font-size: 14px;">
              在<strong>{{item.curNodeName}}</strong>由<strong>{{item.curAssigneeName}}</strong>审批通过
            </p>
            <p style="font-size: 14px;">
              审批意见:{{item.message}}
            </p>
            <p style="font-size: 14px;">
              流程结束
            </p>
            <p style="font-size: 12px;">{{item.createDate}}</p>
          </div>
		  <div v-if="item.actionId==7">
		  	<p style="font-size: 14px;">
		  		在<strong>{{item.curNodeName}}</strong>由<strong>{{item.curAssigneeName}}</strong>撤回到<strong>{{item.nextNodeName}}</strong>
		  	</p>
		  	<p style="font-size: 14px;">
		  		审批意见:{{item.message}}
		  	</p>
		  	<p style="font-size: 12px;">{{item.createDate}}</p>
		  </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "log",
    props: {
      logData: null
    },
    data() {
      return {
        // logData: null
        styleObj:{
          height:""
        }
      }
    },
    mounted: function() {
      console.log(this.logData)
      if (this.logData[this.logData.length - 1].actionId === 5) {
        let ulHeight = document.getElementById("show-log").offsetHeight
        let liHeight = document.querySelector("#show-log li:last-child").offsetHeight
        this.styleObj.height = (ulHeight - liHeight)+"px"
      }
    }
  }
</script>

<style scoped>
  #show-log {
    width: 90%;
    margin: 0 auto;
    position: relative;
  }

  #show-log:before {
    content: '';
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
    content: '';
    position: absolute;
    top: 16px;
    right: 100%;
    height: 0;
    width: 0;
    border: 7px solid transparent;
    border-right: 7px solid white;
    border-color: transparent #f5f5f5 transparent transparent;
  }
</style>

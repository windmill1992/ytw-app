<template>
	<view>
		<van-sticky>
			<view class="absTop" @tap.stop="true">
				<view class="detailTop">
					<input type="text" class="topSearch" @confirm="searchInput" confirm-type="search"
						placeholder="输入厂名搜索"></input>
					<van-button color="#18c2ba" @tap.stop="addManufactor" :data-info="orderDetail.order"
						custom-style="display:inline-block;width:220rpx;height:62rpx;vertical-align: top;line-height:62rpx;float:right;border-radius:15rpx;padding:0 6px;">
						新 增 厂 家</van-button>
				</view>
				<view class="someOrderInfo">
					<view class="someOrderInfo1">
						<view>封包倒计时</view>
						<view class="colfe751b fw550">{{ orderDetail.order.count_down }}</view>
					</view>
					<view class="someOrderInfo1" style="flex:1.3;">
						<view>仓位号</view>
						<view class="colff4848 fw550">{{ orderDetail.order.position_name }}</view>
					</view>
					<view class="someOrderInfo1">
						<view>送货确认码</view>
						<view class="coltheme fw550">{{ orderDetail.order.auth_code }}</view>
					</view>
				</view>

				<view class="detailLevel3">
					<view>厂家数:<text :style="factory.length > 0 ? '#18c2ba' : '#666'">{{factory.length}}个</text>
					</view>
					<view>总收货:<text
							:class="{coltheme: calculation_receive_num > 0}">{{calculation_receive_num}}手</text><text
							style="font-size:18rpx;" v-if="hasInherit">(含结余)</text></view>
					<view>已拉包:<text
							:style="'color:' + calculation_take_num > 0 ? '#18c2ba' : ''">{{calculation_take_num}}手</text>
					</view>
					<view><text class="screenBtn" @tap.stop="_showScreen">{{showType == 5 ? '取消码' : '筛选'}}</text></view>
				</view>
				<view class="operationBoxx" v-if="showScreen">
					<view class="operationItem" v-for="(item, index) in operations" :key="'op' + index"
						:data-index="item.index" @tap.stop="switchFac"
						:style="'color:' + (item.name == '全部拉包' || item.name == '部分拉包') ? '#18c2ba' : ''">
						{{ item.name }}
						<van-icon name="success" :data-index="item.index" @tap.stop="switchFac"
							v-if="item.index == showType" style="position:absolute;right:0rpx;top:10rpx;" />
					</view>
				</view>
				<view class="detailFacBox">
					<view class="detailFacTitle">
						<view class="titleItem" @tap.stop="sortFac" data-type="manufactor_name" data-index="0"
							style="flex:1;line-height: 60rpx;"><text class="vts">厂名 </text>
							<view class="displayInlineBlock">
								<image class="absupdown bllur"
									src="https://www.yitongwang.com/public/static/images/uup.png"></image>
								<image class="absupdown" src="https://www.yitongwang.com/public/static/images/ddn.png">
								</image>
							</view>
						</view>
						<view class="titleItem" @tap.stop="sortFac" data-type="num1" data-index="1"
							style="flex:.6;line-height: 60rpx;"><text class="vts">预约</text><text class="vts fs20">(手)
							</text>
							<view class="displayInlineBlock">
								<image class="absupdown" src="https://www.yitongwang.com/public/static/images/uup.png">
								</image>
								<image class="absupdown" src="https://www.yitongwang.com/public/static/images/ddn.png">
								</image>
							</view>
						</view>
						<view class="titleItem" @tap.stop="sortFac" data-type="num2" data-index="2" style="flex:.6;">
							<text class="vts w80"> 收货 未打包</text>
							<view class="displayInlineBlock" style="height:54rpx;">
								<image class="absupdown" src="https://www.yitongwang.com/public/static/images/uup.png">
								</image>
								<image class="absupdown" src="https://www.yitongwang.com/public/static/images/ddn.png">
								</image>
							</view>
						</view>
						<view class="titleItem" @tap.stop="sortFac" data-type="num3" data-index="2" style="flex:.6;">
							<text class="vts w80"> 打包 未拉走</text>
							<view class="displayInlineBlock" style="height:54rpx;">
								<image class="absupdown" src="https://www.yitongwang.com/public/static/images/uup.png">
								</image>
								<image class="absupdown" src="https://www.yitongwang.com/public/static/images/ddn.png">
								</image>
							</view>
						</view>
						<view class="titleItem" @tap.stop="sortFac" data-type="num4" data-index="3"
							style="flex:.6;line-height: 60rpx;"><text class="vts">已拉包</text>
							<view class="displayInlineBlock">
								<image class="absupdown" src="https://www.yitongwang.com/public/static/images/uup.png">
								</image>
								<image class="absupdown" src="https://www.yitongwang.com/public/static/images/ddn.png">
								</image>
							</view>
						</view>
						<view class="titleItem vts"
							:style="'flex:.4;line-height: 60rpx;font-size:' + showType == 5 ? '23rpx' :  '26rpx'">
							{{ showType == 5 ? '取消码' :  '操作'}}
						</view>
					</view>
					<view class="dotedLine"></view>
				</view>
			</view>
		</van-sticky>

		<view class="mask1" @touchmove.stop="true" @tap.stop="closeScreen" v-if="showScreen"></view>
		<view class="mask22" @touchmove.stop="true" @tap.stop="closeScreen" v-if="showScreen2"></view>
		<!-- 厂家部分  -->
		<view class="detailFacBox" style="padding-top:330rpx;">
			<view class="facItem" v-for="(item, index) in factory" :key="'fac' + index">
				<view class="facItemL" style="flex:2.8;" :data-index="index" @tap.stop="seeFacLog">
					<view style="flex:.8;" class="facItemName">{{item.manufactor_name}}</view>
					<view style="flex:.5;position:relative;">{{item.num1}}</view>
					<view style="flex:.5;">{{item.num2}}</view>
					<view style="flex:.5;">{{item.num3}}</view>
					<view style="flex:.5;">{{item.num4}}</view>
				</view>
				<view class="facItemR" style="background-color:#fff;flex:.4;">
					<van-icon v-if="showType != 5" :info="item.dotted > 0 ? item.dotted : ''" @tap.stop="doOperation"
						:data-index="index" name="more-o" size="50rpx"
						:color="item.dotted == -1 ? '#18c2ba' : '#ff5656'"
						style="position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);" />
					<view v-if="showType == 5" class="facCancelCode">
						<view v-if="item.cancel_code > 0" style="font-size:23rpx;line-height:50rpx;">取消码</view>
						<view v-if="item.cancel_code > 0" style="font-size:23rpx;line-height:14rpx;">
							{{item.cancel_code}}
						</view>
						<view v-if="item.cancel_code == 0">-</view>
					</view>
				</view>
			</view>
		</view>

		<view class="mask2" v-if="showMask2" @touchmove.stop="true" @tap.stop="clickFacOpera" data-type="back">
			<view class="operaFacItemBox">
				<view class="operaFacItem operaFacItem2 "
					:style="'width:' + centerFacName.length > 5 ? '60%' : '40%' + ';padding-left:8rpx;'"
					@tap.stop="clickFacOpera" data-type="back2">
					<text class="facNameCenter">{{centerFacName}}</text>
				</view>
				<view class="operaFacItem" @tap.stop="clickFacOpera" data-type="log">
					<image class="operaFacItemImg" :src="url + '/public/static/images/minniapp/pinbao-detail-log.png'">
					</image>
					<view class="itemView2">
						<view>记录</view>
						<view class="col444">预约记录、收货记录、打包记录、拉包记录</view>
					</view>
				</view>
				<view class="operaFacItem" @tap.stop="clickFacOpera" data-type="urge">
					<image class="operaFacItemImg" :src="url + '/public/static/images/minniapp/pinbao-detail-urge.png'">
					</image>
					<view class="itemView2">
						<view>催送货</view>
						<view class="col444">可电话或微信催促厂家送货</view>
					</view>
				</view>
				<view class="operaFacItem" @tap.stop="clickFacOpera" data-type="modify">
					<image class="operaFacItemImg"
						:src="url + '/public/static/images/minniapp/pinbao-detail-modify.png'">
					</image>
					<view class="itemView2">
						<view>修改</view>
						<view class="col444">可修改该厂名或预约数量</view>
					</view>
				</view>
				<view class="operaFacItem" @tap.stop="clickFacOpera" data-type="cancel"
					:style="'background-color:' + cancelItemTxt == '取消该厂家' ? '' : '#fcc755'">
					<image class="operaFacItemImg"
						:src="url + '/public/static/images/minniapp/pinbao-detail-cancel.png'">
					</image>
					<view class="fw550 itemView2" :class="{cancelFac: cancelItemTxt == '取消该厂家'}">
						<view>{{cancelItemTxt}}</view>
						<view class="col444">取消该厂家的拼包</view>
					</view>
				</view>
				<view v-if="inherit_num > 0" class="operaFacItem" @tap.stop="clickFacOpera" data-type="tips"
					style="background-color:#fcc755;">
					<image class="operaFacItemImg" :src="url + '/public/static/images/minniapp/pinbao-detail-exp.png'">
					</image>
					<view class="itemView2">
						<view>提示</view>
						<view class="col444">该厂家货物有{{inherit_num}}手由历史订单结余过来</view>
					</view>
				</view>
				<view v-if="facRemark != ''" class="operaFacItem" style="background-color:#fcc755;">
					<image class="operaFacItemImg"
						:src="url + '/public/static/images/minniapp/pinbao-detail-remark.png'">
					</image>
					<view class="itemView2">
						<view>收货备注</view>
						<view class="col444">{{ facRemark }}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部Bar  -->
		<view class="detailBottomBar" :style="bottomPosition">
			<view class="detailBottomBarL">
				<view style="font-weight:500;color:#444;">状态:</view>
				<view :style="'font-size:' + orderDetail.order.status_text.length > 6 ? '24rpx' : ''">
					{{ orderDetail.order.status_text }}
				</view>
			</view>
			<view class="detailBottomBarItem">
				<text @tap.stop="operationBtnOrder"
					v-if="orderDetail.order.order_status <= 5 && orderDetail.order.position_is_null != 1"
					data-type="txsh" :data-index="index" class="allOperationItem2 bottomBac1">提醒送货</text>
				<text @tap.stop="operationBtnOrder"
					v-if="orderDetail.order.apply_status != 1 && orderDetail.order.order_status == 0" data-type="qxyy"
					:data-index="index" class="allOperationItem2 bottomBac2">取消预约</text>
				<text @tap.stop="operationBtnOrder"
					v-if="orderDetail.order.order_status == 2 || orderDetail.order.order_status == 3" data-type="dbjl"
					:data-index="index" class="allOperationItem2 bottomBac2">打包记录</text>
				<text @tap.stop="operationBtnOrder" v-if="orderDetail.order.order_status == 1" data-type="ccdb"
					:data-index="index"
					class="allOperationItem2 bottomBac2">{{orderDetail.order.is_urge == 1 ? '已催促打包' : '催促打包'}}</text>
				<text @tap.stop="operationBtnOrder"
					v-if="orderDetail.order.order_status >= 2 && orderDetail.order.order_status <= 5" data-type="lbdh"
					:data-index="index" class="allOperationItem2 bottomBac1">拉包电话</text>
				<text @tap.stop="operationBtnOrder"
					v-if="orderDetail.order.order_status == 4 || orderDetail.order.order_status == 5" data-type="lbmx"
					:data-index="index" class="allOperationItem2 bottomBac2">拉包明细</text>
			</view>
			<view class="detailBottomBarR" @tap.stop="doOperation2">
				<van-icon
					:info="((orderDetail.order.cancel_code || orderDetail.order.apply_status == 1) > 0 ? 1 : '') + (orderDetail.order.is_exclamation_point == 1 ? 1 : '')"
					name="more-o" size="55rpx"
					:color="((orderDetail.order.cancel_code || orderDetail.order.apply_status == 1) > 0 || orderDetail.order.is_exclamation_point == 1) ? '#ff5656' : '#18c2ba'"
					style="position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);" />
			</view>
			<view></view>
		</view>

		<!-- 底部圆点更多弹起的 -->
		<view class="orderOperationItemBox" v-if="showMask3"
			:style="'bottom: 95rpx;height:' + (orderOperations.length * 66 + 20) + 'rpx;background-color:#fff;box-shadow: 0 0 5rpx #555;'">
			<view class="orderOperationItem" v-for="(item, index) in orderOperations" :key="'op' + index"
				:style="item.css ? 'background-color:#fcc755;color:#333;border-radius:10rpx;font-size:28rpx;' : ''"
				@tap.stop="clickRoundDoted" :data-type="item.index">{{item.name}} <text
					v-if="item.name == '重要信息' || item.name == '关闭订单/审核中'" class="absOrderOperaDoted">1</text>
			</view>
		</view>

		<!-- 正常提示 -->
		<van-popup :show="showInfo" @close="onInfoClose" z-index="105" custom-class="warningPopup">
			<view class="warningBox">
				<image class="warningImg"
					src="https://www.yitongwang.com/public/static/images/minniapp/subcontract-info-input.png"></image>
				<view class="warningTxt">{{ curManufactorName }}</view>
				<input class="editTelInput" v-model="curTel" placeholder-class="editTelplaceholdeInput"
					placeholder="请输入厂家电话" maxlength="11"></input>
				<view class="warningTxt">老厂家建议添加号码，下次</view>
				<view class="warningTxt">可直接拨打，无需翻通讯录</view>
				<view class="warningBtn2" @tap.stop="eidtTelAndCall">立即添加并拨打</view>
				<view class="infoPopupCancel" @tap.stop="onInfoClose">
					<van-icon name="close" size="40px" />
				</view>
			</view>
		</van-popup>
		<!-- 送齐，拉走，提示 -->
		<van-popup :show="showOtherTxt" @close="onOtherClose" z-index="105" custom-class="warningPopup">
			<view class="warningBox">
				<image class="warningImg"
					src="https://www.yitongwang.com/public/static/images/minniapp/subcontranct-err.png"></image>
				<view class="warningTxt">{{ editTxt }}</view>
				<view class="warningBtn1" @tap.stop="callAdmin">立 即 拨 打</view>
				<view class="warningBtn2" @tap.stop="onOtherClose">取 消</view>
			</view>
		</van-popup>
		<!-- 垃圾桶单独提示 -->
		<van-popup :show="showLjt" @close="onLjtClose" z-index="105" custom-class="warningPopup">
			<view class="warningBox">
				<image class="warningImg"
					src="https://www.yitongwang.com/public/static/images/minniapp/subcontranct-err.png"></image>
				<view class="warningTxt">{{ editTxt }}</view>
				<view class="warningBtn1" @tap.stop="delFromLajitong">立 即 删 除</view>
				<view class="warningBtn2" @tap.stop="onLjtClose">取 消</view>
			</view>
		</van-popup>
		<!-- 放海报的 -->
		<view v-if='share_btn'>
			<view class="prom-model">
				<icon type="cancel" color="gray" size="22" class="modal-close" bindtap="closeShareModal" />
				<view class="prom-title">{{ }}</view>
				<view class='share-pic'>
					<image @tap.stop='previewSharePic' style='width:100%;height:100%' :src='share_pic'></image>
				</view>
				<view class="share-save-btns">
					<view class="share-save-btn" @tap.stop="saveSharePic">保存海报</view>
				</view>
			</view>
		</view>

		<!-- 修改/记录 弹窗 -->
		<view class="modifyPopupcustom" @touchmove.stop="true" v-if="modifyPopupFlag">
			<view class="modifyPopup"
				:style="'height:' + modifyRecordInfo.reservation.length>5? '80vh' : '60vh' + ';margin-top:' + modifyRecordInfo.reservation.length>5? '9%' : '26%' + ';padding-bottom:110rpx;'">
				<view class="modifyCName">{{ modifyRecordInfo.manufactor_name }}</view>
				<view class="modifyTime">最晚封包时间：{{ modifyRecordInfo.appointment_time }}</view>
				<scroll-view @scroll="modifyScroll" scroll-y class="modifyPopupscroll">
					<view class="modifyRecordTitle">预约记录</view>
					<view class="modifyRecordContent">
						<view class="modifyRecordHead flx flx_r">
							<text>时间</text>
							<text>厂名</text>
							<text>预约数量</text>
						</view>
						<view class="modifyRecordItem flx flx_r" v-for="(item, index) in modifyRecordInfo.reservation"
							:key="'reser' + index">
							<view>
								<view>{{ m1.brTime( item.create_time,'a' ) }}</view>
								<view>{{ m1.brTime( item.create_time,'b' ) }}</view>
							</view>
							<view
								:style="'line-height:80rpx;color:' + (index > 0 && (item.manufactor_name != modifyRecordInfo.reservation[index-1].manufactor_name)) ? 'red' : ''">
								{{ (index > 0 && (item.manufactor_name != modifyRecordInfo.reservation[index-1].manufactor_name)) ? '改为' : '' }}{{ item.manufactor_name }}
							</view>
							<view
								:style="'line-height:80rpx;color:' + (index > 0 && (item.num != modifyRecordInfo.reservation[index-1].num)) ? 'red' : ''">
								{{ (index > 0 && (item.num != modifyRecordInfo.reservation[index-1].num)) ? '改为' : '' }}{{ item.num }}{{item.num == '未填' ? '' : '手'}}
							</view>
						</view>
					</view>
					<view class="newModify flx flx_r">
						<input :focus="modifyFocus1" v-model="curManufactorName"
							style="width:320rpx;" class="modifyInputName" :disabled="modifyNameDisabled"
							placeholder-class="modifyInput" :placeholder="modifyPlaceholderTxt" type="text"
							maxlength="12"></input>
						<input :focus="modifyFocus2" @input="correctNumInput" :value="correctNum" class="modifyInputSum"
							placeholder-class="modifyInput" placeholder="数量(非必填)" type="number" maxlength="4"></input>
					</view>
					<view style="height:150rpx;"></view>
				</scroll-view>
				<view class="modifyPopupBtns flx flx_r" @touchmove.stop="true"
					style="bottom:0;border-top:1rpx solid #ccc;">
					<view @tap.stop="closeModifyPopup">取 消</view>
					<view class="colTheme modifySure" @tap.stop="confirmModify">确 定</view>
				</view>
			</view>
		</view>
		<!-- 添加厂家 -->
		<view class="modifyPopupcustom" @touchmove.stop="true" v-if="showAddFactory">
			<view class="modifyPopup">
				<scroll-view @scroll="modifyScroll" scroll-y class="modifyPopupscroll">
					<view class="modifyRecordbbox">
						<view class="modifyRecordTitle">添加厂家</view>
						<view class="addNewFactoryHead flx flx_r">
							<view>厂名</view>
							<view>数量</view>
							<view>电话</view>
							<view>{{ ' ' }}</view>
						</view>
						<view class="newModify flx flx_r" v-for="(item, index) in addFactoryTempList" :key='' add' +
							index'>
							<view style="flex:1.3;"><input @input="addFactoryInput" v-model="item.manufactor_name"
									class="modifyInputName" placeholder-class="modifyInput" placeholder="请输入厂名"
									type="text" maxlength="12"></input></view>
							<view style="flex:.7;margin:0 8rpx;"><input @input="addFactoryInput"
									v-model="item.goods_number" class="modifyInputSum" placeholder-class="modifyInput"
									placeholder="请输入数量" type="number" maxlength="4"></input></view>
							<view style="flex:1;"><input @input="addFactoryInput" v-model="item.phone"
									class="modifyInputSum" placeholder-class="modifyInput" placeholder="厂家电话"
									type="number" maxlength="11"></input></view>
							<view style="flex:0.2;position:relative;">
								<van-icon
									style="left: 50%; position: absolute; top: 50%;transform: translate(-50%,-50%);"
									@tap.stop="delFromAddTempList" :data-index="index" name="close" size="30rpx" />
							</view>
						</view>
						<view class="newModify flx flx_r" @tap.stop="toAddPage">
							<input disabled v-model="curManufactorName" class="modifyInputName"
								placeholder-class="modifyInput" style="width:200rpx;" placeholder="请输入厂名" type="text"
								maxlength="12"></input>
							<input disabled class="modifyInputSum" placeholder-class="modifyInput" placeholder="数量"
								type="number" maxlength="4" style="width:155rpx;margin: 0 8rpx;"></input>
							<input disabled class="modifyInputSum" placeholder-class="modifyInput" placeholder="厂家电话"
								type="number" maxlength="6" style="width: 180rpx;"></input>
						</view>
					</view>
					<view style="height:150rpx;"></view>
				</scroll-view>
				<view class="modifyPopupBtns flx flx_r" catchtouchmove="true"
					style="bottom:0;border-top:1rpx solid #ccc;">
					<view @tap.stop="closeModifyPopup">取消</view>
					<view class="colTheme modifySure" @tap.stop="confirmAddFactory">确定</view>
				</view>
			</view>
		</view>
		<!-- showMsg -->
		<show-msg :status="true" :isShow="showMsgUrge" :msg1="showMsgTxt1" :showTitle="false" showBtn1
			:btnTxt1="btnTxt1" inlineBtn @btnClick1="showMsgClose1" @btnClick2="showMsgClose2" :btnTxt2="btnTxt2">
		</show-msg>
		<!-- 取消预约 -->
		<show-msg :status="false" :isShow="showMsgCancel" :msg1="showMsgTxt1" :showTitle="false"
			msgStyle="padding:0rpx 50rpx;" minh="380rpx" showBtn1 showBtn2 :btnTxt1="btnTxt1" inlineBtn
			@btnClick2="calcelOrderClick1" @btnClick1="calcelOrderClick2" :btnTxt2="btnTxt2">
		</show-msg>
		<!-- success Msg -->
		<show-msg :status="true" :isShow="successMsgFlag" :msg1="successTxt" :showTitle="false" showBtn2 btnTxt2="好 的">
		</show-msg>
		<!-- err Msg -->
		<show-msg :status="false" :isShow="errMsgFlag" :msg1="errTxt" :showTitle="false" showBtn2
			:showBtn1="showErrMsgBtn1" :btnTxt1="errMsgBtnTxt1" btnTxt2="知道了" @btnClick1="clickErrMsg1">
		</show-msg>
		<!-- 取消厂家 -->
		<show-msg :status="false" :isShow="cancelFanufactorMsgFlag" showTitle :title="showMsgTxt1" showBtn2 showBtn1
			inlineBtn btnTxt1="确定取消" btnTxt2="我点错了" @btnClick1="cancelFactory">
		</show-msg>
		<!-- 发送取消订单申请 -->
		<show-msg :status="false" :isShow="sendCancelOrderApplyFlag" :msg1="sendCancelOrderApplyTxt" showBtn2 showBtn1
			inlineBtn btnTxt1="确定取消" btnTxt2="我点错了" @btnClick1="sendCancelOrderApply">
		</show-msg>
		<!-- 取消协议 -->
		<van-popup z-index="105" :show="showCancelXieyi" @close="onWarningClose" custom-class="warningPopup">
			<view class="warningBox2">
				<image class="warningImg"
					src="https://www.yitongwang.com/public/static/images/minniapp/subcontranct-err.png"></image>
				<view class="headWord">请谨慎操作，强制取消后，系统将无法跟踪货物记录，如您仍需继续强制取消服务，请仔细阅读以下协议：</view>
				<view class="headWord2">“关于已收货物的取消服务协议”</view>
				<scroll-view scroll-y class="xieyiScroll">
					<view class="contentWord contentWord1">取消服务后，系统将不能跟踪货物信息，请尽快处置取消服务的货物，您可以取回货物或重新预约拼包。</view>
					<view class="contentWord contentWord2">如您选择重新预约拼包，需办理<text
							class="coltheme">“关于已取消服务货物的重新预约拼包协议”</text>，如您本人或您指定的人员前往仓库取回货物时，需出具“取消厂家确认码”或“关闭订单确认码”，仓库人员核实后才能办理货物出库手续。
					</view>
					<view class="contentWord contentWord3">暂未发包的货物，我们为您提供免费保管三天的服务，三天后将收取相应的保管费用，<text
							class="col215">最长保管期限为30天，超过30天我们有权自行处置货物</text>。</view>
					<view class="contentWord contentWord4">在保管期内，货物的保管义务由我们承担，不可抗拒的因素除外。</view>
					<view class="contentWord contentWord5">若您强制取消服务次数过多，我们有权终止您的预约拼包功能。</view>
				</scroll-view>

				<view class="warningBtn2" @tap.stop="agreeAgreement">本人同意以上协议并提交申请</view>
				<view class="warningBtn1" @tap.stop="onWarningClose">取 消</view>
			</view>
		</van-popup>
		<!-- 记录 -->
		<see-recode @closeLog="closeLog" v-if="seeLogFlag" :data1="factoryLogInfo"></see-recode>
		<!-- 评价的框 showEvaluate -->
		<show-msg :status="true" :isShow="showEvaluate" :showTitle="false" showBtn2 btnTxt2="提交评价"
			@btnClick2="doEvaluate">
			<view slot="slot1">
				<view class="ttitle">您的评价让我们做的的更好</view>
				<view class="emmmm">请为我们打分</view>
				<view class="lineStar">服务
					<van-rate :value="evaluateV1" size="58rpx" color="#fed04d" void-color="#eee" void-icon="star"
						data-index="1" @change="onEvaluateChange1" />
				</view>
				<view class="lineStar">时效
					<van-rate :value="evaluateV2" size="58rpx" color="#fed04d" void-color="#eee" void-icon="star"
						data-index="2" @change="onEvaluateChange1" />
				</view>
				<view class="lineStar">精准
					<van-rate :value="evaluateV3" size="58rpx" color="#fed04d" void-color="#eee" void-icon="star"
						data-index="3" @change="onEvaluateChange1" />
				</view>
			</view>
		</show-msg>
		<!-- 查看拉包记录的 打包记录的 -->
		<view class="modifyPopupcustom" @touchmove.stop="true" v-if="shouldVoucherShow">
			<view class="modifyPopup" style="height:75vh;margin-top:15%;">
				<scroll-view @scroll="modifyScroll" scroll-y class="modifyPopupscroll">
					<view class="modifyRecordTitle">{{shouldVoucherShowType}}<text
							style="font-size:24rpx;">(合计:{{voucherInfo[0].order_total_num}}手)</text></view>
					<view class="modifyRecordContent">
						<view class="modifyRecordHead flx flx_r">
							<text style="flex:.5;">时间</text>
							<text>厂名</text>
							<text style="flex:.4;">数量</text>
							<text style="flex:.3;">{{shouldVoucherShowType == '打包记录' ? '操作' : '凭证'}}</text>
						</view>
						<view v-for="(item, index) in voucherInfo" :key="'vou' + index"
							style="border-radius:30rpx;overflow:hidden;" v-if="item.total_num > 0">
							<view class="modifyRecordItem flx flx_r"
								:style="'border-bottom:' + item.lj ? '1px dotted #fff' : ''">
								<view style="flex:.5;">
									<view>{{ m1.brTime( item.create_date,'a' ) }}</view>
									<view>{{ m1.brTime( item.create_date,'b' ) }}</view>
								</view>
								<view class="lh65" @tap.stop="seeDetailFac" :data-index="index"><text
										class="absAfterArrow" space="ensp">明细 </text></view>
								<view style="flex:.4" class="lh65">{{ item.total_num }}手</view>
								<view style="flex:.3;position:relative;">
									<van-icon v-if="shouldVoucherShowType == '拉包明细'" class="seeImgIcon"
										@tap.stop="seeOrderDetailImgs" :data-index="index" name="photo" color="#18c2ba"
										size="40rpx" />
									<text v-if="shouldVoucherShowType == '打包记录'" @tap.stop="seeDetailFac"
										:data-index="index" :data-pid="item.pid" class="lh65">展开 <text
											style="color:#cfe0df;" class="absAfterArrow">{{ '哟' }}</text></text>
								</view>
							</view>
							<view>
								<view class="modifyRecordItem flx flx_r" v-for="(item2, index2) in item.log"
									:key="'log' + index + index2" v-if="item.lj && item2.num > 0"
									style="position:relative;display:flex;text-align:center;color:#999;">
									<view style="flex:.5;">
										<view>{{ m1.brTime( item.create_date,'a' ) }}</view>
										<view>{{ m1.brTime( item.create_date,'b' ) }}</view>
									</view>
									<text style="flex:1;" class="lh65">{{item2.manufactor_name}}</text>
									<text style="flex:.4;" class="lh65">{{ item2.num }}手</text>
									<text style="flex:.3;">{{ ' ' }}</text>
								</view>
								<view class="labaorecord modifyRecordItem flx flx_r" v-if="item.lj"
									style="text-align:center;">
									<text>{{ ' ' }}</text>
									<text>{{ ' ' }}</text>
									<text class="lh65" style="text-align:left;" @tap.stop="collectedRecord"
										:data-index="index"><text class="shouqia">{{ '收起' }}</text><text
											style="color:#cfe0df;position:relative;"
											class="absAfterArrow2">1呦</text></text>
								</view>
							</view>
						</view>
					</view>
					<view style="height:150rpx;"></view>
				</scroll-view>
				<view class="modifyPopupBtns flx flx_r" @touchmove.stop="true">
					<text @tap.stop="closeModifyPopup">X</text>
				</view>
			</view>
		</view>

		<!-- 啥也没有 的时候 -->
		<van-empty v-if="orderInfo.length == 0" image="search" description="空空如也哦" />
		<!-- 审核中的时候的提示信息 showUndeReview -->
		<van-popup :show="showUndeReview" @close="onInfoClose" z-index="105" custom-class="warningPopup">
			<view class="warningBox">
				<image class="warningImg"
					src="https://www.yitongwang.com/public/static/images/minniapp/subcontract-info-input.png"></image>
				<view class="warningTxt" style="color:#18c2ba;">{{ '您的修改申请' }}</view>
				<view class="warningTxt" style="color:#18c2ba;">正在审核中，如需加急处理请致电拼包中心{{underReciveTel}}</view>
				<view class="warningBtn2" @tap.stop="onInfoClose">确 定</view>
				<view class="infoPopupCancel" @tap.stop="onInfoClose">
					<van-icon name="close" size="40px" />
				</view>
			</view>
		</van-popup>

		<show-btns :show="showBtns" @clickBtnItem="clickBtnItem"></show-btns>
		<show-btns :show="showBtns2" :btnList="btnList" title="催 促 送 货" @clickBtnItem="clickBtnItem">
		</show-btns>

	</view>
</template>

<script lang="wxs" module="m1">
	var getTime = function(i) {
		var day = Math.floor(i / 60 / 60 / 24)
		var hours = parseInt((i % (60 * 60 * 24)) / (60 * 60));
		var minutes = parseInt((i % (60 * 60)) / 60);
		return day + " 天 " + hours + " 小时 " + minutes + " 分钟 "
	}

	var setCancelTxt = function(s) {
		switch (s) {
			case 0:
				return '取消'
				break;
			case 1:
				return '申请取消厂家'
				break;
			case 2:
				return '取消厂家审核中'
				break;
			case 3:
				return '取消厂家确认码:'
				break;
			case 4:
				return '未通过'
				break;
			default:
				break;
		}
	}
	var brTime = function(t, type) {
		var t = t.split(' ')
		return type == 'a' ? t[0] : t[1]
	}
	module.exports = {
		getTime,
		setCancelTxt,
		brTime
	}
</script>
<script>
	var app = getApp();
	var common = require('../../../static/utils/common.js');
	var request = require("../../../static/utils/request");
	var setting = app.globalData.setting;
	var operations = [{
			name: '默认',
			index: '0'
		},
		{
			name: '已送齐',
			index: '1'
		},
		{
			name: '未送齐',
			index: '2'
		},
		{
			name: '全部打包',
			index: 6
		},
		{
			name: '部分打包',
			index: 7
		},
		{
			name: '全部拉包',
			index: '3'
		},
		{
			name: '部分拉包',
			index: '4'
		},
		{
			name: '已取消',
			index: '5'
		},
	];
	export default {
		data() {
			return {
				bottomPosition: 'bottom:0rpx;',
				url: setting.url,
				order_id: '',
				operations,
				factory: [],
				orderDetail: {
					factory: []
				},
				curIndex: '', //当前被操作的厂家的索引 
				showMsgCancel: false,
				showMsgTxt1: '',
				editParams: {}, //操作对应需要提交的参数
				btnTxt1: '取消预约',
				btnTxt2: '返回修改',
				editUrl: 'cancelOrder',
				showCancelXieyi: false,
				voucherInfo: null,
				shouldVoucherShow: false,
				showBtns: false, //白底的按钮
				showBtns2: false, //白底的按钮
				shareMsgInfo: null, //分享时的数据收集
				share_btn: false,
				showShare: false,
				share_pic: '',
				evaluateV1: 5, //评价星星
				evaluateV2: 5,
				evaluateV3: 5,
				showEvaluate: false,
				showAddFactory: false,
				showAddFactory: null,
				addFactoryTempList: [],
				isFirst: true,
				seeLogFlag: false,
				factoryLogInfo: null,
				modifyPopupFlag: false,
				modifyRecordInfo: null,
				curManufactorName: '',
				correctNum: '',
				modifyNameDisabled: false, //修改厂名的禁用与否
				btnList: [{
						name: '微信催促',
						style: 'background-color:#18c2ba;color:#fff;',
						openType: 'share',
						type: 'share'
					},
					{
						name: '电话催促',
						style: 'background-color:#fff;color:#18c2ba;border:1rpx solid #18c2ba;',
						openType: '',
						type: 'call'
					}
				],
				curTel: '',
				showInfo: false,
				sortType: [false, false, false, false],
				showMask2: false,
				showMask3: false,
				showScreen: false,
				showScreen2: false,
				showType: 0,
				cancelItemTxt: '取消该厂家',
				centerFacName: '',
				posterId: '',
				inherit_num: '',
				facRemark: '',
				orderOperations: [{
						name: '预约信息',
						css: '',
						index: 'yyxx'
					},
					{
						name: '联系拼包中心',
						css: '',
						index: 'call'
					},
				],
				shouldVoucherShowType: '',
				calculation_receive_num: 0, //计算得出的收货数
				calculation_take_num: 0, //计算得出的拉走数
				hasInherit: false, //是否有结余的
			}
		},
		onLoad: function(options) {
			this.order_id = options.order_id
			this.bottomPosition = uni.getStorageSync('isiphoneX') ? 'bottom:12rpx;' : 'bottom:0rpx;'
			this.getDetail()
		},
		onShow: function() {
			if (this.isFirst) {
				this.isFirst = false
			} else {
				this.getDetail()
			}
		},
		onPullDownRefresh: function() {
			this.sortType = [false, false, false, false]
			this.getDetail()
		},
		onPageScroll: function() {
			this.showMask3 = false
		},
		onShareAppMessage: function() {
			return {
				title: `您的送货确认码为:${this.shareMsgInfo.code}最晚封包时间:${this.shareMsgInfo.time}`,
				path: '/pages/index/pinbaoMsg/pinbaoMsg?order_id=' + this.posterId,
				imageUrl: this.url + '/public/static/images/minniapp/share-default-pinbao.png'
			}
		},
		methods: {
			getDetail: function() { //获取详情
				var that = this
				request.get(that.url + '/api/pinbao/getOrderDetails', {
					data: {
						order_id: that.order_id
					},
					success: function(res) {
						if (res.data.status == 1) {
							var s = res.data.result.order.order_status > 5 ? 9 : 0
							that.orderDetail = Object.assign({}, res.data.result)
							that.factory = that.doSwitch(s, res.data.result.factory)
							that.showType = s == 9 ? 5 : 0
						}
						uni.hideLoading()
						uni.stopPullDownRefresh()
					}
				})
			},
			operationBtn: function(e) { //下部分厂家按钮操作
				var index = e.currentTarget.dataset.index
				var type = e.currentTarget.dataset.type
				var fac = this.orderDetail.factory[index]
				var that = this
				this.curIndex = index
				switch (type) {
					case 'qx': //评价 //取消厂家  cancelFactory
						if (fac.receive_num <= 0) { //未收到货 可直接取消厂家
							uni.showModal({
								content: '请确认取消该厂家吗？',
								confirmText: '确定取消',
								cancelText: '我再想想',
								success(res) {
									if (res.confirm) {
										that.req('cancelFactory', {
											manufactor_id: fac.manufactor_id
										}, function(res) {
											uni.showToast({
												title: '取消成功',
											})
											that.getDetail()
										})
									} else if (res.cancel) {}
								}
							})
						} else {
							uni.showModal({
								content: '拼包中心已收货的厂家，取消后系统将不能跟踪货物状态，是否继续？',
								confirmText: '继续取消',
								cancelText: '我再想想',
								success(res) {
									if (res.confirm) {
										that.editUrl = 'applyCancelFactory'
										that.showCancelXieyi = true
										that.editParams = {
											manufactor_id: fac.manufactor_id
										}
									} else if (res.cancel) {}
								}
							})
						}
						break;
					case 'jl': //记录
						this.getFactoryLog(fac.manufactor_id)
						break;
					case 'xg': //修改
						var status = this.orderDetail.order.order_status
						if (status == 6 || status == 7) {
							return uni.showToast({
								title: '当前状态无法修改厂家信息',
								icon: 'none'
							})
						}
						this.curManufactorName = ''
						this.modifyPlaceholderTxt = '厂家名字(非必填)'
						this.modifyNameDisabled = this.orderDetail.factory[this.curIndex].receive_num > 0 ? true : false
						this.requestModifyPopup(fac.manufactor_id)
						break;
					case 'qxcj_shz': //取消审核中
						uni.showToast({
							title: '拼包中心审核中',
							icon: 'none'
						})
						break;
					case 'qxcj_code': //取消码
						break;
					default:
						break;
				}
			},
			operationBtnOrder: function(e) { //上部分订单按钮操作
				var type = e.currentTarget.dataset.type
				var data = this.data.orderDetail.order
				var that = this
				switch (type) {
					case 'pj': //评价
						if (data.order_status != 4 && data.order_status != 5) {
							return
						} else {
							this.showEvaluate = true
						}
						break;
					case 'qxyy': //取消预约
						if (data.order_status != 0) {
							return
						} else {
							this.showMsgCancel = true
							this.showMsgTxt1 = `取消次数过多的话，可能会被限制预约服务，如果信息填写错误，您可以返回修改`
							this.btnTxt1 = '返回修改'
							this.btnTxt2 = '取消预约'
							this.editUrl = 'cancelOrder'
						}
						break;
					case 'gbdd': //关闭订单
						if (data.order_status != 1 && data.order_status != 2 && data.order_status != 3) {
							return
						} else {
							uni.showModal({
								content: '拼包中心已收货的订单，取消后系统将不能跟踪货物状态，是否继续？',
								confirmText: '继续取消',
								cancelText: '我再想想',
								success(res) {
									if (res.confirm) {
										that.editUrl = 'applyCancelOrder'
										that.showCancelXieyi = true
										that.editParams = {
											order_id: that.orderDetail.order.order_id
										}
									} else if (res.cancel) {}
								}
							})
						}
						break;
					case 'txsh': //提醒送货
						if (data.order_status > 5) {
							return
						} else {
							this.showBtns = true
							this.shareMsgInfo = {
								time: data.appointment_date,
								code: data.auth_code,
							}
							this.posterId = data.order_id
						}
						break;
					case 'lbdh': //拉包电话
						if (data.logistics_phone != '') {
							uni.makePhoneCall({
								phoneNumber: e.currentTarget.dataset.tel + '',
							})
						} else {
							uni.showModal({
								content: '您预约的拉包方式为拼包中心代拉，由拼包中心负责通知拉包人员，谢谢您的支持！',
								showCancel: false,
								success(res) {
									if (res.confirm) {}
								}
							})
						}
						break;
					case 'lbmx': //拉包明细
						if (data.order_status != 4 && data.order_status != 5) {
							return
						} else {
							var that = this
							this.req('getTakeawayLog', {
								order_id: data.order_id
							}, function(res) {
								if (res.data.result.length > 0) {
									that.voucherInfo = [...res.data.result]
									that.shouldVoucherShow = true
									that.shouldVoucherShowType = '拉包明细'
								} else {
									uni.showToast({
										title: '当前订单暂时没有拉包记录',
										icon: 'none'
									})
								}
							})
						}
						break;
					case 'gbdd-code': //关闭-确认码
						break;
					case 'gbdd-shz': //关闭订单审核中
						uni.showToast({
							title: '拼包中心审核中',
							icon: 'none'
						})
						break;
					case 'ccdb':
						this.urgeCore(that.orderDetail.order.is_urge, that.orderDetail.order.order_status)
						break
					case 'dbjl': //打包记录
						if (data.order_status == 2 || data.order_status == 3) {
							that.req('getPackLog', {
								order_id: data.order_id
							}, function(res) {
								if (res.data.result) {
									if (res.data.result.length == 0) {
										return uni.showToast({
											title: '该订单暂无相关记录',
											icon: 'none'
										})
									} else {
										that.voucherInfo = [...res.data.result]
										that.shouldVoucherShow = true
										that.shouldVoucherShowType = '打包记录'
									}
								}
							})
						}
						break;
					default:
						break;
				}
			},
			urgeCore: function(is_urge, order_status) { //催促打包= e.currentTarget.dataset.info
				var that = this
				if (order_status != 1) {
					return
				}
				if (is_urge == 1 && order_status == 1) {
					uni.showModal({
						content: `拼包中心已收到您的催促打包，如需加急请致电'${this.orderDetail.order.seller_phone}'`,
						showCancel: false,
						success(res) {
							if (res.confirm) {} else if (res.cancel) {}
						}
					})
					return
				}
				var id = that.orderDetail.order.order_id
				uni.showModal({
					content: '请核对您的货物是否已送齐，如果送齐了，请立即催促打包，催促后会优先给您打包。',
					confirmText: '立即催促',
					cancelText: '我再想想',
					confirmColor: '#18c2ba',
					success(res) {
						request.post(that.url + '/api/pinbao/urgeOrder', {
							data: {
								order_id: id
							},
							success: function(res) {
								uni.showModal({
									content: '催促成功',
									showCancel: false,
								})
								that.orderDetail.order.is_urge = 1
								that.orderDetail = Object.assign({}, that.orderDetail)
							}
						})
					}
				})
			},
			calcelOrderClick1: function() { //取消订单 点击取消
				var that = this
				this.req(this.editUrl, {
					order_id: this.orderDetail.order.order_id
				}, function(res) {
					uni.showToast({
						title: '已取消预约',
					})
					that.showCancelXieyi = false
					that.getDetail()
				})
			},
			agreeAgreement: function() { //同意协议
				var that = this
				this.req(this.editUrl, that.editParams, function(res) {
					uni.showToast({
						title: '已向拼包中心发送取消申请',
						duration: 2000,
						icon: 'none',
						mask: 'true'
					})
					setTimeout(() => {
						that.showCancelXieyi = false
						that.editParams = {}
						that.showMask2 = false
						that.getDetail()
					}, 2000)
				})
			},
			seeDetailFac: function(e) { //展开
				var index = e.currentTarget.dataset.index
				this.voucherInfo[index].lj = !this.voucherInfo[index].lj
				this.voucherInfo = [...this.voucherInfo]
			},
			collectedRecord: function(e) { //收起
				var index = e.currentTarget.dataset.index
				this.voucherInfo[index].lj = !this.voucherInfo[index].lj
				this.voucherInfo = [...this.voucherInfo]
			},
			clickBtnItem: function(e) { //白底按钮点击了item
				if (e.detail.type == 'poster') {
					this.sharePoster()
				} else if (e.detail.type == 'call') { //电话催促
					if (this.orderDetail.factory[this.curIndex].factory_phone != 0) {
						uni.makePhoneCall({
							phoneNumber: this.orderDetail.factory[this.curIndex].factory_phone,
						})
					} else {
						this.showInfo = true
					}
				}
				this.showBtns = false
				this.showBtns2 = false
			},
			seeOrderDetailImgs: function(e) { //查看拉包明细中的图片
				var index = e.currentTarget.dataset.index
				uni.previewImage({
					urls: this.voucherInfo[index].img,
				})
			},
			doEvaluate: function() { //评价的提交操作
				var that = this
				this.req('addOrderEvaluate', {
					order_id: that.orderDetail.order.order_id,
					service: that.evaluateV1,
					efficiency: that.evaluateV2,
					accuracy: that.evaluateV3
				}, function(res) {
					that.showEvaluate = false
					that.orderDetail.order.is_evaluate = 1
					that.evaluateV1 = 5
					that.evaluateV2 = 5
					that.evaluateV3 = 5
					that.orderDetail = Object.assign({}, that.orderDetail)
					uni.showModal({
						content: '提交成功，感谢您的支持！祝您生活愉快！',
						showCancel: false,
						success(res) {
							if (res.confirm) {}
						}
					})
				})
			},
			addManufactor: function(e) { //打开增加厂家
				var phpT = this.orderDetail.order.appointment_time * 1000
				var jsT = +new Date()
				var that = this
				var order_id = this.orderDetail.order.order_id
				var status = this.orderDetail.order.order_status
				if (status > 4) {
					return uni.showToast({
						title: '当前订单状态无法添加新厂家！',
						icon: 'none'
					})
				}
				if (jsT > phpT) {
					return uni.showToast({
						title: '已过最晚封包时间，不能添加厂家！',
						icon: 'none'
					})
				}
				that.showAddFactory = true
			},
			confirmAddFactory: function() { //提交 添加厂家
				var that = this
				let params = {
					order_id: this.orderDetail.order.order_id,
					manufactor: JSON.stringify(this.addFactoryTempList)
				}
				this.req('addFactory', params, function(res) {
					that.showAddFactory = false
					that.addFactoryTempList = []
					that.curManufactorName = ''
					that.getDetail()
				})
			},
			toAddPage: function() { //前往搜索厂家 增加页面
				var str = ''
				let arr = [...this.orderDetail.factory, ...this.addFactoryTempList]
				arr.forEach((item, index) => {
					str += 'name' + index + '=' + item.manufactor_name + '&' //把选择了的厂家名字拼接成url参数 传递
				})
				uni.navigateTo({
					url: '/pages/subcontract/companysearch/index?from=tions&' + str,
				})
			},
			addFactoryInput: function(e) { // 改变新增厂家输入框的值的时候
				this.addFactoryTempList = [...this.addFactoryTempList]
			},
			delFromAddTempList: function(e) { //从增加新厂家列表移除
				var index = e.currentTarget.dataset.index
				let tArr = this.addFactoryTempList
				tArr.splice(index, 1)
				this.addFactoryTempList = [...tArr]
			},
			seeFacLog: function(e) {
				var index = e.currentTarget.dataset.index
				var id = this.factory[index].manufactor_id
				this.getFactoryLog(id)
			},
			getFactoryLog: function(id) { //获取厂家记录====================
				var that = this
				request.get(that.url + '/api/pinbao/getFactoryLog', {
					data: {
						manufactor_id: id
					},
					success: function(res) {
						that.seeLogFlag = true
						that.factoryLogInfo = Object.assign({}, res.data.result)
						that.showMask2 = false
					}
				})
			},
			requestModifyPopup: function(id) { //获取修改详情请求
				var that = this
				request.get(that.url + '/api/pinbao/getEditFactory', {
					data: {
						manufactor_id: id
					},
					success: function(res) {
						that.modifyRecordInfo = Object.assign({}, res.data.result)
						that.modifyPopupFlag = true
						that.modifyPlaceholderTxt = '厂家名字(非必填)'
						that.curManufactorName = ''
						that.correctNum = ''
						that.showMask2 = false
					}
				})
			},
			correctNumInput: function(e) { //修改厂数量
				var reg = /^\d{1,6}$/
				if (!reg.test(e.detail.value) && e.detail.value != '') {
					uni.showToast({
						title: '请正确填写货物数量',
						icon: 'none'
					})
					this.correctNum = ''
				} else {
					this.correctNum = e.detail.value
				}
			},
			confirmModify: function() { //提交修改的请求
				var that = this
				var nameReg = /[`~!#$^&*()=|{}':;',\[\].<>\?~！￥……&*（）——_|{}【】‘；：”“""'。，、？]/
				if (!this.modifyNameDisabled && nameReg.test(that.curManufactorName)) {
					return uni.showToast({
						title: '请正确填写厂家名',
						icon: 'none'
					})
				}
				if (that.correctNum == '' && that.curManufactorName == '') {
					return
				}
				this.req('editFactory', {
					manufactor_id: that.orderDetail.factory[that.curIndex].manufactor_id,
					goods_num: that.correctNum,
					manufactor_name: that.curManufactorName,
				}, function(res) {
					uni.showToast({
						title: '修改成功',
						mask: true
					})
					that.solvePlaceZindexFlag = true
					that.curManufactorName = ''
					that.correctNum = ''
					setTimeout(() => {
						that.requestModifyPopup(that.orderDetail.factory[that.curIndex].manufactor_id)
						that.getDetail()
					}, 1000)
				})
			},
			callAdminAll: function(e) { //联系拼包中心
				this.makeCall(e.currentTarget.dataset.tel)
			},
			makeCall: function(tel) {
				if (tel == '' || tel.trim() == '') {
					this.showInfo = true
					this.curTel = ''
				} else {
					uni.makePhoneCall({
						phoneNumber: tel,
					})
				}
			},
			eidtTelAndCall: function() { //拨打电话并添加
				var tel = this.curTel
				var that = this
				if (/^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/.test(tel)) { //手机号码ok请求
					request.post(that.url + '/api/pinbao/addFactoryPhone', {
						data: {
							manufactor_id: that.orderDetail.factory[that.curIndex].manufactor_id,
							phone: that.curTel
						},
						success: function(res) {
							if (res.data.status == 1) {
								that.makeCall(tel)
							}
							that.showInfo = false
						}
					})
				} else {
					uni.showToast({
						title: '手机号码格式不正确',
						icon: 'none'
					})
				}
			},
			onEvaluateChange1: function(e) { //评分
				var index = e.currentTarget.dataset.index
				var val = e.detail
				switch (index) {
					case '1':
						this.evaluateV1 = val
						break;
					case '2':
						this.evaluateV2 = val
						break;
					case '3':
						this.evaluateV3 = val
						break;
					default:
						break;
				}
			},
			sharePoster: function(e) { //分享成海报
				uni.showLoading({
					title: '正在生成...',
				})
				var that = this
				uni.getImageInfo({
					src: that.url + '/api/pinbao/getRemindPoster?order_id=' + that.orderDetail.order.order_id + 
						'&token=' + uni.getStorageSync('app:userInfo').token,
					isShowLoading: false,
					success: function(res) {
						that.share_btn = true
						that.showShare = false
						that.share_pic = res.path
						uni.hideLoading()
					},
					complete: function(res) {}
				})
			},
			closeShareModal: function() { // 关闭海报
				this.share_btn = false
			},
			saveSharePic: function() { //保存海报
				var that = this
				uni.authorize({
					scope: 'scope.writePhotosAlbum',
					success: function(res) {
						uni.saveImageToPhotosAlbum({
							filePath: that.share_pic,
							success: function(res) {
								that.share_btn = false
								uni.showToast({
									title: '保存成功',
									duration: 2000
								})
							}
						})
					},
					fail: function(res) {
						common.checkAuthorize('scope.writePhotosAlbum')
					}
				})
			},
			previewSharePic: function() { //海报预览
				uni.previewImage({
					urls: [this.share_pic],
				})
			},
			// 按钮的 关闭 / 打开
			onWarningClose: function() {
				this.showWarning = false
				this.showKuohao = false
				this.showCancelXieyi = false
			},
			closeModifyPopup: function() { //关闭修改的弹窗
				this.modifyPopupFlag = false
				this.showAddFactory = false
				this.shouldVoucherShow = false
				this.voucherInfo = []
				this.curManufactorName = ''
				this.correctNum = ''
			},
			closeLog: function() {
				this.seeLogFlag = false
			},
			onInfoClose: function() {
				this.showInfo = false
			},
			//2020 11 24 新版的详情
			clickFacOpera: function(e) { // 操作厂家的按钮
				var type = e.currentTarget.dataset.type
				var orderTtatus = this.orderDetail.order.order_status
				var orderApply = this.orderDetail.order.apply_status
				var that = this
				var fac = this.factory[this.curIndex]
				if (type == 'log') {
					this.getFactoryLog(fac.manufactor_id)
				} else if (type == 'modify') {
					if (orderTtatus > 5 || orderApply == 1 || orderApply == 2 || fac.apply_status == 1 || fac.apply_status == 2) {
						return uni.showToast({
							title: '暂时无法修改厂家信息',
							icon: 'none'
						})
					} else {
						this.modifyPlaceholderTxt = '厂家名字(非必填)'
						this.modifyNameDisabled = fac.receive_num > 0 ? true : false
						this.requestModifyPopup(fac.manufactor_id)
					}
				} else if (type == 'cancel') {
					if (fac.status > 5) {
						return uni.showToast({
							title: '已取消的厂家无法继续取消了哦~',
							icon: 'none'
						})
					}
					if (fac.apply_status == 1) {
						return uni.showToast({
							title: '拼包中心审核处理中，请勿重复操作~',
							icon: 'none'
						})
					}
					if (fac.receive_num <= 0) { //未收到货 可直接取消厂家
						uni.showModal({
							content: '请确认取消该厂家吗？',
							confirmText: '确定取消',
							cancelText: '我再想想',
							success(res) {
								if (res.confirm) {
									that.req('cancelFactory', {
										manufactor_id: fac.manufactor_id
									}, function(res) {
										uni.showToast({
											title: '取消成功',
										})
										that.getDetail()
										that.showMask3 = false
									})
								} else if (res.cancel) {}
							}
						})
					} else {
						uni.showModal({
							content: '拼包中心已收货的厂家，取消后系统将不能跟踪货物状态，是否继续？',
							confirmText: '继续取消',
							cancelText: '我再想想',
							success(res) {
								if (res.confirm) {
									that.editUrl = 'applyCancelFactory'
									that.showCancelXieyi = true
									that.editParams = {
										manufactor_id: fac.manufactor_id
									}
									that.showMask3 = false
								} else if (res.cancel) {}
							}
						})
					}
				} else if (type == 'urge') {
					if (fac.status > 5) {
						return uni.showToast({
							title: '厂家已被取消~',
							icon: 'none'
						})
					}
					if (fac.apply_status == 1) {
						return uni.showToast({
							title: '请在拼包中心审核处理完后再操作哦~',
							icon: 'none'
						})
					}
					this.showBtns2 = true
					this.shareMsgInfo = {
						time: this.orderDetail.order.appointment_date,
						code: this.orderDetail.order.auth_code,
					}
					this.showMask2 = false
					this.posterId = this.orderDetail.order.order_id
				} else if (type == 'tips') {}
				if (type == 'back') {
					this.showMask2 = false
				}
			},
			sortFac: function(e) { //排序
				var that = this
				var type = e.currentTarget.dataset.type
				var index = e.currentTarget.dataset.index
				var facList = this.factory
				if (facList.length <= 1) {
					return
				}
				if (type == 'manufactor_name') { //名字排序
					facList.sort(function(a, b) {
						if (that.sortType[index]) {
							return a.manufactor_name.localeCompare(b.manufactor_name, 'zh')
						} else {
							return b.manufactor_name.localeCompare(a.manufactor_name, 'zh')
						}
					})
				} else if (type == 'num1' || type == 'num2' || type == 'num3' || type == 'num4') {
					facList.sort(function(a, b) {
						var num1 = a[type] == '未填' ? 0 : a[type]
						var num2 = b[type] == '未填' ? 0 : b[type]
						if (that.data.sortType[index]) {
							return num1 - num2
						} else {
							return num2 - num1
						}
					})
				}
				this.factory = [...facList]
				this.sortType[index] = !this.sortType[index]
				this.sortType = [...this.sortType]
			},
			doOperation: function(e) { //显示遮罩操作
				var index = e.currentTarget.dataset.index
				var fac = this.factory[index]
				if (fac.apply_status == 1) {
					this.cancelItemTxt = '取消厂家/待审核'
				} else if (fac.status > 5) {
					if (fac.apply_status == 2) {
						this.cancelItemTxt = '厂家已取消:' + fac.cancel_code
					} else {
						this.cancelItemTxt = '厂家已取消'
					}
				} else {
					this.cancelItemTxt = '取消该厂家'
				}
				this.showMask2 = true
				this.curIndex = index
				this.centerFacName = fac.manufactor_name
				this.inherit_num = fac.inherit_num
				this.showMask3 = false
				this.facRemark = fac.receive_remark.substring(0, 20)
			},
			switchFac: function(e) { //筛选
				var index = e.currentTarget.dataset.index
				this.factory = this.doSwitch(index, this.orderDetail.factory)
				this.showType = index
			},
			doSwitch: function(i, fac) { //筛选的操作抽离  多处使用
				uni.showLoading()
				var list = []
				if (!fac || fac.length == 0) {
					uni.hideLoading()
					return list
				}
				var i = i + ''
				switch (i) {
					case '0': //默认
						list = fac.filter((item) => {
							return item.status < 6
						})
						break;
					case '1': //已送齐
						list = fac.filter((item) => {
							return (((item.receive_num >= item.goods_number) && item.goods_number > 0) || 
								(item.goods_number == 0 && item.receive_num > 0)) && item.status < 6
						})
						break;
					case '2': //未送货
						list = fac.filter((item) => {
							return ((item.receive_num > 0 && item.goods_number > item.receive_num) || 
								(item.receive_num == 0 && item.goods_number == 0)) && item.status < 6
						})
						break;
					case '3': //已全部拉包
						list = fac.filter((item) => {
							return item.status == 5
						})
						break;
					case '4': //已部分拉包
						list = fac.filter((item) => {
							return item.status == 4
						})
						break;
					case '5': //已取消
						list = fac.filter((item) => {
							return item.status > 5
						})
						break;
					case '6': //全部打包
						list = fac.filter((item) => {
							return (item.receive_num > 0 && item.packing_num == item.receive_num)
						})
						break;
					case '7': //部分打包
						list = fac.filter((item) => {
							return (item.receive_num > item.packing_num && item.packing_num > 0)
						})
						break;
					case '9': //部分打包
						list = fac.filter((item) => {
							return item.status > 5
						})
						break;
					default:
						break;
				}
				var calculation_receive_num = 0
				var calculation_take_num = 0
				var hasInherit = false
				list.forEach((item) => {
					calculation_receive_num += (item.receive_num - 0)
					calculation_take_num += (item.num4 - 0)
					if (item.inherit_num > 0) {
						hasInherit = true
					}
					item.dotted = ((item.inherit_num > 0 ? 1 : '') - 0) + 
						(((item.apply_status == 1 || item.apply_status == 2) ? 1 : '') - 0) + 
						((item.receive_remark ? 1 : '') - 0)
					item.dotted = item.dotted > 0 ? item.dotted : -1
				})
				this.showScreen = false
				this.calculation_receive_num = calculation_receive_num
				this.calculation_take_num = calculation_take_num
				this.hasInherit = hasInherit
				uni.hideLoading()
				return list
			},
			searchInput: function(e) {
				var val = e.detail.value
				var index = this.factory.findIndex(function(item) {
					return item.manufactor_name.indexOf(val) != -1
				})
				if (index != -1) {
					var list = this.factory
					var l = list.splice(index, 1)
					this.factory = [...l, ...list]
				}
			},
			_showScreen: function() {
				this.showScreen = true
				this.showMask3 = false
			},
			closeScreen: function() {
				this.showScreen = false
				this.showScreen2 = false
				this.showMask3 = false
			},
			clickRoundDoted: function(e) { //点击圆点内部的选项
				var type = e.currentTarget.dataset.type
				var status = this.orderDetail.order.order_status
				var orderid = this.orderDetail.order.order_id
				var sellerid = this.orderDetail.order.seller_id
				var receNum = this.orderDetail.order.receiving_num
				var goNum = this.orderDetail.order.take_away_num || 0
				var tel = this.orderDetail.order.seller_phone + ''
				var that = this
				this.showMask2 = false
				this.showScreen2 = false
				this.showMask3 = false
				switch (type) {
					case 'yyxx':
						var s = 'a'
						if (receNum == 0) {
							s = 'a'
						} else if (receNum > 0 && goNum == 0) {
							s = 'b'
						} else {
							s = 'c'
						}
						uni.navigateTo({
							url: '/pages/subcontract/write/write?reEdit=' + s + '&seller_id=' + sellerid +
								'&orderid=' + orderid,
						})
						break;
					case 'call':
						uni.makePhoneCall({
							phoneNumber: tel,
						})
						break;
					case 'gbdd':
						if (status != 1 && status != 2 && status != 3) {
							return
						} else {
							uni.showModal({
								content: '拼包中心已收货的订单，关闭后系统将不能跟踪货物状态，是否继续？',
								confirmText: '继续关闭',
								cancelText: '我再想想',
								success(res) {
									if (res.confirm) {
										that.editParams = {
											order_id: that.orderDetail.order.order_id
										}
										that.editUrl = 'applyCancelOrder'
										that.curOrderId = orderid
										that.showCancelXieyi = true
									} else if (res.cancel) {}
								}
							})
						}
						break;
					case 'gbddshz':
						uni.showToast({
							title: '拼包中心审核中，请耐心等待，或联系拼包中心加急处理~',
							icon: 'none',
							duration: 2000
						})
						break;
					case 'ljpj':
						if (that.orderDetail.order.is_evaluate == 1) {
							return uni.showToast({
								title: '订单已评价，无需重复评价，感谢您的评价~',
								icon: 'none'
							})
						}
						that.curOrderId = orderid
						that.showEvaluate = true
						break;
					case 'yrhsz':
						that.showWarning = true
						that.editImg = 'subcontranct-err'
						that.editTxt = '删除后无法恢复，但您可在回收站内查看'
						that.showKuohao = true
						that.btnTxt1 = '确 认 删 除'
						that.btnTxt2 = '取 消'
						that.editUrl = 'delOrderToRecycle'
						that.curId = orderid
						break;
					case 'zyxx':
						uni.showModal({
							content: '您还有货物在拼包中心未打包或未拉包，请注意跟踪记录!',
							showCancel: false
						})
						break;
					default:
						break;
				}
			},
			closeMask2: function() {
				this.showMask2 = false
				this.showMask3 = false
			},
			doOperation2: function(e) { //显示遮罩操作
				var that = this
				var apply = this.data.orderDetail.order.apply_status + ''
				var status = this.data.orderDetail.order.order_status + ''
				if (that.data.showMask3) {
					this.setData({
						showMask3: false,
						showScreen2: false
					})
					return
				}
				var lis = [{
						name: '预约信息',
						css: '',
						index: 'yyxx'
					},
					{
						name: '联系拼包中心',
						css: '',
						index: 'call'
					},
				]
				// 根据状态值  设置框内的内容
				switch (status) {
					case '0':
						break;
					case '1':
						if (apply == 0 || apply == 3) {
							lis.unshift({
								name: '关闭订单',
								css: '',
								index: 'gbdd'
							})
						} else if (apply == 1) {
							lis.unshift({
								name: '关闭订单/审核中',
								css: true,
								index: 'gbddshz'
							})
						}
						break;
					case '2':
						if (apply == 0 || apply == 3) {
							lis.unshift({
								name: '关闭订单',
								css: '',
								index: 'gbdd'
							})
						} else if (apply == 1) {
							lis.unshift({
								name: '关闭订单/审核中',
								css: true,
								index: 'gbddshz'
							})
						}
						break;
					case '3':
						if (apply == 0 || apply == 3) {
							lis.unshift({
								name: '关闭订单',
								css: '',
								index: 'gbdd'
							})
						} else if (apply == 1) {
							lis.unshift({
								name: '关闭订单/审核中',
								css: true,
								index: 'gbddshz'
							})
						}
						break;
					case '4':
						lis.unshift({
							name: '立即评价',
							css: '',
							index: 'ljpj'
						}, {
							name: '重要信息',
							css: true,
							index: 'zyxx'
						})

						break;
					case '5':
						lis.unshift({
							name: '立即评价',
							css: '',
							index: 'ljpj'
						}, {
							name: '移入回收站',
							css: '',
							index: 'yrhsz'
						})
						break;
					case '6':
						if (this.data.orderDetail.order.cancel_code > 0) {
							lis.unshift({
								name: `关闭订单确认码:${this.data.orderDetail.order.cancel_code}`,
								css: true,
								index: ''
							})
						}
						break;
					case '7':
						if (this.data.orderDetail.order.cancel_code > 0) {
							lis.unshift({
								name: `关闭订单确认码:${this.data.orderDetail.order.cancel_code}`,
								css: true,
								index: ''
							})
						}
						break;
					default:
						break;
				}
				that.setData({
					showMask3: true,
					orderOperations: lis,
					showScreen2: true
				})

			},
			// 请求 函数
			req: function(url, params, cb) {
				request.get('/api/pinbao/' + url, {
					data: params,
					success: function(res) {
						cb && cb(res)
					}
				})
			},
		}
	}
</script>

<style scoped src="./tionDetail.css">

</style>

<template>
	<view>
		<!-- 由此结构部分为 4.5 代  -->
		<van-sticky>
			<view class="absTop" @tap.stop="true">
				<view class="detailTop">
					<input type="text" class="topSearch" @confirm="searchInput" confirm-type="search"
						placeholder="输入厂名搜索"></input>
					<van-button color="#18c2ba" @tap.stop="PopupAddNewFac" :data-info="res.order"
						custom-style="display:inline-block;width:260rpx;height:62rpx;vertical-align: top;line-height:62rpx;float:right;border-radius:15rpx;padding: 0 6rpx;">
						新增厂家并收货</van-button>
				</view>
				<view class="someOrderInfo">
					<view class="someOrderInfo1">
						<view>封包倒计时</view>
						<view class="colfe751b fw550">{{ res.order.count_down }}</view>
					</view>
					<view class="someOrderInfo1">
						<view>仓位号</view>
						<view class="colff4848 fw550">{{ res.order.position_name }}</view>
					</view>
					<view class="someOrderInfo1">
						<view>送货确认码</view>
						<view class="coltheme fw550">{{ res.order.auth_code }}</view>
					</view>
				</view>

				<view class="detailLevel3">
					<view>厂家数:<text
							:class="res.order.order_receive_num > 0 ? 'coltheme' : '#666'">{{factory.length}}个</text>
					</view>
					<view>总收货:<text
							:class="res.order.order_receive_num > 0 ? 'coltheme' : '#666'">{{calculation_receive_num}}手</text><text
							style="font-size:18rpx;" v-if="hasInherit">(含结余)</text></view>
					<view>已拉包:<text
							:style="'color:' + res.order.order_take_num > 0 ? '#18c2ba' : '#666'">{{calculation_take_num}}手</text>
					</view>
					<view><text class="screenBtn" @tap.stop="_showScreen">{{'筛选'}}</text></view>
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

				<!-- 表头 -->
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
						<view class="titleItem" @tap.stop="sortFac" data-type="receive_num" data-index="2"
							style="flex:.6;"><text class="vts w80"> 收货 未打包</text>
							<view class="displayInlineBlock" style="height:54rpx;">
								<image class="absupdown" src="https://www.yitongwang.com/public/static/images/uup.png">
								</image>
								<image class="absupdown" src="https://www.yitongwang.com/public/static/images/ddn.png">
								</image>
							</view>
						</view>
						<view class="titleItem" @tap.stop="sortFac" data-type="receive_num" data-index="2"
							style="flex:.6;"><text class="vts w80"> 打包 未拉走</text>
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
						<view class="titleItem vts" style="flex:.4;line-height: 60rpx;">操作</view>
					</view>
					<view class="dotedLine"></view>
				</view>
			</view>
		</van-sticky>

		<view class="mask1" @touchmove.stop="true" @tap.stop="closeScreen" v-if="showScreen"></view>
		<view class="mask22" @touchmove.stop="true" @tap.stop="closeScreen2" v-if="showScreen2"></view>

		<!-- 厂家部分 -->
		<view class="detailFacBox" style="padding-top:330rpx;">
			<view class="facItem" v-for="(item, index) in factory" :key="'fac' + index">
				<view class="facItemL" style="flex:2.8;" :data-status="item.status" @tap.stop="showRecord"
					:data-id="item.manufactor_id" :data-index="index" :data-num="item.goods_number" data-type="recode">
					<view style="flex:.8;" class="facItemName fw550">{{item.manufactor_name}}</view>
					<view style="flex:.5;">{{item.goods_number > 0 ? item.goods_number : '未填'}}</view>
					<view style="flex:.5;position:relative;">
						<text
							v-if="!isShowPack || (isShowPack && !item.canPack) || (isShowPack && item.canPack && !item.lj)">{{item.num2}}</text>
						<input type="number" class="packNum4_5" :value="item.packNum"
							v-if="isShowPack && item.canPack && item.lj" @blur="packInputBlur" @input="packInputChange"
							:data-index="index"></input>
					</view>
					<view style="flex:.5;">{{item.num3}}</view>
					<view style="flex:.5;">{{item.num4}}</view>
				</view>
				<view class="facItemR"
					:style="(!isShowPack && item.status > 5) ? 'background-color:#ffca28;line-height:38rpx;' : 'background-color:#fff;' + 'flex:.4;text-align:center;'">
					<text v-if="!isShowPack && item.cancel_code <= 0 && item.status < 6" :data-status="item.status"
						@tap.stop="showRecord" :data-id="item.manufactor_id"
						:data-num="item.goods_number - item.receive_num - item.time_out_num - 0"
						data-type="recive">收货</text>
					<text v-if="!isShowPack && item.cancel_code > 0" style="color:#333;border-radius:8rpx;">取消码
						{{item.cancel_code}}</text>
					<text style="line-height: unset;"
						v-if="!isShowPack && item.cancel_code == 0 && showType == 5">-</text>
					<van-checkbox v-if="isShowPack && item.canPack" :value="item.lj" checked-color="#18c2ba"
						:data-index="index" @change="choosePackFac"
						style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);"></van-checkbox>
					<van-checkbox v-if="isShowPack && !item.canPack" :value="true" checked-color="#ccc"
						style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);"></van-checkbox>
				</view>
			</view>
		</view>

		<!-- 底部操做 -->
		<view class="bottomBar" bindtap="closeBottomTips" :style="isShowPack ? 'bottom:-280rpx;' : bottomPosition">
			<view class="absBottomL">
				<view>状态:</view>
				<view class="col555" :style="'font-size:' + res.order.order_status == 2 ? '24rpx' : ''">
					{{res.order.status_text}}</view>
			</view>
			<view class="BottomM">
				<text class="BottomMItem" @tap.stop="clickBottomItem" data-type="pack">打包</text>
				<text class="BottomMItem" @tap.stop="clickBottomItem" data-type="go">拉包</text>
				<text class="BottomMItem" @tap.stop="clickBottomItem" data-type="tel">电话</text>
				<text class="BottomMItem" @tap.stop="clickBottomItem" data-type="log">明细</text>
			</view>
			<view class="absBottomR" @tap.stop="clickDotted">
				<van-icon :info="res.order.audit_count > 0 ? res.order.audit_count : ''" name="more-o" size="50rpx"
					:color="res.order.audit_count > 0 ? '#ff5656' : '#18c2ba'"
					style="position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);" />
			</view>
		</view>
		<!-- 取消确定 -->
		<view class="confirmCancel" :style="isShowPack ? bottomPosition : 'left:-1000rpx;'">
			<text style="flex:1;" class="borderR" @tap.stop="unPack">取消</text>
			<text style="flex:1;" @tap.stop="confirmPack">确定</text>
		</view>

		<view class="bottomTelBox" v-if="bottomTipBox == 'tel'">
			<view class="pd10" @tap.stop="makeCall" :data-tel="res.order.mobile">预约电话：{{res.order.mobile}}
				{{res.order.name}}</view>
			<view class="bottomLine"></view>
			<view class="pd10" @tap.stop="makeCall" :data-tel="res.order.logistics_phone">
				拉包电话：{{res.order.logistics_phone > 0 ? res.order.logistics_phone : '拼包中心代拉'}}</view>
		</view>
		<view class="bottomTelBox" style="right:55rpx;" v-if="bottomTipBox == 'log'">
			<view class="pd10" @tap.stop="seeRecodeLG" data-type="da">打包记录</view>
			<view class="bottomLine" style="width:125rpx;"></view>
			<view class="pd10" @tap.stop="seeRecodeLG" data-type="la">拉包明细</view>
		</view>
		<view class="bottomTelBox2" v-if="bottomTipBox == 'dotted'">
			<view class="bottomItem2 pd10" @tap.stop="clickDottedItem" data-type="yyxx">预约信息</view>
			<view class="bottomItem2 pd10" @tap.stop="clickDottedItem" :data-type="item.type"
				v-for="(item, index) in applyItemList" :data-index="index" :key="'apply' + index">{{item.name}}</view>
		</view>
		<!-- 预约信息 -->
		<view class="yyxxMask" @touchmove.stop="true" v-if="bottomTipBox == 'yyxx'">
			<view class="yyxxBox">
				<view class="yyxxTitle">预约信息</view>
				<view class="yyxxLine">
					<view class="yyxxLL">预约人姓名：<text style="color:#666;">{{res.order.name}}</text></view>
					<view class="yyxxLR">仓位号：<text style="color:#666;">{{res.order.position_name}}</text></view>
				</view>
				<view class="yyxxLine">
					<view class="yyxxLL">送货确认码：<text style="color:#666;">{{res.order.auth_code}}</text></view>
				</view>
				<view class="yyxxLine">
					<view class="yyxxLL">预约人电话：<text style="color:#666;">{{res.order.mobile}}</text>
						<van-icon size="35rpx" style="vertical-align:middle;" color="#18c2ba" @tap.stop="makeCall"
							:data-tel="res.order.mobile" name="phone" />
					</view>
				</view>
				<view class="yyxxdotted"></view>
				<view class="yyxxLine">
					<view class="yyxxLL">收货人姓名：<text style="color:#666;">{{res.order.receipt_name}}</text></view>
				</view>
				<view class="yyxxLine">
					<view class="yyxxLL">收货人电话：<text style="color:#666;">{{res.order.receipt_mobile}}</text>
						<van-icon size="35rpx" style="vertical-align:middle;" color="#18c2ba" @tap.stop="makeCall"
							:data-tel="res.order.receipt_mobile" name="phone" />
					</view>
				</view>
				<view class="yyxxLine">
					<view class="yyxxLL">收 货 地 址：<text style="color:#666;">{{res.order.receipt_address}}</text></view>
				</view>
				<view class="yyxxdotted"></view>
				<view class="yyxxLine">
					<view class="yyxxLL">物流公司名称：<text
							style="color:#666;">{{res.order.logistics_company || '未填写'}}</text></view>
				</view>
				<view class="yyxxLine">
					<view class="yyxxLL">拉 包 人 员：<text
							style="color:#666;">{{res.order.logistics_phone ? res.order.logistics_phone : '拼包中心代拉'}}</text>
						<van-icon v-if="res.order.logistics_phone" size="35rpx" style="vertical-align:middle;"
							color="#18c2ba" @tap.stop="makeCall" :data-tel="res.order.logistics_phone" name="phone" />
					</view>
				</view>
				<view class="yyxxLine">
					<view class="yyxxLL">下单备注信息：</view>
				</view>
				<view class="yyxxLine">
					<view class="yyxxLL">最晚封包时间：<text style="color:#666;">{{res.order.appointment_date}}</text></view>
				</view>
				<view class="newRemark" :style="'height:' + newRemarkMore ? 'auto' : '50rpx'">
					{{ res.order.order_remark || '无备注' }}
					<view class="newRemarkMore"
						v-if="res.order.order_remark && res.order.order_remark.length > 15 && !newRemarkMore"
						@tap.stop="_newRemarkMore"></view>
				</view>
				<view class="yyxxClose" @tap.stop="closeBottomTips">X</view>
			</view>
		</view>
		<!-- 图片上传 弹出框 -->
		<view class="uploadImgPre" :hidden="!showUploadImg">
			<van-uploader :file-list="orderLog[curLogIndex].img || []" max-count="3" :deletable="deletable"
				:show-upload="!disabledUpload" @after-read="afterRead" @delete="delUploadImg" />
			<view class="absCloseUpload" @tap.stop="absCloseUpload">收起</view>
		</view>

		<!-- 合计打包的数量  -->
		<view class="totalPackNum" v-if="isShowPack">
			<view>此次打包合计 <text style="border-bottom: 1px solid #000;padding: 0 10rpx;">{{totalPackNum || 0}}</text> 手
			</view>
		</view>

		<!-- 记录 收货  -->
		<see-recode @closeLog="closeLog" @modify="modifyRecode" @modifyFacName="_modifyFacName" v-if="seeLogFlag" admin
			:isNormal="true" :slots="showRecodeSlot" :data1="factoryLogInfo">
			<view class="receiveSlot" slot="receiveSlot">
				<view class="receiveSlotBox" v-if="slotType">
					<view class="flex flex_r assd">
						<view style="line-height:50rpx;">此次收货数量：</view>
						<input placeholder-class="receiveSlotInputPlac" :style="'color:' + receiveSlotInputValCol"
							:focus="receiveSlotFocus" placeholder-style="font-size:24rpx;padding-left:50rpx;"
							:model:value="receiveSlotInputVal" @blur="receiveSlot@blur" class="receiveSlotInput"
							type="text"></input>
						<text class="absPlace">(预约者调走的可输入负数)</text>
					</view>
					<view class="flex flex_r">
						<view style="line-height:50rpx;">备注:</view>
						<input placeholder-class="receiveSlotInputPlac" placeholder="请输入"
							:model:value="receiveSlotInputVal2" class="receiveSlotInput" type="text"
							style="width:525rpx;" maxlength="20"></input>
					</view>
				</view>
				<view class="slotBtns">
					<text class="slotTypeb" @tap.stop="clickSlotBtn1">取消</text>
					<text class="slotTypea" @tap.stop="clickSlotBtn2">确定</text>
				</view>
			</view>
		</see-recode>

		<!-- 修改数量的弹窗 -->
		<van-dialog use-slot id="van-dialog" :show="modifyFacNameFlag" show-cancel-button @confirm="confirmModifyName">
			<input class="editInput" :model:value="modifyFacName" placeholder="输入厂名"></input>
		</van-dialog>
		<!-- 收货数量 -->
		<van-dialog use-slot :title="recipientTitle" :show="showInput" show-cancel-button @close="onCloseInput"
			@confirm="onConfirmInput">
			<input class="editInput" @input="receivedSumChange" maxlength="4" placeholder="输入数量" type="number"
				:model:value="goodsSum"></input>
		</van-dialog>

		<!-- 处理用户申请的订单取消  修改申请 的提示框 -->
		<show-msg :isShow="showErrMsg" :status="false" :msg1="msg1" showTitle :title="errMsgTitle" :msg2="msg2"
			msgStyle="padding:0 25rpx;font-size:36rpx;font-weight:600;line-height:55rpx;" showBtn1 showBtn2 inlineBtn
			:btnTxt1="btnTxt1" :btnTxt2="btnTxt2" @btnClick2="clickOperaBtn2" @btnClick1="clickOperaBtn1"></show-msg>
		<!-- 修改打包日期的提示   -->
		<show-msg :isShow="showErrMsg2" showBtn1 showBtn2 inlineBtn btnTxt1="同意" btnTxt2="拒绝" showTitle title="变更打包日期审核"
			@btnClick2="refuseUpdateTime" @btnClick1="passUpdateTime">
			<view class="applyModefyDate" slot="slot1">
				<view class="applyModefyDateL">
					<view style="color:#333;">原打包日期</view>
					<view style="color:#666;">{{oldTimeMsg}}</view>
				</view>
				<view class="applyModefyDateR">
					<view style="color:#333;">变更后日期</view>
					<view style="color: #18c2ba;">{{newTimeMsg}}</view>
				</view>
			</view>
		</show-msg>
		<!-- 发送取消厂家 -->
		<show-msg :isShow="showErrMsg3" :status="false" showBtn1 showBtn2 inlineBtn :facName="curFacName"
			:btnTxt1="cancelFacBtn1" :btnTxt2="cancelFacBtn2"
			msgStyle="padding:0 25rpx;font-size:36rpx;font-weight:600;line-height:55rpx;" showTitle title="申请取消厂家"
			:msg1="cancelFacMsg1" @btnClick2="clickCancelFac1" @btnClick1="clickCancelFac2"></show-msg>

		<!-- 查看打包记录的 showReceive -->
		<view class="modifyPopupcustom" @touchmove.stop="true" :hidden="!showReceive">
			<view class="modifyPopup"
				:style="'height:70vh;' + orderLog.length > 5 ? 'margin-top:26%;padding-bottom:80rpx;' : 'margin-top:30%;padding-bottom:0rpx;'">
				<view class="modifyRecordTitle">{{logType}}
					<text style="font-size:22rpx;" v-if="logType != '拉包操作'">(合计:{{orderLog[0].order_total_num}}手)</text>
					<text style="font-size:22rpx;" v-else>(待拉包合计:{{orderLog[0].order_un_take_num}}手)</text>
				</view>
				<scroll-view scroll class="modifyPopupscroll">
					<view class="modifyRecordContent">
						<view class="modifyRecordHead flx flx_r">
							<text style="flex:.5;">时间</text>
							<text>厂名</text>
							<text style="flex:.4;">数量</text>
							<text style="flex:.5;">操作</text>
						</view>
						<view v-for="(item, index) in orderLog" :key="'log' + index" class="rela"
							:style="'overflow:' + goDetailOperaIndex >= 0 ? 'unset' : 'hidden' + ';margin:5px auto;border-radius:35rpx;'"
							v-if="item.total_num != 0">
							<view class="modifyRecordItem flx flx_r fw550" style="font-weight:550;">
								<view style="flex:.5;font-size:22rpx;line-height: 32rpx;">
									<view>{{ m1.brTime( item.create_date,'a' ) }}</view>
									<view>{{ m1.brTime( item.create_date,'b' ) }}</view>
								</view>
								<view class="lh65" @tap.stop="seeDetailFac" data-index="{{ index }}">明细 <text
										style="color:#cfe0df;" class="absAfterArrow">{{ '哟' }}</text></view>
								<view style="flex:.4;" class="lh65">{{item.total_num}}手</view>
								<view style="flex:.5;position:relative;">
									<text v-if="logType == '打包记录'" @tap.stop="seeDetailFac" :data-index="index"
										:data-pid="item.pid" class="lh65">展开 <text style="color:#cfe0df;"
											class="absAfterArrow">{{ '哟' }}</text></text>
									<view v-if="logType == '拉包操作'" @tap.stop="seeUploadBox" :data-index="index">
										<block v-if="item.pid>0">
											<text style="color:#18c2ba;" space="emsp" class="fw550"> 已拉走 查看凭证</text>
										</block>
										<block v-if="item.pid == 0">
											<text space="emsp" class="fw550 " v-if="item.img.length == 0"
												style="color:#fb1717;"> 待拉包 上传凭证</text>
											<text space="ensp" class="fw550 imgUploadOk" v-if="item.img.length > 0"
												style="color:#cdabe6;line-height: 30rpx;"> 已上传 拉包凭证</text>
											<icon class="abs_success_no_circle" v-if="item.img.length > 0"
												type="success_no_circle" size="40rpx"></icon>
										</block>
									</view>
									<view v-if="logType == '拉包明细'">
										<van-icon name="more-o" size="50rpx" color="#ff5656"
											style="position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);"
											:data-index="index" @tap.stop="showGoOpera" />
										<view class="goDetailOpera" v-if="goDetailOperaIndex == index">
											<view class="goOperaiitem" @tap.stop="revokeGo" :data-id="item.pack_log_id"
												class="revokeGo">撤销拉包</view>
											<view class="goOperaiitem" @tap.stop="seeUploadBox" :data-index="index">
												查看拉包凭证</view>
										</view>
									</view>
								</view>
							</view>
							<view>
								<view class="modifyRecordItem flx flx_r" v-for="(item2, index2) in item.log"
									:key="'log2' + index + index2" v-if="item.lj"
									style="position:relative;display:flex;text-align:center;color:#999;">
									<view style="flex:.5;font-size:22rpx;line-height: 32rpx;">
										<view>{{ m1.brTime( item2.create_date,'a' ) }}</view>
										<view>{{ m1.brTime( item2.create_date,'b' ) }}</view>
									</view>
									<view style="">
										<view class="lh65">{{ item2.manufactor_name }}</view>
									</view>
									<text style="flex:.4;" class="lh65">{{item2.num}}手</text>
									<text class="lh65" v-if="logType == '打包记录'" style="flex:.4;position:relative;"
										@tap.stop="modifyLog" :data-logid="item2.log_id" :data-index1="index"
										:data-index2="index2" :data-num="item2.num">
										<text class="popupOperaFac popupOperaFac2">{{' '}}</text></text>
									<text class="lh65" v-else style="flex:.5;position:relative;"><text
											class="">{{' '}}</text></text>
								</view>
								<view class="labaorecord modifyRecordItem flx flx_r" v-if="item.lj"
									style="text-align:center;">
									<text class="lh65">{{ ' ' }}</text>
									<text style="flex:.8;" class="lh65">{{ ' ' }}</text>
									<text class="lh65" @tap.stop="collectedRecord" :data-index="index">
										<text class="shouqia">{{ '收起' }}</text>
										<text style="color:#cfe0df;position:relative;" class="absAfterArrow2">1呦</text>
									</text>
								</view>
							</view>
						</view>
					</view>
					<view style="height:150rpx;"></view>
				</scroll-view>
				<view class="modifyPopupBtns flx flx_r" @touchmove.stop="true" style="top:8rpx;">
					<text @tap.stop="closeModifyPopup" class="roundX">X</text>
				</view>
				<view v-if="res.order.order_status < 5 && res.order.position_is_null != 1 && logType == '拉包操作'"
					style="width:100%;height:80rpx;bottom:0;line-height:80rpx;" class="modifyPopupBtns flx flx_r"
					@touchmove.stop="true">
					<text class="borderR" @tap.stop="closeModifyPopup">取 消</text>
					<text style="color:#18c2ba;" @tap.stop="shreLaBao">确 定</text>
				</view>
			</view>
		</view>

		<!-- 新增厂家收货  receiveFactory-->
		<van-popup :show="receiveFactory" @close="closeModifyPopup" round>
			<view class="receiveFactoryBox">
				<view style="background-color:##e7f9f8;border-radius:35rpx 35rpx 0 0;">
					<view class="receiveFactoryTitle">新增厂家收货</view>
					<view class="receiveFactoryHead">
						<text style="flex:1;">厂名</text>
						<text style="flex:1;">数量</text>
						<text space="emsp" style="flex:.5;">备注</text>
					</view>
					<scroll-view scroll-y class="receiveFactoryScroll">
						<view v-for="(item, index) in receiveFactoryList" :key="'rec' + index"
							class="receiveFactoryItem">
							<input class="receiveFactoryInput" :data-index="index" :value="item.manufactor_name"
								data-type="name" @input="receiveFactoryInput" placeholder="厂名" type="text"></input>
							<input class="receiveFactoryInput receiveFactoryInput2" :data-index="index"
								:value="item.num" data-type="sum" @input="receiveFactoryInput" placeholder="数量"
								type="number"></input>
							<text class="absRemark" @tap.stop="_showAddFacRemark"
								:data-index="index">{{item.receive_remark || '备注'}}</text>
							<text class="receiveFactoryDel" @tap.stop="receiveFactoryDel" :data-index="index">X</text>
						</view>
						<view class="receiveFactoryItem">
							<input class="receiveFactoryInput" :value="receiveFactoryNew.manufactor_name"
								data-type="name" @blur="checkBlur" @input="receiveFactoryInput3" placeholder="厂名"
								type="text"></input>
							<input class="receiveFactoryInput receiveFactoryInput2" :value="receiveFactoryNew.num"
								data-type="sum" @blur="checkBlur" @input="receiveFactoryInput3" placeholder="数量"
								type="number"></input>
							<text class="absRemark" :value="receiveFactoryNew.receive_remark" data-type="remark"
								@input="receiveFactoryInput2" placeholder="备注" type="text"></text>
						</view>
					</scroll-view>
				</view>
				<view class="receiveFactoryBtns">
					<text @tap.stop="operationReceiveBtn2" data-type="cancel" style="flex:1;" class="borderR">取消</text>
					<text @tap.stop="operationReceiveBtn2" data-type="confirm" data-receive="more"
						style="flex:1;">确定</text>
				</view>
			</view>
		</van-popup>

		<!-- 4.5版 更改打包数量  curFacName -->
		<view class="changePackNumMask" @touchmove.stop="true" v-if="showModifyLog">
			<view class="changePackNum">
				<view class="changePackNumTitle">{{ curFacName }}</view>
				<view class="changePackNumTitle">修改<text style="color:#f10215;">打包</text>数量</view>
				<view class="changePackNumBody">
					<view class="changePackNumL" style="flex:1;">
						<view class="m20">原<text style="color:#f10215;">打包</text>数量</view>
						<view style="color:#666;">{{modifyData.beforeNum}}手</view>
					</view>
					<view class="changePackNumR" style="flex:1;">
						<view class="m20">修改为</view>
						<view class="changePackNumRView">
							<input class="changePackNumRInput" placeholder="请输入" :value="modifyData.num" data-type="sum"
								@input="receiveFactoryInput2" type="number"></input>
						</view>
					</view>
				</view>
				<view class="changePackNumBtns">
					<text class="changePackNumBtn" @tap.stop="operationReceiveBtn" data-type="cancel">取消</text>
					<text class="changePackNumBtn" @tap.stop="operationReceiveBtn" data-type="confirm"
						data-receive="one">确定</text>
				</view>
				<view class="changePackNumBg"></view>
			</view>
		</view>

		<!-- 修改新增厂家收货 备注 -->
		<van-popup :show="showAddFacRemark" @close="closeModifyPopup" round @click-overlay="true">
			<view class="receiveFactoryBox" style="height:220rpx;">
				<view style="background-color:#e7f9f8;">
					<view class="receiveFactoryTitle">备注</view>
					<view class="receiveFactoryItem">
						<input class="facRemarkVal" :model:value="addFacRemark" @input="addFacRemarkInput"
							:focus="addFacRemarkFocus" placeholder="备注" type="text" maxlength="20"></input>
					</view>
				</view>
				<view class="receiveFactoryBtns">
					<text @tap.stop="closeModifyPopup" style="flex:1;" class="borderR">取消</text>
					<text @tap.stop="confirmAddFacRemark" style="flex:1;">确定</text>
				</view>
			</view>
		</van-popup>
	</view>
</template>

<script lang="wxs" module="m1">
	var brTime = function(t, type) {
		if (!t) {
			return ''
		}
		var t = t.split(' ')
		return type == 'a' ? t[0] : t[1]
	}
	module.exports.brTime = brTime;
</script>
<script>
	var request = require("../../../static/utils/request");
	var app = getApp();
	var setting = app.globalData.setting;
	var can1 = function(s) {
		if (s < 6) {
			return true
		} else {
			return false
		}
	}
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
				bottomPosition: 0,
				order_id: '',
				type: '',
				operations,
				url: setting.url,
				res: {},
				factory: [],
				flag: true,
				showInput: false, //是否展示收货框
				goodsSum: '', //当前编辑的数量
				curId: 0, //当前编辑的id
				curModifyId: '', //当前修改记录的id
				recipientTitle: '确认收货数量',
				uploadSrc: [],
				isFistIn: true,
				seeLogFlag: false,
				factoryLogInfo: {},
				orderLog: [],
				receiveSlotInputValCol: '#444',
				showFirstFlag: true, //用于判别是不是继续添加厂家返回的  做数据刷新处理
				slotType: true, //true为收货 false审核
				receiveSlotInputVal: '', //收货时的输入框
				receiveSlotInputVal2: '', //收货时的备注
				showRecodeSlot: false, //是否需要插槽
				modifyType: '', //修改记录的类型
				modifyIndex: -1,
				modifyFacNameFlag: false,
				modifyFacName: '',
				msg1: '', //提示内文案
				msg2: '', //提示内文案
				btnTxt1: '', //按钮1文案
				btnTxt2: '', //按钮2文案
				showErrMsg: false, //是否显示msg组件
				showErrMsg2: false, //是否显示msg 2组件
				showErrMsg3: false, //是否显示msg 3组件
				errMsgTitle: '', //msg title
				oldTimeMsg: '', //原本的时间
				newTimeMsg: '', //要改成的时间
				cancelFacBtn1: '',
				cancelFacBtn2: '',
				cancelFacMsg1: '',
				curIndex: '', //当前操作的厂家索引
				shenheInfo: {},
				searchVal: '',
				showReceive: false, //看打包记录
				showModifyLog: false, //修改记录弹框
				modifyData: { //编辑改数据的输入框
					beforeNum: '',
					num: ''
				},
				logId: '', //当前操作的logid
				curIndex1: '',
				curIndex2: '',
				showPackRadio: false, //拉包的radio显示
				curFacName: '', //当前操作的厂家名字
				newRemarkMore: false,
				// ====================4.5代新增 过往需要有时间了替换/删除
				showType: 0,
				sortType: [false, false, false, false],
				isShowPack: false, //是否显示拉包的input和checkbox
				bottomTipBox: '', //控制底部菜单弹出选项
				logType: '', //显示记录的类型  打包记录 拉包记录 拉包操作
				goDetailOperaIndex: '-9', //控制拉包记录的操作按键显示
				deletable: true, //默认上传的图片是可以删除的 未拉包的 设置为false
				disabledUpload: false, //是否禁用上传
				showUploadImg: false, //默认不展示上传图片的  操作查看的时候显示
				curLogIndex: -1, //预先留下当前的记录索引
				receiveFactory: false, //是否显示新增厂家收货
				receiveFactoryList: [], //收货时临时存放的厂家 数量
				receiveFactoryNew: { //新增收货时 临时的 未添加进数组的
					manufactor_name: '',
					num: ''
				},
				applyItemList: [], //审核的几个 动态显示
				showScreen: false, //遮罩
				showScreen2: false, //遮罩
				totalPackNum: 0, //总共本次打包数量
				receiveSlotFocus: false,
				calculation_receive_num: 0, //计算得出的收货数
				calculation_take_num: 0, //计算得出的拉走数
				hasInherit: false, //是否包含结余
				// 针对备注
				addFacRemark: '',
				showAddFacRemark: false,
				curModifyNewFacIndex: -1,
				addFacRemarkFocus: false,
			}
		},
		onLoad: function(options) {
			this.order_id = options.order_id
			this.type = options.type ? options.type : 'admin'
			this.bottomPosition = uni.getStorageSync('isiphoneX') ? 'bottom:6rpx;' : ''
			this.getInfo()
		},
		onShow: function() {
			if (this.showFirstFlag) {
				this.showFirstFlag = false
				return
			}
			this.getInfo()
		},
		onPageScroll: function() {
			this.bottomTipBox = -2
		},
		onPullDownRefresh: function() {
			this.getInfo()
		},
		methods: {
			getInfo: function() {
				const that = this
				request.get(that.url + '/api/pinbao/getAdminOrderDetails', {
					data: {
						order_id: that.order_id
					},
					success: function(res) {
						if (res.data.status === 1) {
							var tempList = res.data.result
							var flag = false
							if (tempList.order.order_status == 3) {
								flag = true
							}
							if (tempList.order.order_status != 3 && that.isFistIn == true) {
								that.isFistIn = false
							}
							tempList.factory.forEach((item) => {
								item.packNum = item.num2
								item.MaxPackNum = item.num2
								item.canPack = item.num2 > 0 && can1(item.status)
							})
							that.res = [...tempList]
							that.factory = that.doSwitch(0, tempList.factory)
						}
						uni.stopPullDownRefresh()
					}
				})
			},
			chooseImg: function() {
				var that = this
				uni.chooseImage({
					count: 3,
					success(res) {
						res.tempFilePaths.forEach((item) => {
							that.uploadFile(item)
						})
					}
				})
			},
			afterRead: function(e) {
				this.uploadFile(e.detail.file.path)
			},
			delUploadImg: function(e) { //删除上传的图片
				var imgs = this.orderLog[this.curLogIndex].img
				imgs.splice(e.detail.index, 1)
				this.orderLog[this.curLogIndex].img = imgs
				this.orderLog = [...this.orderLog]
			},
			uploadFile: function(src) {
				var index = this.curLogIndex
				if (this.orderLog[index].img >= 3) {
					return
				}
				uni.showLoading({
					title: '上传中...',
					mask: true
				})
				const that = this
				uni.uploadFile({
					filePath: src,
					name: 'qinzi_imgs',
					url: that.url + '/api/newjoin/upload_qianzi_img',
					success: function(res) {
						if (res.statusCode !== 200) {
							return
						}
						var result = JSON.parse(res.data)
						that.orderLog[that.curLogIndex].img = [...that.orderLog[that.curLogIndex].img, ...[{
							url: result.result
						}]]
						that.orderLog = [...that.orderLog]
						uni.hideLoading()
					}
				})
			},
			onCloseInput: function() {
				this.showInput = false
			},
			onConfirmInput: function() {
				var that = this
				this.req('editOperateLog', {
					id: this.curModifyId,
					num: this.goodsSum
				}, function(res) {
					that.getFactoryLog(that.curId)
					that.getInfo()
					that.goodsSum = ''
				})
			},
			// ============================================新版本部分 上面根据情况删除
			makeCall: function(e) { //打电话
				var tel = e.currentTarget.dataset.tel
				var telReg = /^[1][3,4,5,7,8,9][0-9]{9}$/
				if (!telReg.test(tel)) {
					return
				}
				uni.makePhoneCall({
					phoneNumber: tel,
				})
			},
			showRecord: function(e) { //显示记录
				if (this.isShowPack) {
					return
				}
				var id = e.currentTarget.dataset.id
				var slotType = true //是否要显示插槽
				if (e.currentTarget.dataset.status == 6 || e.currentTarget.dataset.status == 7 || this.res.order.position_is_null == 1) {
					slotType = false
				}
				this.showRecodeSlot = slotType
				this.slotType = slotType
				this.curId = id
				this.receiveSlotInputVal = e.currentTarget.dataset.num < 0 ? '' : e.currentTarget.dataset.num
				this.modifyIndex = e.currentTarget.dataset.index
				this.getFactoryLog(id)
			},
			closeLog: function() { //关闭记录
				this.seeLogFlag = false
			},
			getFactoryLog: function(id) { //获取厂家记录====================
				var that = this
				request.get(that.url + '/api/pinbao/getFactoryLog', {
					data: {
						manufactor_id: id
					},
					success: function(res) {
						that.seeLogFlag = true
						that.factoryLogInfo = res.data.result
						that.receiveSlotFocus = true
						that.receiveSlotInputVal2 = res.data.result.receive_remark || ''
					}
				})
			},
			receiveSlotbindblur: function(e) {
				var val = e.detail.value
				if (val) {
					if (val.charAt(0) == '-') {
						this.receiveSlotInputValCol = '#f10215'
					} else {
						this.receiveSlotInputValCol = '#444'
					}
				}
			},
			clickSlotBtn1: function() { //插槽点击左按钮
				this.seeLogFlag = false
			},
			clickSlotBtn2: function() { //插槽点击右按钮
				var id = this.curId
				var sum = this.receiveSlotInputVal + ''
				var remark = this.receiveSlotInputVal2
				var regRule =
					/^[\u4E00-\u9FA5A-Za-z0-9\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F\s/]+$/
				var that = this
				if (sum.trim() == '' || sum.trim() == 0) {
					return uni.showToast({
						title: '请输入收货数量',
						icon: 'none'
					})
				}
				if (remark.trim() != '' && !regRule.test(remark)) {
					return uni.showToast({
						title: '备注只能输入汉字 + 符号',
						icon: 'none'
					})
				}
				this.req('addReceiveLog', {
					type: '1',
					num: sum,
					remark: remark,
					manufactor_id: id
				}, function(res) {
					that.seeLogFlag = false
					that.getInfo()
				})
			},
			modifyRecode: function(e) { //编辑记录
				if (this.res.order.position_is_null == 1) {
					return uni.showToast({
						title: '当前状态订单无法继续操作',
						icon: 'none'
					})
				}
				var type = e.detail.type
				var info = e.detail.info
				this.showInput = true
				this.recipientTitle = '请输入'
				this.goodsSum = ''
				this.curModifyId = info.id
				this.modifyType = type
			},
			_modifyFacName: function(e) {
				var index = this.modifyIndex
				this.modifyFacNameFlag = true
				this.modifyFacName = this.factory[index].manufactor_name
			},
			confirmModifyName: function() { //确定改名字
				var name = this.modifyFacName + ''
				var that = this
				if (name == '' || name.trim() == '') {
					return uni.showToast({
						title: '名字不能为空',
						icon: 'none'
					})
				}
				if (name.trim() == this.factory[this.modifyIndex].manufactor_name) {
					return
				}
				this.req('editFactoryNameAdmin', {
					manufactor_id: this.curId,
					manufactor_name: name
				}, function(res) {
					uni.showToast({
						title: '修改成功',
					})
					setTimeout(() => {
						that.getFactoryLog(that.curId)
					}, 800)
				})
			},
			clickOperaBtn2: function() { //拒绝取消订单
				var that = this
				this.req('auditOrder', {
					order_id: this.order_id,
					type: 1,
					status: 2
				}, function(res) {
					uni.showToast({
						title: '已拒绝',
						icon: 'none'
					})
					setTimeout(() => {
						that.getInfo()
						that.msg1 = ''
						that.msg2 = ''
						that.btnTxt1 = ''
						that.btnTxt2 = ''
						that.title = ''
						that.showErrMsg = false
					}, 800)
				})
			},
			clickOperaBtn1: function() { //同意取消订单
				var that = this
				this.req('auditOrder', {
					order_id: this.order_id,
					type: 1,
					status: 1
				}, function(res) {
					uni.showToast({
						title: '操作成功',
						icon: 'none'
					})
					setTimeout(() => {
						that.getInfo()
						that.msg1 = ''
						that.msg2 = ''
						that.btnTxt1 = ''
						that.btnTxt2 = ''
						that.title = ''
						that.showErrMsg = false
					}, 800)
				})
			},
			passUpdateTime: function() { //同意改日期
				var that = this
				this.req('auditOrder', {
					order_id: this.order_id,
					type: 2,
					status: 1
				}, function(res) {
					uni.showToast({
						title: '操作成功',
					})
					setTimeout(() => {
						that.getInfo()
						that.showErrMsg2 = false
					}, 800)
				})
			},
			refuseUpdateTime: function() { //拒绝改日期
				var that = this
				this.req('auditOrder', {
					order_id: this.order_id,
					type: 2,
					status: 2
				}, function(res) {
					uni.showToast({
						title: '已拒绝',
						icon: 'none'
					})
					setTimeout(() => {
						that.getInfo()
						that.showErrMsg2 = false
					}, 800)
				})
			},
			clickCancelFac1: function() { // 拒绝取消厂家
				var that = this
				this.req('auditOrder', {
					order_id: this.order_id,
					type: 3,
					status: 2,
					manufactor_id: this.curId
				}, function(res) {
					uni.showToast({
						title: '已拒绝',
						icon: 'none'
					})
					setTimeout(() => {
						that.getInfo()
						that.msg1 = ''
						that.msg2 = ''
						that.btnTxt1 = ''
						that.btnTxt2 = ''
						that.title = ''
						that.showErrMsg3 = false
					}, 800)
				})
			},
			clickCancelFac2: function() { // 同意取消厂家
				var that = this
				this.req('auditOrder', {
					order_id: this.order_id,
					type: 3,
					status: 1,
					manufactor_id: this.curId
				}, function(res) {
					uni.showToast({
						title: '操作成功',
						icon: 'none'
					})
					setTimeout(() => {
						that.getInfo()
						that.msg1 = ''
						that.msg2 = ''
						that.btnTxt1 = ''
						that.btnTxt2 = ''
						that.title = ''
						that.showErrMsg3 = false
					}, 800)
				})
			},
			req: function(url, params, cb) {
				request.post('/api/pinbao/' + url, {
					data: params,
					success: function(res) {
						cb && cb(res)
					}
				})
			},
			// ====================================================第四代
			seeRecodeLG: function(e) { //拉包记录 打包记录
				var type = e.currentTarget.dataset.type
				var that = this
				if (type == 'da') { //显示打包记录
					that.req('getPackLogAdmin', {
						order_id: this.order_id
					}, function(res) {
						if (res.data.result) {
							if (res.data.result.length == 0) {
								return uni.showToast({
									title: '该订单暂无相关记录',
									icon: 'none'
								})
							} else {
								that.orderLog = res.data.result || []
								that.showReceive = true
								that.logType = '打包记录'
							}
						}
					})
				} else { //getTakePackLog
					that.req('getTakePackLog', {
						order_id: this.order_id
					}, function(res) {
						if (res.data.result) {
							if (res.data.result.length == 0) {
								uni.showToast({
									title: '该订单暂无相关记录',
									icon: 'none'
								})
							} else {
								that.orderLog = res.data.result || []
								that.showReceive = true
								that.logType = '拉包明细'
								that.disabledUpload = false
							}
						}
					})
				}
			},
			showGoOpera: function(e) {
				var index = e.currentTarget.dataset.index
				this.goDetailOperaIndex = this.goDetailOperaIndex == index ? -4 : index
			},
			modifyLog: function(e) { //跳出修改数量的框
				if (this.res.order.position_is_null == 1) {
					return uni.showToast({
						title: '当前状态订单无法继续操作',
						icon: 'none'
					})
				}
				var id = e.currentTarget.dataset.logid
				var num = e.currentTarget.dataset.num
				var index1 = e.currentTarget.dataset.index1
				var index2 = e.currentTarget.dataset.index2
				this.logId = id
				this.showModifyLog = true
				this.curIndex1 = index1
				this.curIndex2 = index2
				this.modifyData.beforeNum = num
				this.curFacName = this.orderLog[index1].log[index2].manufactor_name
				this.modifyData = Object.assign({}, this.modifyData)
			},
			operationReceiveBtn2: function(e) { //新增厂家底下按钮操作 //多个厂家的
				var type = e.currentTarget.dataset.type
				var list = this.receiveFactoryList
				var that = this
				if (type == 'confirm') { //点击 新增收货的确定
					var s = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
					var regRule =
						/^[\u4E00-\u9FA5A-Za-z0-9\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F\s/]+$/
					var sumReg = /^\d{1,5}$/
					var indexErr = 'none'
					var indexErr2 = 'none'
					list.forEach((item, index) => {
						item.receive_remark = item.receive_remark || ''
						if (!s.test(item.manufactor_name) || item.manufactor_name.trim() == '' || !sumReg.test(item.num)) {
							indexErr = index
						}
						if (item.receive_remark && !regRule.test(item.receive_remark)) {
							indexErr2 = index
						}
					})
					if (indexErr != 'none') {
						return uni.showToast({
							title: `厂名"${list[indexErr].manufactor_name}"填写格式不正确`,
							icon: 'none'
						})
					}
					if (indexErr2 != 'none') {
						return uni.showToast({
							title: `厂名"${list[indexErr2].manufactor_name}"备注请填写中文+符号`,
							icon: 'none'
						})
					}
					if (list.length == 0) {
						return uni.showToast({
							title: '请填写完整厂名及数量',
							icon: 'none'
						})
					}
					this.req('addFactoryReceiveLog', {
						manufactor: JSON.stringify(list),
						order_id: this.order_id
					}, function(res) {
						uni.showToast({
							title: '收货成功',
						})
						that.receiveFactory = false
						that.receiveFactoryNew = {
							manufactor_name: '',
							num: ''
						}
						that.receiveFactoryList = []
						setTimeout(() => {
							that.getInfo()
						}, 1500)
					})
				} else {
					this.receiveFactory = false
					this.showReceiveOneFac = false
					this.receiveFactoryNew = {
						manufactor_name: '',
						num: ''
					}
					this.curLogIndex = 'none'
				}
			},
			operationReceiveBtn: function(e) { //记录中的更改
				var type = e.currentTarget.dataset.type
				var that = this
				var sumReg = /^\d{1,5}$/
				var num = this.modifyData.num
				if (type == 'confirm') { //点击 新增收货的确定
					if (!sumReg.test(num)) {
						return uni.showToast({
							title: '请正确填写数量',
							icon: 'none'
						})
					}
					this.req('editOperateLog', {
						id: that.logId,
						num: num
					}, function(res) {
						uni.showToast({
							title: '操作成功',
						})
						that.logId = ''
						that.modifyData = {
							beforeNum: '',
							num: ''
						}
						that.curIndex1 = ''
						that.curIndex2 = ''
						that.showModifyLog = false

						setTimeout(() => {
							that.getInfo()
							that.req('getPackLogAdmin', {
								order_id: that.order_id
							}, function(res) {
								if (res.data.result) {
									that.orderLog = [...res.data.result]
								} else {
									that.orderLog = []
								}
							})
						}, 800)
					})
				} else {
					this.showModifyLog = false
					this.modifyData = {
						beforeNum: '',
						num: ''
					}
					this.curIndex1 = ''
					this.curIndex2 = ''
				}
			},
			receiveFactoryDel: function(e) { //从增加收货里面删除一行
				var index = e.currentTarget.dataset.index
				var list = this.receiveFactoryList
				list.splice(index, 1)
				this.receiveFactoryList = [...list]
			},
			receiveFactoryInput: function(e) { //新增厂家收货的
				var index = e.currentTarget.dataset.index
				var type = e.currentTarget.dataset.type
				var val = e.detail.value
				if (type == 'name') {
					this.receiveFactoryList[index].manufactor_name = val
				} else {
					this.receiveFactoryList[index].num = val
				}
				this.receiveFactoryList = [...this.receiveFactoryList]
			},
			receiveFactoryInput3: function(e) {
				var type = e.currentTarget.dataset.type
				var val = e.detail.value
				if (type == 'name') {
					this.receiveFactoryNew.manufactor_name = val
				} else {
					this.receiveFactoryNew.num = val
				}
				this.receiveFactoryNew = Object.assign({}, this.receiveFactoryNew)
			},
			receiveFactoryInput2: function(e) { //
				var type = e.currentTarget.dataset.type
				var val = e.detail.value
				if (type == 'name') {
					this.modifyData.beforeNum = val
				} else if (type == 'sum') {
					this.modifyData.num = val
				} else {
					this.modifyData.receive_remark = val
				}
				this.modifyData = Object.assign({}, this.modifyData)
			},
			checkBlur: function() { //失去焦点判断并增加
				var {
					manufactor_name,
					num
				} = this.receiveFactoryNew
				if (manufactor_name != '' && num != '') {
					this.receiveFactoryList = [...this.receiveFactoryList, {
						manufactor_name: manufactor_name,
						num: num
					}]
					this.receiveFactoryNew = {
						manufactor_name: '',
						num: ''
					}
				}
			},
			choosePack: function(e) { //切换勾选包
				if (this.res.order.position_is_null == 1) {
					return uni.showToast({
						title: '当前状态订单无法继续操作',
						icon: 'none'
					})
				}
				var index = e.currentTarget.dataset.index
				var pid = e.currentTarget.dataset.pid
				if (pid > 0) {
					this.orderLog[index].lj1 = false
					this.orderLog = [...this.orderLog]
					return uni.showToast({
						title: '该包裹已拉走',
						icon: 'none'
					})
				}
				this.orderLog[index].lj1 = !this.orderLog[index].lj1
				this.orderLog = [...this.orderLog]
			},
			revokeGo: function(e) { //撤销拉包
				if (this.res.order.position_is_null == 1) {
					return uni.showToast({
						title: '当前状态订单无法继续操作',
						icon: 'none'
					})
				}
				var id = e.currentTarget.dataset.id
				var that = this
				uni.showModal({
					content: '是否撤销本包裹的拉包?撤销后，厂家货物状态将回到 -打好包未拉- 的状态。',
					confirmColor: '#18c2ba',
					success(res) {
						if (res.confirm) {
							that.req('cancelTakePack', {
								order_id: that.order_id,
								pack_log_id: id
							}, function(res) {
								uni.showToast({
									title: '操作成功',
								})
								setTimeout(() => {
									that.showReceive = false
									that.getInfo()
								}, 800)
							})
						} else if (res.cancel) {}
					}
				})
			},
			_showPackRadio: function(e) { //显示拉包的radio
				var type = e.currentTarget.dataset.type
				if (this.res.order.order_status >= 5) {
					return
				}
				if (type == 'show') {
					if (this.uploadSrc.length == 0) { //先判断有没有图片
						return uni.showToast({
							title: '拉包之前必须上传拉包凭证(拍照)',
							icon: 'none'
						})
					}
				}
				this.showPackRadio = type == 'show'
			},
			shreLaBao: function() { //确定拉包
				var that = this
				var list = this.orderLog.filter((item) => {
					return item.pid <= 0 && item.img.length > 0
				})
				if (list.length == 0) {
					return uni.showToast({
						title: '请上传图片，选择要拉包的包裹后再拉包~',
						icon: 'none'
					})
				}

				var params = {
					order_id: this.order_id,
					pack_data: []
				}
				list.forEach((item) => {
					var imgs = []
					item.img.forEach((item2) => {
						imgs.push(item2.url)
					})
					params.pack_data.push({
						pack_log_id: item.id,
						img: imgs.join(',')
					})
				})

				params.pack_data = JSON.stringify(params.pack_data)
				this.req('takeAway', params, function(res) {
					uni.showToast({
						title: '操作成功',
					})
					setTimeout(() => {
						that.getInfo()
						that.showReceive = false
						that.showUploadImg = false
					}, 800)
				})
			},
			seeDetailFac: function(e) {
				var index = e.currentTarget.dataset.index
				uni.showLoading()
				this.orderLog[index].lj = !this.orderLog[index].lj
				this.orderLog = [...this.orderLog]
				setTimeout(() => {
					uni.hideLoading()
				}, 300)
			},
			collectedRecord: function(e) {
				var index = e.currentTarget.dataset.index
				this.orderLog[index].lj = !this.orderLog[index].lj
				this.orderLog = [...this.orderLog]
			},
			closeModifyPopup: function() {
				this.showReceive = false
				this.receiveFactory = false
				this.goDetailOperaIndex = -99
				this.showAddFacRemark = false
			},
			_newRemarkMore: function() { //查看更多备注
				this.newRemarkMore = true
			},
			_showScreen: function() { //显示筛选
				this.showScreen = true
				this.bottomTipBox = -2
				this.showScreen2 = false
			},
			switchFac: function(e) { //筛选操作
				var index = e.currentTarget.dataset.index
				this.factory = this.doSwitch(index, this.res.factory)
				this.showType = index
			},
			doSwitch: function(i, fac) { //筛选的操作抽离  多处使用
				uni.showLoading()
				var list = []
				if (!fac || fac.length == 0) {
					uni.hideLoading()
					this.showScreen = false
					return list
				}
				var i = i + ''
				switch (i) {
					case '0': //默认
						list = fac.filter((item) => {
							return item.status <= 5
						})
						break;
					case '1': //已送齐
						list = fac.filter((item) => {
							return (((item.receive_num >= item.goods_number) && item.goods_number > 0) || 
								(item.goods_number == 0 && item.receive_num > 0)) && item.status < 6
						})
						break;
					case '2': //未送齐
						list = fac.filter((item) => {
							return (item.goods_number > item.receive_num || 
								(item.goods_number == 0 && item.receive_num == 0)) && item.status < 6
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
				})
				this.showScreen = false
				this.calculation_receive_num = calculation_receive_num
				this.calculation_take_num = calculation_take_num
				this.hasInherit = hasInherit
				uni.hideLoading()
				return list
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
				} else if (type == 'num1' || type == 'receive_num' || type == 'num4') {
					facList.sort(function(a, b) {
						var num1 = a[type] == '未填' ? 0 : a[type]
						var num2 = b[type] == '未填' ? 0 : b[type]
						if (that.sortType[index]) {
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
			searchInput: function(e) { //顶部搜索厂家
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
			clickBottomItem: function(e) { //4.5代 点击底部菜单选项
				var that = this
				var type = e.currentTarget.dataset.type
				switch (type) {
					case 'pack': //点击的打包
						this.judgePack()
						this.bottomTipBox = ''
						this.showScreen2 = false
						break;
					case 'go': //点击的拉包
						that.req('getPackLogAdmin', {
							order_id: this.order_id
						}, function(res) {
							if (res.data.result) {
								if (res.data.result.length == 0) {
									uni.showToast({
										title: '该订单可拉包数为0',
										icon: 'none'
									})
								} else {
									that.orderLog = [...res.data.result]
									that.showReceive = true
									that.bottomTipBox = ''
									that.logType = '拉包操作'
									that.showScreen2 = false
								}
							}
						})
						break;
					case 'tel': //点击的电话
						that.bottomTipBox = that.bottomTipBox == 'tel' ? '-9' : 'tel'
						that.showScreen2 = that.bottomTipBox == 'tel' ? false : true
						break;
					case 'log': //点击的明细
						that.bottomTipBox = that.bottomTipBox == 'log' ? '-9' : 'log'
						that.showScreen2 = that.bottomTipBox == 'log' ? false : true
						break;
					default:
						break;
				}
			},
			closeBottomTips: function() { //关闭底部弹起的选项框
				this.bottomTipBox = ''
			},
			clickDotted: function() { //点击的底部圆点
				var that = this
				var arr = []
				if (that.bottomTipBox == 'dotted') {
					that.bottomTipBox = '-99'
					that.showScreen2 = false
					return
				}
				this.req('getOrderAuditData', {
					order_id: this.order_id
				}, function(res) {
					var result = res.data.result
					if (!result || result.length == 0) {
						arr = []
					}
					result.forEach((item) => {
						if (item.type == 1) {
							arr.push({
								name: '关闭订单/待审核',
								msg1: '请谨慎审核，关闭订单通过后，系统将无法跟踪记录，请务必办理好货物的交接手续，无论是被预约者取回或预约者指定人员取回，都必须办理货物交接手续，切记！',
								msg2: '',
								btnTxt1: '通过',
								btnTxt2: '拒绝',
								errMsgTitle: '用户申请关闭订单',
								showErrMsg: true,
								type: 'dd'
							})
						}
						if (item.type == 2) {
							arr.push({
								name: '变更打包日期/待审核',
								oldTimeMsg: that.res.order.appointment_date,
								newTimeMsg: item.appointment_time,
								showErrMsg2: true,
								type: 'rq'
							})
						}
						if (item.type == 3) {
							arr.push({
								name: '取消厂家/待审核',
								showErrMsg3: true,
								cancelFacBtn1: '通过',
								cancelFacBtn2: '拒绝',
								cancelFacMsg1: '请谨慎审核，取消厂家后，系统将无法跟踪记录，请务必办理好该厂家货物的交接手续，无论是被预约者取回或预约者指定人员取回，都必须办理货物交接手续，切记！',
								curId: item.manufactor_id,
								curFacName: item.manufactor_name,
								type: 'fac'
							})
						}
					})
					if (that.res.order.order_status && that.res.order.cancel_code > 0) {
						arr.push({
							name: `取消厂家确认码:${that.res.order.cancel_code}`,
							type: 'cancel'
						})
					}
					that.bottomTipBox = that.bottomTipBox == 'dotted' ? '-9' : 'dotted'
					that.applyItemList = [...arr]
					that.showScreen2 = true
				})
			},
			clickDottedItem: function(e) { //点击的圆点的弹出框
				var that = this
				var type = e.currentTarget.dataset.type
				if (type == 'yyxx') {
					this.bottomTipBox = 'yyxx'
				} else {
					var index = e.currentTarget.dataset.index
					var obj = that.applyItemList[index]
					for (const key in obj) {
						if (key != 'name' && key != 'type') {
							that[key] = obj[key]
						}
					}
					that.bottomTipBox = '-9'
				}
				that.showScreen2 = false
			},
			judgePack: function() { //点击打包 判断是否可以打包
				var that = this
				this.showType = 0
				this.factory = that.doSwitch(0, JSON.parse(JSON.stringify(that.res.factory))) //注意指向问题，取消打包还原时候用到
				var canSum = 0
				var num = 0
				var list = that.res.factory
				list.forEach((item) => {
					if (item.canPack) {
						canSum++
					}
					if (item.canPack && item.lj) {
						num += parseInt(item.packNum)
					}
				})
				if (canSum == 0) {
					return uni.showToast({
						title: '抱歉，当前订单没有厂家可以操作打包，请先收货后再操作打包~',
						icon: 'none'
					})
				} else {
					that.isShowPack = true
					that.totalPackNum = num
				}
			},
			packInputChange: function(e) { //打包时数量变化
				var index = e.currentTarget.dataset.index
				var val = e.detail.value
				this.factory[index].packNum = val
				this.factory = [...this.factory]
			},
			packInputBlur: function(e) {
				var index = e.currentTarget.dataset.index
				var val = e.detail.value
				var numReg = /^\d{1,5}$/
				var fac = this.factory
				var num = 0
				if (!numReg.test(val)) {
					this.factory[index].packNum = 0
					this.factory = [...this.factory]
					uni.showToast({
						title: `厂名"${fac[index].manufactor_name}"数量填写不正确`,
						icon: 'none'
					})
				}
				fac.forEach((item) => {
					if (item.canPack && item.lj) {
						num += parseInt(item.packNum)
					}
				})
				this.totalPackNum = num
			},
			choosePackFac: function(e) { //选择要打包的厂家
				var index = e.currentTarget.dataset.index
				var fac = this.factory
				var num = 0
				this.factory[index].lj = !fac[index].lj
				this.factory = [...this.factory]
				this.factory.forEach((item) => {
					if (item.canPack && item.lj) {
						num += parseInt(item.packNum)
					}
				})
				this.totalPackNum = num
			},
			confirmPack: function() { //确定打包
				var that = this
				var facs = this.factory
				var packFac = facs.filter((item) => {
					return item.canPack && item.lj
				})
				if (packFac.length == 0) {
					return uni.showToast({
						title: '没有打包的厂家',
						icon: 'none'
					})
				}
				var nameA = 'none'
				var nameB = 'none'
				var maxSum = ''
				var numReg = /^\d{1,5}$/
				var params = []
				packFac.forEach((item, index) => {
					if (!numReg.test(item.packNum) || item.packNum == 0 || item.packNum == '') {
						nameA = item.manufactor_name
					}
					if (item.packNum > item.MaxPackNum) {
						nameB = item.manufactor_name
						maxSum = item.MaxPackNum
					}
					params.push({
						manufactor_id: item.manufactor_id,
						num: item.packNum
					})
				})
				if (nameA != 'none') {
					return uni.showToast({
						title: `"${nameA}"数量填写错误`,
						icon: 'none'
					})
				}
				if (nameB != 'none') {
					return uni.showToast({
						title: `"${nameB}"打包数不能高于收货未打包数"${maxSum}手"`,
						icon: 'none'
					})
				}
				var data = {
					order_id: this.order_id
				}
				data.data = JSON.stringify(params)
				this.req('packaged', data, function(res) { //提交处理
					that.isShowPack = false
					that.getInfo()
				})
			},
			unPack: function() { //取消打包了,还原数据
				this.isShowPack = false
				this.factory = this.doSwitch(0, this.res.factory)
			},
			closeScreen: function() { //关闭筛选
				this.showScreen = false
			},
			closeScreen2: function() { //关闭筛选
				this.showScreen2 = false
				this.bottomTipBox = '-999'
			},
			seeUploadBox; function(e) { //打开上传图片的框
				var index = e.currentTarget.dataset.index
				var log = this.orderLog[index]
				if (log.img.length == 0) {
					this.curLogIndex = index
					this.chooseImg()
					return
				}
				this.curLogIndex = index
				this.showUploadImg = true
				this.deletable = log.pid == 0
				this.disabledUpload = log.pid > 0 || this.logType == '拉包明细'
			},
			absCloseUpload: function() { //关闭图片显示
				this.showUploadImg = false
			},
			reChooseGoPack: function(e) { //选中不选中 要拉包的包
				var index = e.currentTarget.dataset.index
				var log = this.orderLog[index]
				if (log.img.length == 0) {
					return uni.showToast({
						title: '请先上传图片',
						icon: 'none'
					})
				}
				if (log.pid > 0) {
					return false
				}
				this.orderLog[index].lj1 = !this.orderLog[index].lj1
				this.orderLog = [...this.orderLog]
			},
			PopupAddNewFac: function(e) { //新增厂家收货
				if (this.res.order.position_is_null == 1) {
					return uni.showToast({
						title: '当前状态订单无法继续操作',
						icon: 'none'
					})
				}
				this.showReceive = false
				this.receiveFactory = true
			},
			// 针对备注新增加的
			_showAddFacRemark: function(e) {
				this.showAddFacRemark = true
				this.curModifyNewFacIndex = e.currentTarget.dataset.index
				this.addFacRemark = this.receiveFactoryList[e.currentTarget.dataset.index].receive_remark || ''
				this.addFacRemarkFocus = true
			},
			addFacRemarkInput: function(e) {
				this.addFacRemark = e.detail.value
			},
			confirmAddFacRemark: function() {
				this.receiveFactoryList[this.curModifyNewFacIndex].receive_remark = this.addFacRemark
				this.addFacRemark = ''
				this.showAddFacRemark = false
				this.receiveFactoryList = [...this.receiveFactoryList]
			},
		}
	}
</script>

<style scoped src="./detail.css">

</style>

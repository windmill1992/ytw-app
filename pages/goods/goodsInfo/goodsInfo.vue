<template>
	<view>
		<view class="container">
			<view class="type-navbar">
				<view class="type-box" v-for="(item, index) in categories" :key="'cat' + index">
					<view :id="item.id" class="type-navbar-item" :class="{'type-item-on': activeCategoryId == item.id}"
						@tap="tabClick">
						{{item.name}}
					</view>
				</view>
			</view>
			<view class="goods-detail">
				<!-- 商品首页 -->
				<view class="goods-info" :hidden="activeCategoryId==0 ? false : true">
					<swiper class="swiper_box" indicator-dots :autoplay="!videoLink" interval="3000" duration="1000">
						<swiper-item v-if="videoLink">
							<video :controls="true" class="wh100" :src="videoLink" />
						</swiper-item>
						<template v-for="(item, index) in data.gallery">
							<swiper-item :key="'ga' + index">
								<image class="wh100" :src="item.image_url ? item.image_url : ''" @tap.stop="showImg"
									:data-curimg="item.image_url ? item.image_url : ''" mode="aspectFit" />
							</swiper-item>
						</template>
					</swiper>
					<view class="goods-title pd-bg-fff" v-if="is_apply != 1">
						<view class="goods-name ellipsis-2" @longpress="copyTitle" :data-txt="data.goods.goods_name">
							{{data.goods.goods_name}}</view>
						<view class='share-btn' @tap.stop='catchShare'>
							<image src='../../../static/images/icon-share.png'></image>
							<view>分享</view>
						</view>
					</view>
					<view class="goods-price pd-bg-fff">
						<view class="price co-red" v-if="data.goods.exchange_integral">
							<text>{{select.activity.priceName}}</text>
							<text style='font-size:22rpx;' class='mon'>￥</text>
							<text style='font-size:44rpx;'>{{select.price[0]}}</text>
							<text style='font-size:22rpx;' class='mon'>.{{ data.goods.each_hand_single_price }}</text>
							<text style='font-size:34rpx;'> + {{data.goods.exchange_integral}}积分</text>
						</view>
						<view class="price co-red" v-else><text>{{select.activity.priceName}}</text>
							<view v-if="select.activity.prom_type  && select.activity.prom_type != 6">
								<text class='mon'>￥</text>{{ data.goods.each_hand_single_price }}
							</view>
							<template v-else>
								<text class='mon'>￥{{ data.goods.each_hand_single_price }}</text>
							</template>

						</view>
						<view class="prom-info" v-if="select.activity.prom_type  && select.activity.prom_type != 6">
							<text class="prom-type">{{select.activity.countName}}</text>
							<text>{{select.activity.countTime}}</text>
						</view>
						<navigator class="prom-info" v-if="select.activity.prom_type == 6"
							:url="'../../team/team_info/team_info?goods_id=' + select.activity.goods_id + '&team_id=' + select.activity.team_id + '&item_id=' + select.activity.item_id">
							<text class="prom-type">{{select.activity.countName}}</text>
							<view style="display:inline-block;">点击前往</view>
						</navigator>
						<view class="salescollectstock">
							<text v-if="data">收藏数：{{ data.goods.collect_sum }}</text>
							<text v-if="data">浏览数：{{ data.goods.click_count }}</text>
							<text>库存：{{ data.spec_goods_price[0].store_count }}</text>
						</view>
						<view v-if="select.activity.prom_type == 2">{{select.activity.virtual_num}}人已参团</view>

					</view>
					<view v-if="cardList.length > 0 && data.goods.is_virtual == 0"
						class="logistics-list pd-bg-fff coupons" @tap="getCardList">
						<view class="logistics-item">
							<view class="item-title">优惠券</view>
							<view class="promotion-item-mes-card">
								<template v-for="(item, index) in cardList">
									<view v-if="index<3" :key="'card' + index">
										<text
											class="promotion-item-mes-cardborder">满{{item.condition}}减{{item.money}}</text>
									</view>
								</template>

							</view>
							<view class="item-img">
								<image class="wh100" src="../../../static/images/icon-arrowdown.png"></image>
							</view>
						</view>
					</view>
					<view class="logistics-list pd-bg-fff activity"
						v-if="data.activity.data[0] && data.goods.is_virtual == 0">
						<view class='hd_item'>
							<view class="item-title">活动</view>
							<view class='containter'>
								<view class='event'>
									<view class='man' v-for="(item, index) in data.activity.data" v-if="index < 5"
										:key="'act' + index">
										<text class="text">{{item.title}}</text><text
											class='item_content'>{{item.content}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>

					<view class="logistics-list pd-bg-fff address">
						<view class="logistics-item" v-for="(item, index) in data.goods.attr " :key="'attr' + index"
							v-if="index <= 1">
							<view class="item-title">{{ item.attr_name }}</view>
							<view style='width:604rpx;' class="item-mes ellipsis-1">{{ item.attr_value }}
								<text space="ensp"
									style="font-size:22rpx;">{{ item.attr_name == '适用年龄' ? ( data.goods.suggest_age_start ? ('（建议年龄' + data.goods.suggest_age_start + ' ~ ' + data.goods.suggest_age_end + '）') : '' ): '' }}</text>
							</view>
						</view>

						<view class="logistics-item" @tap='openSpecModel'>
							<view class="item-title ellipsis-1">货号颜色</view>
							<view class="item-mes">请选择</view>
							<view class="item-img">
								<image class="wh100" src="../../../static/images/icon-arrowdown.png"></image>
							</view>
						</view>

						<view class="logistics-item" @tap='enterAddress'>
							<view class="item-title ellipsis-1">收货地址</view>
							<view class="item-mes">
								<image class='loc' src='../../../static/images/loc.png'></image>
								{{address.address ? address.address:'请选择配送地址'}}
							</view>
							<view class="item-img">
								<image class="wh100" src="../../../static/images/icon-arrowdown.png"></image>
							</view>
						</view>
						<view class="logistics-item">
							<view class="item-title">配送运费</view>
							<view style='width:600rpx;' class="item-mes">{{shipping}}</view>

						</view>
						<view class="logistics-item" v-if="false">
							<view class="item-title">服务</view>
							<view style='width:604rpx;' class="item-mes ellipsis-1">由{{data.store.store_name}}提供服务
							</view>
						</view>

					</view>

					<!-- 店铺信息 -->
					<view class="shops-mes" v-if="is_apply != 1">
						<view class="shops-info">
							<view class="shops-pic">
								<image class="wh100" :src="url + data.store.store_avatar"></image>
							</view>
							<view class="shops-name">
								<view class="ellipsis-1">{{data.store.store_name}}</view>
								<view class="ellipsis-1">电话:{{ data.store.store_phone }}
									<image @tap="contactTel" style="width:40rpx;height:40rpx;"
										src='../../../static/images/shop-tel.png'></image>
								</view>
								<view class="ellipsis-1">地址:{{ data.store.store_address }}</view>
							</view>

						</view>
						<view class="scores-list">
							<view class="scores-item">
								<view class="scores-title">
									商品评价 <view class="co-red">{{data.store.store_desccredit}}
										<text
											:class="data.store.store_desccredit < 4.5 ? 'low' : (data.store.store_desccredit < 4.8 ? 'middle' : '')">
											{{data.store.descScoreDesc}}</text>
									</view>
								</view>
							</view>
							<view class="scores-item">
								<view class="scores-title">
									服务评价<view class="co-red">{{data.store.store_servicecredit}}
										<text
											:class="data.store.store_servicecredit < 4.5 ? 'low' : (data.store.store_servicecredit < 4.8 ? 'middle' : '')">{{data.store.serviceScoreDesc}}</text>
									</view>
								</view>
							</view>
							<view class="scores-item">
								<view class="scores-title">
									物流评价<view class="co-red">{{data.store.store_deliverycredit}}
										<text
											:class="data.store.store_deliverycredit < 4.5 ? 'low' : (data.store.store_deliverycredit < 4.8 ? 'middle' : '')">{{data.store.deliveryScoreDesc}}</text>
									</view>
								</view>
							</view>
						</view>
						<view class="baguette" @tap.stop="toStore"
							:data-url="'/pages/store/index/index?store_id=' + data.store.store_id">
							<view>进店逛逛</view>
						</view>
						<view class="baguette2" @tap.stop="collectStore">
							<view>收藏店铺</view>
						</view>
					</view>


					<view class="user-comment logistics-item pd-bg-fff">
						<view class='evaluation'>用户评价<text>({{data.statistics.total_sum}})</text></view>
						<view @tap="tabComment" class="good-comment">
							好评<view class="co-red">{{data.goods.goodCommentRate}}%</view>
							<view class="item-img">
								<image class="wh100" src="../../../static/images/icon-arrowdown.png"></image>
							</view>
						</view>
					</view>
					<!-- 评论s -->
					<view class='estimate' v-for="(item, cIdx) in data.comment" :key="'com' + cIdx">
						<image class='user_img'
							:src='item.is_anonymous ? defaultAvatar : item.head_pic ? item.head_pic : defaultAvatar'>
						</image>
						<view class='user'>
							<view class='id'>
								<view class='star_on'>
									<text>{{item.is_anonymous ? '匿名用户' : item.nickname}}</text>
									<template v-for="(img, index1) in item.goods_rank_new">
										<image :src="'../../../static/images/stars-' + img + '.png'"
											:key="'img' + cIdx + index1"></image>
									</template>
									<text class='time'>{{item.addTimeFormat}}</text>
								</view>
							</view>
							<text class='estimate_content'>{{item.content}}</text>
							<view class='estimate_img' v-if="item.img[0].length > 0">
								<image mode='aspectFill' v-for="(img, index2) in item.img" :key="'img2' + cIdx + index2"
									:src='url + img'></image>
							</view>
						</view>
					</view>

					<!-- 评论e -->

					<view class="recommend" v-if="data.recommend_goods.length > 0">
						<view class="recommend-title">为你推荐</view>
						<view class="recommend-ul">
							<navigator v-for="(item, index) in data.recommend_goods" v-if="index < 6"
								:key="'rec' + index" class="li"
								:url="'/pages/goods/goodsInfo/goodsInfo?goods_id=' + item.goods_id"
								open-type='redirect'>
								<view class="li-img">
									<image class="wh100"
										:src="url + '/api/goods/goodsThumImages?goods_id=' + item.goods_id + '&width=200&height=200'">
									</image>
								</view>
								<view class="li-title ellipsis-2">{{item.goods_name}}</view>
								<view class='color'>
									<text>￥</text>{{item.price_new[0]}}<text>.{{item.price_new[1]}}</text></view>
							</navigator>
						</view>
					</view>

				</view>
				<!-- 商品详情 -->
				<view v-if="goods_norms" class="goods-norms" :hidden="activeCategoryId !=2 ? false : true">
					<view class="type-navbar2">
						<view class="type-box2" v-for="(item, index) in categories2" :key="'cat2' + index">
							<view :id="item.id" :class="activeCategoryId2 == item.id ? 'type-item2-on' : ''"
								@tap="tabClick2">
								{{item.name}}
							</view>
						</view>
					</view>
					<view :hidden="activeCategoryId2 == 0 ? false : true" class="wxParse">
						<view v-html="goods_content"></view>
					</view>
					<view class="parameter" :hidden="activeCategoryId2 == 1 ? false : true">
						<view class="table">
							<view class="th-thitle tb">主体</view>
							<view class="td-cont tb" v-for="(item, index) in goodsAttrs" :key="'gattr' + index">
								<view class="td-title">{{item.attr_name}}</view>
								<view class="td-text">{{item.attr_value}}</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 商品评论 -->
				<view class="goods-comment" :hidden="activeCategoryId == 2 ? false : true">
					<view class="type-navbar3">
						<view class="type-box3" v-for="(item, index) in categories3" :key="'cat3' + index">
							<view id="item.id" :class="activeCategoryId3 == item.id ? 'type-item3-on' : ''"
								@tap="tabClick3">
								{{item.name}}({{item.num}})
							</view>
						</view>
					</view>
					<view class="comment-list">
						<view class="comment-item" v-for="(item, cIdx) in comments" :key="'com2' + cIdx">
							<view class="comment-title">
								<view class="user-name">
									<view class="user-pic">
										<image class="wh100"
											:src="item.is_anonymous ? defaultAvatar : item.head_pic ? url + item.head_pic : defaultAvatar">
										</image>
									</view>
									<view class="user-word">{{item.is_anonymous ? '匿名用户' : item.nickname}}</view>
								</view>
								<view>{{item.addTimeFormat}}</view>
							</view>
							<view class="comment-cont">
								<view>
									<view class="stars">
										<view class="stars-checked">
											<image class="star" src="../../../static/images/star-red.png"
												v-for="(img, idx) in item.goods_rank" :key="'red' + cIdx + idx"></image>
										</view>
										<view class="stars-unchecked">
											<image class="star" src="../../../static/images/star-gray.png"
												v-for="(img, idx) in 5 - item.goods_rank" :key="'gray' + cIdx + idx">
											</image>
										</view>
									</view>
									<view class="state-spec ellipsis-1">{{item.spec_key_name?item.spec_key_name:''}}
									</view>
								</view>
								<view class="comment-mes">{{item.content}}</view>
								<view class="img-ul">
									<view class="img-li" v-for="(img, idx) in item.img" :key="'img2' + cIdx + idx">
										<image class="wh100" :src="img" @tap="previewCommentImgs" :data-cidx="cIdx"
											:data-id="idx"></image>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 返回顶部按钮  -->
		<view class="toTop" @tap="doScrollTop" v-if="supportPageScroll">
			<image class="wh100" src="../../../static/images/topup.png"></image>
		</view>
		<!-- 加入购物车栏  -->
		<view class="join-cart">
			<view class='flex_bottom'>
				<view class="goods-collect" @tap.stop="toStore"
					:data-url="'/pages/store/index/index?store_id=' + data.store.store_id">
					<view class="collect-img">
						<van-icon name="shop-o" color="#18c2ba" size="20px" />
					</view>
					<view class="collect-des">店铺</view>
				</view>
				<view class="custom-service cart-ico">
					<button v-if="imChoose==1" open-type="contact" class='cs-button'
						:session-from="'wechat|' + userInfo.user_id + '|' + userInfo.nickname + '|' + userInfo.head_pic + '|' + data.store.store_id">
						<image class="cs-img cs-img-kf" src="../../../static/images/custom-service.png"></image>
						<view class='cs-ing-name'>客服</view>
					</button>
					<view v-else-if="imChoose==0" class='cs-button' @tap='contactService'>
						<image class="cs-img cs-img-kf" src="../../../static/images/custom-service.png"></image>
						<view class='cs-ing-name'>客服</view>
					</view>
					<view v-else class='cs-button' @tap="contactTel">
						<image class="cs-img cs-img-kf" src="../../../static/images/custom-service.png"></image>
						<view class='cs-ing-name'>客服</view>
					</view>
				</view>
				<view class="goods-collect" @tap="collectGoods">
					<view class="collect-img">
						<image :hidden="data.goods.is_collect" class="wh100" src="../../../static/images/heart.png">
						</image>
						<image :hidden="!data.goods.is_collect" class="wh100" src="../../../static/images/heart-h.png">
						</image>
					</view>
					<view class="collect-des">收藏</view>
				</view>
			</view>

			<view v-if="data.goods.is_virtual" class="buy-btn cart-btn cart-btn-lg" @tap="openSpecModel">立即购买</view>
			<view v-else-if="data.goods.prom_type == 4 " class="buy-btn cart-btn cart-btn-lg" @tap="openSpecModel"
				:data-index="false">立即预定</view>
			<template v-else-if="data.goods.exchange_integral <= 0">
				<text class="newBtn addFx" @tap="openSpecModel" data-type="car">加购物车</text>
				<text class="newBtn addCar" @tap="copyDetail" v-if="is_apply != 1">加入分销 </text>
				<text class="newBtn buyNow" @tap="openSpecModel" data-type="buy">立即购买</text>
			</template>
			<view v-else-if="data.goods.exchange_integral > 0" class="buy-btn cart-btn cart-btn-lg"
				@tap="openSpecModel">立即兑换</view>
		</view>


		<!-- 商品预览 -->
		<van-action-sheet :round="false" @close="onClose" :show="show" title="">
			<view class="sheetPrice">
				<text class="small">￥</text>{{ selictGoods.price }}
				<text style="font-size:24rpx;">{{"/件"}}</text>
				<text style="color:#ccc;font-size:30rpx;" space="emsp"> 库存{{ selictGoods.store_count }}件</text>
			</view>
			<view class="sheetAllprice">
				<text class="small">每手总价 ￥</text>{{ selictGoods.allprice }}
				<text :hidden="!selictGoods.introduce"
					style="float:right;margin-right:45rpx;color:#555;font-size:28rpx;">{{ '当前已选:' + selictGoods.goods_num + '手，合计' + totalPrice + '元' }}</text>
			</view>
			<view class="sheetstock"></view>
			<scroll-view class="scroll-y" scroll-y>
				<scroll-view @scroll="scrollXfun" enhanced scroll-x
					:style="'height:' + (scrollBoxHeight - 0 + 15) +'rpx'" class="scroll-x12" id="scroll">
					<view class="scrollx-item-box"
						:style="'width:' + scrollBoxWidth + 'rpx' + ';height:' + scrollBoxHeight + 'rpx'">
						<view @tap="clickImg" :class="'scroll-item' + curImg == index ? ' curimg' : ''"
							:data-index="index" v-for="(item,index) in result.goods_spec_list[0].spec_list"
							:key="'gspec' + index" :style="'width:' + sItemWidth + 'rpx'">
							<image class="imgg" :src=" item.src ? item.src : '' "
								:style="result.spec_goods_price[index].store_count == 0 ? 'filter: saturate(0%);' : ''"
								mode="aspectFit"></image>
							<view :class="'txt' + curImg == index ? ' txt2' : ''">{{ item.item}}</view>
							<image class="fangda" src="../../../static/images/preImage.png" @tap.stop="imageFangDa"
								:data-index=" index "></image>
						</view>
					</view>
				</scroll-view>
				<view class="pressLine" v-if="ulWidth != '200rpx'">
					<view :style="'width:' + ulWidth + ';left:' + pressLeft" class="pressitem"></view>
				</view>
				<view class="logistics-list pd-bg-fff address">
					<view class="logistics-item" v-for="(item, index) in data.goods.attr" :key="'gattr2' + index"
						v-if="index <= 1">
						<view :class="'item-title' + index == 0 ? ' orange1' : ' zhuticolor'">{{ item.attr_name }}:
						</view>
						<view style='width:604rpx;' class="item-mes ellipsis-1">{{ item.attr_value }}</view>
					</view>
				</view>
				<view class="size-box">
					<view class="showSize">
						<text class="fs38">每手几件:</text><text class="sheetsizeitem" @tap="changeShoushu"
							v-for="(item, index) in result.goods_spec_list[1].spec_list " :key="'gspec2' + index"
							:data-index="index" :data-size="item">{{ item.item + '件' }}</text>
					</view>
					<view @tap.stop="siseHelp" class="siseHelp">？</view>
				</view>
				<view class="sheet-num">
					<text>购买数量</text>
					<van-stepper custom-class="stepperrootclass" plus-class="plusclass" minus-class="minusclass"
						input-class="inputclass" :long-press="false" integer button-size="26px" input-width="165rpx"
						@change="bunSumChange" :value="selictGoods.goods_num" :max="sheetMaxSum" />
					<text class="buysumtips">(手)</text>
				</view>
				<view class="jiade"></view>
				<button class="sheet-sub" @tap="buyOrcar">确{{" "}}定</button>
			</scroll-view>
		</van-action-sheet>

		<!-- 模拟previewImage 轮播图 -->
		<view class="previewImage-box" :hidden="isSwiperShow" @touchmove.stop="true" @tap="previewImageTap">
			<swiper class="previewImage" @change="previewImageChange" :current="currentSwiperIndex"
				@animationfinish="swiperOver">
				<swiper-item v-for="(item, index) in result.goods_spec_list[0].spec_list" :key="'gspec3' + index">
					<image class="aaa" :src="item.src ? item.src : ''" mode="aspectFit"></image>
					<view class="introduce-txt">{{ result.goods_spec_list[0].spec_name + '-' + item.item }}</view>
					<view class="introduce-price"><text style="font-size:24rpx;" space="ensp">
							￥</text>{{result.spec_goods_price[index].each_hand_unit_price}}</view>
				</swiper-item>

			</swiper>
			<view class="previewImage-introduce-box"></view>
			<view class="previewImage-index">{{previewImageIndex-0+1}}/{{ result.spec_goods_price.length }}</view>
			<image class="previewImage-image"
				src="https://www.yitongwang.com/public/static/images/minniapp/previewImg-img.png"></image>
			<view class="previewImage-close" hover-class="previewImage-close-hover" @tap.stop="previewImageClose">
				<image src="https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/guanbiguanbi.png"></image>
			</view>
		</view>
		<!-- 优惠信息弹框  -->
		<view :hidden="!openPromModal">
			<view class="cover-layer" @tap="closePromModal"></view>
			<view class="prom-model">
				<icon type="cancel" color="gray" size="22" class="modal-close" @tap="closePromModal" />
				<view class="prom-title">优惠信息</view>
				<view class="logistics-item" v-for="(item, index) in select.activity.data" :key="'selact' + index">
					<view class="item-title"><text class="prom-item">{{item.title}}</text></view>
					<view class="item-mes ellipsis-1">{{item.content}}</view>
				</view>
			</view>
		</view>

		<!-- 分享海报生成 s-->
		<view v-if='share_btn'>
			<view class="prom-model">
				<icon type="cancel" color="gray" size="22" class="modal-close" @tap="closeShareModal" />
				<view class="prom-title"><text space="emsp">{{ shareTxt }}</text></view>
				<view class='share-pic'>
					<image @tap.stop='previewSharePic' style='width:100%;height:100%' :src='share_pic'></image>
				</view>
				<view class="share-save-btns">
					<view class="share-save-btn" @tap.stop="saveSharePic">保存海报</view>
				</view>
			</view>
		</view>

		<action-sheet :hidden="actionSheetHidden" @change="listenerActionSheet" z-index="99">
			<action-sheet-item>
				<button v-if="userInfo.is_B == 1 || userInfo.store_id == 0 || !userInfo.store_id"
					class='action-sheet-btn' @tap.stop="shareTogether">发送给同行</button>
				<button v-if="userInfo.is_B != 1 && userInfo.store_id > 0" class='action-sheet-btn'
					open-type="share">分享给微信好友</button>
			</action-sheet-item>
			<action-sheet-item v-if="userInfo.store_id == 0 || !userInfo.store_id" @tap.stop="getSharePic" type="3">
				分享给下级采购商</action-sheet-item>
			<!---普通人-->
			<action-sheet-item v-if="userInfo.is_B == 1" @tap.stop="getSharePic" type="3">分享给下级采购商<view>（对方看不到壹童网信息）
				</view>
			</action-sheet-item>
			<!---大B-->
			<action-sheet-item v-if="userInfo.is_B == 0 || !userInfo.store_id" @tap.stop="getSharePic" type="0">分享至朋友圈
			</action-sheet-item>
			<!---大A 或普通人-->
			<action-sheet-cancel>取消</action-sheet-cancel>
		</action-sheet>
		<!-- 分享海报生成 e-->
		<!-- 分享下级二维码 -->
		<view class="mask" @touchmove.stop="true" v-if="hasQcode">
			<view class="qCode" v-if="hasQcode">
				<view class="codeClose">
					<icon class="icon-small" color="#999" type="cancel" size="23" @tap.stop="closeQcode"></icon>
				</view>
				<image :src="qCodeImg" />
			</view>

		</view>
		<!-- 分享下级二维码 end -->

		<!-- 复制商品 -->
		<view class="mask" @touchmove.stop="true" v-if="dialog1"></view>
		<view class="dialog1" v-if="dialog1">
			<view class="dialog1-title">复制商品</view>
			<view class="dialog1-content">
				<view class="dialog1-item">
					<view class="dialog1-label">分销价格：</view>
					<input type="number" class="input1" v-model="price1" placeholder="请输入分销商品的价格"></input>
				</view>
			</view>
			<view class="dialog-footer">
				<view class="dialog1-btn" @tap.stop="cancel">取消</view>
				<view class="dialog1-btn" @tap.stop="sure">确定</view>
			</view>
		</view>
		<!-- 每手几件弹出框 -->
		<van-dialog id="van-dialog" />

		<!-- 联系客服 拨打电话 -->
		<van-action-sheet :show="telShow" @close="onTelClose">
			<view class="makePhone col666">{{result.store.store_phone}}</view>
			<view class="makePhone telHasImage bgc18" @tap.stop="callOtherTel">
				<image src="../../../static/images/shop-tel.png"></image> {{ "   呼 叫" }}
			</view>
			<view @tap.stop="onTelClose" class="makePhone telHasImage bgce6">
				<image style="background-color:#777;" src="../../../static/images/dax-1.png"></image> {{ "   取 消" }}
			</view>
		</van-action-sheet>

		<!-- 大B分享同行的弹框 -->
		<van-dialog title="提醒" message="请再次确认，本次分享，对方将知晓壹童网信息，是否继续？\n如若不想让对方知晓壹童网，请返回使用“私密分享给下级采购商”功能来进行分享"
			:show="shareTogether" show-cancel-button message-align="left" zIndex="9999999" confirmButtonText="继续"
			cancelButtonText="返回" confirm-button-open-type="share" @close="shareTogetherClose">
		</van-dialog>

		<!-- 筛选提示遮罩层 -->
		<view class="tips-mask" :hidden="tipsmask" @touchmove.stop="true">
			<image src="https://www.yitongwang.com/public/static/images/minniapp/fx-tips-3.png"></image>
			<view class="txt" @tap.stop="closeMask">我知道了</view>
			<view class="txt2">该提示6次后不再出现，当前已提示{{ pastSum }}次</view>
		</view>

	</view>
</template>

<script lang="wxs" module="splicep">
	var sp = function(v) {
		return v.substring(0, 12) + '...'
	}
	var formatUrl = function(url) {
		if (true) {
			return url
		} else {
			return 'https://www.yitongwang.com' + url
		}
	}
	var getRandom = function(i) {
		if (i) {
			var i = i + ''
			return i[i.length - 1] - 0 + (i[i.length - 2] - 0)
		}
	}
	module.exports = {
		getRandom,
		sp,
		formatUrl
	}
</script>
<script>
	var util = require('../../../static/utils/util.js');
	var common = require('../../../static/utils/common.js');
	var app = getApp();
	var request = app.request;
	var setting = app.globalData.setting;
	import LoadMore from '../../../static/utils/LoadMore.js';
	var load = new LoadMore;
	export default {
		data() {
			return {
				url: setting.url,
				is_apply: 0,
				resourceUrl: setting.resourceUrl,
				defaultAvatar: "https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/user68.jpg",
				userInfo: null,
				data: null, //请求的商品详情数据
				result: null,
				content: '', //商品详情页html
				goodsAttrs: null, //商品属性列表
				cartGoodsNum: 0, //购物车商品数量
				specSelect: 0, //选中的组合规格数组spec_goods_price下标
				optionItemId: 0, //页面参数，页面初始化指定显示的itemid，用于活动
				goodsInputNum: 1, //选中的商品件数
				openSpecModal: false, //是否打开规格弹窗
				openPromModal: false, //是否打开优惠信息弹窗
				showStore: false,
				cardList: [],
				activeCategoryId: 0, //商品主页tab
				supportPageScroll: false, //微信版本是否支持页面滚动回顶部
				goods_norms: 0, //是否显示图文详情
				judge: true, //判断确定按钮是加入购物车还是立即购买
				address: {
					address: '',
					district: 0,
				},
				shipping: '',
				shippingCost: 0,
				enterAddressPage: false,
				categories: [{
						name: "商品",
						id: 0
					},
					{
						name: "详情",
						id: 1
					},
					{
						name: "评论",
						id: 2
					}
				],
				activeCategoryId2: 0, //商品内容tab
				categories2: [{
						name: "商品详情",
						id: 0
					},
					{
						name: "规格参数",
						id: 1
					},
				],
				activeCategoryId3: 0, //商品评论tab
				categories3: [{
						name: "全部",
						id: 0,
						num: 0
					},
					{
						name: "好评",
						id: 1,
						num: 0
					},
					{
						name: "中评",
						id: 2,
						num: 0
					},
					{
						name: "差评",
						id: 3,
						num: 0
					},
					{
						name: "有图",
						id: 4,
						num: 0
					}
				],
				select: { //选择的(规格)商品的参数，用于显示
					price: 0,
					stock: 0,
					spec_img: '',
					specName: '',
					activity: null
				},
				timer: null, //活动倒计时定时器
				imChoose: 0, //0 QQ客服,1 IM客服,2 小能客服
				imgs: [], //商品图片组
				options: null,
				share_btn: false, //自定义分享按钮状态
				actionSheetHidden: true, //自定义actionSheet隐藏True
				activityIn: 0,
				isBragain: false,
				isSeparate: true,
				cardList: [],
				combinations: [], //搭配购
				maskShow: true,
				showCar: false,
				showYes: false,
				goodId: '', //商品id
				dialog1: false, //弹窗
				price1: '', //分销价格
				hasQcode: false, //分享给下级 弹窗
				qCodeImg: '', //分享下级  商品二维码
				store_id: '',
				lll: 0,
				show: false,
				ssuumm: 8,
				scrollBoxWidth: 950,
				scrollBoxHeight: 840,
				sItemWidth: 230,
				ulWidth: 0,
				proportionPx: uni.getSystemInfoSync().screenWidth / 750,
				pressLeft: 0,
				curImg: 'ldsjh',
				selictGoods: {
					introduce: '',
					goods_id: 0,
					goods_num: 1,
					item_id: '',
					form: 1,
					price: 0,
					allprice: 0,
					stock: 0,
				},
				currentShoushu: 0,
				singlePrice: 0,
				sheetMaxNum: 0,
				sheetMaxSum: 10,
				v: 1,
				upsum: 0,
				nextSum: 0,
				carOrBuy: '',
				hasVideo: false,
				videoLink: '',
				previewImageIndex: 0,
				isSwiperShow: true,
				currentSwiperIndex: 1,
				goodsError: false, //极低测试情况下，数据不完整
				totalPrice: 0, //选择了的商品的总价
				telShow: false, //非ios拨打电话的开关
				shareTogether: false, //分享同行的再次弹出
				shareTxt: '分享至朋友圈',
				tipsmask: true,
				pastSum: 1,
				isFirstIn: true,
				goods_content: '',
			}
		},
		onLoad: function(options) {
			uni.hideShareMenu()
			if (options) {
				this.goodId = options.goods_id
				this.store_id = options.store_id
			}
			if (options.scene) {
				var scene = decodeURIComponent(options.scene)
				var data = scene.split('&');
				options.goods_id = data[0].split('=')[1];
				options.store_id = data[1].split('=')[1];
			}
			var that = this;
			if (options.first_leader) {
				uni.setStorageSync('first_leader', options.first_leader);
			}
			var userInfo = uni.getStorageSync('app:userInfo');
			this.userInfo = Object.assign({}, userInfo);
			var that = this;
			app.getConfig(function(res) {
				var im_choose = common.getConfigByName(res.config, 'im_choose');
				that.imChoose = im_choose;
			});
			this.optionItemId = typeof options.item_id == 'undefined' ? 0 : options.item_id;
			request.get('/api/goods/goodsInfo', {
				data: {
					id: options.goods_id,
					store_id: options.store_id
				},
				failRollback: true,
				success: function(res) {
					//  如果有video 则取出
					const r = res.data.result;
					var videoLink = ''
					if (r.goods.video) {
						videoLink = r.goods.video
					}

					var lll = r.spec_goods_price.length //获取到规格参数的数量
					var recommend_goods = r.recommend_goods;
					for (var i in recommend_goods) {
						recommend_goods[i].price_new = recommend_goods[i].shop_price.split(".");
					}
					that.initData(r);

					var images = r.goods_spec_list[0].spec_list.map((item) => {
						return item.src
					})
					if (!r.goods_spec_list[1]) { //判断手数问题有没有传递正确 不行就再见 不让展示商品信息了 无法操作
						uni.showToast({
							title: '该商品商家未设置购买手数规格，暂无法购买',
							icon: 'none'
						})
						that.goodsError = true;
						return
					}
					if (r.goods_spec_list[0].spec_name == "每手几件") {
						r.goods_spec_list = r.goods_spec_list.reverse()
					}
					that.result = Object.assign({}, r);
					that.lll = lll;
					that.selictGoods = Object.assign({}, {
						introduce: '',
						goods_id: r.goods.goods_id,
						goods_num: 1,
						item_id: '',
						form: 1,
						price: r.goods.each_hand_single_price,
						allprice: r.goods.each_hand_all_price,
						store_count: r.spec_goods_price[0].store_count
					});
					that.totalPrice = r.goods.each_hand_all_price;
					that.currentShoushu = r.goods_spec_list[1].spec_list[0].item;
					that.sheetMaxSum = Math.floor(r.spec_goods_price[0].store_count);
					that.previewImages = [...images];
					that.videoLink = videoLink;
					that.requestGoodsContent();
					that.refreshDispatch(r);
				}
			});
			this.requestCardNum();
			//是否支持返回按钮

			if (uni.pageScrollTo) {
				this.supportPageScroll = true;
			}
			//小程序嵌套不能超过5层
			var pages = getCurrentPages();
			if (pages.length < 5) {
				this.showStore = true;
			}
			this.getStoreInfo(options.store_id);
			if (!uni.getStorageSync('maskSum2') && (!this.userInfo || this.userInfo.is_B == 1)) { //大B  现实提示的遮罩层
				uni.setStorageSync('maskSum2', 7);
				this.tipsmask = false
			} else {
				if (uni.getStorageSync('maskSum2') == 1) {
					this.tipsmask = true;
				} else {
					this.tipsmask = false;
					this.pastSum = 6 - uni.getStorageSync('maskSum2') + 2;
				}
			}
			if (this.userInfo.is_B != 1 && this.userInfo.store_id > 0) { //做个保底 大A不要
				this.tipsmask = true;
			}
		},
		//重新刷新物流数据
		onShow: function() {
			if (this.enterAddressPage) {
				this.enterAddressPage = false;
				this.refreshDispatch(this.result);
			}
			if (this.isFirstIn) {
				this.isFirstIn = false;
			} else {
				this.userInfo = Object.assign({}, uni.getStorageSync('app:userInfo'))
			}
		},
		onUnload: function() {
			this.destroyActivityTimer();
		},
		onShareAppMessage: function(res) {
			var that = this
			var goods = that.data.goods;
			var url = that.url;
			var original_img = goods.original_img;
			if (!original_img) {
				original_img = goods.spec_goods_price[0].spec_img;
			}
			if (original_img.indexOf('http') < 0 && original_img.indexOf('https') < 0) {
				original_img = url + original_img
			}
			var name = ''
			if (that.userInfo.nickname) {
				name = that.userInfo.nickname
			}
			return {
				title: name + '发现了一件好货' + goods.goods_name, //自定义转发标题
				path: '/pages/goods/goodsInfo/goodsInfo?goods_id=' + goods.goods_id + '&item_id=' + that.optionItemId + '&first_leader=' + uni.getStorageSync('app:userInfo')['user_id'],
				imageUrl: original_img
			}
		},
		// 页面上拉触底事件的处理函数
		onReachBottom: function() {
			if (true) {
				this.loading = true;
				this.goods_norms = 1;
			}
		},
		methods: {
			getStoreInfo: function(store_id) {
				const that = this
			},
			// 显示分销价格
			copyDetail: function() {
				var that = this;
				if (!uni.getStorageSync('wx_user_info')) {
					app.getUserInfo(function(userInfo) {
						that.userInfo = Object.assign({}, userInfo);
						that.click = false;
					}, true, false);
					return false;
				}
				if (that.goodsError) { // 判断是不是极低概率，出现的商品错乱情况
					return
				}
				if (this.userInfo.store_id == 0) {
					uni.showModal({
						message: '您还没有店铺，无法使用分销功能。是否前往免费开店？',
						confirmButtonText: '免费开店',
						cancelButtonText: '再看看',
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/newjoin/join4/join4',
								})
							}
						}
					})
					return
				}
				if (this.userInfo.store_id != 0 && this.userInfo.is_B != 1) { // 大A
					uni.showModal({
						message: '对不起，目前该功能只针对采购商开放，您当前的身份为供应商，暂无法使用该功能！',
						confirmButtonText: '好的',
						showCancelButton: false
					})
					return
				}

				request.post(that.url + '/api/Distribut/add_goods', {
					data: {
						goods_ids: that.goodId,
						type: 1
					},
					success: function(res) {
						if (res.data.status == -1) {
							uni.showToast({
								title: res.data.msg,
								icon: 'none',
								duration: '2000'
							})
						} else {
							that.fenxiaowai()
						}
					}
				})
			},
			fenxiaowai: function() {
				if (this.lll > 0) {
					uni.navigateTo({
						url: "/pages/distribution/index?good_id=" + this.goodId + "&store_id=" + this.result.store.store_id
					})
					return
				}
				this.dialog1 = true;
			},
			// 分销弹窗
			cancel: function() {
				this.dialog1 = false;
				this.price1 = '';
			},
			// 复制商品确定
			sure: function() {
				let that = this;
				if (!that.price1) {
					uni.showToast({
						title: '请输入分销价格',
						icon: 'none',
						duration: 2000
					})
					return false
				}
				if (that.select.price[0] >= parseFloat(that.price1)) {
					uni.showToast({
						title: '分销价格要比原价格高',
						icon: 'none',
						duration: 2000
					})
					return false
				}
				request.post('/api/Distribut/add_goods', {
					data: {
						goods_ids: that.goodId,
						terminal: "miniapp",
						goods_new_price: that.price1,
					},
					success: function(res) {
						uni.showToast({
							title: '复制成功',
							icon: 'none',
							duration: 2000
						})
					}
				});
			},
			/**查询商品物流 */
			refreshDispatch: function(result) {
				var that = this;
				//地址为0，没有地址时候先默认给1，提交订单再选择地址
				if (consigneeAddress) {
					consigneeAddress.district = consigneeAddress.district ? consigneeAddress.district : 1;
				}
				var consigneeAddress = uni.getStorageSync('goodsInfo:goodsInfo:address') ? 
					uni.getStorageSync('goodsInfo:goodsInfo:address') : result.consignee;
				that.address.address = consigneeAddress.address;
				that.address.district = consigneeAddress.district;
				that.address = Object.assign({}, that.address);
				request.get('/api/goods/dispatching', {
					data: {
						goods_id: result.goods.goods_id,
						region_id: consigneeAddress.district,
					},
					isShowLoading: false,
					success: function(res) {
						var shippinginfo;
						if (res.data.result > 0) {
							shippinginfo = '￥' + res.data.result;
						} else if (res.data.result == 0) {
							shippinginfo = '包邮';
						} else {
							shippinginfo = res.data.msg;
						}
						if (consigneeAddress.district > 0) {
							that.shippingCost = res.data.result
						}
						that.shipping = shippinginfo;
					},
				});
			},
			enterAddress: function() {
				//检查用户是否登录方可操作立即购买
				if (!app.auth.isAuth()) {
					app.showLoading(null, 1500);
					app.getUserInfo();
					return;
				}
				this.enterAddressPage = true;
				uni.navigateTo({
					url: '/pages/user/address_list/address_list?operate=selectAddress'
				});
			},
			/** 初始化数据，注意顺序 */
			initData: function(data) {
				//初始化评论
				this.initComment(data);
				//初始化店铺
				this.initStore(data);
				//检查一下购物的数量，可能无库存
				this.checkCartNum(this.goodsInputNum);
			},
			/** 检查商品 */
			initCheckGoods: function(data) {
				var that = this;
				var item_id = data.spec_goods_price.length > 0 ? data.spec_goods_price[0]['item_id'] : '';
				if (that.optionItemId) {
					item_id = that.optionItemId;
				}
				request.get('/api/goods/activity', {
					data: {
						goods_id: data.goods.goods_id,
						item_id: item_id,
					},
					isShowLoading: false,
					success: function(res) {
						//初始化规格
						if (res.data.result.goods.activity_is_on == 1) {
							data.activity = res.data.result.goods
							that.initSpecsPrice(data);
						} else {
							data.goods.prom_type = 0;
							that.initSpecsPrice(data);
						}
					}
				});
			},
			/** 初始化店铺 */
			initStore: function(data) {
				var s = data.store;
				s.avgScore = (s.store_desccredit / 3 + s.store_servicecredit / 3 + s.store_deliverycredit / 3).toFixed(2);
				s.descScoreDesc = common.getStoreScoreDecs(s.store_desccredit);
				s.serviceScoreDesc = common.getStoreScoreDecs(s.store_servicecredit);
				s.deliveryScoreDesc = common.getStoreScoreDecs(s.store_deliverycredit);
				this.data.store = s;
				this.data = Object.assign({}, this.data);
			},
			/** 初始化评论相关 */
			initComment: function(data) {
				//好评率
				data.goods.goodCommentRate = data.statistics.high_rate;
				//评论日期格式化
				for (var i = 0; i < data.comment.length; i++) {
					data.comment[i].addTimeFormat = util.formatTime(data.comment[i].add_time, false);
					//设置5颗星s
					var on = 'on';
					var half = 'half';
					var off = 'off';
					var goods_rank_new = [];
					for (var ii = 1; ii <= 5; ii++) {
						if (data.comment[i].goods_rank >= ii) {
							goods_rank_new.push(on);
						} else {
							if (ii - 1 < data.comment[i].goods_rank && data.comment[i].goods_rank < ii) {
								goods_rank_new.push(half);
							} else {
								goods_rank_new.push(off);
							}
						}
					}
					data.comment[i].goods_rank_new = goods_rank_new;
					//设置5颗星
					data.comment[i].goods_rank = parseInt(data.comment[i].goods_rank);
				}
				//评论数
				this.categories3[0].num = data.statistics.total_sum;
				this.categories3[1].num = data.statistics.high_sum;
				this.categories3[2].num = data.statistics.center_sum;
				this.categories3[3].num = data.statistics.low_sum;
				this.categories3[4].num = data.statistics.img_sum;
				//渲染视图
				this.categories3 = [...this.categories3];
				this.data = Object.assign({}, data);
			},
			/** 初始化所有规格 */
			initSpecsPrice: function(data) {
				var specSelect = 0; //初始化选中第一个规格
				var specs = data.spec_goods_price;
				if (specs.length == 0) { //没有规格
					this.initActivity(data.activity);
					return;
				}
				//第一次请求的总数据中的activity默认是第一种规格的,可减少一次请求
				specs[0].activity = data.activity;
				if (this.optionItemId) { //指定规格
					for (var i = 0; i < specs.length; i++) {
						if (specs[i].item_id == this.optionItemId) {
							specSelect = i;
							break;
						}
					}
				} else { //初始化选库存不为0的规格
					for (var i = 0; i < specs.length; i++) {
						if (specs[i].store_count <= 0) {
							continue;
						}
						specSelect = i;
						break;
					}
				}
				//生成子规格组(goods_spec_list)的各自选中项
				var specIds = specs[specSelect].key.split("_");
				var list = data.goods_spec_list;
				for (var i = 0; i < list.length; i++) {
					for (var j = 0; j < list[i].spec_list.length; j++) {
						if (util.inArray(list[i].spec_list[j].item_id, specIds)) {
							list[i].selectItemId = list[i].spec_list[j].item_id;
							break;
						}
					}
				}
				this.specSelect = specSelect;
				this.data.data.goods_spec_list = list;
				this.data.spec_goods_price = specs;
				this.data = Object.assign({}, this.data);
				this.initSelectSpecGoods();
			},
			/** 初始化选中的规格商品 */
			initSelectSpecGoods: function() {
				var specSelect = this.specSelect;
				var specs = this.data.spec_goods_price;
				var itemId = specs[specSelect].item_id;
				if (specs[specSelect].prom_type == 0) {
					var noActivity = {
						prom_type: 0
					};
					specs[specSelect].activity = noActivity;
					this.initActivity(noActivity);
				} else if (typeof specs[specSelect].activity != 'undefined') {
					this.initActivity(specs[specSelect].activity);
				} else {
					// this.requestSpecInfo(specSelect);
				}
			},
			/** 请求规格商品的活动信息 */
			requestSpecInfo: function(specSelect) {
				var that = this;
				var specs = this.data.spec_goods_price;
				request.get('/api/goods/activity', {
					data: {
						goods_id: this.data.goods.goods_id,
						item_id: specs[specSelect].item_id
					},
					isShowLoading: false,
					success: function(res) {
						specs[specSelect].activity = res.data.result.goods;
						that.initActivity(res.data.result.goods);
					}
				});
			},
			/** 初始化显示的活动信息 */
			initActivity: function(activity) {
				if (activity.prom_type && activity.prom_type != 6) {
					var startTime = (new Date()).getTime();
					if (activity.prom_type == 1) { //抢购
						activity.priceName = '抢购价';
						activity.countName = '限时抢购';
					} else if (activity.prom_type == 2) { //团购
						activity.priceName = '团购价';
						activity.countName = '限时团购';
					} else if (activity.prom_type == 3) { //促销
						activity.countName = '优惠促销';
					} else if (activity.prom_type == 4) { //预售
						activity.priceName = '预售价';
						activity.countName = '预售';
					}
					this.data.goods.shop_price = activity.shop_price;
					this.data = Object.assign({}, this.data);
					activity.countTime = '--天--时--分--秒';
				} else if (activity.prom_type == 6) {
					activity.countName = '该商品正在参与拼团';
					activity.goods_id = activity.goods_id;
					activity.team_id = activity.prom_id ? activity.prom_id : 0;
					activity.item_id = activity.item_id ? activity.item_id : 0;
				}
				this.select.activity = activity;
				this.select = Object.assign({}, this.select);
				this.destroyActivityTimer();
				this.createActivityTimer();
				this.initSelectedData();
			},
			/** 初始化选中的（规格）商品的显示参数 */
			initSelectedData: function() {
				var goods = this.data.goods;
				var activity = this.select.activity;
				var specs = this.data.spec_goods_price;
				var specSelect = this.specSelect;
				var stock = 0;
				var price = 0;
				var item_id = 0;
				var active_item_id = 0;
				var specImg = "/api/goods/goodsThumImages?goods_id=" + this.data.goods.goods_id + "&width=200&height=200";
				if (activity.prom_type == 1 || activity.prom_type == 2) {
					price = activity.shop_price;
					//处理参与活动的数量为0的库存错误展示
					item_id = typeof(activity.item_id) != 'undefined' ? specs[specSelect].item_id : 0;
					active_item_id = typeof(activity.item_id) != 'undefined' ? activity.item_id : 0;
					if (item_id == active_item_id) {
						stock = activity.store_count;
					} else if (specs.length == 0) {
						stock = activity.store_count;
					} else {
						stock = specs[specSelect].store_count;
					}
				} else if (activity.prom_type == 3) {
					price = activity.prom_price;
					stock = specs.length > 0 ? specs[specSelect].store_count : goods.store_count;
				} else if (specs.length > 0) {
					price = specs[specSelect].price;
					stock = specs[specSelect].store_count;
				} else {
					price = goods.shop_price;
					stock = goods.store_count;
				}
				if (specs.length > 0) {
					specImg = specs[specSelect].spec_img;
					if (!specImg) {
						specImg = "/api/goods/goodsThumImages?goods_id=" + this.data.goods.goods_id + "&width=200&height=200";
					}
				}
				if (specImg.indexOf('http') < 0 && specImg.indexOf('https') < 0) {
					specImg = this.url + specImg;
				}
				if (goods.exchange_integral > 0) {
					price = price - goods.exchange_integral / parseInt(goods.point_rate);
					price = price.toFixed(2);
				}
				if (this.select.activity.prom_type && this.select.activity.prom_type != 6) {
					this.select.stock = stock;
					this.select.spec_img = specImg;
					this.select.specName = specs.length > 0 ? specs[specSelect].key_name : '';
					this.select = Object.assign({}, this.select);
					return false;
				} else {
					this.select.price = price.split('.');
					this.select.stock = stock;
					this.select.spec_img = specImg;
					this.select.specName = specs.length > 0 ? specs[specSelect].key_name : '';
					this.select = Object.assign({}, this.select);
				}
			},
			/** 创建活动倒计时定时器 */
			createActivityTimer: function() {
				var activity = this.select.activity;
				if (!activity.prom_type) {
					return;
				}
				var that = this;
				this.timer = setInterval(function() {
					var remainTime = activity.end_time * 1000 - (new Date()).getTime();
					remainTime = util.remainTime(remainTime);
					this.select.activity.countTime = remainTime;
					that.select = Object.assign({}, that.select);
				}, 1000);
			},
			/** 销毁活动倒计时定时器 */
			destroyActivityTimer: function() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
			},
			/** 商品首页 */
			tabClick: function(e) {
				var typeId = e.currentTarget.id;
				this.activeCategoryId = typeId;
				if (typeId == 1) {
					this.tabGoodsContent();
					this.loading = true;
					this.goods_norms = 1;
				} else if (typeId == 2) {
					this.tabComment();
				}
			},
			/** 商品详情页 */
			tabClick2: function(e) {
				this.activeCategoryId2 = e.currentTarget.id
			},
			/** 评论页 */
			tabClick3: function(e) {
				if (e.currentTarget.id == this.activeCategoryId3) {
					return;
				}
				this.activeCategoryId3 = e.currentTarget.id
				this.requestComments(this.data.goods.goods_id, e.currentTarget.id);
			},
			/** 请求评论数据 */
			requestComments: function(goodsId, commentType) {
				var that = this;
				commentType++;
				var requestUrl = that.url + '/api/goods/getGoodsComment?goods_id=' + goodsId + '&type=' + commentType;
				request.get(requestUrl, {
					isShowLoading: false,
					success: function(res) {
						var comments = res.data.result;
						for (var i = 0; i < comments.length; i++) {
							comments[i].addTimeFormat = util.formatTime(comments[i].add_time);
							comments[i].goods_rank = parseInt(comments[i].goods_rank);
						}
						that.comments = [...comments];
					}
				});
			},
			/** 返回顶部 */
			doScrollTop: function() {
				uni.pageScrollTo({
					scrollTop: 0
				});
			},
			/** 打开评论页 */
			tabComment: function() {
				this.activeCategoryId = 2;
				if (!this.comments) {
					this.requestComments(this.data.goods.goods_id, this.activeCategoryId3);
				}
			},
			/** 打开商品内容页 */
			tabGoodsContent: function() {
				this.activeCategoryId = 1;
			},
			/** 请求商品详情页嵌入的html内容 */
			requestGoodsContent: function() {
				var that = this;
				request.get('/api/goods/goodsContent', {
					data: {
						id: this.data.goods.goods_id
					},
					isShowLoading: false,
					success: function(res) {
						//网页中的图片加上域名
						common.wxParseAddFullImageUrl(that, 'goods_content');
						that.goods_content = res.data.result.goods_content;
						that.goodsAttrs = [...res.data.result.goods_attr_list];
					},
				});
			},
			/** 获取可领券的优惠券 */
			requestCardList: function() {
				var that = this;
				request.get('/api/activity/coupon_center', {
					data: {
						cat_id: that.result.goods.cat_id3,
						goods_id: that.result.goods.goods_id,
					},
					isShowLoading: false,
					success: function(res) {
						for (let i in res.data.result) {
							res.data.result[i].condition = parseInt(res.data.result[i].condition);
							res.data.result[i].money = parseInt(res.data.result[i].money);
						}
						that.cardList = [...res.data.result] || [];
					}
				});
			},
			/** 领取卡券 */
			getCardList: function() {
				uni.navigateTo({
					url: '../../activity/coupon_list/coupon_list?type=goodsinfo',
				})
			},
			/** 点击规格按钮的回调函数 */
			selectSpec: function(e) {
				//对商品数量进行判断，对库存进行判断
				var itemId = e.currentTarget.dataset.itemid;
				var listIdx = e.currentTarget.dataset.listidx;
				var list = this.data.goods_spec_list;
				if (list[listIdx].selectItemId == itemId) {
					return;
				}
				list[listIdx].selectItemId = itemId;
				var newSpecKeys = [];
				for (var i = 0; i < list.length; i++) {
					newSpecKeys[i] = list[i].selectItemId;
				}
				//item排序,生成key
				var newSpecKeys = util.sortSize(newSpecKeys).join('_');
				var newSpecSelect = 0;
				var specs = this.data.spec_goods_price;
				for (var i = 0; i < specs.length; i++) {
					if (specs[i].key == newSpecKeys) {
						newSpecSelect = i;
						break;
					}
				}
				this.specSelect = newSpecSelect
				this.data.goods_spec_list = list;
				this.data = Object.assign({}, this.data);
				this.initSelectSpecGoods();
				this.checkCartNum(this.goodsInputNum);
			},
			/** 加入购物车 */
			addCart: function(e) {
				var that = this;
				var itemId = 0;
				var specs = this.data.spec_goods_price;
				//区分有规格和无规格
				if (specs.length > 0) {
					if (specs[this.specSelect].store_count <= 0) {
						return app.showWarning("库存已为空！");
					}
					itemId = specs[this.specSelect].item_id;
				} else {
					if (this.data.goods.store_count <= 0) {
						return app.showWarning("库存已为空！");
					}
				}
				if (this.goodsInputNum <= 0) {
					return app.showWarning("商品数量不能为0");
				}
				var data = {
					goods_id: this.data.goods.goods_id,
					goods_num: this.goodsInputNum,
					item_id: itemId,
					form: 1
				};
				if (this.data.goods.is_virtual) {
					return this.buyVirtualGoods(data);
				}
				//检查用户是否登录方可操作立即购买
				if (!app.auth.isAuth()) {
					app.showLoading(null, 1500);
					app.getUserInfo();
					return;
				}
				if (e.currentTarget.dataset.action == 'add') { //加入购物车
					if (this.shippingCost < 0 || this.select.stock <= 0) {
						return;
					}
					request.post('/api/cart/addCart', {
						data: data,
						success: function(res) {
							uni.showModal({
								title: '添加成功！',
								cancelText: '去购物车',
								confirmText: '再逛逛',
								success: function(res) {
									if (res.cancel) {
										uni.reLaunch({
											url: '/pages/cart/cart/cart'
										});
									} else {
										that.requestCardNum();
									}
								}
							});
						}
					});
				} else if (e.currentTarget.dataset.action == 'exchange') { //立即兑换
					this.exchange(data);
				} else { //立即购买
					this.buyNow(data);
				}
			},
			goCard: function() {
				uni.switchTab({
					url: '/pages/cart/cart/cart'
				});
			},
			/** 购买虚拟商品 */
			buyVirtualGoods: function(data) {
				//检查用户是否登录方可操作立即购买
				if (!app.auth.isAuth()) {
					app.showLoading(null, 1500);
					app.getUserInfo();
					return;
				}
				Object.assign(data, {
					goods_name: this.data.goods.goods_name,
					spec_name: this.select.specName,
					price: this.select.price,
				});
				uni.navigateTo({
					url: '/pages/virtual/buy_step/buy_step?' + util.Obj2Str(data)
				});
			},
			/** 立即兑换 */
			exchange: function(data) {
				//检查用户是否登录方可操作立即购买
				if (!app.auth.isAuth()) {
					app.showLoading(null, 1500);
					app.getUserInfo();
					return;
				}
				if (this.shippingCost < 0 || this.select.stock <= 0) {
					return;
				}
				uni.navigateTo({
					url: '/pages/cart/integral/integral?' + util.Obj2Str(data)
				});
			},
			/** 立即购买 */
			buyNow: function(data) {
				//检查用户是否登录方可操作立即购买
				if (!app.auth.isAuth()) {
					app.showLoading(null, 1500);
					app.getUserInfo();
					return;
				}
				Object.assign(data, {
					action: 'buy_now',
				});
				uni.navigateTo({
					url: '/pages/cart/cart2/cart2?' + util.Obj2Str(data)
				});
			},
			/** 增加购买的商品数量 */
			addCartNum: function(e) {
				this.checkCartNum(this.goodsInputNum + 1);
			},
			/** 减少购买的商品数量 */
			subCartNum: function(e) {
				this.checkCartNum(this.goodsInputNum - 1);
			},
			/** 输入购买的数量 */
			inputCartNum: function(e) {
				this.checkCartNum(Number(e.detail.value));
			},
			/** 检查购买的数量 */
			checkCartNum: function(num) {
				var stock = this.data.goods.store_count;
				if (this.data.spec_goods_price.length > 0) {
					stock = this.data.spec_goods_price[this.specSelect].store_count;
				}
				if (num > stock || stock == 0) {
					num = stock;
				} else if (num < 1) {
					num = 1;
				}
				this.goodsInputNum = num;
			},
			/** 关闭规格弹窗 */
			closeSpecModal: function(e) {
				var query = uni.createSelectorQuery();
				//选择class
				var that = this;
				var height = 0;
				query.select('.spec-model').boundingClientRect(function(rect) {
					height = rect.height
					var animation = uni.createAnimation({
						duration: 200,
						timingFunction: 'ease'
					});
					animation.translate(0, height).step();
					that.ani = animation.export();
					setTimeout(function() {
						that.openSpecModal = false;
					}, 200)
				}).exec();
			},
			/** 打开规格弹窗 */
			openSpecModel: function(e) {
				this.setSize();
				var type = e.currentTarget.dataset.type;
				this.carOrBuy = type;
				this.show = true;
			},
			collectGoods: function() {
				var that = this;
				if (!uni.getStorageSync('wx_user_info')) {
					app.getUserInfo(function(userInfo) {
						that.userInfo = Object.assign({}, userInfo);
						that.click = false;
					}, true, false);
					return false;
				}
				request.post('/api/goods/collectGoodsOrNo', {
					data: {
						goods_id: that.data.goods.goods_id
					},
					isShowLoading: false,
					success: function(res) {
						var status = that.data.goods.is_collect;
						var sum = that.data.goods.collect_sum + (status ? -1 : 1);
						that.data.goods.is_collect = !that.data.goods.is_collect;
						that.data.goods.collect_sum = sum;
						that.data = Object.assign({}, that.data);
					}
				});
			},
			collectStore: function() {
				var that = this;
				if (!uni.getStorageSync('wx_user_info')) {
					app.getUserInfo(function(userInfo) {
						that.userInfo = Object.assign({}, userInfo);
						that.click = false;
					}, true, false);
					return false;
				}
				request.post('/api/store/collectStoreOrNo', {
					data: {
						store_id: that.data.goods.store_id
					},
					success: function(res) {
						console.log(res)
						if (res.data.status == 1) {
							if (res.data.msg == '关注成功') {
								uni.showToast({
									title: '收藏成功',
								})
							} else {
								uni.showToast({
									title: '已取消收藏',
									icon: 'none'
								})
							}
						}
					}
				});
			},
			toStore: function(e) {
				var store_id = this.data.store.store_id
				var user_store_id = this.userInfo.store_id || 0
				if (store_id == user_store_id) {
					uni.navigateTo({
						url: '/pages/distribut0/shop/shop',
					})
					return
				}
				uni.navigateTo({
					url: e.currentTarget.dataset.url,
				})
			},
			/** 联系客服 */
			onTelClose: function() {
				this.telShow = false
			},
			callOtherTel: function() {
				uni.makePhoneCall({
					phoneNumber: this.result.store.store_phone,
				})
			},
			contactService: function() {
				app.confirmBox('请联系客服：' + this.data.store.store_phone);
			},
			contactTel: function() { //展示商家电话号码
				if (this.result.store.store_phone != 0) {
					if (uni.getStorageSync('telsystem').indexOf('iOS') != -1) { //是苹果手机时候 ios
						uni.makePhoneCall({
							phoneNumber: this.result.store.store_phone,
						})
						return
					} else { // 不是ios系统手机
						this.telShow = true;
					}
				} else {
					uni.showToast({
						title: '店家很神秘，未留下客服MM的联系方式',
						icon: 'none'
					})
				}
			},
			/** 请求购物车数量 */
			requestCardNum: function() {
				var that = this;
				request.get('/api/cart/cartList', {
					isShowLoading: false,
					success: function(res) {
						var cartGoodsNum = 0;
						var list = res.data.result.storeList;
						if (!list) {
							return;
						}
						for (var i = 0; i < list.length; i++) {
							for (var j = 0; j < list[i].cartList.length; j++) {
								cartGoodsNum += list[i].cartList[j].goods_num;
							}
						}
						that.cartGoodsNum = cartGoodsNum;
					}
				});
			},
			/** 预览图片 */
			previewCommentImgs: function(e) {
				var imgs = this.comments[e.currentTarget.dataset.cidx].img;
				uni.previewImage({
					current: imgs[e.currentTarget.dataset.id],
					urls: imgs
				});
			},
			/** 预览图片 */
			previewGoodsCommentImgs: function(e) {
				var that = this;
				var imgs = this.data.comment[e.currentTarget.dataset.cidx].img;
				imgs = imgs.map(function(val) {
					return that.url + val;
				});
				uni.previewImage({
					current: imgs[e.currentTarget.dataset.id],
					urls: imgs
				});
			},
			/** 关闭优惠信息弹窗 */
			closePromModal: function() {
				this.openPromModal = false
			},
			/** 打开优惠信息弹窗 */
			openPromModal: function() {
				this.openPromModal = true;
			},
			shareTogetherClose: function() {
				this.shareTogether = false;
			},
			shareTogether: function() {
				var that = this
				var store_id = this.userInfo.store_id || 0
				var is_B = this.userInfo.is_B || 0
				if (!this.userInfo) { //未登录
					uni.showModal({
						content: '您还没有登录，无法使用分享功能哦~',
						confirmText: '前往登录',
						success(res) {
							if (res.confirm) {
								uni.switchTab({
									url: '/pages/user0/index/index',
								})
							} else if (res.cancel) {
								console.log('用户点击取消')
							}
						}
					})
				} else { //已登录
					if (store_id == 0) {
						that.actionSheetHidden = true;
						uni.showModal({
							message: '您还没有店铺，无法使用分享功能。是否前往免费开店？',
							confirmButtonText: '免费开店',
							cancelButtonText: '再看看',
							success: res => {
								if (res.confirm) {
									uni.navigateTo({
										url: '/pages/newjoin/join4/join4',
									})
								}
							}
						})
					} else if (is_B == 1) {
						uni.showModal({
							title: '提示',
							content: '本次分享，对方将知晓壹童网信息，是否继续',
							messageAlign: "left",
							cancelText: '返回',
							confirmText: '继续',
							success(res) {
								if (res.confirm) {
									that.shareTogether = true;
								} else if (res.cancel) {
									console.log('啥也不用干1')
								}
							}
						})
					}
				}
			},
			/** 商品分享海报s */
			catchShare: function() {
				if (!uni.getStorageSync('wx_user_info')) {
					app.getUserInfo(function(userInfo) {
						that.userInfo = Object.assign({}, userInfo);
						that.click = false;
					}, true, false);
					return false;
				}
				this.actionSheetHidden = false;
			},
			listenerActionSheet: function(e) {
				this.actionSheetHidden = !this.actionSheetHidden;
			},
			//关闭二维码弹窗
			closeQcode: function() {
				this.hasQcode = false;
			},
			/**
			 * 获取商品分享海报
			 */
			getSharePic: function(e) {
				if (!uni.getStorageSync('app:userInfo').token) {
					uni.reLaunch({
						url: '/pages/user0/index/index',
					})
				}
				var that = this
				var type = e.currentTarget.dataset.type
				var store_id = uni.getStorageSync('app:userInfo').store_id
				var is_B = this.userInfo.is_B || 0
				if (store_id == 0 && is_B == 0) { // 普通人 看看得了
					this.actionSheetHidden = true;
					uni.showModal({
						message: '您还没有店铺，无法使用分享功能。是否前往免费开店？',
						confirmButtonText: '免费开店',
						cancelButtonText: '再看看',
						success: res => {
							uni.navigateTo({
								url: '/pages/newjoin/join4/join4',
							})
						}
					})
					return
				}
				if (store_id > 0 && is_B == 0) { // 大A 海报
					type = 0
					this.haibao(type)
				}
				if (store_id > 0 && is_B == 1) { // 大B 海报
					that.shareTxt = '  为保护您的商业机密，请保存海报后， 通过微信发送给下级'
					type = 3
					request.get(that.url + '/api/Goods/isGoodsSharePoster', {
						data: {
							goods_id: that.goodId
						},
						success: function(res) {
							if (res.data.status == 1) {
								uni.showModal({
									title: '提示',
									content: '请确认分享的是下级采购商吗？',
									success(res) {
										if (res.confirm) {
											that.haibao(type)
										} else if (res.cancel) {
											console.log('用户点击取消')
										}
									}
								})
							}
						}
					})
				}
			},
			haibao: function(type) {
				const that = this
				that.actionSheetHidden = !this.actionSheetHidden;
				uni.showLoading({
					title: '正在生成',
					mask: true,
				})
				var item_id = (that.data.spec_goods_price.length) > 0 ? that.data.spec_goods_price[that.specSelect].item_id : 0
				uni.getImageInfo({
					src: that.url + '/api/goods/goodsSharePoster?id=' + that.data.goods.goods_id +
						'&item_id=' + item_id +
						'&prom_id=' + that.data.goods.prom_id +
						'&store_id=' + that.data.goods.store_id +
						'&prom_type=' + that.data.goods.prom_type +
						'&token=' + that.userInfo.token +
						'&type=' + type + '&leader_id=' + uni.getStorageSync('app:userInfo')['user_id'],
					isShowLoading: false,
					success: function(res) {
						that.share_btn = true;
						that.share_pic = res.path;
					},
					complete: function(res) {
						uni.hideLoading()
						if (res.errMsg.indexOf('fail') != -1) {
							uni.showModal({
								message: '您的店铺暂无出售中的商品,或当前商品您还没有加入分销，无法分享，您可点击加入分销，分销商品,或发布新商品',
								confirmButtonText: '好的',
								showCancelButton: false,
							})
						}
					}
				})
			},
			closeShareModal: function() {
				this.share_btn = false;
			},
			saveSharePic: function() {
				var that = this
				uni.authorize({
					scope: 'scope.writePhotosAlbum',
					success: function(res) {
						uni.saveImageToPhotosAlbum({
							filePath: that.share_pic,
							success: function(res) {
								that.share_btn = false;
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
			previewSharePic: function() {
				uni.previewImage({
					urls: [this.share_pic],
				})
			},
			/** 商品分享海报e */
			/** 领取卡券 */
			getCardList: function() {
				uni.navigateTo({
					url: '../../activity/coupon_list/coupon_list?type=goodsinfo',
				})
			},
			onClose: function() {
				this.show = false;
			},
			onGetUserInfo: function(e) {
				console.log(e.detail);
			},
			// 初始化购买弹框数据 根据款式数量 设定弹框横向滑动的总宽 以及每项的宽  和分几行显示
			setSize: function() {
				var length = this.result.goods_spec_list[0].spec_list.length
				// 根据款项的数量设置横向画框的尺寸
				if (length < 4) {
					// 3件以内的情况
					this.scrollBoxWidth = 730;	//一个整的宽度
					this.scrollBoxHeight = 330; //一个item的高度
					this.sItemWidth = 228;	//每个1/3的宽度
					this.ulWidth = '200rpx';
				} else if (length < 7) {
					this.scrollBoxWidth = 730;	//4个小的规格的宽度
					this.scrollBoxHeight = 660;	//两个item的高度
					this.sItemWidth = 235;	//每个1/3的宽度
					this.ulWidth = '200rpx';
				} else {
					if (length % 2 == 0) {
						this.scrollBoxWidth = length / 2 * 235; //4个小的规格的宽度
						this.scrollBoxHeight = 660;	//两个item的高度
						this.sItemWidth = 235;	//每个1/3的宽度
						this.ulWidth = 750 / (length / 2 * 235) * 200 + 'rpx';
					} else {
						this.scrollBoxWidth = (length + 1) / 2 * 235; //4个小的规格的宽度
						this.scrollBoxHeight = 660;	//两个item的高度
						this.sItemWidth = 235; 	//每个1/3的宽度
						this.ulWidth = 750 / ((length + 1) / 2 * 235) * 200 + 'rpx';
					}
				}
			},
			// 选择不同规格产品
			clickImg: function(e) {
				const index = e.currentTarget.dataset.index
				if (this.result.spec_goods_price[index].store_count == 0) {
					return uni.showToast({
						title: '当前规格没有库存，请选择其他规格查看',
						icon: 'none'
					})
				}
				if (index == this.curImg) {
					this.curImg = 'lkdh';
					this.selictGoods = Object.assign({},{
						introduce: '',
						goods_id: this.result.goods.goods_id,
						goods_num: this.selictGoods.goods_num > Math.floor(this.result.spec_goods_price[0].store_count) ? 
							Math.floor(this.result.spec_goods_price[0].store_count) : this.selictGoods.goods_num,
						item_id: '',
						form: 1,
						price: this.result.goods.each_hand_single_price,
						allprice: this.result.goods.each_hand_all_price,
						store_count: this.result.spec_goods_price[0].store_count
					});
					this.totalPrice = this.result.goods.each_hand_all_price;
					this.sheetMaxSum = Math.floor(this.result.spec_goods_price[0].store_count);
					this.v = 1;
					this.upsum = 1;
					return
				}
				var v = 1
				var sheetMaxNum = this.sheetMaxNum
				var goodsName = this.result.goods.goods_name
				var item_id = this.result.spec_goods_price[index].item_id
				var kuanshi = this.result.goods_spec_list[0].spec_list[index].item
				var kuanshiname = this.result.goods_spec_list[0].spec_name
				var goods_id = this.result.goods.goods_id
				var totalPrice = this.result.spec_goods_price[index].price * (this.selictGoods.goods_num >
					Math.floor(this.result.spec_goods_price[0].store_count) ? 
					Math.floor(this.result.spec_goods_price[0].store_count) : this.selictGoods.goods_num)
				var goods_num = this.selictGoods.goods_num > Math.floor(this.result.spec_goods_price[0].store_count) ? 
				Math.floor(this.result.spec_goods_price[0].store_count) : this.selictGoods.goods_num
				var price = this.result.spec_goods_price[index].each_hand_unit_price
				var sheetMaxSum = Math.floor(this.result.spec_goods_price[index].store_count)
				var introduce = goodsName + '  ' + kuanshiname + '-' + kuanshi
				this.setData({
					curImg: e.currentTarget.dataset.index,
					selictGoods: {
						introduce: introduce,
						goods_id: goods_id,
						goods_num: goods_num,
						item_id: item_id,
						form: 1,
						price: price,
						allprice: this.data.result.spec_goods_price[index].price,
						store_count: this.data.result.spec_goods_price[index].store_count
					},
					totalPrice: totalPrice,
					sheetMaxSum: sheetMaxSum,
					v: v
				})
			},
			// 手数变化
			changeShoushu: function(e) {
				var index = e.currentTarget.dataset.index
				var shoushu = this.data.result.goods_spec_list[1].spec_list[index].item
				const selictGoods = JSON.parse(JSON.stringify(this.data.selictGoods))
				var count = selictGoods.store_count

				var sheetMaxSum = Math.floor(this.data.selictGoods.store_count)
				this.setData({
					currentShoushu: shoushu,
					selictGoods: selictGoods,
					sheetMaxSum: sheetMaxSum,
				})
			},
			// 购买数量变化
			bunSumChange: function(e) {
				// console.log(e.detail)
				console.log(e.detail)
				var num = e.detail * this.data.currentShoushu
				if (num > this.data.selictGoods.store_count) {
					this.setData({
						v: Math.floor(this.data.selictGoods.store_count)
					})
				}
				const selictGoods = JSON.parse(JSON.stringify(this.data.selictGoods))
				selictGoods.goods_num = e.detail
				this.setData({
					selictGoods: selictGoods,
					upsum: num,
					totalPrice: selictGoods.allprice * e.detail,
				})
				if (e.detail > this.data.sheetMaxSum) {
					uni.showToast({
						title: '当前库存' + this.data.sheetMaxSum + '件' + '，您可联系商家增加库存',
						icon: 'none'
					})
				}
			},
			// 购买 或者添加购物车
			buyOrcar: function(e) {
				const that = this
				var type = this.data.carOrBuy
				// console.log(type)
				// return
				const selictGoods = JSON.parse(JSON.stringify(this.data.selictGoods))
				if (selictGoods.introduce == '') {
					return uni.showToast({
						title: '您还没有选择商品',
						icon: 'none'
					})
				}
				const data = {
					goods_id: selictGoods.goods_id,
					goods_num: selictGoods.goods_num,
					item_id: selictGoods.item_id,
					form: 1,
					store_id: this.data.data.goods.store_id
				}
				if (type == 'car') {
					if (!app.auth.isAuth()) {
						app.showLoading(null, 1500);
						app.getUserInfo();
						return;
					}

					console.log(data)
					request.post('/api/cart/addCart', {
						data: data,
						success: function(res) {
							uni.showModal({
								title: '添加成功！',
								cancelText: '去购物车',
								confirmText: '再逛逛',
								success: function(res) {
									if (res.cancel) {
										uni.reLaunch({
											url: '/pages/cart/cart/cart'
										});
									} else {
										that.setData({
											show: false
										})
										that.requestCardNum();
									}
								}
							});
						}
					});
				} else {
					this.buyNow(data);
				}
			},
			imageFangDa: function(e) {
				var index = e.currentTarget.dataset.index
				this.setData({
					currentSwiperIndex: index,
					isSwiperShow: false
				})
			},
			// 模拟图片预览
			previewImageChange: function(e) {
				var index = e.detail.current
				this.setData({
					previewImageIndex: index
				})
			},
			// 商品预览滚动
			scrollXfun: function(e) {
				var bili = this.data.proportionPx
				// console.log(e.detail.scrollLeft,'=====',e.detail.scrollWidth)
				// console.log(e.detail.scrollLeft / (e.detail.scrollWidth - (730*bili)))
				this.setData({
					pressLeft: e.detail.scrollLeft / e.detail.scrollWidth * 100 + '%'
				})
			},
			//  关闭模拟预览
			previewImageClose: function() {
				this.setData({
					isSwiperShow: true
				})
			},
			previewImageTap: function(e) {
				var index = this.data.previewImageIndex
				if (this.data.result.spec_goods_price[index].store_count == 0) {
					return uni.showToast({
						title: '当前规格没有库存，请选择其他规格查看',
						icon: 'none'
					})
				}
				const {
					goods_spec_list,
					spec_goods_price,
					goods
				} = this.data.result
				var v = 1
				var goodsName = goods.goods_name
				var kuanshi = goods_spec_list[0].spec_list[index].item
				var kuanshiname = goods_spec_list[0].spec_name
				var goods_id = goods.goods_id
				var item_id = spec_goods_price[index].item_id
				var introduce = goodsName + '  ' + kuanshiname + '-' + kuanshi
				var price = spec_goods_price[index].each_hand_unit_price
				var goods_num = this.data.selictGoods.goods_num > Math.floor(this.data.result.spec_goods_price[0]
						.store_count) ? Math.floor(this.data.result.spec_goods_price[0].store_count) : this.data
					.selictGoods.goods_num
				var totalPrice = this.data.result.spec_goods_price[index].price * (this.data.selictGoods.goods_num >
					Math.floor(this.data.result.spec_goods_price[0].store_count) ? Math.floor(this.data.result
						.spec_goods_price[0].store_count) : this.data.selictGoods.goods_num)
				var sheetMaxSum = Math.floor(this.data.result.spec_goods_price[index].store_count)
				this.setData({
					curImg: this.data.previewImageIndex,
					selictGoods: {
						introduce: introduce,
						goods_id: goods_id,
						goods_num: goods_num,
						item_id: item_id,
						form: 1,
						price: price,
						allprice: this.data.currentShoushu * price * v,
						store_count: this.data.result.spec_goods_price[index].store_count
					},
					sheetMaxSum: sheetMaxSum,
					v: v,
					isSwiperShow: true,
					totalPrice: totalPrice
				})

			},
			swiperOver: function(e) {
				this.setData({
					previewImageIndex: e.detail.current
				})
			},
			siseHelp: function() { //每手几件的弹出
				Dialog.alert({
					message: "每‘手’即该商品 ··所有尺码各一件·· \n例:某商品所含尺码为-S/M/L/XL/XXL。\n一手则含S至XXL在内所有五个尺码各一件",
				})
			},
			closeMask: function() { // 提示信息
				this.setData({
					tipsmask: true
				})
				if (uni.getStorageSync('maskSum2')) { //判断本地有无数量设置过
					var maskSum = uni.getStorageSync('maskSum2') - 1
					uni.setStorageSync('maskSum2', maskSum)
				} else {
					uni.setStorageSync('maskSum2', 5)
				}
			},
			showImg: function(e) {
				var imgs = this.data.data.gallery.map(function(item) {
					return item.image_url
				})
				uni.previewImage({
					urls: imgs,
					current: e.currentTarget.dataset.curimg
				})
			},
			copyTitle(e) {
				uni.setClipboardData({
					data: e.currentTarget.dataset.txt,
				})
			}
		}
	}
</script>

<style scoped src="./goodsInfo.css">

</style>

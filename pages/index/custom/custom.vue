<template>
	<view>
		<template name="custom">
			<block wx:if="{{search}}">
				<!-- 搜索栏 -->
				<view class='search_contain' wx:if="{{search.block_type == 8}}">
					<!-- 搜索栏1 -->
					<view class="search_st1 search-box {{scrollTop>10?'search-fixed':''}}"
						wx:if="{{search.search_style ==0}}" style="padding-top:15rpx;">
						<view>
							<view url='' class="tpd-logo">
								<image class="wh100 {{scrollTop>10?'bg-logo':''}}" src="{{wap_home_logo}}"></image>
							</view>
							<view class="search-input {{scrollTop>10?'bg-input':''}}"
								style="width:{{iflogin?'710rpx':'710rpx'}};background:#fff;border-radius:100rpx;">
								<image class="ico-search" src='../../../images/search.png'></image>
								<input type="text" style="width:{{iflogin?'464':'400'}}rpx;" placeholder="请输入您所搜索的商品"
									bindfocus="jumpSearch"></input>
							</view>
							<view url='' class="tpd-personal-warp">
								<view class="ico-head-personal">
									<image
										src='https://www.yitongwang.com/public/static/images/logo/seller_login_logo_defaults.png'>
									</image>
								</view>
							</view>
						</view>
					</view>

					<!-- 搜索栏2 -->
					<view class="search_st2 search-box {{scrollTop>10?'search-fixed':''}}"
						wx:if="{{search.search_style == 1}}">
						<view>
							<view class="search-input {{scrollTop>10?'bg-input':''}}">
								<image class="ico-search" src='../../../images/search.png'></image>
								<input type="text" placeholder="请输入您所搜索的商品" bindfocus="jumpSearch"></input>
							</view>
						</view>
					</view>
					<!-- 搜索栏3 -->
					<view class="search_st3 search-box {{scrollTop>10?'search-fixed':''}}"
						wx:if="{{search.search_style == 2}}">
						<view style="margin:15rpx 20rpx;background:#fff;">
							<view url='' class="tpd-logo">
								<image class="wh100 {{scrollTop>10?'bg-logo':''}}" src="{{url + wap_home_logo}}">
								</image>
							</view>
							<view class="search-input {{scrollTop>10?'bg-input':''}}"
								style="width:{{iflogin?'700':'660'}}rpx;background:#fff;">
								<image class="ico-search" src='../../../images/search.png'></image>
								<input type="text" style="width:{{iflogin?'464':'400'}}rpx;" placeholder="请输入您所搜索的商品"
									bindfocus="jumpSearch"></input>
							</view>
							<view url='' class="tpd-personal-warp">
								<!-- <text  hidden='{{iflogin}}' class="{{scrollTop>10?'bg-fonts':''}}" catchtap='tologin'>登录</text> -->
								<view class="ico-head-personal">
									<image
										src='https://www.yitongwang.com/public/static/images/logo/seller_login_logo_defaults.png'>
									</image>
								</view>
							</view>
						</view>
					</view>
					<!-- 搜索栏4 -->
					<view class="search_st4 search-box {{scrollTop>10?'search-fixed':''}}"
						wx:if="{{search.search_style == 3}}">
						<view>
							<view class="search-input">
								<input type="text" placeholder="请输入您所搜索的商品" bindfocus="jumpSearch"></input>
								<image class="ico-search" src='../../../images/search.png'></image>
							</view>
						</view>
						<navigator url='../../location/location?crt={{search.currentCity}}'>
							<text>{{search.currentCity}}</text>
							<image src='../../../images/ico-pt4.png'></image>
						</navigator>
					</view>

				</view>
			</block>


			<block wx:for="{{block_model}}" wx:for-index="indesx">

				<!-- 海报 -->
				<view class='posters' wx:if="{{item.block_type == 0}}"
					style="margin-bottom: {{item.spacing*2}}rpx;width:{{item.width}}rpx;height:{{item.height}}rpx"
					catchtap='topage' data-type="{{item['url_type']}}" data-id="{{item['app_url']}}"
					data-url="{{item['url']}}">
					<image class="posters_img" wx:if="{{item.height_style == 0}}" src="{{url + item.pic}}"
						mode='scaleToFill'></image>
					<image class="posters_img" wx:if="{{item.height_style == 1}}" src="{{url + item.pic}}"
						mode='scaleToFill'></image>
				</view>

				<!-- 轮播广告 -->
				<view class='banners' wx:if="{{item.block_type == 1}}" style="margin-bottom: {{item.spacing*2}}rpx;">
					<view class="finde_man"></view>
					<swiper indicator-dots="true" autoplay="true" interval="3000" duration="1000">
						<block wx:for="{{item.nav}}" wx:key="index">
							<swiper-item catchtap='topage' data-type="{{item.url_type}}" data-id="{{item.app_url}}"
								data-url="{{item.url}}">
								<image src="{{url + item.pic}}" class="sviewde-image"></image>
							</swiper-item>
						</block>
					</swiper>
				</view>
				<!-- 快捷入口 -->
				<view wx:if="{{item.block_type == 2}}">
					<!-- 5入口 -->
					<view class="section {{item.shape_type ==1 ?'imgstyle':''}}"
						style="margin-bottom: {{item.spacing*2}}rpx;height:auto;">
						<view
							class="{{item.nav.length == 3 ? 'flex-wrp3' :item.nav.length == 4?'flex-wrp4':'flex-wrp5'}} tpdm-navstyle-circle"
							style="flex-direction:row;">
							<block wx:for="{{item.nav}}" wx:for-item="items" wx:for-index="idx">
								<view class="flex-item" catchtap='topage' data-url="{{items['url']}}"
									data-type="{{items['url_type']}}" data-id="{{items['app_url']}}">
									<image src='{{url + items.pic}}'></image>
									<text>{{items.title_name}}</text>
								</view>
							</block>
						</view>
					</view>
				</view>
				<!-- 商品列表 -->
				<view class="container_list " wx:if="{{item.block_type == 3}}"
					style="margin-bottom: {{item.spacing*2}}rpx;">
					<view class="tpdm-gdstyle">
						<view class="tpdm-goods-nav" hidden="{{item.name_show == 1 ? false:true}}">
							<block wx:for="{{item.nav}}" wx:for-item="items" wx:for-index="idx">
								<text
									class="goods-nav-list   {{idx == (item.title_selected?item.title_selected:0)?'choosetab':''}}"
									data-fid="{{indesx}}" data-index="{{idx}}" style="width:{{100/item.nav.length}}%;"
									catchtap='changeGoodsShow'>{{items.tab_title}}</text>
							</block>
						</view>
						<!-- 橱窗式 -->
						<view class="tpdm-goods-list tpdm-goods-list1" wx:if="{{item.show_type == 0}}">
							<view class="tpdm-goods-wrap clearfix">
								<block wx:if="{{item.list.length == 0}}">
									<view class="not-data-text">暂无上传商品哦~~</view>
								</block>
								<block wx:for="{{item.list}}" wx:key="idxgl" wx:for-item="itemsgl" wx:for-index="idxgl">

									<navigator class='tpdm-goods-lis'
										url="../../goods/goodsInfo/goodsInfo?goods_id={{itemsgl.goods_id}}">
										<view class="tpdm-goods-pic" href="javascript:;">
											<view class='h-label' wx:if="{{itemsgl.label_name}}"
												style='background: url(/images/h-label.png) no-repeat;background-size:175rpx 40rpx;'>
												{{itemsgl.label_name}}</view>
											<image src="{{ itemsgl.original_img}}"></image>
										</view>

										<view class="tpdm-goods-name">{{itemsgl.goods_name}}</view>
										<text class='lb-name'
											wx:if="{{itemsgl.label_name}}">{{itemsgl.label_name}}</text>
										<view class="tpdm-goods-des">
											<view class="tpdm-goods-price">
												<view class='tg-sm'>￥</view>
												{{itemsgl.activity.prom_price>0?itemsgl.activity.prom_price:itemsgl.shop_price}}
											</view>
											<view class="tpdm-goods-like">
												已售{{(itemsgl.sales_sum*1) + itemsgl.virtual_sales_sum }}件</view>
										</view>

									</navigator>
								</block>
							</view>
						</view>
						<!-- 列表式 -->
						<view class="tpdm-goods-list tpdm-goods-list2" wx:if="{{item.show_type == 1}}">
							<block wx:if="{{item.list.length == 0}}">
								<view class="not-data-text">暂无上传商品哦~~</view>
							</block>
							<view class="tpdm-goods-wrap clearfix" wx:for="{{item.list}}" wx:for-item="items"
								wx:for-index="idx">
								<navigator class='tpdm-goods-lis'
									url="../../goods/goodsInfo/goodsInfo?goods_id={{items.goods_id}}">
									<view class="tpdm-goods-pic">
										<view class='h-label' wx:if="{{items.label_name}}"
											style='background: url(/images/h-label.png) no-repeat;background-size:175rpx 40rpx;'>
											{{items.label_name}}</view>
										<image src="{{items.original_img}}"></image>
										<text hidden="{{!items.activity.prom_title}}"
											class="Seconds_kill">{{items.activity.prom_title}}</text>
									</view>
									<view class="tpdm-goods-name">{{items.goods_name}}</view>
									<text class='lb-name lst-lb'
										wx:if="{{items.label_name}}">{{items.label_name}}</text>
									<view class="tpdm-goods-des">
										<view class="tpdm-goods-price">
											<view class='tg-sm'>￥</view>
											{{items.activity.prom_price>0?items.activity.prom_price:items.shop_price}}
										</view>

									</view>
									<view class="tpdm-goods-nametwo">
										已售出{{(items.sales_sum * 1) + items.virtual_sales_sum }}件</view>
								</navigator>
							</view>
						</view>
						<!-- 海报式 -->
						<view class="tpdm-goods-list tpdm-goods-list3" wx:if="{{item.show_type == 2}}">
							<block wx:if="{{item.list.length == 0}}">
								<view class="not-data-text">暂无上传商品哦~~</view>
							</block>
							<view class="tpdm-goods-wrap clearfix" wx:for="{{item.list}}" wx:for-item="items"
								wx:for-index="idx">

								<navigator class='tpdm-goods-lis'
									url="../../goods/goodsInfo/goodsInfo?goods_id={{items.goods_id}}">
									<view class="tpdm-goods-pic">
										<view class='h-label' wx:if="{{items.label_name}}"
											style='background: url(/images/h-label.png) no-repeat;background-size:175rpx 40rpx;'>
											{{items.label_name}}</view>
										<image src="{{ items.original_img}}"></image>
									</view>
									<view class="tpdm-goods-name">{{items.goods_name}}</view>
									<view class="tpdm-goods-des">
										<view class="tpdm-goods-price">￥
											{{items.activity.prom_price>0?items.activity.prom_price:items.shop_price}}

										</view>
										<view class="tpdm-goods-like">
											{{(items.comment_count * 1) + items.virtual_comment_count || 0}}条评论</view>
										<view style="text-align:center;color:#666;" class="">销量
											{{(items.sales_sum * 1) + items.virtual_sales_sum }}</view>
									</view>

								</navigator>
							</view>
						</view>
					</view>
				</view>
				<!-- 营销活动 -->
				<view class='tpdm-acstyle' wx:if="{{item.block_type == 6}}"
					style="margin-bottom: {{item.spacing*2}}rpx;">
					<!-- 拼团 -->
					<view wx:if="{{item.activity_type == 0 && item.team_list.length >0}}">
						<!-- 橱窗式 -->
						<!-- <view class="tpdm-activity-title" wx:if="{{item.tab_type == 1}}">{{item.tab_title}}</view> -->
						<view wx:if="{{item.tab_title}}" class="section">
							<view class="section-title">{{item.tab_title}}</view>
						</view>
						<view class="choice_box">
							<view class="choice_list">
								<block wx:if="{{item.show_type == 0}}" wx:key="index">
									<navigator class="inline" wx:for="{{item.team_list}}" wx:for-item="items"
										wx:for-index="idx"
										url="/pages/goods/goodsInfo/goodsInfo?goods_id={{items.goods_id}}">
										<view class="choice_item group {{index>=2?'vertical_type':''}}">

											<image class='image'
												src="{{url}}/api/goods/goodsThumImages?goods_id={{items.goods_id}}&width=400&height=400">
											</image>

											<view class="choice_footer">
												<view class='goods_name'>{{items.act_name}}</view>
												<!-- 暂时先隐藏 -->
												<view style='display:none;' class='pro-label'>
													<view>商品标签</view>
													<view>商品标签</view>
												</view>
												<view class="goods_name_cen">
													<view wx:if="{{items.follow_users_head_pic.length > 0}}"
														class='group_image'>
														<image src='{{items.follow_users_head_pic[0]}}'></image>
														<image wx:if="{{items.follow_users_head_pic.length>1}}"
															src='{{items.follow_users_head_pic[1]}}'></image>
													</view>
													<view class="des_flex_4">
														<view class="price">￥<text>{{items.team_price}}</text></view>
														<view class="similer">
															<text>已拼{{items.virtual_num+items.virtual_sales_num}}件</text>
														</view>
													</view>
												</view>
											</view>
										</view>
									</navigator>
								</block>
								<!-- <view class="tpdm-goods-list tpdm-goods-list1" wx:if="{{item.show_type == 0}}">
		                    <view class="tpdm-goods-wrap clearfix" id="nxkhh">
		                        <block wx:for="{{item.team_list}}"  wx:for-item="items" wx:for-index="idx">
		                            <view class="tpdm-goods-lis">
		                                <navigator class="tpdm-goods-pic"  url="../../team/team_info/team_info?goods_id={{items.goods_id}}&item_id={{items.item_id}}&team_id={{items.team_id}}">
		                                    <image src="{{url + items.share_img}}"></image>
		                                </navigator>
		                                <navigator href="javascript:;" class="tpdm-goods-name">{{items.act_name}}</navigator>
		                                <view class="tpdm-goods-des">
		                                    <view class="tpdm-goods-price">￥{{items.team_price}}</view>
		                                    <view class="tpdm-sold-num">单买:￥{{items.goods.shop_price}}</view>
		                                </view>
		                                <view class="tpdm-goods-mes">
		                                    <navigator url="../../team/team_info/team_info?goods_id={{items.goods_id}}&item_id={{items.item_id}}&team_id={{items.team_id}}" class='text-mes-a' href="javascript:;">去拼单 ></navigator>
		                                    <view class='text-mes-span'>{{items.needer}}人团</view>
		                                    <view class="tpdm-acbuyer"><image src=''></image>...</view>
		                                </view>                
		                            </view>  
		                        </block>
		                    </view>
		                </view> -->
								<!-- 列表式 -->

								<block wx:if="{{item.show_type == 1}}" wx:key="index">
									<navigator wx:for="{{item.team_list}}" wx:for-item="items" wx:for-index="idx"
										url="/pages/goods/goodsInfo/goodsInfo?goods_id={{items.goods_id}}">
										<view class="choice_item">

											<image src="{{url + items.share_img}}"></image>

											<view class="choice_footer">
												<view class='goods_name'>{{items.act_name}}</view>
												<!-- 暂时先隐藏 -->
												<view style='display:none;' class='pro-label'>
													<view>商品标签</view>
													<view>商品标签</view>
												</view>
												<view class="goods_name_cen">

													<view wx:if="{{items.follow_users_head_pic.length > 0}}"
														class='group_img'>
														<image src='{{items.follow_users_head_pic[0]}}'></image>
														<image wx:if="{{items.follow_users_head_pic.length>1}}"
															src='{{items.follow_users_head_pic[1]}}'></image>
													</view>
													<view class="des_flex_4">
														<view class="price">￥<text>{{items.team_price}}</text></view>
														<view class="similer">
															<text>已拼{{items.virtual_num+items.virtual_sales_num}}件</text>
														</view>
													</view>
												</view>
											</view>
										</view>
									</navigator>
								</block>
							</view>
						</view>
						<!-- <view class="tpdm-goods-list tpdm-goods-list2"  wx:if="{{item.show_type == 1}}">
		                    <view class="tpdm-goods-wrap clearfix" wx:for="{{item.team_list}}" wx:for-item="items" wx:for-index="idx"> 
		                        <view class='tpdm-goods-lis'>
		                            <navigator class="tpdm-goods-pic" url="../../goods/goodsInfo/goodsInfo?goods_id={{items.goods_id}}"   url="../../team/team_info/team_info?goods_id={{items.goods_id}}&item_id={{items.item_id}}&team_id={{items.team_id}}">
		                                <image src="{{url + items.share_img}}"></image>
		                            </navigator> 
		                            <navigator href="javascript:;" class="tpdm-goods-name">{{items.act_name}}</navigator> 
		                            <view class="tpdm-goods-des">
		                                <view class="tpdm-goods-price">￥{{items.team_price}}</view>
		                                <text class="tpdm-goods-dev">单买：￥{{items.goods.shop_price}}</text>
		                            </view>
		                               <view class="tpdm-goods-mes">
		                                    <navigator url="../../team/team_info/team_info?goods_id={{items.goods_id}}&item_id={{items.item_id}}&team_id={{items.team_id}}" class='text-mes-a' href="javascript:;">去拼单 ></navigator>
		                                    <view class='text-mes-span'>{{items.needer}}人团</view>
		                                    <view class="tpdm-acbuyer"><image src=''></image>...</view>
		                                </view> 
		                        </view>
		                    </view>
		                </view> -->

					</view>



					<!-- 秒杀 -->
					<view wx:if="{{item.activity_type == 1 && custom_skill_status}}">
						<block wx:if="{{item.flash_sale_list.length >0}}">
							<view class="tpdm-seckill-title">
								<image class='tpdm-seckill-label' src='../../../images/s2.png'></image>
								<view id="flash_time " class='seckill-times'>{{item.start_time_format}}点专场</view>
								<view class="tpdm-seckill-time" id="hms">
									<view id="time_h " class='seckill_li'>{{countDownList.hou}}</view>
									<view id="time_m " class='seckill_li'>{{countDownList.min}}</view>
									<view id="time_s " class='seckill_li'>{{countDownList.sec}}</view>
								</view>
								<navigator class='tpdm-seckill-gd' url="../../activity/seckill_list/seckill_list">更多 >
								</navigator>
							</view>
							<view class="tpdm-seckill-list" id="flash_list">
								<block wx:for="{{item.flash_sale_list}}" wx:for-item="items" wx:for-index="idx">
									<navigator class='seckill-list-a'
										url="../../goods/goodsInfo/goodsInfo?goods_id={{items.goods_id}}&item_id={{items.item_id >0 ? items.item_id: ''}}"
										href="javascript:;">
										<image
											src="{{url}}/api/goods/goodsThumImages?goods_id={{items.goods_id}}&width=300&height=300">
										</image>
										<view class='vp'>{{items.goods_name}}</view>
										<view class='seckill-list-span'>￥{{items.price}}</view>
										<view class='seckill-list-i'>￥{{items.shop_price}}</view>
									</navigator>
								</block>
							</view>
						</block>
					</view>
				</view>
				<!-- 橱窗 -->
				<view class='tpwindow ' wx:if="{{item.block_type == 4}}" style="margin-bottom: {{item.spacing*2}}rpx;">
					<!-- 橱窗1 -->
					<view class='tpwindow1' wx:if="{{item.window_style == 0}}">
						<view catchtap='topage' data-type="{{item['nav'][0]['url_type']}}"
							data-id="{{item['nav'][0]['app_url']}}" data-url="{{item['nav'][0]['url']}}">
							<image src="{{url + item['nav'][0]['pic']}}"></image>
						</view>
					</view>
					<!-- 橱窗2 -->
					<view class='tpwindow2' wx:if="{{item.window_style == 1}}">
						<view catchtap='topage' data-type="{{item['nav'][0]['url_type']}}"
							data-id="{{item['nav'][0]['app_url']}}" data-url="{{item['nav'][0]['url']}}">
							<image src="{{url + item['nav'][0]['pic']}}"></image>
						</view>
						<view catchtap='topage' data-type="{{item['nav'][1]['url_type']}}"
							data-id="{{item['nav'][1]['app_url']}}" data-url="{{item['nav'][1]['url']}}">
							<image src="{{url + item['nav'][1]['pic']}}"></image>
						</view>
					</view>
					<!-- 橱窗3 -->
					<view class='tpwindow3' wx:if="{{item.window_style == 2}}">
						<view class='' catchtap='topage' data-type="{{item['nav'][0]['url_type']}}"
							data-id="{{item['nav'][0]['app_url']}}" data-url="{{item['nav'][0]['url']}}">
							<image src="{{url + item['nav'][0]['pic']}}"></image>
						</view>
						<view class='' catchtap='topage' data-type="{{item['nav'][1]['url_type']}}"
							data-id="{{item['nav'][1]['app_url']}}" data-url="{{item['nav'][1]['url']}}">
							<image src="{{url + item['nav'][1]['pic']}}"></image>
						</view>
						<view class='' catchtap='topage' data-type="{{item['nav'][2]['url_type']}}"
							data-id="{{item['nav'][2]['app_url']}}" data-url="{{item['nav'][2]['url']}}">
							<image src="{{url + item['nav'][2]['pic']}}"></image>
						</view>
					</view>
					<!-- 橱窗4 -->
					<view class='tpwindow4' wx:if="{{item.window_style == 3}}">
						<view class='wrap1' catchtap='topage' data-type="{{item['nav'][0]['url_type']}}"
							data-id="{{item['nav'][0]['app_url']}}" data-url="{{item['nav'][0]['url']}}">
							<image src="{{url + item['nav'][0]['pic']}}"></image>
						</view>
						<view class='wrap2' catchtap='topage' data-type="{{item['nav'][1]['url_type']}}"
							data-id="{{item['nav'][1]['app_url']}}" data-url="{{item['nav'][1]['url']}}">
							<image src="{{url + item['nav'][1]['pic']}}"></image>
						</view>
						<view class='wrap2 leftviewne' catchtap='topage' data-type="{{item['nav'][2]['url_type']}}"
							data-id="{{item['nav'][2]['app_url']}}" data-url="{{item['nav'][2]['url']}}">
							<image src="{{url + item['nav'][2]['pic']}}"></image>
						</view>
					</view>
					<!-- 橱窗5 -->
					<view class='tpwindow5' wx:if="{{item.window_style == 4}}">
						<view class='wrap1' catchtap='topage' data-type="{{item['nav'][0]['url_type']}}"
							data-id="{{item['nav'][0]['app_url']}}" data-url="{{item['nav'][0]['url']}}">
							<image src="{{url + item['nav'][0]['pic']}}"></image>
						</view>
						<view class='wrap2' catchtap='topage' data-type="{{item['nav'][1]['url_type']}}"
							data-id="{{item['nav'][1]['app_url']}}" data-url="{{item['nav'][1]['url']}}">
							<image src="{{url + item['nav'][1]['pic']}}"></image>
						</view>
						<view class='wrap2 leftviewne' catchtap='topage' data-type="{{item['nav'][2]['url_type']}}"
							data-id="{{item['nav'][2]['app_url']}}" data-url="{{item['nav'][2]['url']}}">
							<image src="{{url + item['nav'][2]['pic']}}"></image>
						</view>
					</view>
					<!-- 橱窗6 -->
					<view class='tpwindow6' wx:if="{{item.window_style == 5}}">
						<view class='' catchtap='topage' data-type="{{item['nav'][0]['url_type']}}"
							data-id="{{item['nav'][0]['app_url']}}" data-url="{{item['nav'][0]['url']}}">
							<image src="{{url + item['nav'][0]['pic']}}"></image>
						</view>
						<view class='' catchtap='topage' data-type="{{item['nav'][1]['url_type']}}"
							data-id="{{item['nav'][1]['app_url']}}" data-url="{{item['nav'][1]['url']}}">
							<image src="{{url + item['nav'][1]['pic']}}"></image>
						</view>
						<view class='' catchtap='topage' data-type="{{item['nav'][2]['url_type']}}"
							data-id="{{item['nav'][2]['app_url']}}" data-url="{{item['nav'][2]['url']}}">
							<image src="{{url + item['nav'][2]['pic']}}"></image>
						</view>
						<view class='' catchtap='topage' data-type="{{item['nav'][3]['url_type']}}"
							data-id="{{item['nav'][3]['app_url']}}" data-url="{{item['nav'][3]['url']}}">
							<image src="{{url + item['nav'][3]['pic']}}"></image>
						</view>
					</view>
					<!-- 橱窗7 -->
					<view class='tpwindow7' wx:if="{{item.window_style == 6}}">
						<view class='wrap1' catchtap='topage' data-type="{{item['nav'][0]['url_type']}}"
							data-id="{{item['nav'][0]['app_url']}}" data-url="{{item['nav'][0]['url']}}">
							<image src="{{url + item['nav'][0]['pic']}}"></image>
						</view>
						<view class='wrap2' catchtap='topage' data-type="{{item['nav'][1]['url_type']}}"
							data-id="{{item['nav'][1]['app_url']}}" data-url="{{item['nav'][1]['url']}}">
							<image src="{{url + item['nav'][1]['pic']}}"></image>
						</view>
						<view class='wrap3' catchtap='topage' data-type="{{item['nav'][2]['url_type']}}"
							data-id="{{item['nav'][2]['app_url']}}" data-url="{{item['nav'][2]['url']}}">
							<image src="{{url + item['nav'][2]['pic']}}"></image>
						</view>
						<view class='wrap3 leftviewne' catchtap='topage' data-type="{{item['nav'][3]['url_type']}}"
							data-id="{{item['nav'][3]['app_url']}}" data-url="{{item['nav'][3]['url']}}">
							<image src="{{url + item['nav'][3]['pic']}}"></image>
						</view>
					</view>
					<!-- 橱窗8 -->
					<view class='tpwindow8' wx:if="{{item.window_style == 7}}">
						<view class='wrap1' catchtap='topage' data-type="{{item['nav'][0]['url_type']}}"
							data-id="{{item['nav'][0]['app_url']}}" data-url="{{item['nav'][0]['url']}}">
							<image src="{{url + item['nav'][0]['pic']}}"></image>
						</view>
						<view class='wrap2' catchtap='topage' data-type="{{item['nav'][2]['url_type']}}"
							data-id="{{item['nav'][2]['app_url']}}" data-url="{{item['nav'][2]['url']}}">
							<image src="{{url + item['nav'][2]['pic']}}"></image>
						</view>
						<view class='wrap2 topviewne' catchtap='topage' data-type="{{item['nav'][3]['url_type']}}"
							data-id="{{item['nav'][3]['app_url']}}" data-url="{{item['nav'][3]['url']}}">
							<image src="{{url + item['nav'][3]['pic']}}"></image>
						</view>
						<view class='wrap3 leftviewne' catchtap='topage' data-type="{{item['nav'][1]['url_type']}}"
							data-id="{{item['nav'][1]['app_url']}}" data-url="{{item['nav'][1]['url']}}">
							<image src="{{url + item['nav'][1]['pic']}}"></image>
						</view>
					</view>
					<!-- 橱窗9 -->
					<view class='tpwindow9' wx:if="{{item.window_style == 8}}">
						<view class='wrap1' catchtap='topage' data-type="{{item['nav'][0]['url_type']}}"
							data-id="{{item['nav'][0]['app_url']}}" data-url="{{item['nav'][0]['url']}}">
							<image src="{{url + item['nav'][0]['pic']}}"></image>
						</view>
						<view class='wrap2' catchtap='topage' data-type="{{item['nav'][1]['url_type']}}"
							data-id="{{item['nav'][1]['app_url']}}" data-url="{{item['nav'][1]['url']}}">
							<image src="{{url + item['nav'][1]['pic']}}"></image>
						</view>
						<view class='botviewne' catchtap='topage' data-type="{{item['nav'][2]['url_type']}}"
							data-id="{{item['nav'][2]['app_url']}}" data-url="{{item['nav'][2]['url']}}">
							<image src="{{url + item['nav'][2]['pic']}}"></image>
						</view>
						<view class='botviewne' catchtap='topage' data-type="{{item['nav'][3]['url_type']}}"
							data-id="{{item['nav'][3]['app_url']}}" data-url="{{item['nav'][3]['url']}}">
							<image src="{{url + item['nav'][3]['pic']}}"></image>
						</view>
					</view>
				</view>
				<!-- 文本导航 -->
				<view class="tpdm-txtnav-list " wx:if="{{item.block_type == 5}}"
					style="margin-bottom: {{item.spacing*2}}rpx;color:{{item.text_font_color}};background-color:{{item.text_bg_color}};">
					<view class="txtnav-list-cont"
						style="text-align:{{item.text_align}};font-size:{{item.text_font}}px;color:{{item.text_font_color}}">
						{{item.txt_title}}</view>
					<view class='txtnav-lis-a' catchtap='topage' data-type="{{item['url_type']}}"
						data-id="{{item['app_url']}}" data-url="{{item['url']}}">更多<image src='../../../images/xr_3.png'
							class='next_icon'></image>
					</view>
				</view>
				<!-- 优惠券 -->
				<view class='coupons ' wx:if="{{item.block_type == 7}}" style="margin-bottom: {{item.spacing*2}}rpx;">
					<!-- 优惠券1 -->
					<view class='coupons1' wx:if="{{item.coupon_style == 0}}">
						<block wx:for="{{item.nav}}" wx:for-item="items" wx:for-index="idx">
							<view class='coupons_items'>
								<text class='cou_mon'><text class='cou_icon'></text>￥{{items['money']}}</text>
								<text class='cou_cond'>满{{items['condition']}}使用</text>
								<view catchtap='getCoupon' data-cid="{{items.id}}" class='cou_viewnk'>
									<image src='https://www.yitongwang.com/public/static/images/bg-coupon1.png'></image>
									<text>立即领取</text>
								</view>
							</view>
						</block>
					</view>
					<!-- 优惠券2 -->
					<view class='coupons2' wx:if="{{item.coupon_style == 1}}">
						<block wx:for="{{item.nav}}" wx:for-item="items" wx:for-index="idx">
							<view class='coupons_items'>
								<view class='coupon_bj'>
									<image src='https://www.yitongwang.com/public/static/images/bg-coupon2.png'></image>
								</view>
								<view class='coupon_le'><text></text>￥{{items.money}}</view>
								<view class='coupon_ri'>
									<text>满{{items.condition}}使用</text>
									<view catchtap='getCoupon' data-cid="{{items.id}}" class='cou_viewnk'>立即领取</view>
								</view>
							</view>
						</block>
					</view>
				</view>
				<!-- 滚动公告 -->
				<view class="tpdm-messtyle" wx:if="{{item.block_type == 10}}"
					style="margin-bottom: {{item.spacing*2}}rpx;background:{{item.msg_bg_color}}">
					<view class="tpdm-mes-logo">
						<image src="{{url + item.notice_pic || '../../img/z-mse1.png' }}" alt=""></image>
					</view>
					<view class="tpdm-mes-title" id="tpdm-mes-title">
						<swiper class="swiper_container" vertical="true" autoplay="true" circular="true"
							interval="3000">
							<swiper-item wx:for="{{item.nav}}" wx:for-item="items">
								<view class="tpdm-mesname" catchtap='topage' data-type="{{items['url_type']}}"
									data-id="{{items['app_url']}}" data-url="{{items['url']}}">
									<view><text class="tpdm-mesname-name"
											style="color:{{item.msg_font_color}};font-size:{{item.text_font*2}}rpx;">{{items.notice_info}}</text>
									</view>
								</view>
							</swiper-item>
						</swiper>
					</view>
				</view>

				<!-- 视频 s -->
				<view class='tpd-video' wx:if="{{item.block_type == 14}}" style="margin-bottom: {{item.spacing*2}}rpx;">
					<video id="myVideo" poster="{{url + item.video_img}}" src="{{video.video_url}}"
						binderror="videoErrorCallback" controls>
					</video>
				</view>
				<!-- 视频 e -->

				<!-- 多门店店铺 -->
				<view class="tpd-multipleStores-wrap " wx:if="{{item.block_type == 18 }}"
					style="margin-bottom: {{item.spacing*2}}rpx;display:block;" hidden="{{ad}}">
					<view class="tpd-multipleStores-head">——<text>{{item.top_title}}</text>——</view>
					<view class="tpd-multipleStores-dizi" wx:if="{{address}}">
						<view class="tpd-multipleStores-icon1">
							<image src="../../../images/iconfont-shouhuodizhi.png"></image>
						</view>
						<text>当前：</text><text>{{address}}</text>
					</view>
					<view class="tpd-multipleStores-li" wx:for="{{shop_list}}">
						<view catchtap='goShopIndex' data-id="{{item.shop_id}}" data-item="{{item}}">
							<view class="tpd-multipleStores-list">
								<view class="tpd-multipleStores-img">
									<image src="{{url+item.store_logo}}"></image>
								</view>
								<view class="tpd-multipleStores-cont">
									<text>{{item.store_name}}</text>
									<view>{{item.seo_description}}</view>
									<text>评分: {{item.avg_score}}</text>
									<text>销量{{item.count_month_order}}单</text>
									<text>{{item.distance}}Km</text>
								</view>
							</view>
							<view class="tpd-multipleStores-wzhi">
							</view>
						</view>
					</view>
				</view>

				<!-- 单文本 -->
				<view class="tpd-text-cont " wx:if="{{item.block_type == 17 }}"
					style="margin-bottom: {{item.spacing*2}}rpx;background:{{item.text_bg_color}};font-size:{{item.text_font}}px"
					catchtap='topage' data-type="{{item['url_type']}}" data-id="{{item['app_url']}}"
					data-url="{{item['url']}}">
					<view style="color:{{item.text_font_color}};text-align:{{item.text_align}};">{{item.txt_title}}
					</view>
				</view>

				<!-- 图文列表s -->
				<!-- 左图右文 -->
				<view class='float' wx:if="{{item.block_type == 15}}" style="margin-bottom: {{item.spacing*2}}rpx;">
					<view class=" tpd-graphicLists tpd-graphic-wrap1" wx:if="{{item.article_type == 0}}"
						catchtap='topage' data-type="{{item['url_type']}}" data-id="{{item['app_url']}}"
						data-url="{{item['url']}}">
						<view class="tpd-graphicLists-ul">
							<view class="tpd-graphicLists-li">
								<view>
									<view class="tpd-graphicList-img fl">
										<image src="{{url + item.nav[0]['pic']}}"></image>
									</view>
									<view class="tpd-graphicList-cont fr">
										<view class="graphicList-cont-h3">
											{{item.title}}
										</view>
										<view class="graphicList-cont-p">
											{{item.content}}
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 左文右图 -->
					<view class=" tpd-graphicLists tpd-graphic-wrap2" wx:if="{{item.article_type == 1}}"
						catchtap='topage' data-type="{{item['url_type']}}" data-id="{{item['app_url']}}"
						data-url="{{item['url']}}">
						<view class="tpd-graphicLists-ul">
							<view class="tpd-graphicLists-li">
								<view>
									<view class="tpd-graphicList-img fl">
										<image src="{{url + item.nav[0]['pic']}}"></image>
									</view>
									<view class="tpd-graphicList-cont fr">
										<view class="graphicList-cont-h3">
											{{item.title}}
										</view>
										<view class="graphicList-cont-p">
											{{item.content}}
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 上下单图 -->
					<view class=" tpd-graphicLists tpd-graphic-wrap3" wx:if="{{item.article_type == 2}}"
						catchtap='topage' data-type="{{item['url_type']}}" data-id="{{item['app_url']}}"
						data-url="{{item['url']}}">
						<view class="tpd-graphicLists-ul">
							<view class="tpd-graphicLists-li">
								<view>
									<view class="tpd-graphicList-cont fr">
										<view class="graphicList-cont-h3">
											{{item.title}}
										</view>
										<view class="graphicList-cont-p">
											{{item.content}}
										</view>
									</view>
									<view class="tpd-graphicList-img fl">
										<image src="{{url + item.nav[0]['pic']}}"></image>
									</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 上下双图 -->
					<view class=" tpd-graphicLists tpd-graphic-wrap4" wx:if="{{item.article_type == 3}}"
						catchtap='topage' data-type="{{item['url_type']}}" data-id="{{item['app_url']}}"
						data-url="{{item['url']}}">
						<view class="tpd-graphicLists-ul">
							<view class="tpd-graphicLists-li">
								<view>
									<view class="tpd-graphicList-cont fr">
										<view class="graphicList-cont-h3">
											{{item.title}}
										</view>
										<view class="graphicList-cont-p">
											{{item.content}}
										</view>
									</view>
									<view class="tpd-graphicList-img fl">
										<image src="{{url + item.nav[0]['pic']}}"></image>
										<image src="{{url + item.nav[1]['pic']}}"></image>
									</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 上下三图 -->
					<view class=" tpd-graphicLists tpd-graphic-wrap5" wx:if="{{item.article_type == 4}}"
						catchtap='topage' data-type="{{item['url_type']}}" data-id="{{item['app_url']}}"
						data-url="{{item['url']}}">
						<view class="tpd-graphicLists-ul">
							<view class="tpd-graphicLists-li">
								<view>
									<view class="tpd-graphicList-cont fr">
										<view class="graphicList-cont-h3">
											{{item.title}}
										</view>
										<view class="graphicList-cont-p">
											{{item.content}}
										</view>
									</view>
									<view class="tpd-graphicList-img fl">
										<image src="{{url + item.nav[0]['pic']}}"></image>
										<image src="{{url + item.nav[1]['pic']}}"></image>
										<image src="{{url + item.nav[2]['pic']}}"></image>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 图文列表e -->

				<!-- 富文本 -->
				<view class='tpd-richText-cont' wx:if="{{item.block_type == 16}}"
					style="margin-bottom: {{item.spacing*2}}rpx;background:{{item.bgcolor}}">
					<import src="../../../utils/wxParse/wxParse.wxml" />
					<template is="wxParse" data="{{wxParseData:content.nodes}}" />
				</view>

				<!-- 滑动轮播 s -->
				<!-- style="{{item.tab_title.length >3 ? 'min-width:15%;' : item.tab_title.length==1? 'width:100%;':item.tab_title.length==2? 'width:50%;':item.gootab_titleds_list.length==3? 'width:33%;':''}}" -->
				<view class='tpd-containers-slider ' wx:if="{{item.block_type == 13}}"
					style="margin-bottom: {{item.spacing*2}}rpx;">
					<!-- <view class="containers-slider-title" wx:if="{{item.name_show == 1}}">{{item.tab_title}}</view> -->
					<view wx:if="{{homeData.hot_goods}}" wx:if="{{item.name_show == 1}}" class="section">
						<view class="section-title">{{item.tab_title}}</view>
					</view>
					<view class="containers-slider-wrap">
						<view class="containers-slider-cont" style=" white-space: nowrap; ">
							<!-- <scroll-view scroll-x="true" class="containers-slider-cont" style=" white-space: nowrap; " > -->
							<view class="containers-slider-item" wx:for="{{item.goods_list}}" wx:for-item="items"
								wx:if="{{index<item.num}}">
								<navigator url="../../goods/goodsInfo/goodsInfo?goods_id={{items.goods_id}}">
									<view class="seckill-item-img">
										<image mode='aspectFit' src='{{items.original_img}}'></image>
									</view>
									<view class="seckill-item-name">
										<view class="seckill-item-p">
											{{items.goods_name}}
										</view>
									</view>
									<view class="seckill-item-price">
										<view class="item-price-span">
											￥<text style="font-size:20rpx;">
												{{items.activity.prom_price>0?items.activity.prom_price:items.shop_price}}</text>
										</view>
									</view>
									<text style='left:8rpx;' hidden="{{!items.activity.prom_title}}"
										class="Seconds_kill">{{items.activity.prom_title}}</text>
								</navigator>
							</view>
						</view>
						<!-- </scroll-view> -->
					</view>
				</view>
				<!-- 滑动轮播 e -->

				<!-- 新闻列表 -->
				<view class='index_news_list' wx:if="{{item.block_type == 12}}"
					style="margin-bottom: {{item.spacing*2}}rpx;">
					<view class='tpdm-goods-nav'><text class='goods-nav-list'>{{item.new_title}}</text>
						<navigator class='news-more' data-link='/api/news/news_list.html' catchtap='goNewsDetail'>更多
							<image src='../../../images/xr_3.png' class='next_icon'></image>
						</navigator>
					</view>
					<view class="newlist-con" wx:for="{{item.new_list}}" wx:for-item="items" wx:for-index="idx">
						<view class="hottea-list" catchtap='goNewsDetail' data-link='{{items.link}}'
							data-id='{{items.article_id}}'>
							<view class="carlist-img">
								<image src="{{url+items.thumb}}"></image>
							</view>
							<view class="carlist-txt">
								<text class='news_title'>{{items.title}}</text>
								<text class='news_intro'>{{items.description}}</text>
								<view class='news_info'>
									<text class='news_type'>{{items.cat_name}}</text>
									<image src="/images/icon-fire.png"></image>
									<text class='news_time'>{{items.add_time}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class='z-form-wrap' wx:if="{{item.block_type == 19}}"
					style="margin-bottom: {{item.spacing*2}}rpx;background-color:{{item.bg_color}}">
					<form>
						<view class='z-form-item'>

							<block wx:for="{{item.nav}}" wx:for-item="items" wx:for-index="idx">
								<!-- 单文本 -->
								<view class='z-form-text' wx:if="{{items.type == 0}}">
									<text class='form-name'>{{items.title}}</text>
									<view class='form-text-input'>
										<input type='text' data-fid="{{indesx}}" data-idx="{{idx}}"
											style="border-color:{{items.border_color}};" bindblur="checkFromType"
											data-fid="{{indesx}}" data-idx="{{idx}}" value="{{items.val}}"
											placeholder="{{items.placeholder || '请输入内容'}}"></input>
									</view>
								</view>
								<!-- 多文本 -->
								<view class='z-form-textarea' wx:if="{{items.type == 1}}">
									<text class='form-name'>{{items.title}}</text>
									<view class='form-textarea-input'><textarea data-fid="{{indesx}}" data-idx="{{idx}}"
											placeholder="{{items.placeholder || '请输入内容'}}" bindblur="checkFromType"
											style="border-color:{{items.border_color}};height:{{items.min_height * 20}}px;"
											value="{{items.val}}"></textarea></view>
								</view>
								<!-- 时间 -->
								<view class='z-form-time' wx:if="{{items.type == 2}}">
									<text class='form-name'>时间</text>
									<view class='form-time-input'>
										<picker mode="date" value="{{!items.val?'':intelligence_date}}"
											start="2018-01-01" end="2025-12-30" bindchange="bindTimeChange"
											data-fid="{{indesx}}" data-idx="{{idx}}">
											<view class="picker picker-date-text">
												当前选择: <text>{{!items.val?'':intelligence_date}}</text>
											</view>
										</picker>
									</view>
								</view>
								<!-- 地区 -->
								<view class='z-form-time' wx:if="{{items.type == 3}}">
									<text class='form-name'>地区</text>
									<view class='picker-date-dq' data-fid="{{indesx}}" data-idx="{{idx}}"
										bindtap="openRegionsModal">请选择地区:
										<block wx:if="{{items.val}}">
											<text>{{from_address.province_name}} {{from_address.city_name}}
												{{from_address.district_name}}
												{{from_address.twon_name != 'null'?from_address.twon_name:''}}</text>
										</block>
										<block wx:else>
											<text></text>
										</block>
									</view>
								</view>
								<!-- 单选按钮 -->
								<view class='form-radio' wx:if="{{items.type == 4}}">
									<text class='form-name'>{{items.title}}</text>
									<block wx:if="{{items.option_type == 1}}">
										<radio-group
											class="group  flex {{items.option_name.length < 3 ? 'space-around':'space-between'}}">
											<view class="label-2" wx:for="{{items.option_name}}" wx:for-item="itemss"
												wx:for-index="idxs">
												<radio id="{{idxs}}" hidden value="{{idxs}}"
													checked="{{idxs == itemss.selected ?'true':''}}"></radio>
												<view class="label-2__icon" catchtap='radioChange' data-fid="{{indesx}}"
													data-idx="{{idx}}" data-idxs="{{idxs}}"
													style="border-color:{{items.border_color}};">
													<view class="label-2__icon-checked" catchtap='radioChange'
														data-fid="{{indesx}}" data-idx="{{idx}}" data-idxs="{{idxs}}"
														style="opacity:{{idxs ==itemss.selected? 1: 0}}"></view>
												</view>
												<label class="label-2__text"><text>{{itemss.name}}</text></label>
											</view>
										</radio-group>
									</block>
									<block wx:else>
										<radio-group class="group ">
											<view class="label-2" wx:for="{{items.option_name}}" wx:for-item="itemss"
												wx:for-index="idxs">
												<radio id="{{idxs}}" hidden value="{{idxs}}"
													checked="{{idxs == itemss.selected ?'true':''}}"></radio>
												<view class="label-2__icon" catchtap="radioChange" data-fid="{{indesx}}"
													data-idx="{{idx}}" data-idxs="{{idxs}}"
													style="border-color:{{items.border_color}};">
													<view class="label-2__icon-checked" catchtap="radioChange"
														data-fid="{{indesx}}" data-idx="{{idx}}" data-idxs="{{idxs}}"
														style="opacity:{{idxs ==itemss.selected? 1: 0}}"></view>
												</view>
												<label class="label-2__text"><text>{{itemss}}</text></label>
											</view>
										</radio-group>
									</block>
								</view>
								<!-- 多选按钮 -->
								<view class='form-checkbox' wx:if="{{items.type == 5}}">
									<text class='form-name'>{{items.title}}</text>
									<block wx:if="{{items.option_type == 1}}">
										<checkbox-group
											class="group  flex {{items.option_name.length < 3 ? 'space-around':'space-between'}}">
											<view class="label-1" wx:for="{{items.option_name}}" wx:for-item="itemss"
												wx:for-index="idxs">
												<label>
													<checkbox hidden value="{{idxs}}"
														checked="{{idxs ==  itemss.selected ?'true':''}}"></checkbox>
													<view class="label-1__icon" catchtap="checkboxChange"
														data-fid="{{indesx}}" data-idx="{{idx}}" data-idxs="{{idxs}}"
														style="border-color:{{items.border_color}};">
														<view class="label-1__icon-checked" catchtap="checkboxChange"
															data-fid="{{indesx}}" data-idx="{{idx}}"
															data-idxs="{{idxs}}"
															style="opacity:{{idxs ==  itemss.selected ? 1: 0}}"></view>
													</view>
													<text class="label-1__text">{{itemss.name}}</text>
												</label>
											</view>
										</checkbox-group>
									</block>
									<block wx:else>
										<checkbox-group class="group">
											<view class="label-1" wx:for="{{items.option_name}}" wx:for-item="itemss"
												wx:for-index="idxs">
												<label>
													<checkbox hidden value="{{idxs}}"
														checked="{{idxs ==  itemss.selected ?'true':''}}"></checkbox>
													<view class="label-1__icon" catchtap="checkboxChange"
														data-fid="{{indesx}}" data-idx="{{idx}}" data-idxs="{{idxs}}"
														style="border-color:{{items.border_color}};">
														<view class="label-1__icon-checked" catchtap="checkboxChange"
															data-fid="{{indesx}}" data-idx="{{idx}}"
															data-idxs="{{idxs}}"
															style="opacity:{{idxs ==  itemss.selected ? 1: 0}}"></view>
													</view>
													<text class="label-1__text">{{itemss.name}}</text>
												</label>
											</view>
										</checkbox-group>
									</block>
								</view>
							</block>
							<!-- 提交按钮 -->
							<view class='z-from-btn'>
								<button style="color:{{item.submit_color}};background-color:{{item.submit_bg_color}};"
									catchtap='fromSubmit' data-fid="{{indesx}}">{{item.submit_name}}</button>
							</view>
						</view>
					</form>
				</view>
			</block>
		</template>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style scoped src="./custom.css">

</style>

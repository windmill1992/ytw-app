const formatTime = date => {
  var data = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const operaList = [
  {name: '店铺资金',src: 'https://test.yitongwang.com/public/static/images/minniapp/DIYshop_store_money.png',index: 0},
  {name: '店铺设置',src: 'https://test.yitongwang.com/public/static/images/minniapp/DIYshop_set.png',index: 1},
  {name: '营销管理',src: 'https://test.yitongwang.com/public/static/images/minniapp/DIYshop_sell.png',index: 3},
  {name: '投诉/建议',src: 'https://test.yitongwang.com/public/static/images/minniapp/DIYshop_tel.png',index: 2},
]
//计算日期
function addDate(date, days) {
  var d = new Date(date);
  d.setDate(d.getDate() + days);
  var m = d.getMonth() + 1;
  if (m < 9) {
    m = "0" + m
  }
  return d.getFullYear() + '-' + m + '-' + d.getDate();
}

module.exports = {
  formatTime,
  addDate,
  operaList
}

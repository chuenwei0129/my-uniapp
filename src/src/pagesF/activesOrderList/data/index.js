export const tabData = [
    {
      title: '全部',
      id: 1,
      status: '',
    },
    {
      title: '待付款',
      status: 10,
      id: 2
    },
    {
			title: '待服务',
			status: 150,
			id: 3
    },
    {
      title: '已完成',
      status: 220,
      id: 4
    },
    {
      title: '已退款',
      status: -400,
      id: 5
    }
  ]
  export const orderStatus = {
      '10' : '待付款',
      '150' : '待服务',
      '220' : '已完成',
      '-200' : '退款中',
      '-110' : '已取消',
      '-400' : '已退款',
      '300' : '已完成'
  }
  
  export const statusColor = {
      '10' : '#FF4D4D',
      '150' : '#FFB400',
      '220' : '#333333',
      '-200' : '#FFB400',
      '-110' : '#333333',
      '-400' : '#333333',
      '300' : '#333333',
  }
  export const statusTime = {
      '150' : '有效期至',
      '220' : '核销时间',
      '-110' : '取消时间',
      '-400' : '退款时间'
  }
import request from '../utils/request'

//新的方式创建api
export default {
    login(data){
        return request.post('/login',data)
    },
    //首页数据
    // index(){
    //     return request.get('/Index/index')
    // },
    //创建订单的列表数据
    h5companion(){
        return request.get('/h5/companion')
    },
    //创建订单
    createOrder(data){
        return request.post('/createOrder',data)
    },
    //订单列表
    OrderList({params}){
        return request.get('/order/list',{params})
    },

    //订单详情
    orderDetail({params}){
        return request.get('/order/detail',{params})
    },
    
}
export const index = () => {
    return request.get('/Index/index')
}
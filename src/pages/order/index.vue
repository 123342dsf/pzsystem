<template>
    <div class="container">
        <div class="header">我的订单</div>
        <van-tabs @click-tab="onClickTab" v-model:active="active">
            <van-tab title="全部" name=""/>
            <van-tab title="待支付"name="1"/>
            <van-tab title="待服务" name="2"/>
            <van-tab title="已完成" name="3"/>
            <van-tab title="已取消" name="4"/>
        </van-tabs>
        <van-row  @click="goDetail(item)"  v-for="item in order" :key="item.out_trade_no">
            <van-col span="5">
                <van-image width="50" height="50" radius="5" :src="item.serviceImg"></van-image>
            </van-col>
            <van-col span="14">
                <div class="text1">
                    {{ item.service_name }}
                </div>
                <div class="text2">
                    <div>{{ item.hospital_name }}</div>
                    <div>预约时间:{{ item.starttime }}</div>
                </div>
            </van-col>
            <van-col :style="{color:colorMap[item.trade_state]}" span="5">
                {{ item.trade_state }}
            </van-col>
        </van-row>
    </div>
</template>
<script setup>
//主要是tab标签页？？展示订单效果：全部，待支付（计时功能），待服务，已完成，已取消
import {ref,getCurrentInstance,onMounted} from 'vue'
import {useRouter} from 'vue-router'
//在有name的情况下，通过name来决定展示哪一个tab
// onMounted(()=>{
//     getOrderList("")
// })
const {proxy} = getCurrentInstance()
//获取订单列表
const order=ref([])
const getOrderList = async(state) => {
    console.log(state)
    const {data}=await proxy.$api.OrderList({state})
    order.value=data.data
}
const active = ref("")

const colorMap={
    '待支付':'#ff976a',
    '待服务':'#1989fa',
    '已完成':'#07c160',
    '已取消':'#ee0a24'
}

const onClickTab=(item)=>{
    getOrderList(item.name)
}

//订单跳转
const router=useRouter()
const goDetail=(item)=>{
    router.push(`/detail?oid=${item.out_trade_no}`)
}
</script>
<style lang="scss" scoped>
</style>
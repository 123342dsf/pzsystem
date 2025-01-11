<template>
    <div class="container">
        <div class="user">
            <van-image width="100" height="100" class="img" :src="userInfo.avatar" />
            <div class="text">{{userInfo.name}}</div>
        </div>
        <div class="order">
            <div class="top">
                <div class="text1">我的订单</div>
                <div class="text2">全部></div>
            </div>
            <div class="button">
                <div class="item">待付款</div>
                <div class="item">待发货</div>
                <div class="item">待收货</div>
                <div class="item">待评价</div>
                <div class="item">退款/售后</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import {ref,computed} from 'vue'
//为什么使用计算属性
const userInfo=computed(()=>{
    //监听当前变化??监听谁的变化呢这是
    return JSON.parse(localStorage.getItem('h5_userInfo'))||{}
})
</script>
<style lang="scss" scoped>
.container {
    background-color: #f0f0f0;
    height: 100vh;
    overflow: hidden;
    .user {
      width: 95%;
      height: 200px;
      background-color: #fff;
      text-align: center;
      border-radius: 10px;
      margin: 10px;
      .img {
        margin-top: 30px;
      }
      .text {
        line-height: 30px;
        font-weight: bold;
      }
    }
    .order {
      width: 90%;
      margin: 10px;
      border-radius: 5px;
      background-color: #fff;
      padding: 10px;
      .top {
        margin: 10px;
        line-height: 50px;
        display: flex;
        justify-content: space-between;
        .text1 {
          color: #333;
        }
        .text2 {
          color: #999;
        }
        border-bottom: 0.5px solid #f5f5f5;
      }
      .buttom {
        padding: 10px;
        display: flex;
        justify-content: space-around;
        .item {
          font-size: 14px;
          color: #999;
        }
      }
    }
    .foot {
      margin: 0 10px;
      padding: 10px;
      line-height: 50px;
      background-color: #fff;
      .foot1,
      .foot2 {
        display: flex;
        justify-content: space-between;
        color: #555;
      }
      .foot1 {
        border-bottom: 0.5px solid #f5f5f5;
      }
    }
    .quit {
      width: 90%;
      margin: 20px;
    }
    .quit_text {
      margin: 20px 0;
      text-align: center;
    }
  }
</style>
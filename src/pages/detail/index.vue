<template>
    <div class="container"></div>
    <div class="header">
            <van-icon @click="goBack" name="arrow-left" class="header-left" size="30"/>
            订单详情
        </div>
        <statusBar item="0"></statusBar>
</template>
<script setup>
import {getCurrentInstance,onMounted} from 'vue'
import statusBar from '../../components/statusBar.vue'
import {useRouter,useRoute} from 'vue-router'
const {proxy}=getCurrentInstance()
const router=useRouter()
const route=useRoute()

onMounted(async()=>{
    console.log(route.query.oid)
    const {data}=await proxy.$api.orderDetail({oid:route.query.oid})
})

const goBack = () => {
    //对应浏览器的“返回上一页”
    router.go(-1);
}
</script>
<style lang="scss" scoped>
.container {
    background-color: #f0f0f0;
    height: 100vh;
  }
  .header {
    background-color: #fff;
    line-height: 40px;
    text-align: center;
    .header-left {
      float: left;
    }
  }
  .card {
    margin: 15px 0;
    padding: 10px;
    .header-text {
      padding-left: 5px;
      line-height: 30px;
      font-size: 16px;
      font-weight: bold;
      border-left: 4px solid red;
    }
  }
  .dzf {
    padding: 20px;
    .text1 {
      font-size: 20px;
      font-weight: bold;
      line-height: 30px;
      color: #666;
    }
    .text2 {
      font-size: 14px;
      color: #666;
    }
    .text3 {
      text-align: center;
      .van-button {
        margin-top: 10px;
        margin-left: 10px;
        width: 80%;
        font-weight: bold;
      }
    }
  }
  ::v-deep(.van-dialog__content) {
    text-align: center;
    padding: 20px;
    .close {
      position: absolute;
      left: 20px;
    }
  }
</style>
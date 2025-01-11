<template>
    <h1>用户登录</h1>
    <van-form @submit="onSubmit">
        <van-cell-group inset>
            <van-field
            v-model="form.userName"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
            v-model="form.passWord"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
            />
        </van-cell-group>
        <div style="margin: 16px;">
            <van-button round block type="primary" native-type="submit">
            提交
            </van-button>
        </div>
    </van-form>

</template>
<script setup>
import {reactive,getCurrentInstance} from 'vue'
import {useRouter} from 'vue-router'
//获取vue实例,解构赋值，直接拿到实例的proxy属性
const {proxy}=getCurrentInstance()
const router=useRouter()

//表单数据
const form=reactive({
    userName:'',
    passWord:''
})
//提交
const onSubmit=async()=>{
    const {data}=await proxy.$api.login(form)
    //将数据缓存
    if(data.code===10000){
        localStorage.setItem('h5_token',data.data.token)
        localStorage.setItem('h5_userInfo',JSON.stringify(data.data.userInfo))
        router.push({path:'/home'})
    }
}
</script>
<style  lang="less" scoped>
h1{
    text-align: center;
}
</style>
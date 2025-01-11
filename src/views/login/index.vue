<template>
    <el-row class="login-container" justify="center" :align="'middle'">
        <el-card style="max-width: 480px">
            <div class="card-header">
                <img
            :src="imgUrl"
            />
            </div>
            <div class="jump-link">
                <el-link type="primary" @click="handleChange">
                    {{ formType?'返回登录':'注册账号' }}
                </el-link>
                <el-form
                ref="loginFormRef"
                class="demo-ruleForm"
                :model="loginForm"
                :rules="rules"
                style="max-width:600px">
                    <el-form-item prop="userName">
                        <el-input 
                        v-model="loginForm.userName" 
                        placeholder="手机号"
                        prefix-icon="User"
                        />
                    </el-form-item>
                    <el-form-item prop="passWord">
                        <el-input 
                        v-model="loginForm.passWord" 
                        placeholder="密码"
                        prefix-icon="Lock"
                        />
                    </el-form-item>
                    <el-form-item v-if="formType" prop="validCode">
                        <el-input 
                        v-model="loginForm.validCode" 
                        placeholder="验证码"
                        prefix-icon="Lock">
                        <template #append >
                            <span  @click="countDownChange">
                                {{ countDown.validText }}
                            </span>
                        </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="width:100%" @click="submit(loginFormRef)">
                            {{ formType?'注册账号':'登录' }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </el-row>
</template>
<script setup>
import { ref ,reactive ,computed,toRaw} from 'vue'
import {getCode,useAuthentication,login,menuPermissions} from '../../api'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const imgUrl = new URL('../../../public/login-head.png', import.meta.url).href
const loginForm = reactive({
    userName: '',
    passWord: '',
    validCode:''
})
//自定义校验函数，必要参数rule，value，callback
const validatorUser = (rule, value, callback) => {
    //不能为空
    console.log('检验了手机号')
    if (!value) {
        callback(new Error('请输入账号'))
    }else{
        const phoneReg=/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
        phoneReg.test(value) ? callback() : callback(new Error('手机号格式不正确'))
    }

}
const validatorPass = (rule, value, callback) => {
    console.log('密码')
    if (!value) {
        callback(new Error('请输入密码'))
    }else{
        const reg=/^[a-zA-Z0-9_-]{4,16}$/
        reg.test(value) ? callback() : callback(new Error('密码格式不正确'))
    }
}
//表单检验(自定义，离开焦点后检验)
const rules = reactive({
    userName:[{validator:validatorUser,trigger:'blur'}],
    passWord:[{validator:validatorPass,trigger:'blur'}],
})
const loginFormRef = ref()
const router=useRouter()
const store=useStore()
const routerList=computed(() => store.state.menu.routerList)
//表单提交，分为注册和登录两种逻辑（但是方法校验不分）
const submit = async(formEl) => {
    if (!formEl) return
    //手动触发校验,validate为校验方法，参数为回调函数，
    //valid为校验结果，fields为对象，包含校验不通过的字段
    await formEl.validate((valid, fields) => {
    if (valid) {
        if(formType.value){
            //注册逻辑
            useAuthentication(loginForm).then(({data})=>{
                if(data.code===10000)
                ElMessage.success("注册成功，请登录")
                formType.value=0
            }
            )
        }else{
            login(loginForm).then(({data})=>{
                if(data.code===10000){
                    ElMessage.success("登录成功")
                    //将token和用户信息缓存到浏览器中
                    localStorage.setItem('pz_token',data.data.token)
                    
                    console.log(data.data.userInfo)
                    localStorage.setItem('pz_userInfo', JSON.stringify(data.data.userInfo));
                    //动态拿到数据
                    menuPermissions().then(({data})=>{
                        console.log(data)
                        store.commit('dynamicMenu',data.data)
                        toRaw(routerList.value).forEach(item => {
                            router.addRoute('main',item)
                        }
                        )
                        router.push('/')
                    })
                }
            })
        }
    } else {
        console.log('error submit!', fields)
    }
    })

}
//通过ref创建数据，0：登录，1：注册
const formType = ref(0)
//点击切换登录和注册
const handleChange = () => {
    formType.value = formType.value ? 0 : 1
}
//验证码显示字段的逻辑
const countDown=reactive({
    validText:'获取验证码',
    time:60
})
//标志计时器状态，防止无限制创建定时器
let flag=false
let timer
//实现验证码点击逻辑（定时器）
const countDownChange = () => {
    //如果已发送不处理
    if(flag) return
        //如果手机号不存在或者不符合格式
    const phoneReg=/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    if(!loginForm.userName ||!phoneReg.test(loginForm.userName)){
        console.log('手机号格式不正确')
        return ElMessage({
            message: '手机号格式不正确',
            type: 'warning',
        })
        
    }
    //倒计时
    timer=setInterval(() => {
        console.log('定时器开启')
        if(countDown.time<=0){
            countDown.time=60
            countDown.validText='获取验证码'
            flag=false
            clearInterval(timer)
        }
        else{
            countDown.time-=1
            countDown.validText=`剩余${countDown.time}s`
        }
        
    },1000)
    flag=true
    console.log('发送验证码')
    getCode({tel:loginForm.userName}).then(({data})=>{
        console.log('api调用成功')
        console.log(data)
    })
}

</script>
<style lang="css" scoped>
:deep(.el-card__header) {
    padding: 0
    }
.login-container {
    height: 100%;
    .card-header{
    background-color: #899fe1;
    img {
        width: 430px;
    }
    }
    .jump-link {
        text-align: right;
        margin-bottom: 10px;
    }
  }
</style>
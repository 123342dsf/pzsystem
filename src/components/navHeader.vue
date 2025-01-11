<template>
    <div class="header-container">
        <div class="header-left flex-box">
            <el-icon  class="icon" @click='store.commit("collapseMenu")'><Fold /></el-icon>
            <ul class="flex-box">
                <li v-for="(item,index) in selectMenu"
                :key="item.path"
                :class="{selected : route.path === item.path}"
                class="tab flex-box">
                    <el-icon><component :is="item.icon" /></el-icon>
                    <RouterLink class='text flex-box' :to="item.path">{{ item.name }} </RouterLink>     
                    <el-icon class="close" @click="closeTab(item,index)"><Close/></el-icon> 
                </li>
            </ul>
        </div>
        <div class="header-right">
            <el-dropdown @command="handleClick">
                <span class="el-dropdown-link flex-box">
                    <el-avatar :src=userInfo.avatar />
                    <p class="user-name">{{userInfo.name}}</p>
                </span>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="cancel">退出</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';
import {useRoute,useRouter} from 'vue-router'
//获取store实例
const store = useStore()
const route= useRoute();
const router=useRouter();
const selectMenu= computed(()=>store.state.menu.selectMenu);
const userInfo=JSON.parse(localStorage.getItem('pz_userInfo'))
const closeTab=(item,index)=>{
    store.commit('closeMenu',index)
    if(item.path!==route.path){
        return
    }
    //router的push函数让route直接跳转到该页面
    selectMenuData=selectMenu.value
    if(index===selectMenuData.length){
        if(!selectMenuData.length){
            router.push('/')
        }
        else{
        router.push({
            path:selectMenuData[index-1].path
        }
        )
    }
    }
    else{
        router.push({
            path:selectMenuData[index].path
        }
        )
    }
} 
const handleClick=(command)=>{
    if(command==='cancel'){
        localStorage.removeItem('pz_token')
        localStorage.removeItem('pz_userInfo')
        //未登录时的路由守卫监测得到(即虽然是跳转到/页面，
        //但是/页面没有token依旧会跳转到login页面)
        window.location.href=window.location.origin

    }
}
</script>
<style lang="less" scoped>
.flex-box {
    display: flex;
    align-items: center;
    height: 100%;
}
.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    background-color: #fff;
    padding-right: 25px;
    .header-left {
        height: 100%;
        .icon {
            width: 45px;
            height: 100%;
        }
        .icon:hover {
            background-color: #f5f5f5;
            cursor: pointer;
        }
        .tab {
            padding: 0 10px;
            height: 100%;
            .text {
                margin: 0 5px;
            }
            .close {
                visibility: hidden;
            }
            &.selected {
                a {
                    color: #409eff;
                }
                i {
                    color: #409eff;
                }
                background-color: #f5f5f5;
            }
        }
        .tab:hover {
            background-color: #f5f5f5;
            .close {
                visibility: inherit;
                cursor: pointer;
                color: #000;
            }
        }
    }
    .header-right {
        .user-name {
            margin-left: 10px;
        }
    }
    a {
        height: 100%;
        color: #333;
        font-size: 15px;
    }
}
</style>

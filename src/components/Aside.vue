<template>
    <el-menu :style="{width:isCollapsed?'64px':'200px'}"
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="aside-container"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapsed"
        :default-active="active"
      >
        <p class="logo-lg">{{ isCollapsed?'DIDI':'DIDI陪诊'}}</p>
        <treeMenu :menuData="menuData" :index="1" />
      </el-menu>
</template>
<script setup>

import { reactive ,computed} from 'vue';
import treeMenu from './treeMenu.vue';  
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'

const store= useStore();
const isCollapsed= computed(()=>store.state.menu.isCollapsed);
//获取到router实例
const router= useRouter();
const menuData=computed(()=>store.state.menu.routerList);
const active=computed(()=>store.state.menu.menuActive);
</script>
<style lang="less" scoped>
.aside-container {
    height: 100%;
    .logo-lg {
        font-size: 20px;
        text-align: center;
        height: 50px;
        line-height: 50px;
        color: #fff;
    }
}
</style>
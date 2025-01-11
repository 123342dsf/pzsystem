<template>  
    <template v-for="(item, index) in props.menuData">
        <el-menu-item  @click="handleClick(item, `${props.index}-${item.meta.id}`)"
            v-if="!item.children || item.children.length == 0"
            :key="`${props.index}-${item.meta.id}`" 
            :index="`${props.index}-${item.meta.id}`">
                <el-icon size="20">
                    <component :is="item.meta.icon" />              
                </el-icon>
                
                <span>{{ item.meta.name }}</span>
        </el-menu-item>
        <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`">
            <template #title>
                <el-icon size="20">
                    <component :is="item.meta.icon" />
                </el-icon>
                <span>{{ item.meta.name }}</span>
            </template>
            <treeMenu :index="`${props.index}-${item.meta.id}`" :menuData="item.children" />
        </el-sub-menu>
    </template>
</template> 
<script setup>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'
const props=defineProps(['menuData','index'])
const store=useStore()
const router = useRouter()
const handleClick = (item, active) => {
    router.push(item.meta.path)
    store.commit("addMenu",item.meta)
    store.commit("updateMenuActive",active)
}

</script>
<style scoped>
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
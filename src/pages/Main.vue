<template>
    <RouterView ></RouterView>
    <van-tabbar v-model="active">
        <van-tabbar-item 
            v-for="item in router.options.routes[0].children" 
            :key="item.path" 
            :icon="item.meta.icon"
            :url="`#/${item.path}`" >
            {{item.meta.name}}
        </van-tabbar-item> 
    </van-tabbar>
</template>
<script setup >
import {ref} from 'vue'
import {useRouter} from 'vue-router'
//active用于记录当前导航的索引，默认为第一个
const active = ref(0)
const router=useRouter()
// const route=useRoute()
//同样根据路由信息来实现导航
// onMounted(()=>{
//     const data=router.options.routes[0]
//     //数据处理，路由匹配,即找到当前路由对应的导航
//     //active.value=data.children.findIndex(item=>'/'+item.path===route.path)
// })

</script>
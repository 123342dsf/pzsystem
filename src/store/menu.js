const localData=localStorage.getItem('pz_v3pz')
const state= localData?localData.menu:{
    isCollapsed:false,
    selectMenu:[],
    routerList:[],
    //索引的作用出現了
    menuActive:'1-1'
}
//state是对象，payload是传递的参数
const mutations={
    collapseMenu(state){
        state.isCollapsed=!state.isCollapsed
    },
    addMenu(state,payload){
        if((state.selectMenu.findIndex(item=>item.path===payload.path))===-1){
            state.selectMenu.push(payload)
        }
    },
    closeMenu(state,payload){
        //const index=state.selectMenu.findIndex(val=>val.name===payload.name)
        //通过索引删除指定元素
        state.selectMenu.splice(payload,1)
    },
    dynamicMenu(state,payload){
        //vite中通过glob导入具体文件所在路径(glob匹配规则)
        //得到所有的组件（routs里的component）
        //'**/'：是一个递归的通配符，表示匹配所有子文件夹及其子文件夹中的文件
        //会返回对象，对象里都是键值对，键是路径，值是动态导入的函数
        const modules=import.meta.glob('../views/**/**/*.vue')
        //编写函数，修改动态路由
        //接受路由信息，替换component
        console.log(modules)
        function routerSet(router){
            console.log(router)
            router.forEach(route=>{
                //判断没有子菜单（即首先判断是否有component属性）
                if(!route.children){
                    //url是键值，通过url得到动态导入组件(view页面)
                    const url=`../views${route.meta.path}/index.vue`
                    route.component=modules[url]
                }else{
                    //有子菜单，递归处理
                    routerSet(route.children)
                }
            }
            )
        }
        routerSet(payload)
        //能拿到完整的路由数据，并且赋值
        state.routerList=payload
        console.log(state.routerList,'routerList')
    },
    updateMenuActive(state,payload){
        state.menuActive=payload
    }
}

export default {
    state,
    mutations,
}
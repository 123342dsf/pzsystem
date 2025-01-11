<template>
    <PanelHead/>
    <div class="btns">
        <el-button :icon='Plus' type='primary' @click="open(null)" size="small">新增</el-button>
    </div>
    <el-table
        :data="tableData.list" style='width:100%'>
        <el-table-column prop="id" label="id"/>
        <el-table-column prop="name" label="昵称"/>
        <el-table-column prop="permissionName" label="菜单权限" width="500px"/>
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" @click="open(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pagination-info">
        <el-pagination
        v-model:current-page="paginationData.pageNum"
        :page-size="paginationData.pageSize"
        :background="false"
        layout="total, prev, pager, next"
        :total="tableData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
    </div>
    <el-dialog
        v-model="dialogFormVisible"
        :before-close="beforeClose"
        :title="添加权限"
        :width="'500px'"
        :rules="rules"
    >
        <el-form 
            ref="FormRef"
            label-width="100px"
            label-position="left"
            :model="form"
        >
            <el-form-item  v-show='false' prop="id">
                <el-input v-model="form.id"  />      
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入权限名称" />      
            </el-form-item>
            <el-form-item label="权限" prop="permissions">
                <el-tree
                ref="treeRef"
                :data="permissionData"
                style="max-width: 600px;"
                node-key="id"
                show-checkbox
                :default-checked-keys="defaultKeys"
                :default-expanded-keys="[2]"
                >
                </el-tree>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                    <el-button type='primary' @click="confirm(FormRef)">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref ,reactive,onMounted,nextTick} from 'vue'
import {userGetMenu,userSetMenu,menuList} from '../../../api'
import {Plus} from '@element-plus/icons-vue'
//树形菜单权限数据
const permissionData = ref([])
onMounted(()=>{
    userGetMenu().then(({data})=> {
        permissionData.value = data.data
    }
    )
    getListData()
})

const paginationData=reactive({
    pageNum: 1,
    pageSize: 10 
})

//改变每页显示内容的多少
const handleSizeChange=(val)=>{
    paginationData.pageSize=val
    getListData()
}
//改变当前页数
const handleCurrentChange=(val)=>{
    paginationData.pageNum=val
    getListData()
}

//列表数据
const tableData = reactive({
    list:[],
    total:0
})

//打开弹窗,rowData新增无数据，编辑有数据，分情况
const open=(rowData={})=>{
    dialogFormVisible.value=true
    //如果有数据，手动赋值（弹窗form打开是异步的｛更新 DOM 之后的操作｝，因为数据绑定？编辑赋值？）
    nextTick(()=>{
        if(rowData){
            //不能整体赋值，可能会存在属性丢失，assign会保留原有属性
            Object.assign(form,{id:rowData.id,name:rowData.name})
            treeRef.value.setCheckedKeys(rowData.permissions)

        }
    })
}

//对应请求列表数据
const getListData=()=>{
    menuList(paginationData).then(({data})=>{
        const {list,total}=data.data
        tableData.list=list
        tableData.total=total
        console.log(data,'data')
    })
}

//用来控制弹窗的显示隐藏
const dialogFormVisible = ref(false)
//关闭弹窗前的回调,避免回显，要重置表单数据
const beforeClose = () => {
    dialogFormVisible.value=false
    FormRef.value.resetFields()
    treeRef.value.setCheckedKeys(defaultKeys)
}
//form的数据
const form = reactive({
//id是编辑的时候需要用到的？
    name:'',
    permissions:'',
    id:''
})
//选中权限（默认）
const defaultKeys=[4,5]
//获取到tree组件，来实现tree组件的数据获取
const treeRef = ref()
//获取表单组件，来实现表单提交时的校验
const FormRef = ref()
//为什么异步？
const confirm=async(formEl)=>{
    if (!formEl) return
    await formEl.validate((valid, fields)=>{
        if(valid){
            //获取到选择的checkbox的数据
            const permissions=JSON.stringify(treeRef.value.getCheckedKeys())
            userSetMenu({name:form.name,permissions:permissions,id:form.id}).then(({data})=>{  
                beforeClose()
                //重新请求新的数据！
                getListData()
            })
        }else{
            console.log('error submit!', fields)
        }
    }
)
}
//表单校验
const rules = reactive({
    name:[{trigger:'blur',required:true,message:'请输入权限名称'}],  
})

</script>
<style lang="less" scoped>
.btns{
    padding: 10px,10px,10px,10px;
    background-color: #fff;
}
</style>
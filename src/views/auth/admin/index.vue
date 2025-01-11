<template>
    <el-table
        :data="tableData.list" style='width:100%'>
        <el-table-column prop="id" label="id"/>
        <el-table-column prop="name" label="昵称"/>
        <el-table-column prop="permissions_id" label="所属组别">
            <template #default="scope">
                {{ permissionName(scope.row.permissions_id) }}
            </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号"/>
        <el-table-column prop="active" label="状态">
            <template #default="scope">
                <el-tag :type="scope.row.active?'success':'danger'">{{ scope.row.active?'正常':'失效' }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column  label="创建时间">
            <template #default="scope">
                <div style="display: flex;">
                    <el-icon><Clock/></el-icon>
                    <span style="margin-left: 10px;">{{ scope.row.create_time }}</span>
                </div>
            </template>
        </el-table-column>
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
            <el-form-item  label="手机号" prop="mobile">
                <el-input v-model="form.mobile" disabled />      
            </el-form-item>
            <el-form-item label="昵称" prop="name">
                <el-input v-model="form.name"  />      
            </el-form-item>
            <el-form-item label="菜单权限" prop="permissions_id">
                <el-select 
                    v-model="form.permissions_id" 
                    placeholder="请选择"
                    style="width: 240px;"
                >
                    <el-option v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    />
                        
                </el-select>
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
import {authAdmin,menuSelectList,updateUser} from '../../../api'
import { ref,reactive ,onMounted} from 'vue';
import dayjs from 'dayjs'
const paginationData=reactive({
    pageNum: 1,
    pageSize: 10 
})

const tableData = reactive({
    list:[],
    total:0
})
//请求列表
const getListData=()=>{
    authAdmin(paginationData).then(({data})=>{
        console.log(data,'authAdmin')
        //对日期时间戳进行额外处理
        const {list,total}=data.data
        list.forEach(item=>{
            item.create_time=dayjs(item.create_time).format('YYYY-MM-DD')
        })
        tableData.list=list
        tableData.total=total
    })
}

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

const dialogFormVisible=ref(false)
const beforeClose=()=>{
    dialogFormVisible.value=false
}
//编辑表单
const form=reactive({
    name:'',
    permissions_id:''
})

const FormRef=ref()
const rules = reactive({
    name:[{trigger:'blur',required:true,message:'请填写昵称'}],  
    permissions_id:[{trigger:'change',required:true,message:'请选择权限'}]
})
const confirm=async(formEl)=>{
    if (!formEl) return
    await formEl.validate((valid, fields)=>{
        if (valid) {
    const { name, permissions_id } = form;
    console.log('确认中')
    updateUser({ name, permissions_id }).then(({ data }) => {
        if (data.code === 10000) {
            console.log('成功');
            dialogFormVisible.value = false;
            getListData();
        }
    });
}else{
            console.log('error submit!', fields)
        }
    }
)
}
onMounted(()=>{
    getListData()
    menuSelectList().then(({data})=>{
        options.value=data.data
        console.log(data,'menuSelectList')
    })
}
)
const options=ref([])
//根据权限id匹配权限名称
const permissionName=(id)=>{
    const data=options.value.find(item=>item.id===id)
    return data?data.name:'超级管理员'
}
const open=(rowData)=>{
    dialogFormVisible.value=true
    Object.assign(form,{mobile:rowData.mobile,name:rowData.name,permissions_id:rowData.permissions_id})
}

</script>

<style lang="less" scoped>
</style>
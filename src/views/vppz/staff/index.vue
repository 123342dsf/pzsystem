<template>
    <div class="btns">
        <el-button :icon='Plus' type='primary' @click="open(null)" size="small">新增</el-button>
        <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon-color="#626AEF"
            title="你确定要删除吗"
            @confirm="confirmEvent"
            @cancel="cancelEvent"
        >
            <template #reference>
            <el-button :icon="Delete" type="danger" size="small">删除</el-button>
            </template>
        </el-popconfirm>
    </div>
    <el-table
        :data="tableData.list" 
        style='width:100%'
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id"/>
        <el-table-column prop="name" label="昵称"/>
        <el-table-column prop="avatar" label="头像">
            <template v-slot:default="scope">
                <img :src="scope.row.avatar" style="width: 50px; height: 50px;" />
            </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别"/>
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="active" label="状态" >
            <template #default="scope">
                <el-tag
                :type=" Number(scope.row.active) ? 'success': 'danger'"
                >{{ scope.row.active ? '正常' : '失效'}}</el-tag
                >
            </template>
        </el-table-column>
        <el-table-column  prop="create_time" label="创建时间" />
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" @click="open(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
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
            :rules="rules"
        >
            <el-form-item  prop="id" v-show="false">
                <el-input v-model="form.id"  />      
            </el-form-item>
            <el-form-item label="昵称" prop="name">
                <el-input v-model="form.name" placeholder="请输入昵称" />      
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
                <el-button @click="avatarLoad" v-if="!form.avatar">点击更换</el-button>
                <img v-else :src="form.avatar"  style="width: 100px;height: 100px;">
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select
                    v-model="form.sex"
                    style="width: 100%"
                    >
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
                <el-input-number v-model="form.age" :min="0"   />
            </el-form-item>
            <el-form-item label="手机号"  prop="mobile">
                <el-input v-model="form.mobile" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="是否生效"  prop="active">
                <el-radio-group v-model="form.active">
                    <el-radio value='1' size="large">生效</el-radio>
                    <el-radio value='0' size="large">失效</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                    <el-button type='primary' @click="confirm()">确认</el-button>
            </div>
        </template>
    </el-dialog>
    <el-dialog
        v-model="dialogAvatarVisible"
        :before-close="beforeCloseAvatar"
        :width="'900px'"
    >
        <div class="flex-box" >
            <div 
            v-for="(item,index) in Avatars"
            :key="{index}"
            >
            <div class="avatar-item">
                <el-icon 
                    color="green" 
                    v-if="select===index"
                    class="avatar-icon"
                    ><Select /></el-icon>
                <img  :src="item.url" @click="select=index"/>
            </div>
        </div>
        </div>
        <el-button @click='confirmPicture'>确定</el-button>
    </el-dialog>
</template>
<script setup>
import dayjs from 'dayjs';
import {reactive,ref,onMounted,nextTick} from 'vue'
import {photoList,Companion,companionList,deleteCompanion} from '../../../api'
import {Plus,Delete} from '@element-plus/icons-vue'
const Avatars = ref([]);  // 使用 ref() 创建响应式变量
const FormRef = ref()
const selectedUsers=ref([])
onMounted(() => {
    getCompanionList()
    // 获取图片数据
    photoList().then(({ data }) => {
        Avatars.value = data.data;  // 使用 .value 修改 ref 的值
    });
});
//关于页数的显示
const paginationData=reactive({
    pageNum: 1,
    pageSize: 10 
})
//获取陪护师列表
const getCompanionList=()=>{
    companionList({pageNum:paginationData.pageNum,pageSize:paginationData.pageSize}).then(({data})=>{
        data.data.list.forEach(item=>{
            item.create_time= dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss');
        })
        tableData.list=data.data.list
        tableData.total=data.data.total
    })
}

//关于pop弹窗
const confirmEvent=()=>{
    //判断是否有需要删除的内容
    if(selectedUsers.value.length){
        deleteCompanion({id:selectedUsers.value}).then(()=>{
        selectedUsers.value=[]
        getCompanionList();
    })
    }else{
        ElMessage({
                message: '请至少选择一种',
                type: 'warning',
            })
    }
}


const select=ref(0)
const dialogFormVisible=ref(false)
const dialogAvatarVisible=ref(false)
const tableData=reactive({
    list:[],
    total:0
    // id:'',
    // name:'',
    // avatar:'',
    // sex:'',
    // mobile:'',
})

const form=reactive({
    //没创建之前，id为空，这也是标识，代表未创建。未创建就给它一个唯一id标识，创建了
    //后返回id，也可以通过id进行修改
    id:'',
    name:'',
    avatar:'',
    sex:'',
    mobile:'',
    active:'1',
    age:28
})
const options = [
    {
        value: '男',
        label: '男',
    },
    {
        value: '女',
        label: '女',
    }
]

//关于选择（删除，批量删除）
const handleSelectionChange=(val)=>{
    selectedUsers.value= val.map(item =>({id:item.id}));
    //这里使用了 map() 方法来从 val 数组中的每个对象中提取 id 属性
}

//open函数，参数可以为空，空的时候为创建，非空的时候为编辑，编辑的时候需要赋值
const open=(rowData={})=>{
    dialogFormVisible.value=true
    //说明处于编辑
    nextTick(()=>{
        if(rowData){
        //nextTIck可以理解为获取了最新的dom状态，dom一改变，nextTick就会执行（怕赋值可能不是最新数据）
        //或者产生混乱？？？其实还是有点没理解
        Object.assign(form,{id:rowData.id,name:rowData.name,avatar:rowData.avatar,sex:rowData.sex,mobile:rowData.mobile,active:rowData.active,age:rowData.age})
    }
    })

}

const beforeCloseAvatar=()=>{
    dialogAvatarVisible.value=false
}
const beforeClose=()=>{
    dialogFormVisible.value=false
    FormRef.value.resetFields()
}
const avatarLoad=()=>{
    dialogAvatarVisible.value=true
}
const confirmPicture=()=>{
    form.avatar=Avatars.value[select.value].url
    dialogAvatarVisible.value=false
    select.value=0
}
//自定义手机号校验
const validatorUser = (rule, value, callback) => {
    //不能为空
    if (!value) {
        callback(new Error('手机号不能为空'))
    }else{
        const phoneReg=/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
        phoneReg.test(value) ? callback() : callback(new Error('手机号格式不正确'))
    }
}

//表单校验
const rules = reactive({
    name:[{trigger:'blur',required:true,message:'请输入权限名称'}],  
    avatar:[{trigger:'blur',required:true,message:'请选择头像'}],
    sex:[{trigger:'blur',required:true,message:'请选择性别'}],
    mobile:[{validator:validatorUser,trigger:'blur'}],
})

const confirm=async ()=>{
    //表单上传
    //确保组件FormRef存在，不是null或者undefined
    if(!FormRef) return
    //异步操作的原因：涉及网络请求，可能耗时长；等待验证，等待网络请求
    //validate进行表单验证，验证通过，valid为true，否则为false
    await FormRef.value.validate((valid,fields)=>{
        if(valid){
            Companion({id:form.id,name:form.name,avatar:form.avatar,age:form.age,sex:form.sex,mobile:form.mobile,active:Number(form.active)}).then(res=>{
                getCompanionList()
                beforeClose()
            })
        }else{
            console.log('error submit!', fields)
        }
    })

}
</script>
<style lang="less" scoped>
.flex-box {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
.avatar-item{
    display: flex;
    flex-direction: column;
    position: relative;
    .avatar-icon{
        position:absolute;
        top:0;
        left:0;
        background-color: aliceblue;
    }
}
</style>
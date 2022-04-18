<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">域名管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>域名管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 域名基本信息查询表单 -->
      <el-form :inline="true" label-suffix=":" v-model="addForm">
        <!-- 项目 -->
        <el-form-item label="项目" prop="project">
          <el-select
            v-model="addForm.project"
            style="width: 150px"
            placeholder="请选择"
            clearable
            filterable
            allow-create
          >
            <el-option
              v-for="item in project_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 环境 -->
        <el-form-item label="环境" prop="domain_env">
          <el-select
            v-model="addForm.domain_env"
            style="width: 150px"
            placeholder="请选择"
            clearable
            filterable
            allow-create
          >
            <el-option label="test" value="test"></el-option>
            <el-option label="uat" value="uat"></el-option>
            <el-option label="prod" value="prod"></el-option>
          </el-select>
        </el-form-item>

        <!-- 所属业务 -->
        <el-form-item label="所属业务" prop="business">
          <el-select
            v-model="addForm.business"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in business_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 域名 -->
        <el-form-item label="域名" prop="domain_name">
          <el-input v-model.trim="addForm.domain_name" placeholder="域名" />
        </el-form-item>

        <!-- 是否备案 -->
        <el-form-item label="是否备案" prop="id_beian">
          <el-select
            v-model="addForm.id_beian"
            style="width: 150px"
            placeholder="请选择"
            clearable
            filterable
            allow-create
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <!-- 域名状态 -->
        <el-form-item label="域名状态" prop="domain_status">
          <el-select
            v-model="addForm.domain_status"
            style="width: 150px"
            placeholder="域名状态"
            clearable
            filterable
            allow-create
          >
            <el-option label="在用" :value="1"></el-option>
            <el-option label="备用" :value="0"></el-option>
            <el-option label="异常" :value="-1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="domain_name_basic_info_submit(addForm)"
        >查询</el-button
      >
      <el-button type="primary" @click="addDialogVisible = true"
        >添加域名</el-button
      >
      <!-- 用户列表区域 ,表格渲染使用:data来表示数据源 -->
      <el-table :data="domainlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="域名" prop="domain_name"></el-table-column>
        <el-table-column
          label="域名托管商"
          prop="register_name"
        ></el-table-column>
        <el-table-column type="域名解析商" prop="resolver"></el-table-column>
        <el-table-column label="是否备案" prop="id_beian"></el-table-column>
        <el-table-column label="项目" prop="project"></el-table-column>
        <el-table-column label="环境" prop="domain_env"></el-table-column>
        <el-table-column label="业务" prop="business"></el-table-column>
        <el-table-column
          label="业务类别"
          prop="business_type"
        ></el-table-column>
        <el-table-column label="域名状态" prop="domain_status">
        </el-table-column>
        <el-table-column label="备注" prop="remarks"></el-table-column>
        <!-- 140px 操作框刚好展开 -->
        <el-table-column label="操作" width="140px">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="current_domian_name_click(scope.row)"
              >详情</el-button
            >
            <el-button type="text" size="mini">线路质量检测</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <!-- 
        size-change: 每页可以显示多少条数据, pagesize
        current-change： 最中间显示的页码值
        current-page: 当前的页数显示, pagenum
        page-sizes： 每页可以显示多少条，下拉菜单
        page-size： 当前每页显示多少条

       -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.skip"
        :page-sizes="[10, 20, 40, 100]"
        :page-size="queryInfo.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible">
        <!-- 内容主题区域 -->
        <!-- lable-width是前面文本的宽度 ,100px刚好展开长字符串-->
        <el-form
          :inline="true"
          :model="addForm"
          :rules="addFormRules"
          ref="addForm"
          label-width="100px"
        >
          <!-- prop,验证规则属性，验证规则名称 -->
          <el-form-item label="域名" prop="domain_name" required>
            <el-input v-model="addForm.domain_name"></el-input>
          </el-form-item>
          <el-form-item label="域名托管商" prop="register_name" required>
            <el-select
              v-model="addForm.register_name"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in cloud_vender_opstion"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="域名解析商" prop="resolver" required>
            <el-select
              v-model="addForm.resolver"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in cloud_vender_opstion"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否备案" prop="id_beian" required>
            <el-select v-model="addForm.id_beian" placeholder="请选择是否备案">
              <el-option label="已备案" value="1"></el-option>
              <el-option label="未备案" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目" prop="project" required>
            <el-select
              v-model="addForm.project"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in project_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="环境" prop="domain_env" required>
            <el-select
              v-model="addForm.domain_env"
              placeholder="请选择"
              clearable
              filterable
              allow-create
            >
              <el-option label="test" value="test"></el-option>
              <el-option label="uat" value="uat"></el-option>
              <el-option label="prod" value="prod"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务" prop="business" required>
            <el-select
              v-model="addForm.business"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in business_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务类型" prop="business_type" required>
            <el-select
              v-model="addForm.business_type"
              placeholder="业务类型"
              clearable
              filterable
              allow-create
            >
              <el-option label="前端" value="前端"></el-option>
              <el-option label="后端" value="后端"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="域名状态" prop="domain_status" required>
            <el-select
              v-model="addForm.domain_status"
              placeholder="请选择域名状态"
            >
              <el-option label="再用" value="1"></el-option>
              <el-option label="备用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="addForm.remarks"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部的按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <!-- @click="addDialogVisible = false" -->
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="addDomain">立即添加</el-button>
        </span>
      </el-dialog>
    </el-card>
    <el-drawer
      :title="current_domain_name_details_dict.domain_name"
      size="64.5%"
      :visible.sync="current_domain_name_details_drawer_is_visible"
      :modal="false"
    >
      <!-- 修改用户的对话框 -->
      <!-- 通过作用域插槽渲染操作列：https://www.bilibili.com/video/BV1vE411871g?p=194 
      https://www.bilibili.com/video/BV1vE411871g?p=193
      -->
      <div style="margin: 20px; height: 800px; overflow: auto">
        <div>
          <el-row>
            <el-col :span="4"><b>域名托管商：</b> </el-col>
            <el-col :span="4">{{
              current_domain_name_details_dict.register_name
            }}</el-col>
            <el-col :span="4"><b>域名解析商：</b></el-col>
            <el-col :span="4">{{
              current_domain_name_details_dict.resolver
            }}</el-col>
            <el-col :span="4"><b>是否备案：</b></el-col>
            <el-col
              :span="4"
              v-if="current_domain_name_details_dict.is_beian == 1"
              >是</el-col
            >
            <el-col :span="4" v-else>否</el-col>
          </el-row>
          <br />
          <el-row>
            <el-col :span="4"><b>项目：</b></el-col>
            <el-col :span="4">{{
              current_domain_name_details_dict.project
            }}</el-col>
            <el-col :span="4"><b>环境：</b></el-col>
            <el-col :span="4">{{
              current_domain_name_details_dict.domain_env
            }}</el-col>
            <el-col :span="4"><b>业务：</b></el-col>
            <el-col :span="4">{{
              current_domain_name_details_dict.business
            }}</el-col>
          </el-row>
          <br />
          <el-row>
            <el-col :span="4"><b>业务类型：</b></el-col>
            <el-col :span="4">{{
              current_domain_name_details_dict.business_type
            }}</el-col>
            <el-col :span="4"><b>域名状态：</b></el-col>
            <el-col :span="4">{{
              current_domain_name_details_dict.domain_status
            }}</el-col>
            <el-col :span="4"><b>备注：</b></el-col>
            <el-col :span="4">{{
              current_domain_name_details_dict.remarks
            }}</el-col>
          </el-row>
          <br />
          <template>
            <div>
              <el-button>编辑</el-button>
              <el-divider></el-divider>
              <h1 style="margin: 0px">域名当前解析记录</h1>
            </div>
          </template>
          <!-- 线路切换表格 -->
          <!-- 阿里云 -->
          <el-table>
            <el-table-colume
              prop="RR"
              label="主机记录"
              align="center"
            ></el-table-colume>
            <el-table-colume
              prop="Type"
              label="记录类型"
              align="center"
            ></el-table-colume>
            <el-table-colume
              prop="Line"
              label="解析线路"
              align="center"
            ></el-table-colume>
            <el-table-colume
              prop="Value"
              label="记录值"
              align="center"
            ></el-table-colume>
            <el-table-colume
              prop="TTL"
              label="TTL"
              align="center"
            ></el-table-colume>
            <el-table-colume
              prop="Status"
              label="状态"
              align="center"
            ></el-table-colume>
          </el-table>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 云厂商列表
      cloud_vender_opstion: [],
      // 业务列表
      business_options: [],
      // 项目名称列表
      project_options: [],
      // 获取用户列表的参数对象
      queryInfo: {
        // 根据域名搜索数据
        query: '',
        // 当前的页数
        skip: 1,
        // 当前每页显示多少条数据
        limit: 10,
      },
      // 分页功能中的数据总条数
      total: 0,
      // 生命周期函数中定义的第一个函数，获取到的数据存在domainlist列表中
      domainlist: [],
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据,绑定的是添加数据区域的:data 属性，与输入框中的数据进行双向数据绑定
      addForm: {
        domain_name: '',
        register_name: '',
        resolver: '',
        id_beian: '',
        project: '',
        domain_env: '',
        business: '',
        business_type: '',
        domain_status: '',
        remarks: '',
      },
      // 修改域名数据时的表单数据
      current_domain_basic_info_edit_form: {},
      // 控制修改表单数据页面的显示与隐藏
      current_domain_basic_info_edit_form: false,
      // 前端点击每行的详情时，通过socop.row 获取每行的所有数据，并重新赋值
      current_domain_name_details_dict: {},
      // 右侧详情抽屉开关
      current_domain_name_details_drawer_is_visible: false,
      //
      addFormRef: {},
      // 添加表单验证规则的对象
      addFormRules: {
        domain_name: [
          { required: true, message: '请输入域名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在3-10个字符之间', trigger: 'blur' },
        ],
        register_name: [
          { required: true, message: '请输入托管商名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在3-10个字符之间', trigger: 'blur' },
        ],
        resolver: [
          { required: true, message: '请输入域名解析商', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在3-10个字符之间', trigger: 'blur' },
        ],
        id_beian: [
          { required: true, message: '请输入备案信息', trigger: 'blur' },
          { min: 1, max: 2, message: '一位数字', trigger: 'blur' },
        ],
        project: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在3-10个字符之间', trigger: 'blur' },
        ],
        domain_env: [
          { required: true, message: '请输入环境名称', trigger: 'blur' },
          { min: 2, max: 4, message: '长度在3-10个字符之间', trigger: 'blur' },
        ],
        business: [
          { required: true, message: '请输入业务名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3-10个字符之间', trigger: 'blur' },
        ],
        business_type: [
          { required: true, message: '请输入业务类型', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在3-10个字符之间', trigger: 'blur' },
        ],
        domain_status: [
          { required: true, message: '请输入域名状态', trigger: 'blur' },
          { min: 1, max: 2, message: '一位数字', trigger: 'blur' },
        ],
      },
      drawer: false,
    }
  },
  // 声明周期函数，在页面创建时就会调用函数，发起数据请求
  created() {
    // 获取域名信息表
    this.getDomainList()
    //获取云厂商下拉框
    this.get_could_vender_options()
    // 获取项目项目下拉框
    this.get_could_business_opstion()
    this.get_could_project_opstion()
  },
  methods: {
    async getDomainList() {
      const { data: res } = await this.$http.get('/domain/domain01', {
        params: this.queryInfo,
      })
      this.domainlist = res.msg
      this.total = res.total
      // console.log(this.domainlist)
    },
    // 监听pagesize 改变的事件
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.limit = newSize
      this.getDomainList()
    },
    // 监听页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.skip = newPage
      this.getDomainList()
    },

    // 监听添加用户对话框的关闭事件
    resetForm() {
      // 重置表单
      this.$refs.addForm.resetFields()
      console.log('hello word')
    },
    addDomain() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'domain/domain',
          this.addForm
        )
        // console.log(res)
        this.$message.success('添加用户成功!')
        // 隐藏添加对话框
        // this.addDialogVisible = false
        // 刷新,重新获取域名列表
        this.getDomainList()
        // 重置表单.下次再打开时为空
        this.$refs.addForm.resetFields()
      })
    },
    async get_could_vender_options() {
      const { data: cloud_venter } = await this.$http.get('/domain/cloud')
      this.cloud_vender_opstion = cloud_venter.msg
      // console.log(cloud_venter.msg)
    },
    async get_could_business_opstion() {
      const { data: business } = await this.$http.get('domain/business')
      // msg 接口返回的数据格式中的键(属性)
      this.business_options = business.msg
      // console.log(business.msg)
    },
    async get_could_project_opstion() {
      const { data: project } = await this.$http.get('domain/project')
      // msg 接口返回的数据格式中的键(属性)
      this.project_options = project.msg
      // console.log(project.msg)
    },
    async domain_name_basic_info_submit(params) {
      // this.domain_name_basic_info_table_data = []
      let query_params = JSON.parse(JSON.stringify(params))
      console.log(query_params)
      for (var key in query_params) {
        if (query_params[key] === '') {
          delete query_params[key]
        }
      }
      console.log(query_params)
      const { data: res } = await this.$http.post(
        'domain/domain_sum',
        query_params
      )
      console.log(res)

      // if (res.code !== 200) return this.$message.error(res.msg)
      this.domainlist = res
      //         // 刷新,重新获取域名列表
      // this.getDomainList()
      // 重置表单.下次再打开时为空
      // this.resetForm()
    },
    // 单击域名，打开右侧抽屉，域名详情,点击以后更新字典，后面这个抽屉里显示的相关的值都从这里取值
    async current_domian_name_click(row) {
      if (
        this.current_domain_name_details_dict.domain_name !== row.domain_name
      ) {
        // 最上端数据保存
        this.current_domain_name_details_dict = JSON.parse(JSON.stringify(row))
        this.current_domain_name_resolver = JSON.parse(
          JSON.stringify(this.current_domain_name_details_dict.resolver)
        )
        this.current_domain_name = JSON.parse(
          JSON.stringify(this.current_domain_name_details_dict.domain_name)
        )
      } else {
        this.current_domain_name_details_drawer_is_visible = true
      }
      console.log('>>>>>>>>>>>')
      console.log(this.current_domain_name_details_dict)
      console.log(this.current_domain_name_details_dict.domain_name)
      let pares = this.current_domain_name_details_dict.domain_name
      console.log(pares)
      console.log('>>>>>>>>>>>>')
      // console.log(this.project_options)
    },
  },
}
</script>
<style>
</style>





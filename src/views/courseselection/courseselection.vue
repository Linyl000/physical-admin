<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="学期" prop="semesterId">
        <el-input
          v-model="queryParams.semesterId"
          placeholder="请输入学期"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          size="mini"
          @click.prevent="importTemplate"
          style="color: #409eff; text-decoration: none"
          >下载模版</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :on-success="handleTempSuccess"
          :limit="1"
          :headers="headers"
        >
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            v-hasPermi="['work:stuCourceSester:add']"
            >新增</el-button
          >
        </el-upload>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['work:stuCourceSester:remove']"
          >删除</el-button
        >
      </el-col>

      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="stuCourceSesterList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学生名称" align="center" prop="nickName" />
      <el-table-column label="学号" align="center" prop="studentNo" />
      <el-table-column label="学校名称" align="center" prop="schoolName" />
      <el-table-column label="课程名称" align="center" prop="courseName" />
      <el-table-column label="课程编号" align="center" prop="teacherName" />
      <el-table-column label="课程编号" align="center" prop="courseNo" />
      <el-table-column label="学期" align="center" prop="semesterId" />

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['work:stuCourceSester:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['work:stuCourceSester:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改学生选课对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学期" prop="semesterId">
          <el-input v-model="form.semesterId" placeholder="请输入学期" />
        </el-form-item>
        <el-form-item label="是否删除" prop="delFlag">
          <el-select style="width: 100%;" v-model="form.delFlag" placeholder="请选择是否删除">
            <el-option value="0" label="否"> </el-option>
            <el-option value="1" label="是"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更改关联课程" prop="courseId">
          <el-select style="width: 100%;"  v-model="form.courseId" placeholder="请选择是否删除">
            <el-option :value="i.courseId" :label="i.courseName" v-for="i in courseList" :key="i.courseId"> </el-option>
          </el-select>  
        </el-form-item>
        <!-- courseId -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listStuCourceSester,
  getStuCourceSester,
  delStuCourceSester,
  // addStuCourceSester,
  updateStuCourceSester,
} from "@/api/courseselection/courseselection.js";
import {listCourse} from '@/api/course/course'
import service from "@/utils/request.js";
import { getToken } from "@/utils/auth";
export default {
  name: "StuCourceSester",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: "",
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 学生选课表格数据
      stuCourceSesterList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      rules: {},
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        semesterId: null,
      },
      // 表单参数
      uploadUrl: service.ip + "/common/upload",
      // 表单校验
      rules: {},
      headers: { Authorization: "Bearer " + getToken() },
      courseList:[],
      form:{
        userId:null,
        courseId:null,
        delFlag:null,
        // id:null
      }
    };
  },
  created() {
    this.getList();
    listCourse().then(res=>{
      console.log(res)
       this.courseList=res.rows

    })
  },
  methods: {

    /** 查询学生选课列表 */
    getList() {
      this.loading = true;
      listStuCourceSester(this.queryParams).then((response) => {
        this.stuCourceSesterList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },

    // 表单重置
    reset() {
      // this.file
      for(let key in this.form){
        this.form[key]=null
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id).join(",");
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    importTemplate() {
      this.download(
        "/api/work/stuCourceSester/importTemplate",
        {},
        `选课模版${new Date().getTime()}.xlsx`
      );
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加学生选课";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.id || this.ids;
      getStuCourceSester(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学生选课";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
            updateStuCourceSester(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm("是否确认删除学生吗？")
        .then(function () {
          return delStuCourceSester(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */

    handleTempSuccess(e) {
      this.$msgSuccess("上传成功");
      this.getList();
    },
  },
};
</script>

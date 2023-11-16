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
      <el-form-item label="试卷名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入试卷名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="所属学校" prop="schoolName">
        <el-input
          v-model="queryParams.schoolName"
          placeholder="请输入所属学校"
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
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['course:course:add']"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['course:course:edit']"
            >修改</el-button
          >
        </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['course:course:remove']"
          >删除</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['course:course:export']"
            >导出</el-button
          >
        </el-col> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="taskList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="试卷名称" align="center" prop="name" />
      <el-table-column label="开始时间" align="center" prop="beginTime" />
      <el-table-column label="结束时间" align="center" prop="endTime" />
      <!-- <el-table-column label="每题分值" align="center" prop="titleScore" />
      <el-table-column label="教师名称" align="center" prop="teacherName" /> 
      <el-table-column label="关联章节" align="center" prop="section" />-->
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
            v-hasPermi="['course:course:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-fold"
            @click="handleGoQuestions(scope.row)"
            v-hasPermi="['course:course:edit']"
            >题库增改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['course:course:remove']"
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
    <!-- 添加或修改课程对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="试卷名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入试卷名称" />
        </el-form-item>
        <el-form-item label="试卷开始时间" prop="beginTime">
          <el-date-picker
            v-model="form.beginTime"
            style="width: 100%"
            type="datetime"
            placeholder="选择日期时间"
            :value-format="'yyyy-MM-dd HH:mm:ss'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="试卷结束时间" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            style="width: 100%"
            type="datetime"
            placeholder="选择日期时间"
            :value-format="'yyyy-MM-dd HH:mm:ss'"
          >
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="每题得分" prop="titleScore">
          <el-input v-model="form.titleScore" />
        </el-form-item>
        <el-form-item label="及格分" prop="passScore">
          <el-input v-model="form.passScore" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getExamList,
  getExamById,
  addExampaper,
  editExampaper,
  delExampaper
} from '@/api/answerFunction/emamList'
import service from '@/utils/request.js'
import { parse } from '@/utils/timeformat'

export default {
  data() {
    return {
      courseId: '',
      loading: true,
      queryParams: {
        name: null,
        taskName: null,
        courseName: null,
        teacherName: null,
        schoolName: null,
        pageNum: 1,
        pageSize: 10
      },
      ids: '',
      taskList: [],
      showSearch: true,
      multiple: false,
      rules: {
        name: [{ required: true, message: '试卷名不能为空', trigger: 'blur' }],
        beginTime: [
          { required: true, message: '试卷名不能为空', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '试卷名不能为空', trigger: 'blur' }
        ]
      },
      title: '',
      open: false,
      form: {
        name: null,
        titleScore: null,
        passScore: null
      },
      uploadUrl: service.ip + '/common/upload',
      testList: []
    }
  },
  created() {
    this.getList()
  },

  methods: {
    handleQuery() {
      this.getList()
    },
    getList() {
      this.loading = true
      getExamList({ ...this.queryParams }).then((res) => {
        this.loading = false
        this.taskList = res.rows
        this.total = res.total
        this.open = false
      })
    },
    submitForm() {
      if (this.title == '新建试卷') {
        addExampaper(this.form).then(() => {
          this.getList()
          this.$message.success('新建成功')
        })
      } else {
        editExampaper(this.form).then(() => {
          this.getList()
          this.$message.success('编辑成功')
        })
      }
    },
    handleAdd() {
      this.title = '新建试卷'
      this.open = true
      this.form = {
        name: null
      }
    },
    handleUpdate(row) {
      this.title = '编辑试卷'
      this.open = true
      this.form = row
    },
    handleDelete(row) {
      let ids = row.id || this.ids
      this.$modal
        .confirm('是否确认删除课程当前任务吗？')
        .then(function () {
          return delExampaper(ids)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id).join(',')
      this.multiple = !selection.length
    },
    //查看题库
    handleGoQuestions(row) {
      this.$router.push({
        path: 'examQuestionList',
        query: { examId: row.id }
      })
    }
  }
}
</script>

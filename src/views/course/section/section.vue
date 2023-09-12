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
      <!-- <el-form-item label="理论课试卷名" prop="examPaperName">
        <el-input
          v-model="queryParams.examPaperName"
          placeholder="请输入理论课试卷名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="任务名称" prop="courseName">
        <el-input
          v-model="queryParams.courseName"
          placeholder="请输入任务名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <!-- <el-form-item label="课程类型" prop="courseType">
        <el-select
          placeholder="请选择课程类型"
          v-model="queryParams.courseType"
          clearable
        >
          <el-option value="0" label="理论"> </el-option>
          <el-option value="1" label="视频"> </el-option>
        </el-select>
      </el-form-item> -->

      <!-- <el-form-item label="任务类型" prop="taskType">
        <el-select
          placeholder="请选择任务类型"
          v-model="queryParams.taskType"
          clearable
        >
          <el-option value="0" label="作业"> </el-option>
          <el-option value="1" label="考试"> </el-option>
        </el-select>
      </el-form-item> -->

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
      <el-table-column label="任务名称" align="center" prop="taskName" />
      <!-- <el-table-column label="课程名称" align="center" prop="courseName" /> -->
      <el-table-column label="文字描述" align="center" prop="taskDetails" />
      <!-- <el-table-column label="任务类型" align="center" prop="taskType">
        <template slot-scope="scope">
          {{ scope.row.taskType == '0' ? '作业' : '考试' }}
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="任务类型" align="center" prop="courseType">
        <template slot-scope="scope">
          {{ scope.row.courseType == '0' ? '理论' : '视频' }}
        </template>
      </el-table-column> -->
      <el-table-column label="章节视频" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.courseVideo">有（点击修改按钮查看）</div>
          <div v-else>无</div>
        </template>
      </el-table-column>
      <el-table-column label="关联试卷" align="center" prop="testPaper" />
      <el-table-column label="开始时间" align="center" prop="startTime" />
      <el-table-column label="结束时间" align="center" prop="endTime" />
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
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="form.taskName" placeholder="请输入章节任务名称" />
        </el-form-item>
        <el-form-item label="文字描述" prop="taskDetails">
          <el-input v-model="form.taskDetails" placeholder="请输入文字描述" />
        </el-form-item>
        <!-- <el-form-item label="任务类型" prop="taskType">
          <el-select
            v-model="form.taskType"
            style="width: 100%"
            placeholder="选择课程类型"
          >
            <el-option :key="0" label="作业" value="0"></el-option>
            <el-option :key="1" label="考试" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程类型" prop="courseType">
          <el-select
            v-model="form.courseType"
            style="width: 100%"
            placeholder="选择课程类型"
          >
            <el-option label="理论" value="0"></el-option>
            <el-option label="视频" value="1"></el-option>
          </el-select>
        </el-form-item> -->
        <!-- @loadedmetadata="handleLoadedMetadata" -->
        <el-form-item label="章节视频">
          <div style="display: flex">
            <video
              v-if="form.courseVideo"
              :src="form.courseVideo"
              style="margin: 0 20px 0 0"
              width="60%"
              height="auto"
              :controls="true"
              ref="videoRef"
            ></video>
            <div
              style="
                height: 40px;
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 0 10px;
              "
            >
              <!-- <div v-if="form.courseVideo" class="avatar-uploader" @click="bigVide">
<i class="el-icon-plus avatar-uploader icon" >放大</i>
</div> -->
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :on-success="handleVideoSuccess"
                :before-upload="beforeVideoUpload"
                accept="video/*"
                :limit="1"
                :headers="headers"
                :show-file-list="false"
              >
                <span>
                  {{ form.courseVideo ? '更换' : '上传' }}
                </span>
              </el-upload>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="关联试卷" prop="testPaperld">
          <el-select
            v-model="form.testPaperld"
            filterable
            placeholder="选择关联试卷"
          >
            <el-option
              v-for="dict in testPaperList"
              :key="dict.testPaperld"
              :label="dict.testPaper"
              :value="dict.testPaperld"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            style="width: 100%"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="任务结束时间" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            style="width: 100%"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCourseNumWork,
  delCourseNumWork,
  addCourseNumWork,
  updateCourseNumWork
} from '@/api/course/section'
import { getExamList } from '@/api/answerFunction/emamList'
import service from '@/utils/request.js'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      courseId: '',
      loading: true,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        examPaperName: null,
        taskName: null,
        courseType: null,
        taskType: null
      }, // 总条数
      total: 0,
      ids: '',
      taskList: [],
      showSearch: true,
      multiple: false,
      testPaperList: [],
      rules: {
        taskName: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' }
        ],
        startTime: [
          {
            required: true,
            message: '请选择开始时间',
            trigger: ['blur', 'change']
          }
        ],
        endTime: [
          {
            required: true,
            message: '请选择结束时间',
            trigger: ['blur', 'change']
          }
        ]
      },
      title: '',
      open: false,
      form: {
        taskName: null,
        taskDetails: null,
        startTime: null,
        endTime: null,
        taskType: null,
        courseType: null,
        courseVideo: null,
        examPaperId: null
      },
      uploadUrl: service.ip + '/common/upload',
      headers: { Authorization: 'Bearer ' + getToken() },
      testList: []
    }
  },
  created() {
    this.courseId = this.$route.query.courseId
    this.getList()
    this.getTaskList()
  },

  methods: {
    handleQuery() {
      this.getList()
    },
    beforeVideoUpload(file) {
      const isVideo = file.type.startsWith('video/')
      const isLt200M = file.size / 1024 / 1024 < 200

      if (!isVideo) {
        this.$message.error('只能上传视频文件!')
      }
      if (!isLt200M) {
        this.$message.error('视频文件大小不能超过 200MB!')
      }

      return isVideo && isLt200M
    },
    handleVideoSuccess(r) {
      this.form.courseVideo = r.url
    },
    getTaskList() {
      getExamList({ courseId: this.courseId }).then((res) => {
        this.testList = res.rows
      })
    },
    getList() {
      this.loading = true
      listCourseNumWork({ ...this.queryParams, courseId: this.courseId }).then(
        (res) => {
          this.loading = false
          this.taskList = res.rows
          this.total = res.total
          this.open = false
        }
      )
    },
    submitForm() {
      if (this.title == '创建章节任务') {
        addCourseNumWork({ ...this.form, courseId: this.courseId }).then(() => {
          this.$message.success('添加成功')
          this.getList()
        })
      } else {
        updateCourseNumWork({ ...this.form, courseId: this.courseId }).then(
          () => {
            this.$message.success('修改成功')
            this.getList()
          }
        )
      }
    },
    cancel() {},
    handleAdd() {
      this.title = '创建章节任务'
      this.open = true
      this.form = {
        taskName: null,
        taskDetails: null,
        courseVideo: null,
        testPaperId: null,
        startTime: null,
        endTime: null
      }
    },
    handleUpdate(row) {
      this.title = '修改章节任务'
      this.open = true
      this.form = row
    },
    handleDelete(row) {
      let ids = row.id || this.ids
      this.$modal
        .confirm('是否确认删除当前任务吗？')
        .then(function () {
          return delCourseNumWork(ids)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.courseId).join(',')
      this.multiple = !selection.length
    }
  }
}
</script>

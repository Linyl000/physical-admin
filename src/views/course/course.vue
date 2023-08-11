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
      <el-form-item label="课程编号" prop="courseNo">
        <el-input
          v-model="queryParams.courseNo"
          placeholder="请输入课程编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="课程名称" prop="courseName">
        <el-input
          v-model="queryParams.courseName"
          placeholder="请输入课程名称"
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
      <el-form-item label="教师名称" prop="teacherName">
        <el-input
          v-model="queryParams.teacherName"
          placeholder="请输入教师名称"
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['course:course:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
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
      </el-col>
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
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="courseList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="课程id" align="center" prop="courseId" /> -->
      <el-table-column label="课程编号" align="center" prop="courseNo" />
      <el-table-column label="课程名称" align="center" prop="courseName" />
      <el-table-column label="所属学校" align="center" prop="schoolName" />
      <el-table-column label="任课教师" align="center" prop="teacherName" />
      <el-table-column label="课程介绍" align="center" prop="courseIntroduce" />
      <el-table-column label="课程视频" align="center" prop="courseVideo">
        <template slot-scope="scope">
          <video
            :src="scope.row.courseVideo"
            width="100%"
            height="auto"
            :controls="false"
          ></video> </template
      ></el-table-column>
      <!-- <el-table-column label="课程Json" align="center" prop="courseJson" /> -->
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
            icon="el-icon-files"
            @click="handleGoSection(scope.row)"
            v-hasPermi="['course:course:edit']"
            >查看章节</el-button
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
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="课程编号" prop="courseNo">
          <el-input v-model="form.courseNo" placeholder="请输入课程编号" />
        </el-form-item>
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="form.courseName" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="学校名称" prop="schoolId">
          <el-select
            v-model="form.schoolId"
            filterable
            placeholder="选择课程所属学校"
            @change="listTeacher"
          >
            <el-option
              v-for="dict in schoolList"
              :key="dict.schoolId"
              :label="dict.deptName"
              :value="dict.schoolId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教师名称" prop="teacherId">
          <el-select
            v-model="form.teacherId"
            filterable
            placeholder="选择课程教师"
          >
            <el-option
              v-for="dict in teacherList"
              :key="dict.teacherId"
              :label="dict.userName"
              :value="dict.teacherId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程介绍" prop="courseIntroduce">
          <el-input
            type="textarea"
            autosize
            v-model="form.courseIntroduce"
            placeholder="请输入课程介绍"
          />
        </el-form-item>
        <el-form-item label="课程视频" prop="courseVideo">
          <div style="display: flex">
            <video
              v-if="form.courseVideo"
              :src="form.courseVideo"
              width="80%"
              height="auto"
              :controls="true"
              ref="videoRef"
              @loadedmetadata="handleLoadedMetadata"
            ></video>
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 20%;
              "
            >
              <!-- <div v-if="form.courseVideo" class="avatar-uploader" @click="bigVideo">
                <i class="el-icon-plus avatar-uploader-icon">放大</i>
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
                <i class="el-icon-refresh avatar-uploader-icon">{{
                  form.courseVideo ? '更换' : '上传'
                }}</i>
              </el-upload>
            </div>
          </div>
        </el-form-item>
        <!-- <el-form-item label="课程Json" prop="courseJson">
          <el-input
            v-model="form.courseJson"
            type="textarea"
            placeholder="请输入课程Json"
          />
        </el-form-item> -->
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
  listCourse,
  getCourse,
  delCourse,
  addCourse,
  updateCourse,
  listSchool,
  listTeacher
} from '@/api/course/course'
import service from '@/utils/request.js'
import { getToken } from '@/utils/auth'

export default {
  name: 'Course',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 课程表格数据
      courseList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        schoolName: null,
        courseNo: null,
        courseName: null,
        teacherName: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        courseNo: [
          { required: true, message: '课程编号不能为空', trigger: 'blur' }
        ],
        courseName: [
          { required: true, message: '课程名称不能为空', trigger: 'blur' }
        ],
        schoolId: [
          {
            required: true,
            message: '学校名称不能为空',
            trigger: ['blur', 'change']
          }
        ],
        teacherId: [
          {
            required: true,
            message: '教师名称不能为空',
            trigger: ['blur', 'change']
          }
        ]
      },
      uploadUrl: service.ip + '/common/upload',
      //上传额外参数
      headers: { Authorization: 'Bearer ' + getToken() },
      //学校和教师列表
      schoolList: [],
      teacherList: []
    }
  },
  created() {
    this.getList()
    this.listSchool()
    this.listTeacher()
  },
  methods: {
    //学校
    listSchool() {
      listSchool().then((res) => {
        this.schoolList = res.data.map((item) => {
          return { ...item, schoolId: item.deptId }
        })
      })
      if (this.form.schoolId) {
        this.listTeacher()
      }
    },
    //老师
    listTeacher() {
      listTeacher({ deptId: this.form.schoolId }).then((res) => {
        this.teacherList = res.data.map((item) => {
          return { ...item, teacherId: item.userId }
        })
      })
    },
    //上传视频
    handleVideoSuccess(response, file) {
      // 上传视频成功后的处理逻辑
      console.log(response)
      console.log(file)
      this.form.courseVideo = response.url // 重置预览图片地址
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
    handleLoadedMetadata() {
      const videoElement = this.$refs.videoRef
      this.form.allTime = videoElement.duration // 视频总时长（以秒为单位）
    },
    bigVideo() {},
    /** 查询课程列表 */
    getList() {
      this.loading = true
      listCourse(this.queryParams).then((response) => {
        this.courseList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        courseId: null,
        courseName: null,
        courseNo: null,
        courseVideo: null,
        schoolId: null,
        teacherId: null,
        courseIntroduce: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.courseId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加课程'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.courseId || this.ids
      getCourse(id).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改课程'
      })
    },
    //查看课程章节
    handleGoSection(row) {
      this.$router.push({ name: 'section', params: { courseId: row.courseId } })
      // window.location.href = '/section'
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.courseId != null) {
            updateCourse(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addCourse(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.courseId || this.ids
      this.$modal
        .confirm('是否确认删除课程编号为"' + ids + '"的数据项？')
        .then(function () {
          return delCourse(ids)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'course/course/export',
        {
          ...this.queryParams
        },
        `course_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>

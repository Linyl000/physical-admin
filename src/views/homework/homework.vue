<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="82px"
    >
      <!-- <el-form-item
        label="学校名称（根据学校id显示查询【仅管理员可见】）"
        prop="studentNo"
      >
        <el-input
          v-model="queryParams.studentNo"
          placeholder="请输入学校名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="学院名称（查询学校后根据学院id显示查询）"
        prop="studentNo"
      >
        <el-input
          v-model="queryParams.studentNo"
          placeholder="请输入学院名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="任课教师（查询学院后根据老师id显示查询）"
        prop="studentNo"
      >
        <el-input
          v-model="queryParams.studentNo"
          placeholder="请输入任课教师名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="课程id(预留名称列表)" prop="courseWorkId">
        <el-input
          v-model="queryParams.courseWorkId"
          placeholder="请输入课程名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="课程作业id(预留名称列表)" prop="courseWorkId">
        <el-input
          v-model="queryParams.courseWorkId"
          placeholder="请输入课程作业名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学生学号" prop="studentNo">
        <el-input
          v-model="queryParams.studentNo"
          placeholder="请输入学生学号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="完成状态" prop="finishStatus">
        <el-select
          v-model="queryParams.finishStatus"
          placeholder="完成状态"
          clearable
          style="width: 220px"
        >
          <el-option
            v-for="dict in finishList"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="识别状态" prop="identificationStatus">
        <el-select
          v-model="queryParams.identificationStatus"
          placeholder="识别状态"
          clearable
          style="width: 220px"
        >
          <el-option
            v-for="dict in identificationList"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['studentwork:studentwork:add']"
          >新增</el-button
        >
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['studentwork:studentwork:edit']"
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
          v-hasPermi="['studentwork:studentwork:remove']"
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
          v-hasPermi="['studentwork:studentwork:export']"
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
      :data="studentworkList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学生作业id" align="center" prop="id" />
      <el-table-column label="课程id" align="center" prop="courseId" />
      <el-table-column label="课程作业id" align="center" prop="courseWorkId" />
      <el-table-column label="任课教师id" align="center" prop="teacherId" />
      <el-table-column label="学生id" align="center" prop="studentId" />
      <el-table-column label="视频地址" align="center" prop="workVideo">
        <template slot-scope="scope">
          <video
            :src="scope.row.workVideo"
            width="100%"
            height="auto"
            :controls="false"
          ></video> </template
      ></el-table-column>
      <!-- <el-table-column
        label="学生作业json"
        align="center"
        prop="demonstrationVideo"
      /> -->
      <el-table-column label="作业成绩" align="center" prop="workScore" />
      <el-table-column label="作业建议" align="center" prop="wordSuggest" />
      <!-- <el-table-column label="文件识别码" align="center" prop="fileMd5" /> -->
      <!-- <el-table-column
        label="${comment}"
        align="center"
        prop="creatTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.creatTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="完成状态" align="center" prop="finishStatus">
        <template slot-scope="scope">
          <span
            v-if="scope.row.finishStatus === '1'"
            style="color: rgba(255, 0, 0, 0.658)"
            >未完成</span
          >
          <span
            v-else-if="scope.row.finishStatus === '2'"
            style="color: rgb(44, 190, 44)"
            >已完成</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="识别状态"
        align="center"
        prop="identificationStatus"
        ><template slot-scope="scope">
          <span
            v-if="scope.row.identificationStatus === '1'"
            style="color: rgba(255, 0, 0, 0.658)"
            >正在识别</span
          >
          <span
            v-else-if="scope.row.identificationStatus === '2'"
            style="color: rgb(44, 190, 44)"
            >已识别</span
          >
        </template></el-table-column
      >
      <!-- <el-table-column label="类型" align="center" prop="type" /> -->
      <el-table-column label="总时长(秒)" align="center" prop="allTime" />
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
            v-hasPermi="['studentwork:studentwork:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['studentwork:studentwork:remove']"
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

    <!-- 添加或修改学生作业记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item v-if="form.id" label="学生作业id" prop="courseWorkId">
          <el-input
            v-model="form.id"
            placeholder="请输入学生作业id"
            :disabled="title == '添加学生作业记录' ? false : true"
          />
        </el-form-item>
        <el-form-item label="课程id" prop="courseId">
          <el-input
            v-model="form.courseId"
            placeholder="请输入课程id"
            :disabled="title == '添加学生作业记录' ? false : true"
          />
        </el-form-item>
        <el-form-item label="课程作业id" prop="courseWorkId">
          <el-input
            v-model="form.courseWorkId"
            placeholder="请输入课程作业id"
            :disabled="title == '添加学生作业记录' ? false : true"
          />
        </el-form-item>
        <el-form-item label="任课教师id" prop="teacherId">
          <el-input
            v-model="form.teacherId"
            placeholder="请输入任课教师id"
            :disabled="title == '添加学生作业记录' ? false : true"
          />
        </el-form-item>
        <el-form-item label="学生id" prop="studentId">
          <el-input
            v-model="form.studentId"
            placeholder="请输入学生id"
            :disabled="title == '添加学生作业记录' ? false : true"
          />
        </el-form-item>
        <el-form-item label="作业视频" prop="workVideo">
          <div style="display: flex">
            <video
              v-if="form.workVideo"
              :src="form.workVideo"
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
              <!-- <div v-if="form.workVideo" class="avatar-uploader" @click="bigVideo">
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
                  form.workVideo ? '更换' : '上传'
                }}</i>
              </el-upload>
            </div>
          </div>
        </el-form-item>
        <!-- <el-form-item label="视频json" prop="demonstrationVideo">
          <el-input
            v-model="form.demonstrationVideo"
            placeholder="请输入视频json"
          />
        </el-form-item> -->
        <el-form-item label="作业成绩" prop="workScore">
          <el-input v-model="form.workScore" placeholder="请输入作业分数" />
        </el-form-item>
        <el-form-item label="作业建议" prop="wordSuggest">
          <el-input v-model="form.wordSuggest" placeholder="请输入作业建议" />
        </el-form-item>
        <!-- <el-form-item label="文件识别码" prop="fileMd5">
          <el-input v-model="form.fileMd5" placeholder="请输入文件识别码" />
        </el-form-item> -->
        <!-- <el-form-item label="${comment}" prop="creatTime">
          <el-date-picker
            clearable
            v-model="form.creatTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择${comment}"
          >
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="完成状态" prop="finishStatus">
          <el-select
            v-model="form.finishStatus"
            placeholder="完成状态"
            clearable
            style="width: 220px"
            :disabled="title == '添加学生作业记录' ? false : true"
          >
            <el-option
              v-for="dict in finishList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="识别状态" prop="identificationStatus">
          <el-select
            v-model="form.identificationStatus"
            placeholder="识别状态"
            clearable
            style="width: 220px"
            :disabled="title == '添加学生作业记录' ? false : true"
          >
            <el-option
              v-for="dict in identificationList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="类型" prop="type">
          <el-input v-model="form.type" placeholder="请输入类型" />
        </el-form-item> -->
        <!-- <el-form-item label="总时长" prop="allTime">
          <el-input
            v-model="form.allTime"
            placeholder="请输入总时长"
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
  listStudentwork,
  getStudentwork,
  delStudentwork,
  addStudentwork,
  updateStudentwork
} from '@/api/homework/homework'
import service from '@/utils/request.js'
import { getToken } from '@/utils/auth'
export default {
  name: 'homework',
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
      // 学生作业记录表格数据
      studentworkList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        studentNo: '',
        finishStatus: '',
        identificationStatus: '',
        courseWorkId: ''
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      finishList: [
        { value: '1', label: '未完成' },
        { value: '2', label: '已完成' }
      ],
      identificationList: [
        { value: '1', label: '正在识别' },
        { value: '2', label: '已识别' }
      ],
      uploadUrl: service.ip + '/common/upload',
      //上传额外参数
      headers: { Authorization: 'Bearer ' + getToken() }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    //上传视频
    handleVideoSuccess(response, file) {
      // 上传视频成功后的处理逻辑
      console.log(response)
      console.log(file)
      this.form.workVideo = response.url // 重置预览图片地址
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
    /** 查询学生作业记录列表 */
    getList() {
      this.loading = true
      listStudentwork(this.queryParams).then((response) => {
        this.studentworkList = response.rows
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
        id: null,
        workVideo: null,
        courseWorkId: null,
        demonstrationVideo: null,
        workScore: null,
        wordSuggest: null,
        ropeSkippingNum: null,
        fileMd5: null,
        studentId: null,
        creatTime: null,
        updateTime: null,
        finishStatus: '0',
        identificationStatus: '0',
        type: null,
        allTime: null,
        teacherId: null,
        courseId: null
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
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加学生作业记录'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getStudentwork(id).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改学生作业记录'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateStudentwork(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addStudentwork(this.form).then((response) => {
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
      const ids = row.id || this.ids
      this.$modal
        .confirm('是否确认删除学生作业记录编号为"' + ids + '"的数据项？')
        .then(function () {
          return delStudentwork(ids)
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
        'studentwork/studentwork/export',
        {
          ...this.queryParams
        },
        `studentwork_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .avatar-uploader {
  padding: 0px 5px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 10px;
}
</style>

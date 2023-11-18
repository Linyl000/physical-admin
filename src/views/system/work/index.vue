<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="90px"
    >
      <el-form-item label="任务作业名称" prop="taskId">
        <el-input
          v-model="queryParams.taskId"
          placeholder="请输入任务作业名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作业分数" prop="workScore">
        <el-input
          v-model="queryParams.workScore"
          placeholder="请输入作业分数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="作业建议" prop="wordSuggest">
        <el-input
          v-model="queryParams.wordSuggest"
          placeholder="请输入作业建议"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="学生学号" prop="studentId">
        <el-input
          v-model="queryParams.studentId"
          placeholder="请输入学生学号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学生姓名" prop="studentId">
        <el-input
          v-model="queryParams.studentId"
          placeholder="请输入学生姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="完成状态 " prop="finishStatus">
        <el-select
          v-model="queryParams.finishStatus"
          placeholder="请选择完成状态 "
          clearable
        >
          <el-option
            v-for="dict in dict.type.sys_job_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="总时长" prop="allTime">
        <el-input
          v-model="queryParams.allTime"
          placeholder="请输入总时长"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="beginTime">
        <el-date-picker
          clearable
          v-model="queryParams.beginTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择开始时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          clearable
          v-model="queryParams.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择结束时间"
        >
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="0:理论    1:视频" prop="courseType">
        <el-select
          v-model="queryParams.courseType"
          placeholder="请选择0:理论    1:视频"
          clearable
        >
          <el-option
            v-for="dict in dict.type.course_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
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
          v-hasPermi="['system:work:add']"
        >新增</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:work:edit']"
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
          v-hasPermi="['system:work:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:work:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="workList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="" align="center" prop="id" />
      <el-table-column label="作业上传视频" align="center" prop="workVideo" />
      <el-table-column label="任务作业id" align="center" prop="taskId" />
      <el-table-column label="作业分数" align="center" prop="workScore" />
      <el-table-column label="作业建议" align="center" prop="wordSuggest" />
      <el-table-column label="学生id" align="center" prop="studentId" />
      <el-table-column label="完成状态 " align="center" prop="finishStatus">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_job_status"
            :value="scope.row.finishStatus"
          />
        </template>
      </el-table-column>
      <el-table-column label="" align="center" prop="identificationStatus" />
      <el-table-column label="状态" align="center" prop="taskType" />
      <el-table-column label="总时长" align="center" prop="allTime" />
      <el-table-column
        label="开始时间"
        align="center"
        prop="beginTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.beginTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="结束时间"
        align="center"
        prop="endTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="0:理论    1:视频"
        align="center"
        prop="courseType"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.course_type"
            :value="scope.row.courseType"
          />
        </template>
      </el-table-column> -->
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
            v-hasPermi="['system:work:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:work:remove']"
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

    <!-- 添加或修改学生作业对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="作业上传视频" prop="workVideo">
          <el-input
            v-model="form.workVideo"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="任务作业id" prop="taskId">
          <el-input v-model="form.taskId" placeholder="请输入任务作业id" />
        </el-form-item>
        <el-form-item label="作业分数" prop="workScore">
          <el-input v-model="form.workScore" placeholder="请输入作业分数" />
        </el-form-item>
        <el-form-item label="作业建议" prop="wordSuggest">
          <el-input v-model="form.wordSuggest" placeholder="请输入作业建议" />
        </el-form-item>
        <el-form-item label="学生id" prop="studentId">
          <el-input v-model="form.studentId" placeholder="请输入学生id" />
        </el-form-item>
        <el-form-item label="完成状态 ">
          <el-radio-group v-model="form.finishStatus">
            <el-radio
              v-for="dict in dict.type.sys_job_status"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="总时长" prop="allTime">
          <el-input v-model="form.allTime" placeholder="请输入总时长" />
        </el-form-item>
        <el-form-item label="开始时间" prop="beginTime">
          <el-date-picker
            clearable
            v-model="form.beginTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择开始时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            clearable
            v-model="form.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间"
          >
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="0:理论    1:视频" prop="courseType">
          <el-select
            v-model="form.courseType"
            placeholder="请选择0:理论    1:视频"
          >
            <el-option
              v-for="dict in dict.type.course_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
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
  listWork,
  getWork,
  delWork,
  addWork,
  updateWork
} from '@/api/system/work'

export default {
  name: 'Work',
  dicts: ['course_type', 'sys_job_status'],
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
      // 学生作业表格数据
      workList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        workVideo: null,
        taskId: null,
        workScore: null,
        wordSuggest: null,
        studentId: null,
        finishStatus: null,
        identificationStatus: null,
        taskType: null,
        allTime: null,
        beginTime: null,
        endTime: null,
        courseType: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询学生作业列表 */
    getList() {
      this.loading = true
      listWork(this.queryParams).then((response) => {
        this.workList = response.rows
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
        taskId: null,
        workScore: null,
        wordSuggest: null,
        studentId: null,
        createTime: null,
        updateTime: null,
        finishStatus: '0',
        identificationStatus: '0',
        taskType: null,
        allTime: null,
        beginTime: null,
        endTime: null,
        courseType: null,
        delFlag: null
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
      this.title = '添加学生作业'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getWork(id).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改学生作业'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateWork(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addWork(this.form).then((response) => {
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
        .confirm('是否确认删除学生作业编号为"' + ids + '"的数据项？')
        .then(function () {
          return delWork(ids)
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
        'system/work/export',
        {
          ...this.queryParams
        },
        `work_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>

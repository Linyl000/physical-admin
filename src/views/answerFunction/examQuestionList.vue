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
      <el-form-item label="试卷名称" prop="examPaperName">
        <el-input
          v-model="queryParams.examPaperName"
          placeholder="请输入试卷名称"
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
      <el-table-column label="题目" align="center" prop="titleContent" />
      <el-table-column label="选项A" align="center" prop="optionA" />
      <el-table-column label="选项B" align="center" prop="optionB" />
      <el-table-column label="选项C" align="center" prop="optionC" />
      <el-table-column label="选项D" align="center" prop="optionC" />
      <el-table-column label="试卷名" align="center" prop="examPaperName" />
      <el-table-column label="答案" align="center" prop="answer" />
      <el-table-column label="答案解析" align="center" prop="analysis" />

      <!-- analysis -->
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
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['course:course:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改课程对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="题目内容" prop="titleContent">
          <el-input
            type="textarea"
            v-model="form.titleContent"
            placeholder="请输入课程编号"
          />
        </el-form-item>
        <el-form-item label="选择关联试卷" prop="examPaperId">
          <el-select v-model="form.examPaperId">
            <el-option
              v-for="i in paperList"
              :key="i.id"
              :value="JSON.stringify(i.id)"
              :label="i.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选项A" prop="optionA">
          <el-input v-model="form.optionA" />
        </el-form-item>
        <el-form-item label="选项B" prop="optionB">
          <el-input v-model="form.optionB" />
        </el-form-item>
        <el-form-item label="选项C" prop="optionC">
          <el-input v-model="form.optionC" />
        </el-form-item>
        <el-form-item label="选项D" prop="optionD">
          <el-input v-model="form.optionD" />
        </el-form-item>
        <el-form-item label="答案解析" prop="analysis">
          <el-input v-model="form.analysis" />
        </el-form-item>
        <!-- analysis -->
        <el-form-item label="答案" prop="answer">
          <el-select v-model="form.answer">
            <el-option value="A" label="选项A" />
          <el-option value="C" label="选项B" />
          <el-option value="C" label="选项C" />
          <el-option value="D" label="选项D" />
          </el-select>
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
  getTitleList,
  getTitleById,
  addTitlepaper,
  editTitlepaper,
  delTitlepaper,
} from "@/api/answerFunction/questionList";
import { getExamList } from "@/api/answerFunction/emamList";
import service from "@/utils/request.js";
import { parse } from "@/utils/timeformat";
function deepclone(obj) {
  let li = {};
  if (typeof obj === "object" && obj !== null) {
    for (let key in obj) {
      li[key] = deepclone(obj[key]);
    }
    return li;
  } else {
    return obj;
  }
}

export default {
  data() {
    return {
      courseId: "",
      loading: true,
      queryParams: {
        examPaperName: null,
      },
      ids: "",
      taskList: [],
      showSearch: true,
      multiple: false,
      rules: {
        taskName: [
          { required: true, message: "任务名被你为空", trigger: "blur" },
        ],
        beginTime: [
          {
            required: true,
            message: "请选择结束时间",
            trigger: ["blur", "change"],
          },
        ],
        endTime: [
          {
            required: true,
            message: "请选择结束时间",
            trigger: ["blur", "change"],
          },
        ],
        titleScore: [
          { required: true, message: "任务名被你为空", trigger: "blur" },
        ],
        passScore: [
          { required: true, message: "任务名被你为空", trigger: "blur" },
        ],
      },
      title: "",
      open: false,
      form: {
        titleContent: null,
        optionA: null,
        optionB: null,
        optionC: null,
        optionD: null,
        answer: null,
        analysis: null,
        examPaperId: null,
      },
      tempform: {
        titleContent: null,
        optionA: null,
        optionB: null,
        optionC: null,
        optionD: null,
        analysis: null,
        answer: null,
        examPaperId: null,
      },
      uploadUrl: service.ip + "/common/upload",
      testList: [],
      paperList: [],
    };
  },
  created() {
    this.getList();
    getExamList().then(({ rows }) => {
      this.paperList = rows;
    });
  },

  methods: {
    handleQuery() {
      this.getList();
    },
    //   getPaperList(){
    //     getExamList
    //   },
    getList() {
      this.loading = true;
      getTitleList({ ...this.queryParams }).then((res) => {
        this.loading = false;
        this.taskList = res.rows;
        this.open = false;
      });
    },
    submitForm() {
      this.form.beginTime = parse(this.form.beginTime);
      this.form.endTime = parse(this.form.endTime);
      if (this.title == "新建试卷") {
        addTitlepaper(this.form).then(() => {
          this.getList();
          this.$message.success("新建成功");
        });
      } else {
        editTitlepaper(this.form).then(() => {
          this.getList();
          this.$message.success("编辑成功");
        });
      }
      console.log(this.form);
    },
    handleAdd() {
      this.title = "新建试卷";
      this.open = true;
      for (let key in this.form) {
        this.form[key] = null;
      }
    },
    handleUpdate(row) {
      this.title = "编辑试卷";
      this.open = true;
      let arow = deepclone(row);
      this.form = arow;
      this.form.id = arow.id;
    },
    handleDelete(row) {
      let ids = row.id || this.ids;
      this.$modal
        .confirm("是否确认删除课程当前任务吗？")
        .then(function () {
          return delTitlepaper(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id).join(",");
      this.multiple = !selection.length;
    },
  },
};
</script>

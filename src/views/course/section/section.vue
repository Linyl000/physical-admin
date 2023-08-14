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
      <el-form-item label="理论课试卷名" prop="examPaperName">
        <el-input
          v-model="queryParams.examPaperName"
          placeholder="请输入理论课试卷名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务名称" prop="courseName">
        <el-input
          v-model="queryParams.courseName"
          placeholder="请输入任务名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="课程类型" prop="courseType">
        <el-select
          placeholder="请选择课程类型"
          v-model="queryParams.courseType"
          clearable
        >
          <el-option value="0" label="理论"> </el-option>
          <el-option value="1" label="视频"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="任务类型" prop="taskType">
        <el-select
          placeholder="请选择任务类型"
          v-model="queryParams.taskType"
          clearable
        >
          <el-option value="0" label="作业"> </el-option>
          <el-option value="1" label="考试"> </el-option>
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
      <!-- <el-table-column label="课程id" align="center" prop="courseId" /> -->
      <el-table-column label="任务名称" align="center" prop="taskName" />
      <el-table-column label="课程名称" align="center" prop="courseName" />
      <el-table-column label="开始时间" align="center" prop="startTime" />
      <el-table-column label="结束时间" align="center" prop="endTime" />
      <el-table-column label="任务详情" align="center" prop="taskDetails" />
      <el-table-column label="任务类型" align="center" prop="taskType">
        <template slot-scope="scope">
          {{ scope.row.taskType == "0" ? "作业" : "考试" }}
        </template>
      </el-table-column>
      <el-table-column label="课程类型" align="center" prop="courseType">
        <template slot-scope="scope">
          {{ scope.row.courseType == "0" ? "理论" : "视频" }}
        </template>
      </el-table-column>
      <el-table-column label="任务内容" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.courseType == '0'">
            {{ scope.row.examPaperName?scope.row.examPaperName:"未选中试卷" }}
          </div>
          <div v-else>
            <div v-if="scope.row.courseType == '1'">
              <video
              v-if="scope.row.courseVideo"
                :src="scope.row.courseVideo"
                controls
                width="100px"
                height="100px"
              ></video>
              <div v-else>
                未上传视频
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
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
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="form.taskName" placeholder="请输入课程编号" />
        </el-form-item>
        <el-form-item label="任务详情" prop="taskDetails">
          <el-input v-model="form.taskDetails" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="任务开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            style="width: 100%;"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="任务结束时间" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            style="width: 100%;"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
         <el-form-item label="任务类型" prop="taskType">
          <el-select
            v-model="form.taskType"
            style="width: 100%;"
            placeholder="选择课程类型"
          >
            <el-option
              :key="0"
              label="作业"
              value="0"
            ></el-option>
            <el-option
              :key="1"
              label="考试"
              value="1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程类型" prop="courseType">
          <el-select
            v-model="form.courseType"
            style="width: 100%;"
            placeholder="选择课程类型"
          >
            <el-option
              label="理论"
              value="0"
            ></el-option>
            <el-option
              label="视频"
              value="1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务内容" >
           <div v-show="form.courseType=='0'">
            <el-select
            style="width: 100%;"
            v-model="form.examPaperId"
            placeholder="选择课程类型"
          >
            <el-option
              v-for="i in testList"
              :key="i.id"
              :label="i.name"
              :value="i.id"
            ></el-option>
          </el-select>
           </div>
           <div v-show="form.courseType=='1'">
            <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :on-success="handleVideoSuccess"
                :limit="1"
                :headers="headers"
              >
                <el-button type="primary" >选择视频</el-button>
              </el-upload>   
           </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCourseNumWork, delCourseNumWork ,addCourseNumWork,updateCourseNumWork} from "@/api/course/section";
import { getExamList} from '@/api/answerFunction/emamList'
import service from "@/utils/request.js";
import { getToken } from "@/utils/auth";
function deepclone(obj){
   let li={} 
  if(typeof obj==='object' && obj!==null){
        for(let key in obj){
          li[key]=deepclone(obj[key])
        }
        return li
   }else{
    return obj
   }
}

export default {
  data() {
    return {
      courseId: "",
      loading: true,
      queryParams: {
        examPaperName: null,
        taskName: null,
        courseType: null,
        taskType: null,
      },
      ids: "",
      taskList: [],
      showSearch: true,
      multiple: false,
      rules: {
        taskName: [
          { required: true, message: "任务名被你为空", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "请选择开始时间",  trigger: ["blur", "change"], },
        ],
        endTime: [
          {
            required: true,
            message: "请选择结束时间",
            trigger: ["blur", "change"],
          },
        ],
      },
      title: "",
      open: false,
      form: {
        taskName :null,
        taskDetails :null,
        startTime :null,
        endTime :null,
        taskType :null,
        courseType:null,
        courseVideo:null,
        examPaperId:null,
      },
      uploadUrl: service.ip + '/common/upload',
      headers: { Authorization: 'Bearer ' + getToken() },
    testList:[]
    };
  },
  created() {
    this.courseId = this.$route.query.courseId;
    this.getList();
    this.getTaskList();
  },

  methods: {
    handleQuery() {
      this.getList();
    },
    handleVideoSuccess(r){
    this.form.courseVideo=r.url
    },
    getTaskList(){
      getExamList({courseId:this.courseId}).then(res=>{
             this.testList=res.rows
      })
    },
    getList() {
      this.loading = true;
      listCourseNumWork({ ...this.queryParams, courseId: this.courseId }).then(
        (res) => {
          this.loading = false;
          this.taskList = res.rows;
          this.open=false
        }
      );
    },
    submitForm(){
      if(this.title=='创建课程任务'){
        addCourseNumWork({...this.form,courseId:this.courseId}).then(()=>{
         this.$message.success('添加成功')
         this.getList()
      })
      }else{
        updateCourseNumWork({...this.form,courseId:this.courseId}).then(()=>{
         this.$message.success('修改成功')
         this.getList()
      })
      }
      
    },
    cancel(){

    },
    handleAdd() {
      this.title = "创建课程任务";
      this.open = true;
    for(let key in this.form){
      this.form[key]=null
    }
    },
    handleUpdate(row) {
      this.title = "修改课程任务";
      this.open = true;
      this.form =deepclone(row);
    },
    handleDelete(row) {
      let ids = row.id || this.ids;
        this.$modal
          .confirm("是否确认删除课程当前任务吗？")
          .then(function () {
            return delCourseNumWork(ids);
          })
          .then(() => {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          })
          .catch(() => {});
   
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.courseId).join(",");
      this.multiple = !selection.length;
    },
  },
};
</script>

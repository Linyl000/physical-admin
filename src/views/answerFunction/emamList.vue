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
        <el-form-item label="作业任务名称" prop="taskName">
          <el-input
            v-model="queryParams.taskName"
            placeholder="请输入作业任务名称"
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
        <el-form-item label="学校名称" prop="schoolName">
          <el-input
            v-model="queryParams.schoolName"
            placeholder="请输入学校名称"
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
        <el-table-column label="课程名" align="center" prop="courseName" />
        <el-table-column label="课程类型" align="center" prop="courseType"/>
        <el-table-column label="每题分值" align="center" prop="titleScore" />
        <el-table-column label="教师名称" align="center" prop="teacherName" />


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
          <el-form-item label="试卷标题" prop="name">
            <el-input v-model="form.name" placeholder="请输入课程编号" />
          </el-form-item>
          <!-- <el-form-item label="试卷开始时间" prop="beginTime">
            <el-date-picker
              v-model="form.beginTime"
              style="width: 100%;"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="试卷结束时间" prop="endTime">
            <el-date-picker
              v-model="form.endTime"
              style="width: 100%;"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item> -->
           <el-form-item label="每题得分" prop="titleScore">
          <el-input v-model="form.titleScore" />
          </el-form-item>
          <el-form-item label="及格分" prop="passScore">
          <el-input v-model="form.passScore" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { getExamList, getExamById ,addExampaper,editExampaper,delExampaper} from "@/api/answerFunction/emamList";
  import service from "@/utils/request.js";
  import {parse} from '@/utils/timeformat'
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
            name: null,
            taskName: null,
            courseName: null,
            teacherName: null,
            schoolName: null,

        },
        ids: "",
        taskList: [],
        showSearch: true,
        multiple: false,
        rules: {
          taskName: [
            { required: true, message: "任务名被你为空", trigger: "blur" },
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
            name: null,
            titleScore: null,
            passScore: null,
        },
        tempform: {
            name: null,
            titleScore: null,
            passScore: null,
        },
        uploadUrl: service.ip + '/common/upload',
      testList:[]
      };
    },
    created() {
      this.getList();
    },
  
    methods: {
      handleQuery() {
        this.getList();
      },
      getList() {
        this.loading = true;
        getExamList({ ...this.queryParams }).then(
          (res) => {
            this.loading = false;
            this.taskList = res.rows;
            this.open=false
          }
        );
      },
      submitForm(){
        if(this.title=='新建试卷'){
            addExampaper(this.form).then(()=>{
                 this.getList()
                 this.$message.success('新建成功')
            })
        }else{
            editExampaper(this.form).then(()=>{
                 this.getList()
                 this.$message.success('编辑成功')
            })
        }
            console.log(this.form)
      },
      handleAdd() {
        this.title = "新建试卷";
        this.open = true;
      for(let key in this.form){
        this.form[key]=null
      }
      },
      handleUpdate(row) {
        console.log(row)
        this.title = "编辑试卷";
        this.open = true;
        let arow =deepclone(row);
        this.form=arow
        console.log(arow)
        this.form.id=arow.id
      },
      handleDelete(row) {
        let ids = row.id || this.ids;
          this.$modal
            .confirm("是否确认删除课程当前任务吗？")
            .then(function () {
              return delExampaper(ids);
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
  
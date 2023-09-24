<template>
  <div class="pages">
    <el-form
      ref="modelForm"
      :rule="rules"
      :model="modelForm"
      label-position="right"
      label-width="100px"
    >
      <!-- 可拖拽 -->
      <!-- <vuedraggable
        v-model="modelForm.topic"
        class="wrapper"
        @end="end"
      > -->
      <div v-for="(item, index) in modelForm.topic" :key="index">
        <el-collapse v-model="activeNames">
          <el-collapse-item :name="index">
            <template slot="title">
              <div
                style="
                  margin-left: 22px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
              >
                第{{ index + 1 }}题，题目：{{ item.titleContent }}
              </div>
            </template>
            <!-- 题目 -->
            <el-form-item
              :prop="`topic.${index}.titleType`"
              :label="`题目${index + 1}类型`"
              :rules="{
                required: true,
                message: '请选择题目类型',
                trigger: 'change'
              }"
            >
              <el-radio-group
                v-model="item.titleType"
                @change="changeQuestion(index)"
              >
                <el-radio label="0">单选题</el-radio>
                <el-radio label="1">多选题</el-radio>
                <el-radio label="2">判断题</el-radio>
                <el-radio label="3">视频题</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 标题 -->
            <el-form-item
              :prop="`topic.${index}.titleContent`"
              label="题目"
              :rules="{
                required: true,
                message: '请填写题目',
                trigger: 'change'
              }"
            >
              <el-input
                v-model.trim="item.titleContent"
                style="width: 258px"
                type="textarea"
                clearable
                placeholder="请填写题目"
                :autosize="{ minRows: 2 }"
              />
            </el-form-item>
            <!-- 分值 -->
            <el-form-item
              :prop="`topic.${index}.titleScore`"
              label="分值"
              :rules="{
                required: true,
                message: '请填写分值',
                trigger: 'change'
              }"
            >
              <el-input
                v-model.trim="item.titleScore"
                style="width: 258px"
                clearable
                placeholder="请填写分值"
              />
            </el-form-item>

            <!-- 单/多选择 -->

            <el-form-item
              v-if="
                modelForm.topic[index].titleType === '0' ||
                modelForm.topic[index].titleType === '1'
              "
              :prop="`topic.${index}.optionA`"
              label="A选项"
              :rules="{
                required: true,
                message: '请填写A选项',
                trigger: 'change'
              }"
            >
              <el-input
                v-model.trim="item.optionA"
                style="width: 258px"
                clearable
                placeholder="请填写A选项"
              />
            </el-form-item>
            <el-form-item
              v-if="
                modelForm.topic[index].titleType === '0' ||
                modelForm.topic[index].titleType === '1'
              "
              :prop="`topic.${index}.optionB`"
              label="B选项"
              :rules="{
                required: true,
                message: '请填写B选项',
                trigger: 'change'
              }"
            >
              <el-input
                v-model.trim="item.optionB"
                style="width: 258px"
                clearable
                placeholder="请填写B选项"
              />
            </el-form-item>
            <el-form-item
              v-if="
                modelForm.topic[index].titleType === '0' ||
                modelForm.topic[index].titleType === '1'
              "
              :prop="`topic.${index}.optionC`"
              label="C选项"
              :rules="{
                required: true,
                message: '请填写C选项',
                trigger: 'change'
              }"
            >
              <el-input
                v-model.trim="item.optionC"
                style="width: 258px"
                clearable
                placeholder="请填写C选项"
              />
            </el-form-item>
            <el-form-item
              v-if="
                modelForm.topic[index].titleType === '0' ||
                modelForm.topic[index].titleType === '1'
              "
              :prop="`topic.${index}.optionD`"
              label="D选项"
              :rules="{
                required: true,
                message: '请填写D选项',
                trigger: 'change'
              }"
            >
              <el-input
                v-model.trim="item.optionD"
                style="width: 258px"
                clearable
                placeholder="请填写D选项"
              />
            </el-form-item>
            <!-- 判断 -->
            <!-- 视频 -->
            <!-- 答案 -->
            <el-form-item
              v-if="modelForm.topic[index].titleType !== '1'"
              :prop="`topic.${index}.answer`"
              label="答案"
              :rules="{
                required: true,
                message: '请填写正确答案',
                trigger: 'change'
              }"
            >
              <el-radio-group
                v-if="item.titleType === '0'"
                v-model="item.answer"
              >
                <el-radio label="A">A</el-radio>
                <el-radio label="B">B</el-radio>
                <el-radio label="C">C</el-radio>
                <el-radio label="D">D</el-radio>
              </el-radio-group>
              <!-- 判断 -->
              <el-radio-group
                v-if="item.titleType === '2'"
                v-model="item.answer"
              >
                <el-radio label="0">正确</el-radio>
                <el-radio label="1">错误</el-radio>
              </el-radio-group>
              <!-- 视频 -->
              <div v-if="item.titleType === '3'">
                <video
                  v-if="item.answer"
                  :src="item.answer"
                  style="margin: 0 20px 0 0"
                  width="500px"
                  height="auto"
                  :controls="true"
                  ref="videoRef"
                ></video>
                <div
                  style="
                    width: 76px;
                    height: 40px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    padding: 0 10px;
                  "
                >
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    :on-success="handleVideoSuccess"
                    :before-upload="(file) => beforeVideoUpload(index, file)"
                    accept="video/*"
                    :limit="1"
                    :headers="headers"
                    :show-file-list="false"
                  >
                    <span>
                      {{ item.answer ? '更换' : '上传' }}
                    </span>
                  </el-upload>
                </div>
              </div>
            </el-form-item>
            <el-form-item
              v-else
              :prop="`topic.${index}.answerArr`"
              label="答案"
              :rules="{
                required: true,
                message: '请填写正确答案',
                trigger: 'change'
              }"
            >
              <!-- 多选 -->
              <el-checkbox-group
                v-if="item.titleType === '1'"
                v-model="item.answerArr"
              >
                <el-checkbox label="A">A</el-checkbox>
                <el-checkbox label="B">B</el-checkbox>
                <el-checkbox label="C">C</el-checkbox>
                <el-checkbox label="D">D</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <!-- <el-button v-show="item.type != 2" @click="addDomain(index)"
                  >新增选项</el-button
                > -->
              <el-button @click="removeQuestion(index)">删除题目</el-button>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </div>
      <!-- </vuedraggable> -->
      <el-form-item>
        <el-button @click="addQuestion">新增题目</el-button>
        <el-button style="margin-top: 10px" @click="addSubmit()"
          >提交</el-button
        >
        <el-button @click="resetForm('modelForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import vuedraggable from 'vuedraggable'
import service from '@/utils/request.js'
import { getToken } from '@/utils/auth'
import { getTitleList, addTitlepaper } from '@/api/answerFunction/questionList'
export default {
  name: 'question',
  components: {
    vuedraggable
  },
  data() {
    return {
      rules: {},
      linshi: null,
      activeNames: [],
      active: null,
      queryParams: {
        pageNum: 1,
        pageSize: 10000
      },
      //新增题目
      modelForm: {
        //试卷id
        examPaperId: null,
        //题目
        topic: [
          {
            titleType: '',
            titleScore: '',
            titleContent: '',
            optionA: '',
            optionB: '',
            optionC: '',
            optionD: '',
            answer: '',
            answerArr: []
          }
        ]
      },
      uploadUrl: service.ip + '/common/upload',
      headers: { Authorization: 'Bearer ' + getToken() }
    }
  },
  created() {
    this.$set(this.modelForm, 'examPaperId', Number(this.$route.query.examId))
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getTitleList({
        ...this.queryParams,
        examPaperId: Number(this.$route.query.examId)
      }).then((res) => {
        this.loading = false
        this.$set(this.modelForm, 'topic', res.rows)
        this.active = res.rows.length
        this.total = res.total
        this.open = false
      })
    },
    end(evt) {
      this.$refs.modelForm.clearValidate()
    },
    removeQuestion(index) {
      //删除题目
      this.modelForm.topic.splice(index, 1)
      if (this.activeNames.includes(index)) {
        this.activeName.splice(this.activeName.indexOf(index), 1)
      }
      this.active = this.modelForm.length
    },
    addQuestion() {
      // 新增题目
      this.modelForm.topic.push({
        titleType: '',
        titleScore: '',
        titleContent: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        answer: '',
        answerArr: []
      })
      this.activeNames.push(this.active)
      this.active += 1
    },
    resetForm(formName) {
      // 重置
      this.$refs[formName].resetFields()
    },
    addSubmit() {
      this.$refs.modelForm.validate((valid) => {
        if (valid) {
          // if (this.modelForm.topic.length === 0) {
          //   this.$message({
          //     message: '不允许提交空问卷',
          //     type: 'warning'
          //   })
          //   return
          // }
          addTitlepaper(this.modelForm).then(() => {
            this.getList()
            this.$message.success('增改题目成功')
          })
        } else {
          this.$message.error('题目不可为空')
        }
      })
    },
    changeQuestion(index) {
      // if (this.modelForm.topic[index].titleType === 1) {
      //   this.$set(this.modelForm.topic[index], 'answer', '0')
      // } else {
      //   this.$set(this.modelForm.topic[index], 'answerArr', ['0'])
      // }
    },
    beforeVideoUpload(index, file) {
      this.linshi = index
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
      this.$set(this.modelForm.topic[this.linshi], 'answer', r.url)
    }
    // removeDomain(index, idx) {
    //   // 删除选项
    //   this.modelForm.topic[index].answers.splice(idx, 1)
    // },
    // addDomain(index) {
    //   // 新增选项
    //   this.modelForm.topic[index].answers.push({
    //     id: this.modelForm.topic[index].answers.length + 1,
    //     value: ''
    //   })
    // },
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-weight: 700;
  font-size: 30px;
  margin-bottom: 20px;
}
</style>

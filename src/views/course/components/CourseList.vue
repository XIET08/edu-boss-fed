<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" :model="form" class="demo-form-inline" ref="form">
          <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="form.courseName" placeholder="课程名称"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status">
              <el-option label="全部" value=""></el-option>
              <el-option label="上架" value="1"></el-option>
              <el-option label="下架" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              @click="onSubmit"
              :disabled="isLoading"
            >查询</el-button>
          </el-form-item>
          <el-form-item class="btn-add">
            <el-button
              @click="$router.push({ name: 'course-create'})"
              type="primary"
            >添加课程</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="courses"
        style="width: 100%"
        v-loading="isLoading"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="price"
          width="180"
          label="价格">
        </el-table-column>
        <el-table-column
          prop="sortNum"
          width="180"
          label="排序">
        </el-table-column>
        <el-table-column
          prop="status"
          width="150"
          label="上架状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="scope.row.isStatusLoading"
              @change="onStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          width="520"
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="$router.push({ name: 'course-edit', params: { courseId: scope.row.id } })">编辑</el-button>
            <el-button
              size="mini"
              @click="$router.push({ name: 'course-section', params: { courseId: scope.row.id } })">内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="form.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          :disabled="isLoading"
        >
      </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getQueryCourses, changeState } from '@/services/course'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'CourseList',
  data () {
    return {
      courses: [],
      form: {
        courseName: '',
        status: '',
        currentPage: 1,
        pageSize: 10
      },
      totalCount: 0,
      isLoading: false,
      dialogVisible: false,
      roleId: '', // 编辑的角色ID
      isEdit: false
    }
  },
  created () {
    this.loadCourses()
  },
  methods: {
    async loadCourses () {
      this.isLoading = true
      const { data } = await getQueryCourses(this.form)
      data.data.records.forEach((item: any) => {
        item.isStatusLoading = false
      })
      this.courses = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
    },
    onSubmit () {
      this.form.currentPage = 1
      this.loadCourses()
    },
    handleEdit (course: any) {
      console.log(course)
    },
    handleDelete (item: any) {
      console.log('handleDelete')
    },
    handleSizeChange (val: number) {
      this.form.pageSize = val
      this.form.currentPage = 1
      this.loadCourses()
    },
    handleCurrentChange (val: number) {
      this.form.currentPage = val
      this.loadCourses()
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.currentPage = 1
      this.loadCourses()
    },
    onSuccess () {
      this.dialogVisible = false
      this.loadCourses()
    },
    async onStateChange (course: any) {
      course.isStatusLoading = true
      const { data } = await changeState({
        courseId: course.id,
        status: course.status
      })
      this.$message.success(`${course.status === 0 ? '下架' : '上架'}成功`)
      course.isStatusLoading = false
    }
  }
})

</script>

<style lang="scss" scoped>
.btn-add {
  float: right;
}
</style>

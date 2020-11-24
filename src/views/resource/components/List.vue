<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" :model="form" class="demo-form-inline" ref="form">
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="form.name" placeholder="资源名称"></el-input>
          </el-form-item>
          <el-form-item label="资源路径" prop="url">
            <el-input v-model="form.url" placeholder="资源路径"></el-input>
          </el-form-item>
          <el-form-item label="资源分类" prop="categoryId">
            <el-select
              v-model="form.categoryId"
              placeholder="全部"
              clearable
            >
              <el-option
                v-for="item in resourceCategories"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
              :disabled="isLoading"
            >查询搜索</el-button>
            <el-button
              @click="onReset"
              :disabled="isLoading"
            >重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="resources"
        style="width: 100%"
        v-loading="isLoading"
      >
        <el-table-column
          type="index"
          label="编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="资源名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="url"
          width="180"
          label="资源路径">
        </el-table-column>
        <el-table-column
          prop="description"
          width="180"
          label="描述">
        </el-table-column>
        <el-table-column
          :formatter="dateFormat"
          prop="createdTime"
          width="180"
          label="添加时间">
        </el-table-column>

        <el-table-column
          width="180"
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
       </el-table>
       <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="form.current"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="form.size"
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
import dayjs from 'dayjs'
import { getResourcePages, getResourceCategories } from '@/services/resource'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      resources: [],
      form: {
        name: '',
        url: '',
        categoryId: '',
        current: 1,
        size: 10
      },
      totalCount: 0,
      resourceCategories: [],
      isLoading: false
    }
  },
  created () {
    this.loadResources()
    this.loadResourceCategories()
  },
  methods: {
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      this.resourceCategories = data.data
    },
    async loadResources () {
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      this.resources = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
    },
    onSubmit () {
      this.form.current = 1
      this.loadResources()
    },
    dateFormat (row: any, column: any) {
      const date = row[column.property]
      return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : date
    },
    handleEdit (item: any) {
      console.log('handleEdit')
    },
    handleDelete (item: any) {
      console.log('handleDelete')
    },
    handleSizeChange (val: number) {
      this.form.size = val
      this.form.current = 1
      this.loadResources()
    },
    handleCurrentChange (val: number) {
      this.form.current = val
      this.loadResources()
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.current = 1
      this.loadResources()
    }
  }
})

</script>

<style lang="scss" scoped></style>

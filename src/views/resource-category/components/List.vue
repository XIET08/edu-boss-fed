<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="handleAdd">添加</el-button>
      </div>
      <el-table
        :data="resourceCategories"
        style="width: 100%"
        v-loading="isLoading"
      >
        <el-table-column
          prop="id"
          label="编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="180">
        </el-table-column>
        <el-table-column
          :formatter="dateFormat"
          prop="createdTime"
          width="180"
          label="创建时间">
        </el-table-column>
         <el-table-column
          prop="sort"
          width="180"
          label="排序">
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
    </el-card>
    <el-dialog :title="isShowEdit ? '添加分类': '编辑分类'" :visible.sync="dialogVisable" width="40%">
      <el-form :model="categoryData" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="categoryData.name"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="categoryData.sort" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="" @click="dialogVisable = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import dayjs from 'dayjs'
import {
  getResourceCategories,
  deleteResourceCategory,
  saveOrderUpdateCategory
} from '@/services/resource-category'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'ResourceCategoryList',
  data () {
    return {
      resourceCategories: [],
      isLoading: false,
      categoryData: {
        name: '',
        sort: 0
      },
      dialogVisable: false,
      isShowEdit: false
    }
  },
  created () {
    this.loadResourceCategories()
  },
  methods: {
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      this.resourceCategories = data.data
    },
    dateFormat (row: any, column: any) {
      const date = row[column.property]
      return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : date
    },
    handleEdit (item: any) {
      this.categoryData = item
      this.isShowEdit = true
      this.dialogVisable = true
    },
    handleDelete (item: any) {
      this.$confirm('确认删除吗？', '删除提示', {})
        .then(async () => {
          await deleteResourceCategory(item.id)
          this.$message.success('删除成功')
          this.loadResourceCategories()
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    handleAdd () {
      this.categoryData = {
        name: '',
        sort: 0
      }
      this.isShowEdit = false
      this.dialogVisable = true
    },
    async handleSave () {
      console.log('handleSave')
      const { data } = await saveOrderUpdateCategory(this.categoryData)
      if (data.code === '000000') {
        this.$message.success('保存成功')
        this.dialogVisable = false
        this.loadResourceCategories()
      } else {
        this.$message.error(data.mesg)
      }
    }
  }
})

</script>

<style lang="scss" scoped></style>

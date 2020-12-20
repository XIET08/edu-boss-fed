<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" :model="form" class="demo-form-inline" ref="form">
          <el-form-item label="输入搜索" prop="name">
            <el-input v-model="form.name" placeholder="角色名称"></el-input>
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
      <el-button @click="handleAdd">添加角色</el-button>
      <el-table
        :data="roles"
        style="width: 100%"
        v-loading="isLoading"
      >
        <el-table-column
          type="index"
          label="编号"
          width="220">
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
          width="220">
        </el-table-column>
        <el-table-column
          prop="description"
          width="220"
          label="描述">
        </el-table-column>
        <el-table-column
          :formatter="dateFormat"
          prop="createdTime"
          width="220"
          label="添加时间">
        </el-table-column>

        <el-table-column
          width="520"
          label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                @click="$router.push({
                  name: 'alloc-menu',
                  params: {
                    roleId: scope.row.id
                  }
                })">分配菜单</el-button>
            <el-button
              size="mini"
              type="text"
              @click="$router.push({
                name: 'alloc-resource',
                params: {
                  roleId: scope.row.id
                }
              })">分配资源</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="text"
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
    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <create-or-edit
        v-if="dialogVisible"
        :role-id="roleId"
        :is-edit="isEdit"
        @success="onSuccess"
        @cancle="dialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import dayjs from 'dayjs'
import { getRolePages, deleteRole } from '@/services/role'
import { Form } from 'element-ui'
import CreateOrEdit from './CreateOrEdit.vue'

export default Vue.extend({
  name: 'RoleList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      roles: [],
      form: {
        name: '',
        current: 1,
        size: 10
      },
      totalCount: 0,
      isLoading: false,
      dialogVisible: false,
      roleId: '', // 编辑的角色ID
      isEdit: false
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    async loadRoles () {
      this.isLoading = true
      const { data } = await getRolePages(this.form)
      this.roles = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
    },
    onSubmit () {
      this.form.current = 1
      this.loadRoles()
    },
    dateFormat (row: any, column: any) {
      const date = row[column.property]
      return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : date
    },
    handleEdit (role: any) {
      this.dialogVisible = true
      this.roleId = role.id
      this.isEdit = true
    },
    handleDelete (item: any) {
      this.$confirm('确认删除吗？', '删除提示', {})
        .then(async () => {
          await deleteRole(item.id)
          this.$message.success('删除成功')
          this.loadRoles()
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    handleSizeChange (val: number) {
      this.form.size = val
      this.form.current = 1
      this.loadRoles()
    },
    handleCurrentChange (val: number) {
      this.form.current = val
      this.loadRoles()
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.current = 1
      this.loadRoles()
    },
    onSuccess () {
      this.dialogVisible = false
      this.loadRoles()
    },
    handleAdd () {
      this.dialogVisible = true
      this.isEdit = false
    }
  }
})

</script>

<style lang="scss" scoped></style>

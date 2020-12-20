<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form
          :inline="true"
          :model="form"
          class="demo-form-inline"
          ref="form"
        >
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item label="注册时间" prop="rangeDate">
             <el-date-picker
                v-model="form.rangeDate"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="isLoading"
              >查询搜索</el-button
            >
            <el-button @click="onReset" :disabled="isLoading">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="users" style="width: 100%" v-loading="isLoading">
        <el-table-column prop="id" label="用户ID" width="180">
        </el-table-column>
        <el-table-column label="头像" width="180">
          <template slot-scope="scope">
            <el-avatar
              :size="30"
              :src="scope.row.portrait || 'http://www.lgstatic.com/thumbnail_100x100/i/image2/M01/5E/65/CgotOVszSAOANi0LAAAse2IVWAE693.jpg'"
            ></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="name" width="180" label="用户名">
        </el-table-column>
        <el-table-column prop="phone" width="180" label="手机号">
        </el-table-column>
        <el-table-column
          :formatter="dateFormat"
          prop="createTime"
          width="180"
          label="注册时间"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="状态"
          width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="ENABLE"
              inactive-value="DISABLE"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleForbidUser(scope.row)"
              disabled
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column width="180" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleSelectRole(scope.row)"
              >分配角色</el-button
            >
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
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-select v-model="roleIdList" multiple placeholder="请选择">
        <el-option
          v-for="role in roles"
          :key="role.id"
          :value="role.id"
          :label="role.name"
        >
        </el-option>
      </el-select>
      <div slot="footer">
        <el-button
          type="primary"
          @click="handleAllocRole"
        >确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import dayjs from 'dayjs'
import {
  getUserPages,
  forbidUser,
  enableUser
} from '@/services/user'
import {
  getAllRoles,
  allocateUserRoles,
  getUserRoles
} from '@/services/role'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'UserList',
  data () {
    return {
      users: [],
      form: {
        currentPage: 0,
        pageSize: 0,
        phone: '',
        userId: 0,
        startCreateTime: '',
        endCreateTime: '',
        rangeDate: []
      },
      totalCount: 0,
      isLoading: false,
      dialogVisible: false,
      roleIdList: [],
      roles: [],
      currentUser: null // 分配角色的当前用户
    }
  },
  created () {
    this.loadUsers()
  },
  methods: {
    async loadUsers () {
      this.isLoading = true
      const { rangeDate } = this.form
      if (rangeDate && rangeDate.length) {
        this.form.startCreateTime = rangeDate[0]
        this.form.endCreateTime = rangeDate[1]
      } else {
        this.form.startCreateTime = ''
        this.form.endCreateTime = ''
      }
      const { data } = await getUserPages(this.form)
      this.users = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
    },
    onSubmit () {
      this.form.currentPage = 1
      this.loadUsers()
    },
    dateFormat (row: any, column: any) {
      const date = row[column.property]
      return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : date
    },
    handleEdit (item: any) {
      console.log('handleEdit')
    },
    async handleSelectRole (user: any) {
      this.currentUser = user

      // 加载角色列表
      const { data } = await getAllRoles()
      this.roles = data.data

      const { data: { data: userRoles } } = await getUserRoles((this.currentUser as any).id)
      this.roleIdList = userRoles.map((role: any) => role.id)

      this.dialogVisible = true
    },
    handleSizeChange (val: number) {
      this.form.pageSize = val
      this.form.currentPage = 1
      this.loadUsers()
    },
    handleCurrentChange (val: number) {
      this.form.currentPage = val
      this.loadUsers()
    },
    onReset () {
      ;(this.$refs.form as Form).resetFields()
      this.form.currentPage = 1
      this.loadUsers()
    },
    async handleAllocRole () {
      const { data } = await allocateUserRoles({
        userId: (this.currentUser as any).id,
        roleIdList: this.roleIdList
      })
      data.code === '000000' ? this.$message.success('操作成功') : this.$message.error(data.mesg)
      this.dialogVisible = false
    },
    async handleForbidUser (user: any) {
      const { data } = user.status === 'ENABLE' ? await enableUser(user.id) : await forbidUser(user.id)
      if (data.code === '000000') {
        this.$message.success('操作成功')
      } else {
        this.$message.error(data.mesg)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep .el-select {
  width: 100%;
}
</style>

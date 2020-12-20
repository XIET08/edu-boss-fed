<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button type="primary" @click="$router.push({ name: 'advert-space-create' })">添加广告位</el-button>
      </div>
      <el-table :data="advertSpaces" style="width: 100%" v-loading="isLoading">
        <el-table-column prop="spaceKey" label="spaceKey" width="180">
        </el-table-column>
        <el-table-column prop="name" width="260" label="广告名称">
        </el-table-column>
        <el-table-column
          :formatter="dateFormat"
          prop="createTime"
          width="220"
          label="创建时间"
        >
        </el-table-column>
        <el-table-column
          :formatter="dateFormat"
          prop="updateTime"
          width="220"
          label="更新时间"
        >
        </el-table-column>
        <el-table-column width="220" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import dayjs from 'dayjs'
import { getAllSpaces } from '@/services/advert'

export default Vue.extend({
  name: 'AdvertSpaceList',
  data () {
    return {
      advertSpaces: [],
      isLoading: false
    }
  },
  created () {
    this.loadAdvertSpaces()
  },
  methods: {
    async loadAdvertSpaces () {
      this.isLoading = true
      const { data } = await getAllSpaces()
      this.advertSpaces = data.content
      this.isLoading = false
    },
    dateFormat (row: any, column: any) {
      const date = row[column.property]
      return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : date
    },
    handleEdit (item: any) {
      this.$router.push({
        name: 'advert-space-edit',
        params: {
          advertSpaceId: item.id
        }
      })
    }
  }
})
</script>

<style lang="scss" scoped></style>

<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button type="primary" @click="$router.push({ name: 'advert-create' })">添加广告</el-button>
      </div>
      <el-table :data="adverts" style="width: 100%" v-loading="isLoading">
        <el-table-column prop="id" label="id" width="180">
        </el-table-column>
        <el-table-column prop="name" width="220" label="广告名称">
        </el-table-column>
        <el-table-column prop="spaceName" width="220" label="广告位置">
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-avatar
              shape="square"
              :size="80"
              :src="scope.row.img"
            ></el-avatar>
          </template>
        </el-table-column>
        <el-table-column width="260" label="时间">
          <template slot-scope="scope">
            <p>开始时间：{{ scope.row.startTime }}</p>
            <p>结束时间：{{ scope.row.endTime }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="上线下线"
          width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column width="180" label="操作">
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
import {
  getAdList,
  getAllSpaces
} from '@/services/advert'

export default Vue.extend({
  name: 'AdvertList',
  data () {
    return {
      adverts: [],
      advertSpaces: [],
      isLoading: false
    }
  },
  created () {
    this.loadAdverts()
  },
  methods: {
    async loadAdverts () {
      this.isLoading = true
      const ret = await Promise.all([getAllSpaces(), getAdList()])
      this.advertSpaces = ret[0].data.content
      this.adverts = ret[1].data.content
      this.adverts.forEach((ad: any) => {
        const space: any = this.advertSpaces.find((space: any) => space.id === ad.spaceId)
        if (space) {
          ad.spaceName = space.name
        }
        ad.startTime = dayjs(ad.startTime).format('YYYY-MM-DD HH:mm:ss')
        ad.endTime = dayjs(ad.endTime).format('YYYY-MM-DD HH:mm:ss')
      })
      this.isLoading = false
    },
    handleEdit (item: any) {
      this.$router.push({
        name: 'advert-edit',
        params: {
          advertId: item.id
        }
      })
    }
  }
})
</script>

<style lang="scss" scoped></style>

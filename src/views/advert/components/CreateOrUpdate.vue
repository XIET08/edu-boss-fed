<template>
  <el-card>
    <div slot="header">
      添加广告
    </div>
    <el-form :model="advert" label-width="80px">
      <el-form-item label="广告名称">
        <el-input v-model="advert.name"></el-input>
      </el-form-item>
      <el-form-item label="广告位置">
        <el-select v-model="advert.spaceId" placeholder="请选择">
          <el-option
            v-for="space in advertSpaces"
            :key="space.id"
            :value="space.id"
            :label="space.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker v-model="advert.startTime" type="datetime" placeholder=""></el-date-picker>
      </el-form-item>
      <el-form-item label="到期时间">
        <el-date-picker v-model="advert.endTime" type="datetime" placeholder=""></el-date-picker>
      </el-form-item>
      <el-form-item label="上线/下线">
        <el-radio v-model="advert.status" :label="0">下线</el-radio>
        <el-radio v-model="advert.status" :label="1">上线</el-radio>
      </el-form-item>
      <el-form-item label="广告图片">
        <course-image v-model="advert.img"/>
      </el-form-item>
      <el-form-item label="广告链接">
        <el-input v-model="advert.link" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="广告备注">
        <el-input v-model="advert.text" type="textarea" placeholder="" rows="3"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  saveOrUpdateAdvert,
  getAdById
} from '@/services/advert'
import { getAllSpaces } from '@/services/advert-space'
import CourseImage from '@/views/course/components/CourseImage.vue'

export default Vue.extend({
  name: 'CreateOrUpdate',
  components: {
    CourseImage
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    advertId: {
      type: [String, Number]
    }
  },
  data () {
    return {
      advert: {
        name: '',
        spaceId: '',
        startTime: '',
        endTime: '',
        status: 0,
        img: '',
        link: '',
        text: ''
      },
      advertSpaces: []
    }
  },
  created () {
    this.loadAdvertSpaces()
    if (this.isEdit) {
      this.loadAdvert()
    }
  },
  methods: {
    async loadAdvert () {
      const { data } = await getAdById(this.advertId)
      this.advert = data.content
    },
    async loadAdvertSpaces () {
      const { data } = await getAllSpaces()
      this.advertSpaces = data.content
    },
    async handleSubmit () {
      const { data } = await saveOrUpdateAdvert(this.advert)
      this.$message.success('操作成功')
      this.$router.back()
    }
  }
})

</script>

<style lang="scss" scoped>
.el-input, .el-textarea {
  width: 70%;
}
</style>

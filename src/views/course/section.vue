<template>
  <div class="course-section">
    <el-card>
      <div slot="header">
        课程名称
      </div>
      <el-tree
        :data="sections"
        :props="defaultProps"
        draggable
        :allow-drop="handleAllowDrop"
        @node-drop="handleSort"
      >
      <div class="inner" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span class="actions" v-if="data.sectionName">
          <el-button type="">编辑</el-button>
          <el-button type="">添加课时</el-button>
          <el-button type="">状态</el-button>
        </span>
        <span class="actions" v-else>
          <el-button type="">编辑</el-button>
          <el-button type=""
            @click="$router.push({
              name: 'course-video',
              params: {
                courseId: courseId
              },
              query: {
                sectionId: data.id,
                lessonId: data.parent.id
              }
            })">上传视频</el-button>
          <el-button type="">状态</el-button>
        </span>
      </div>
      </el-tree>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getSectionAndLesson, saveOrUpdateSection } from '@/services/course-section'
import { saveOrUpdateLesson } from '@/services/course-lesson'

export default Vue.extend({
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data: any) {
          return data.sectionName || data.theme
        }
      }
    }
  },
  created () {
    this.loadSections()
  },
  methods: {
    async loadSections () {
      const { data } = await getSectionAndLesson(this.courseId)
      this.sections = data.data
    },
    handleNodeClick (data: any) {
      console.log(data)
    },
    handleAllowDrop (draggingNode: any, dropNode: any, type: any) {
      return draggingNode.data.sectionId === dropNode.data.sectionId && type !== 'inner'
    },
    async handleSort (dragNode: any, dropNode: any, type: any, event: any) {
      try {
        await Promise.all(dropNode.parent.childNodes.map((item: any, index: number) => {
          if (typeof (item.data.lessonDTOS) !== 'undefined') {
            // 阶段
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index + 1
            })
          } else {
            // 课时
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index + 1
            })
          }
        }))
        this.$message.success('排序成功')
      } catch (err) {
        this.$message.error('排序失败')
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.inner {
  flex: 1;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}
::v-deep .el-tree-node__content {
  height: auto;
}
</style>

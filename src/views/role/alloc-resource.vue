<template>
  <div class="alloc-resource">
    <el-card>
      <div slot="header">
        <span>分配权限</span>
      </div>
      <el-tree
        ref="resource-tree"
        :data="resources"
        node-key="id"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        :default-checked-keys="checkedKeys"
      ></el-tree>
      <div style="text-align: center;">
        <el-button @click="resetChecked">清空</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  getAllResources,
  getRoleResources,
  allocateRoleResources
} from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'
import { Tree } from 'element-ui'

export default Vue.extend({
  name: 'AllocResource',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      resources: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  created () {
    this.loadResources()
    this.loadRoleResources()
  },
  methods: {
    async loadResources () {
      const ret = await Promise.all([getAllResources(), getResourceCategories()])
      const resources = ret[0].data.data
      const resourceCategories = ret[1].data.data

      resources.forEach((r: any) => {
        const category = resourceCategories.find((c: any) => c.id === r.categoryId)
        if (category) {
          category.children = category.children || []
          category.children.push(r)
        }
      })

      // 修改顶层分类 ID：因为分类 ID 和资源 ID 冲突
      resourceCategories.forEach((item: any) => {
        item.id = Math.random()
      })

      this.resources = resourceCategories
    },
    async loadRoleResources () {
      const { data } = await getRoleResources(this.roleId)
      this.getCheckedKeys(data.data)
    },
    getCheckedKeys (resources: any) {
      resources.forEach((r: any) => {
        r.resourceList && r.resourceList.forEach((c: any) => {
          if (c.selected) {
            this.checkedKeys = [...this.checkedKeys, c.id as never]
          }
        })
      })
    },
    async onSave () {
      const checkedNodes = (this.$refs['resource-tree'] as Tree).getCheckedNodes()
      const resourceIdList: number[] = []
      checkedNodes.forEach(item => {
        if (!item.children) {
          resourceIdList.push(item.id)
        }
      })
      await allocateRoleResources({
        roleId: this.roleId,
        resourceIdList
      })
      this.$message.info('操作成功')
      this.$router.back()
    },
    resetChecked () {
      (this.$refs['resource-tree'] as Tree).setCheckedKeys([])
    }
  }
})

</script>

<style lang="scss" scoped></style>

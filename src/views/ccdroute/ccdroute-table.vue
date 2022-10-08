<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddCcdRoute">New CcdRoute</el-button>

    <el-table :data="ccdRouteList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="CcdRoute id" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="CcdRoute address" width="220">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="CcdRoute mask" width="220">
        <template slot-scope="scope">
          {{ scope.row.mask }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="CcdRoute Description">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="ccdRoute" label-width="80px" label-position="left">
        <el-form-item label="Address">
          <el-input v-model="ccdRoute.address" placeholder="CcdRoute address" />
        </el-form-item>
        <el-form-item label="Mask">
          <el-input v-model="ccdRoute.mask" placeholder="CcdRoute mask" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="ccdRoute.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="ccdRoute Description"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmRole">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { deleteCcdRoute, getCcdRoutes, updateCcdRoute, addCcdRoute } from '@/api/ccdroute'

const defaultCcdRoute = {
  id: null,
  address: '',
  description: '',
  mask: ''
}

export default {
  data() {
    return {
      ccdRoute: Object.assign({}, defaultCcdRoute),
      routes: [],
      ccdRouteList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getCcdRoutes()
  },
  methods: {
    async getCcdRoutes() {
      const res = await getCcdRoutes()
      this.ccdRouteList = res.msg
    },
    handleAddCcdRoute() {
      this.ccdRoute = Object.assign({}, defaultCcdRoute)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.ccdRoute = deepClone(scope.row)
    },
    handleDelete(scope) {
      this.$confirm('Confirm to remove the ccdRoute?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteCcdRoute(scope.row.id)
          getCcdRoutes().then(res => {
            this.ccdRouteList = res.msg
          })
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        await updateCcdRoute(this.ccdRoute)
      } else {
        await addCcdRoute(this.ccdRoute)
      }
      const { description, id, address } = this.ccdRoute
      this.dialogVisible = false
      getCcdRoutes().then(res => {
        this.ccdRouteList = res.msg
      })

      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>ccdRoute id: ${id}</div>
            <div>ccdRoute address: ${address}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>

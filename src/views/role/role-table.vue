<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">New Role</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="Role Id" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Role Name" width="220">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="primary" size="small" @click="handleCcdRouteControl(scope)">CcdRouteControl</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="role.roleName" placeholder="Role Name" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmRole">Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="myCcdRouteVisible">
      <el-button type="primary" @click="showMyCcdRouteHandle(tempRoleId)">已经存在</el-button>
      <el-button type="primary" @click="showNotMyCcdRouteHandle(tempRoleId)">不存在</el-button>
      <el-table v-show="showMyCcdRouteVisible" :data="myCcdRouteList" style="width: 150%;margin-top:50px;" border>
        <el-table-column align="center" label="id" width="220">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="ccdRouteId" width="220">
          <template slot-scope="scope">
            {{ scope.row.ccdRouteId }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="address" width="220">
          <template slot-scope="scope">
            {{ scope.row.address }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="mask" width="220">
          <template slot-scope="scope">
            {{ scope.row.mask }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="description" width="220">
          <template slot-scope="scope">
            {{ scope.row.description }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Operations">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="handleDeleteRoleCcd(scope)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-show="showNotMyCcdRouteVisible" :data="notMyCcdRouteList" style="width: 150%;margin-top:50px;" border>
        <el-table-column hidden="false" align="center" label="id" width="220">
          <template slot-scope="scope">
            {{ scope.row.ccdRouteId }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="address" width="220">
          <template slot-scope="scope">
            {{ scope.row.address }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="mask" width="220">
          <template slot-scope="scope">
            {{ scope.row.mask }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="description" width="220">
          <template slot-scope="scope">
            {{ scope.row.description }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Operations">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="handleAddRoleCcd(scope)">add</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:right;">
        <el-button type="success" @click="handleRoleCcdApply()">role ccd apply</el-button>
        <el-button type="danger" @click="myCcdRouteVisible=false">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getRoles, addRole, deleteRole, updateRole, addRoleCcd, delRoleCcd } from '@/api/role'
import { getAllNotInRoleId, getCcdRouteByRoleId, roleCcdRouteApply } from '@/api/ccdroute'

const defaultRole = {
  id: '',
  roleName: ''
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      myCcdRouteList: [],
      notMyCcdRouteList: [],
      rolesList: [],
      dialogVisible: false,
      myCcdRouteVisible: false,
      showNotMyCcdRouteVisible: false,
      showMyCcdRouteVisible: true,
      tempRoleId: null,
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
    this.getRoles()
  },
  methods: {
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.msg
    },
    showNotMyCcdRouteHandle(roleId) {
      const data = { 'roleId': roleId }
      getAllNotInRoleId(data).then(response => {
        this.notMyCcdRouteList = response.msg
        this.showMyCcdRouteVisible = false
        this.showNotMyCcdRouteVisible = true
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 10 * 1000)
      })
    },
    showMyCcdRouteHandle(roleId) {
      const data = { 'roleId': roleId }
      getCcdRouteByRoleId(data).then(response => {
        this.myCcdRouteList = response.msg
        this.showNotMyCcdRouteVisible = false
        this.showMyCcdRouteVisible = true
        setTimeout(() => {
          this.listLoading = false
        }, 10 * 1000)
      })
    },
    handleCcdRouteControl(scope) {
      this.tempRoleId = scope.row.id
      const data = { 'roleId': scope.row.id }
      getCcdRouteByRoleId(data).then(response => {
        this.myCcdRouteList = response.msg
        this.myCcdRouteVisible = true
        this.showNotMyCcdRouteVisible = false
        this.showMyCcdRouteVisible = true
        setTimeout(() => {
          this.listLoading = false
        }, 10 * 1000)
      })
    },
    handleRoleCcdApply() {
      const data = {
        'roleId': this.tempRoleId
      }
      roleCcdRouteApply(data).then(res => {
        this.$message({
          type: 'success',
          message: 'ccd apply succed!'
        })
      })
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleAddRoleCcd(scope) {
      const data = [{
        'ccdRouteId': scope.row.ccdRouteId,
        'roleId': this.tempRoleId
      }]
      addRoleCcd(data).then(response => {
        this.$message({
          type: 'success',
          message: 'add succed!'
        })
        this.showNotMyCcdRouteHandle(this.tempRoleId)
        setTimeout(() => {
          this.listLoading = false
        }, 10 * 1000)
      })
    },
    handleDeleteRoleCcd(scope) {
      const data = {
        'roleCcdRouteId': scope.row.id
      }
      delRoleCcd(data).then(response => {
        this.$message({
          type: 'success',
          message: 'delete succed!'
        })
        this.showMyCcdRouteHandle(this.tempRoleId)
        setTimeout(() => {
          this.listLoading = false
        }, 10 * 1000)
      })
    },
    handleDelete(scope) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(scope.row.id)
          this.getRoles()
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
        updateRole(this.role).then(res => {
          this.getRoles()
        })
      } else {
        addRole(this.role).then(res => {
          this.getRoles()
        })
      }
      const { id, roleName } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Key: ${id}</div>
            <div>Role Name: ${roleName}</div>
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

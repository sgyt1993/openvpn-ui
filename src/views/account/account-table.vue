<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <!--      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
      <!--        下载-->
      <!--      </el-button>-->
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox>
    </div>

    <el-table
      v-if="list.length > 0"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="id" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Identity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ExpirationDate" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ExpirationDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="RevocationDate" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.RevocationDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="AccountStatus" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.AccountStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ConnectionServer" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ConnectionServer }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" label="RoleId" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.roleId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="RoleName" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="700" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="success" @click="handleUserCcdApply(row)">
            user ccd apply
          </el-button>
          <el-button type="primary" size="mini" @click="changePassword(row)">
            change-password
          </el-button>
          <el-button v-if="row.roleId == null || row.roleId == 0" type="primary" size="mini" @click="changeRole(row)">
            set-role
          </el-button>
          <el-button v-if="row.roleId != null && row.roleId != 0" type="danger" size="mini" @click="deleteRole(row)">
            remove-role
          </el-button>
          <el-button type="primary" size="mini" @click="setCcdClientAddress(row)">
            set-ccdClientAddress
          </el-button>
          <el-button size="mini" @click="handleRevoke(row,'draft')">
            Revoke
          </el-button>
          <el-button size="mini" type="primary" @click="handleUnRevoke(row,'draft')">
            UnRevoke
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
          <el-button size="mini" type="primary" @click="handleDownload(row,$index)">
            download
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item v-show="dialogStatus=='create'" label="用户" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="roleTableVisible">
      <el-table :data="rolesList" style="width: 150%;margin-top:50px;" border>
        <el-table-column hidden="false" align="center" label="id" width="220">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="roleName" width="220">
          <template slot-scope="scope">
            {{ scope.row.roleName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Operations">
          <template slot-scope="scope">
            <el-button v-if="temp.roleId == null || temp.roleId == 0" type="primary" size="small" @click="handleAddUserRole(scope)">add</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:right;">
        <el-button type="danger" @click="roleTableVisible=false">Cancel</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="ccdFormVisible">
      <el-form ref="dataForm" :rules="ccdClientRules" :model="tempCcdClient" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item align="center" label="clientAddress" label-width="150px">
          <el-input v-model="tempCcdClient.clientAddress" />
        </el-form-item>
        <el-form-item align="center" label="mask" label-width="150px">
          <el-input v-model="tempCcdClient.mask" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ccdFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="createOrUpdateuCcdClient()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import {
  changeUserPassword,
  createUser,
  userRevoke,
  userUnRevoke,
  userList,
  addAccountRole,
  deleteAccountRole, addCcdClientAddress, queryCcdClientAddressByAccountId, userCcdApply
} from '@/api/user'
import { getRoles } from '@/api/role' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: null,
        username: '',
        password: '',
        roleId: null,
        clientAddress: '',
        mask: ''
      },
      tempCcdClient: {
        accountId: null,
        clientAddress: '',
        mask: ''
      },
      tempRoleId: null,
      dialogFormVisible: false,
      roleTableVisible: false,
      ccdFormVisible: false,
      rolesList: [],
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        username: [{ required: true, message: 'username is required', trigger: 'blur' }],
        password: [{ required: true, message: 'password is required', trigger: 'blur' }]
      },
      ccdClientRules: {
        clientAddress: [{ required: true, message: 'clientAddress is required', trigger: 'blur' }],
        mask: [{ required: true, message: 'mask is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getRoles()
  },
  methods: {
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.msg
    },
    getList() {
      this.listLoading = true
      userList(this.listQuery).then(response => {
        const list = response.msg
        const total = response.msg.length
        this.list = list
        this.total = total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleRevoke(row) {
      const data = {
        username: row.Identity
      }
      userRevoke(data).then(() => {
        this.$message({
          message: '操作Success',
          type: 'success'
        })
      })
    },
    handleUnRevoke(row) {
      const data = {
        username: row.Identity
      }
      userUnRevoke(data).then(() => {
        this.$message({
          message: '操作Success',
          type: 'success'
        })
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    setCcdClientAddress(row) {
      this.tempCcdClient.accountId = row.id
      const data = {
        'accountId': this.tempCcdClient.accountId
      }
      queryCcdClientAddressByAccountId(data).then(res => {
        this.tempCcdClient.mask = res.msg.mask
        this.tempCcdClient.clientAddress = res.msg.clientAddress
        this.ccdFormVisible = true
      })
    },
    createOrUpdateuCcdClient() {
      const data = {
        'accountId': this.tempCcdClient.accountId,
        'clientAddress': this.tempCcdClient.clientAddress,
        'mask': this.tempCcdClient.mask
      }
      addCcdClientAddress(data).then(res => {
        this.$message({
          message: '操作Success',
          type: 'success'
        })
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUser(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUserCcdApply(row) {
      const data = {
        'accountId': row.id
      }
      userCcdApply(data).then(res => {
        this.$message({
          message: '操作Success',
          type: 'success'
        })
      })
    },
    changePassword(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.username = row.Identity
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    changeRole(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.roleTableVisible = true
    },
    deleteRole(row) {
      const data = {
        'accountId': row.id
      }
      deleteAccountRole(data).then(res => {
        this.getList()
        this.$message({
          message: '操作Success',
          type: 'success'
        })
      })
    },
    handleAddUserRole(scope) {
      const data = {
        'roleId': scope.row.id,
        'accountId': this.temp.id
      }
      addAccountRole(data).then(res => {
        this.temp.roleId = scope.row.id
        this.getList()
        this.$message({
          message: '操作Success',
          type: 'success'
        })
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          changeUserPassword(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleDownload(row, index) {
      const data = {
        username: row.Identity
      }
      const axios_cfg = {
        baseURL: process.env.VUE_APP_BASE_API,
        method: 'post',
        url: 'api/user/config/show',
        data: data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8;'
        },
        timeout: 500000,
        transformRequest: [
          function(data) {
            let ret = ''
            for (const it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            ret = ret.substring(0, ret.lastIndexOf('&'))
            return ret
          }
        ]
      }
      axios.request(axios_cfg)
        .then(function(response) {
          debugger
          const blob = new Blob([response.data], { type: 'text/plain' })
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = row.Identity + '.ovpn'
          link.click()
          URL.revokeObjectURL(link.href)
        }).catch(console.error)
    },

    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

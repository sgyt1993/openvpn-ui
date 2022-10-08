/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const roleRouter = {
  path: '/role',
  component: Layout,
  redirect: '/role/role-table',
  name: 'Role',
  meta: {
    title: 'Role',
    icon: 'lock'
  },
  children: [
    {
      path: 'role-table',
      component: () => import('@/views/role/role-table'),
      name: 'Role',
      meta: { title: 'Role' }
    }
  ]
}
export default roleRouter

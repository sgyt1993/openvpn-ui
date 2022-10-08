/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const ccdrouteRouter = {
  path: '/ccdroute',
  component: Layout,
  redirect: '/ccdroute/ccdroute-table',
  name: 'CcdRoute',
  meta: {
    title: 'CcdRoute',
    icon: 'table'
  },
  children: [
    {
      path: 'ccdroute-table',
      component: () => import('@/views/ccdroute/ccdroute-table'),
      name: 'CcdRoute',
      meta: { title: 'CcdRoute' }
    }
  ]
}
export default ccdrouteRouter

/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const accountRouter = {
  path: '/account',
  component: Layout,
  redirect: '/account/account-table',
  name: 'Account',
  meta: {
    title: 'Account',
    icon: 'table'
  },
  children: [
    {
      path: 'account-table',
      component: () => import('@/views/account/account-table'),
      name: 'Account',
      meta: { title: 'Account' }
    }
  ]
}
export default accountRouter


const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/dashboard/dashboard.vue') },
      { path: '/dashboard', component: () => import('pages/dashboard/dashboard.vue') },
      { path: '/roles', component: () => import('pages/RolesFeed.vue') },
      { path: '/members', component: () => import('pages/MembersFeed.vue') },
      { path: '/proposals', component: () => import('pages/ProposalTables.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes

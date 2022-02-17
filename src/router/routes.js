
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/dashboard/dashboard.vue') },
      { path: 'dashboard', component: () => import('pages/dashboard/dashboard.vue') },
      { path: 'alert-manager', component: () => import('pages/alert-manager/alert-manager-form.vue') },
      // { path: 'members/add', component: () => import('pages/members/add/members-add.vue') },
      // { path: 'members/add/success', component: () => import('pages/members/add/success.vue') },
      { path: 'members', component: () => import('pages/members/list/members-list.vue') },
      { path: 'applicants', component: () => import('pages/applicants/list/applicants-list.vue') },
      { path: 'old/@:username', component: () => import('pages/profiles/view/profile-view.vue') },
      { path: '@:username', component: () => import('pages/profiles/Profile.vue'), props: true },
      { path: '@:username/edit', component: () => import('pages/profiles/edit/profile-edit.vue') },
      { path: 'old/wallet', component: () => import('pages/profiles/view/wallet-view.vue') },
      { path: 'wallet', component: () => import('pages/profiles/Payments.vue') },
      { path: 'roles', component: () => import('pages/roles/Apply.vue') },
      { path: 'treasury', component: () => import('pages/treasury/treasury.vue') },
      { path: 'multi-sig', component: () => import('pages/multi-sig/multi-sig-list.vue') },
      { path: 'documents-proposal/:type/:user?', component: () => import('pages/documents-proposal/list.vue') },
      { path: 'documents/:type/:user?', component: () => import('pages/documents/list.vue') }
    ]
  },
  { path: '/welcome', component: () => import('pages/onboarding/welcome.vue') },
  { path: '/login', component: () => import('pages/onboarding/login.vue') },
  { path: '/register', component: () => import('pages/onboarding/register.vue') },
  { path: '/error', component: () => import('pages/onboarding/down.vue') },
  {
    path: '/:dhoname',
    component: () => import('layouts/DhoSelector.vue'),
    props: true,
    children: [
      {
        path: 'demo-ipfs',
        name: 'ipfs',
        component: () => import('pages/dho/DemoIpfs.vue')
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/onboarding/NLogin.vue')
      },
      {
        path: 'members',
        name: 'members',
        meta: {
          title: 'Members'
        },
        component: () => import('pages/dho/Members.vue')
      },
      {
        path: 'proposals',
        component: () => import('pages/proposals/Proposals.vue'),
        children: [
          {
            path: 'create',
            name: 'proposal-create',
            meta: {
              breadcrumbs: {
                tab: {
                  name: 'Proposals',
                  link: 'proposals'
                }
              }
              // title: 'Create New Proposal'
            },
            component: () => import('pages/proposals/ProposalCreate.vue')
          },
          {
            path: ':hash',
            name: 'proposal-detail',
            meta: {
              breadcrumbs: {
                tab: {
                  name: 'Proposals',
                  link: 'proposals'
                }
              },
              layout: 'proposal',
              title: 'Proposal Details'
            },
            component: () => import('pages/proposals/ProposalDetail.vue'),
            props: true
          },
          {
            path: '',
            name: 'proposals',
            meta: {
              title: 'Proposals'
            },
            component: () => import('pages/proposals/ActiveProposals.vue')
          }
        ]
      },
      {
        path: 'organization',
        name: 'organization',
        meta: {
          title: 'Organization'
        },
        component: () => import('pages/dho/Organizational.vue')
      },
      {
        path: 'organization/assets/:type',
        name: 'organization/assets',
        component: () => import('pages/dho/OrganizationalAssets.vue')
      },
      {
        path: 'explore',
        name: 'explore',
        meta: {
          status: 'red',
          title: 'Explore'
        },
        component: () => import('pages/dho/Explore.vue')
      },
      {
        path: '@:username',
        name: 'profile',
        meta: {
          status: 'yellow',
          title: 'Profile'
        },
        component: () => import('pages/profiles/Profile.vue'),
        props: true
      },
      {
        path: 'wallet',
        name: 'wallet',
        meta: {
          breadcrumbs: {
            tab: {
              name: 'Profile',
              link: 'profile'
            }
          },
          status: 'yellow',
          title: 'Wallet'
        },
        component: () => import('pages/profiles/Payments.vue')
      },
      {
        path: 'archetypes',
        name: 'archetypes',
        meta: {
          breadcrumbs: {
            tab: {
              name: 'Organization',
              link: 'organization'
            }
          },
          status: 'yellow',
          title: 'Archetypes'
        },
        component: () => import('pages/dho/Archetypes.vue')
      },
      {
        path: 'badges',
        name: 'badges',
        meta: {
          breadcrumbs: {
            tab: {
              name: 'Organization',
              link: 'organization'
            }
          },
          status: 'yellow',
          title: 'Badges'
        },
        component: () => import('pages/dho/Badges.vue')
      },
      {
        path: 'circles',
        name: 'circles',
        meta: {
          breadcrumbs: {
            tab: {
              name: 'Organization',
              link: 'organization'
            }
          },
          status: 'red',
          title: 'Circles'
        },
        component: () => import('pages/dho/Circles.vue')
      },
      {
        path: 'policies',
        name: 'policies',
        meta: {
          breadcrumbs: {
            tab: {
              name: 'Organization',
              link: 'organization'
            }
          },
          status: 'red',
          title: 'Policies'
        },
        component: () => import('pages/dho/Policies.vue')
      },
      // This Code was temporal commented for MVP
      // {
      //   path: 'search',
      //   meta: {
      //     breadcrumbs: {
      //       tab: {

      //       }
      //     },
      //     status: 'red',
      //     title: 'Search result for ""'
      //   },
      //   component: () => import('pages/search/Results.vue')
      // },
      { path: 'support', component: () => import('pages/support/Support.vue') },
      {
        path: 'treasury',
        name: 'treasury',
        meta: {
          breadcrumbs: {
            tab: {
              name: 'Organization',
              link: 'organization'
            }
          },
          status: 'yellow',
          title: 'Treasury'
        },
        component: () => import('pages/dho/Treasury.vue')
      },
      {
        path: 'multi-sig',
        name: 'multi-sig',
        meta: {
          status: 'yellow',
          title: 'Multi-sig'
        },
        component: () => import('pages/multi-sig/multi-sig-list.vue')
      },
      {
        path: 'home',
        name: 'dashboard',
        meta: {
          title: 'Dashboard'
        },
        component: () => import('pages/dho/Home.vue')
      },
      {
        path: '*',
        name: '404-not-found',
        meta: {
          title: 'Error page'
        },
        component: () => import('pages/Error404Page.vue')
      }
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

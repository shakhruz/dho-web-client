<script>
export default {
  name: 'profile-sidebar',
  components: {
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue'),
    QuickActions: () => import('./quick-actions.vue'),
    QuickLinks: () => import('./quick-links.vue'),
    SidebarNews: () => import('./sidebar-news.vue')
  },

  props: {
    compact: Boolean,
    daoName: String,
    isMember: Boolean,
    profile: {
      type: Object
    }
  }
}
</script>

<template lang="pug">
#profile-sidebar.full-width.full-height
  q-scroll-area.full-height
    .column.q-py-xxxl.flex.scrollable-area.justify-between(:class="{ 'q-px-xxxl': !compact, 'compact-padding': compact }")
      .profile.q-py-md
        .internal-profile(:class="{ 'justify-between': !compact, 'row': !compact }")
          .container.q-mb-xxxl.justify-center.flex(v-if="compact")
            q-btn(color="internal-bg" text-color="primary" rounded unelevated size="sm" padding="12px" icon="fas fa-times" @click="$emit('close')")
          profile-picture(:username="profile.username" size="88px")
          .container(v-if="!compact")
            q-btn(color="internal-bg" text-color="primary" rounded unelevated size="sm" padding="12px" icon="fas fa-times" @click="$emit('close')")
        .h-h3.q-mt-md(v-if="profile && !compact") {{ profile.name || profile.username }}
        .h-b3.text-body(v-if="profile && !compact") {{ '@' + profile.username }}
      sidebar-news(:username="profile.username" :daoName="daoName" v-if="isMember && !compact")
      //- quick-actions //- Commented for MVP
      quick-links.q-py-sm(:username="profile.username" :isMember="isMember" :compact="compact")
</template>

<style lang="stylus" scoped>
#profile-sidebar
  width 100px
.scrollable-area
  min-height 100vh
.compact-padding
  padding-left 26px
  padding-right 26px

</style>

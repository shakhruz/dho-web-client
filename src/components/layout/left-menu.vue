<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'layout-left-menu',
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'isMember', 'isEnroller'])
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    displayForm (type) {
      this.setShowRightSidebar(true)
      this.setRightSidebarType(`${type}Form`)
    }
  }
}
</script>

<template lang="pug">
  q-scroll-area.fit.bg-grey-3
    q-list.menu(
      :bordered="false"
      dense
    )
      q-item.q-mt-md.text-black(to="/dashboard")
        q-item-section(avatar)
          q-icon(name="fa fa-home")
        q-item-section
          strong Activities
      q-item(
        v-if="isAuthenticated && isMember"
        clickable
        v-ripple
        @click="displayForm('role')"
      )
        q-item-section(avatar)
        q-item-section Create Role
      q-item(
        v-if="isAuthenticated && isMember"
        clickable
        v-ripple
        @click="displayForm('payout')"
      )
        q-item-section(avatar)
        q-item-section Create Contribution
      q-item(
        to="/documents-proposal/role"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Endorse Role
      q-item(
        to="/documents-proposal/payout"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Endorse Contribution
      q-item(
        to="/roles"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Apply for Role
      q-item(
        to="/applicants"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Enroll Members
        q-item-section(side)
          q-icon(
            name="fas fa-lock"
            class="text-disabled"
            style="font-size: 18px;"
          )
      q-item(
        to="/documents-proposal/assignment"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Enroll Applicants
      q-item(
        to="/treasury"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Treasury
      q-item(
        to="/multi-sig"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Multi Sig
      q-item(
        v-if="isEnroller"
        to="/alert-manager"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Alert manager
      q-separator.q-my-sm
      q-item.text-black(to="/members")
        q-item-section(avatar)
          q-icon(name="fas fa-user-friends")
        q-item-section
          strong Participants
      q-item(
        to="/applicants"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section New Members
      q-separator.q-my-sm
      q-item
        q-item-section(avatar)
          q-icon(name="fas fa-suitcase")
        q-item-section
          strong Proposals
      q-item(
        to="/documents-proposal/role"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Roles
      q-item(
        to="/documents-proposal/payout"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Contributions
      q-item(
        to="/documents-proposal/badge"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Badges
      q-item(
        to="/documents-proposal/assignment"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Role-assignments
      q-item(
        to="/documents-proposal/badgeAssignment"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Badge-assignments
      q-separator.q-my-sm
      q-item
        q-item-section(avatar)
          q-icon(name="fas fa-handshake")
        q-item-section
          strong Agreements
      q-item(
        to="/documents/badge"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Badges
      q-item(
        to="/documents/role"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Roles
      q-item(
        to="/documents/assignment"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Assignments

</template>

<style lang="stylus" scoped>
.close-btn
  margin-top 10px
.btn-add
  margin-right 17px
.menu
  font-size 16px
  /deep/.q-item.q-router-link--active
    font-weight 700
    color #E06664
.menu > .q-item, .q-item--dense
  min-height 28px
</style>

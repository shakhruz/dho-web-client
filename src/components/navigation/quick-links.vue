<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'quick-links',

  props: {
    compact: Boolean,
    username: String,
    isMember: Boolean
  },

  methods: {
    ...mapActions('accounts', ['logout']),
    changeRoute (name, params) {
      this.$router.push({ name: name, params })
    }
  },
  computed: {
    ...mapGetters('dao', ['selectedDao']),
    cssVars () {
      return {
        '--button-size': this.compact ? '96px' : '140px'
      }
    }
  }
}
</script>

<template lang="pug">
.quick-links.full-width(:style="cssVars")
  .row.q-gutter-xs.justify-center
    .col-6.button-square
      q-btn.fit.items-end(:to="isMember ? { name: 'proposal-create', params: { dhoname: selectedDao.name } } : {}" rounded unelevated color="internal-bg" :disabled="!isMember")
        .column.items-center
          q-icon.q-pa-xs(color="primary" size="md" name="fas fa-file-medical")
          .text-caption.text-no-wrap.text-primary.text-bold New Proposal
    .col-6.button-square
      q-btn.fit(@click="changeRoute('profile', {username})" rounded unelevated color="internal-bg" :disabled="!isMember")
        .column.items-center
          q-icon.q-pa-xs(color="primary" size="md" name="far fa-user")
          .text-caption.text-no-wrap.text-primary.text-bold My Profile
    .col-6.button-square
      q-btn.fit(@click="changeRoute('profile', {username})" rounded unelevated color="internal-bg" :disabled="!isMember")
        .column.items-center
          q-icon.q-pa-xs(color="primary" size="md" name="fas fa-wallet")
          .text-caption.text-no-wrap.text-primary.text-bold My Wallet
    .col-6.button-square
      q-btn.fit(@click="logout" rounded unelevated color="internal-bg")
        .column.items-center
          q-icon.q-pa-xs(color="primary" size="md" name="fas fa-sign-out-alt")
          .text-caption.text-no-wrap.text-primary.text-bold Logout
</template>

<style lang="stylus" scoped>
.button-square
  height var(--button-size)
  width var(--button-size)

.text-caption
  font-size 10px !important
  font-weight 600 !important
  font-family Source Sans Pro, sans-serif !important
</style>

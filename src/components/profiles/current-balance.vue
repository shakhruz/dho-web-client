<template lang="pug">
widget(title="Current balance")
  .h-b2.sub.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
  .q-mt-md
    template(v-for="token of tokens")
      .div.q-mb-sm
        .row.q-mb-xs
          .h-btn1.text-heading {{ token.name }}
        .row
          .col-3
            q-avatar(size="40px")
              img(:src="token.logo")
          .col.bg-internal-bg.flex.items-center.q-px-sm.q-ml-xs.border.rounded-top
            q-spinner-dots(
              v-if="loading"
              color="primary"
              size="30px"
            )
            .h-b2.text-heading(v-else) {{ token.amount }}
</template>

<script>
export default {
  name: 'current-balance',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },
  props: {
    tokens: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean
    }
  }
}
</script>

<style lang="stylus">
.sub
  color: #9EA0A5 !important
.rounded-top
  border-radius:  26px
</style>

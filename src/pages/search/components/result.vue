<template lang="pug">
widget.bg-internal-bg.q-mb-sm
  .row.items-center.justify-between
    q-btn(round unelevated :icon="icon" color="primary" text-color="white" size="sm" :ripple="false")
    .q-ml-md.q-mr-auto.spacingInfo
      .text-body1.text-bold {{ title.length > maxChar ? title.substring(0,maxChar) + '...' : title }}
      .text-body2.text-italic.grey-color {{ getType }}
      div.text-body2.grey-color(v-html="getHighlight")
    chips(:tags="getTags")
</template>

<script>
import { format } from '~/mixins/format'

export default {
  name: 'result',
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    Chips: () => import('~/components/common/chips.vue')
  },
  mixins: [format],
  props: {
    icon: String,
    title: String,
    type: String,
    salary: String,
    compensation: String,
    status: String,
    highlights: Object
  },
  computed: {
    getType () {
      /* eslint-disable no-multi-spaces */
      switch (this.type) {
        case 'Member':          return 'Member'
        case 'Assignbadge':     return 'Recurring Activity'
        case 'Assignment':      return 'Recurring Activity'
        case 'Role':            return 'Organizational'
        case 'Badge':           return 'Organizational Asset'
        case 'Payout':          return 'One Time Activity'
        case 'Payment':         return 'Payment'
        default:                return ''
      }
    },
    getHighlight () {
      return this.highlights.details_description_s?.[0].substring(0, this.maxChar)
    },
    getTags () {
      const tags = this.tags
      const status = this.statusTags
      if (tags?.length > 0 && status?.length > 0) {
        return status.concat(tags)
      } else {
        return null
      }
    },
    statusTags () {
      if (this.status === 'approved') {
        return [{ label: 'Active', color: 'positive' }]
      }
      if (this.status === 'proposed') {
        return [{ label: 'Voting', color: 'warning' }]
      }
      if (this.status === 'suspended') {
        return [{ label: 'Suspended', color: 'negative' }]
      }
      return null
    },
    tags () {
      if (this.type === 'Payout') {
        const [usdAmount] = this.compensation.split(' ')
        return [
          { color: 'primary', label: 'Generic Contribution' },
          { color: 'grey', outline: true, label: `${this.shortNumber(usdAmount)} HUSD` }
        ]
      }

      if (this.type === 'Assignment' || this.type === 'Edit') {
        return [
          { color: 'primary', label: 'Role Assignment' }
          // { color: 'primary', outline: true, label: 'Circle One' }
          // { color: 'primary', label: 'B3' },
          // { color: 'grey-4', label: '80%', text: 'grey-7' }
        ]
      }

      if (this.type === 'Assignbadge') {
        return [
          { color: 'primary', label: 'Badge Assignment' },
          { color: 'primary', outline: true, label: 'Assign' }
          // { color: 'primary', outline: true, label: 'Circle One' }
        ]
      }

      if (this.type === 'Suspend') {
        return [
          { color: 'primary', label: 'Suspension' }
        ]
      }

      if (this.type === 'Role') {
        const [amount] = this.salary.split(' ')
        let band = ''
        if (amount <= 80000) band = 'B1'
        if (amount > 80000) band = 'B2'
        if (amount > 100000) band = 'B3'
        if (amount > 120000) band = 'B4'
        if (amount > 140000) band = 'B5'
        if (amount > 160000) band = 'B6'
        if (amount > 180000) band = 'B7'
        return [
          { color: 'primary', label: ' Role Archetype' },
          { color: 'primary', outline: true, label: `${band} ${this.shortNumber(amount)}` }
        ]
      }

      if (this.type === 'Badge') {
        return [
          { color: 'primary', label: 'Badge' }
        ]
      }

      return null
    }
  },
  data () {
    return {
      maxChar: 50
    }
  }
}
</script>

<style scope lang="stylus">
.grey-color
  color: #84878E
.spacingInfo
  max-width: 50%
</style>

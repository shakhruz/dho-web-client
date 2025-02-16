<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import BadgeAssignmentsStack from '~/components/documents-parts/badge-assignments-stack'
import TopRightIcon from '~/components/documents-parts/top-right-icon'
import { documents, getValueFromDocument } from '~/mixins/documents'
import { format } from '~/mixins/format'

export default {
  name: 'assignment-card',
  mixins: [documents, format],
  components: { TopRightIcon, BadgeAssignmentsStack },

  props: {
    assignment: { type: Object, required: true },
    history: { type: Boolean, required: false }
  },

  data () {
    return {
      profile: null,
      role: null,
      showClaim: false,
      claiming: false,
      currentPeriod: null,
      timeout: null,
      countdown: '',
      suspendReason: '',
      withdrawNotes: '',
      newCommit: 0
    }
  },

  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapActions('assignments', ['claimAssignmentPayment', 'adjustCommitment', 'suspendAssignment', 'withdrawFromAssignment']),
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapActions('roles', ['loadRole']),
    showCardFullContent () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'assignmentView',
        data: this.assignment
      })
    },
    async onAdjustAssignment () {
      await this.adjustCommitment({ hash: this.assignment.hash, commitment: this.newCommit })
    },
    async onSuspendAssignment () {
      await this.suspendAssignment({ hash: this.assignment.hash, reason: this.suspendReason })
      await this.$router.push({ path: '/documents-proposal/payout' })
    },
    async onWithdrawFromAssignment () {
      await this.withdrawFromAssignment({ hash: this.assignment.hash, notes: this.withdrawNotes })
      if (this.$router.currentRoute.path !== `/@${this.account}`) {
        await this.$router.push({ path: `/@${this.account}` })
      }
    },
    async onClaimAssignmentPayment () {
      this.claiming = true
      await this.claimAssignmentPayment(this.assignment.hash)
      this.$emit('claimed')
      this.claiming = false
    },
    async verifyClaim () {
      const startIdx = this.getPeriodIndexByDate(new Date(this.startPhase.startDate))
      const maxIdx = Math.min(this.getPeriodIndexByDate(new Date()), startIdx + this.periodCount)
      let allClaimed = true
      for (let i = startIdx; i <= maxIdx - 1; i += 1) {
        const start = this.periods[i].startDate
        if (!this.assignment.claimed || !this.assignment.claimed.some(c => {
          const claim = new Date(getValueFromDocument(c, 'details', 'start_time') + 'Z')
          return start.getFullYear() === claim.getFullYear() &&
            start.getMonth() === claim.getMonth() &&
            start.getDate() === claim.getDate()
        })) {
          allClaimed = false
        }
      }

      this.showClaim = !allClaimed

      if (!this.showClaim && !this.isExpired) {
        this.currentPeriod = await this.getPeriodByDate(new Date())
        if (!this.currentPeriod) return
        this.timeout = setInterval(this.updateCountdown, 1000)
      }
    },
    updateCountdown () {
      const end = new Date(this.currentPeriod.endDate + 'Z').getTime()
      const t = end - Date.now()
      if (t >= 0) {
        const days = Math.floor(t / (1000 * 60 * 60 * 24))
        const hours = `0${Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}`.slice(-2)
        const mins = `0${Math.floor((t % (1000 * 60 * 60)) / (1000 * 60))}`.slice(-2)
        const secs = `0${Math.floor((t % (1000 * 60)) / 1000)}`.slice(-2)
        if (days) {
          this.countdown = `${days}d `
        } else {
          this.countdown = ''
        }
        this.countdown += `${hours}:${mins}:${secs}`
      } else {
        this.countdown = ''
        setTimeout(this.verifyClaim, 2000)
        clearInterval(this.timeout)
      }
    },
    editObject () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'assignmentForm',
        data: {
          hash: this.assignment.hash,
          role: this.role,
          url: this.getValue(this.assignment, 'details', 'url'),
          salaryCommitted: this.getValue(this.assignment, 'details', 'time_share_x100'),
          salaryDeferred: this.getValue(this.assignment, 'details', 'deferred_perc_x100'),
          startPeriod: this.startPhase,
          periodCount: this.periodCount,
          edit: true
        }
      })
    }
  },

  async mounted () {
    this.profile = await this.getPublicProfile(this.assignee)
    if (this.account === this.assignee) {
      await this.verifyClaim()
    }
  },

  beforeDestroy () {
    if (this.timeout) {
      clearInterval(this.timeout)
    }
  },

  computed: {
    ...mapGetters('accounts', ['account', 'isAuthenticated']),
    ...mapGetters('periods', ['periods', 'getEndPeriod', 'getPeriodByDate', 'getPeriodIndexByDate', 'getMaxCurrentPeriodCount']),
    title () {
      return this.getValue(this.assignment, 'details', 'title')
    },
    url () {
      return this.getValue(this.assignment, 'details', 'url')
    },
    assignee () {
      return this.getValue(this.assignment, 'details', 'assignee')
    },
    roleId () {
      return this.getValue(this.assignment, 'details', 'role')
    },
    currCommit () {
      let current = this.maxCommit
      if (this.assignment && this.assignment.lastimeshare) {
        current = this.getValue(this.assignment.lastimeshare[0], 'details', 'time_share_x100')
      }
      return current
    },
    maxCommit () {
      return this.getValue(this.assignment, 'details', 'time_share_x100')
    },
    isAdjusted () {
      return this.currCommit < this.maxCommit
    },
    startPhase () {
      const period = this.getValue(this.assignment, 'details', 'start_period')
      if (period) {
        return this.periods.find(p => p.value === period)
      }
      return null
    },
    periodCount () {
      return this.getValue(this.assignment, 'details', 'period_count')
    },
    endPhase () {
      return this.startPhase && this.getEndPeriod({ value: this.startPhase.value, periodCount: this.periodCount - 1 })
    },
    isExpired () {
      return !this.startPhase || (this.endPhase && this.endPhase.endDate && new Date(this.endPhase.endDate).getTime() < Date.now())
    },
    willExpireWithin3Votes () {
      // We give users 3 voting durations to extend their assignment
      const TIME_TO_EXTEND = 3 * this.$config.contracts.voteDurationSeconds * 1000
      if (this.endPhase) {
        const expireTime = new Date(this.endPhase.endDate).getTime()
        if (Date.now() + TIME_TO_EXTEND > expireTime) {
          return true
        }
      }
      return false
    },
    annualSalary () {
      return this.role && this.getValue(this.role, 'details', 'annual_usd_salary')
    },
    roleTitle () {
      return this.role && this.getValue(this.role, 'details', 'title')
    }
  },
  watch: {
    roleId: {
      immediate: true,
      async handler (val) {
        this.role = val && await this.loadRole(val)
      }
    }
  }
}
</script>

<template lang="pug">
q-card.assignment(v-if="(isExpired && history) || (!isExpired && !history)")
  .ribbon(v-if="isExpired")
    span.text-white.bg-red EXPIRED
  .ribbon(v-else-if="isAdjusted")
    span.text-white.bg-red ADJUSTED
  q-btn.card-menu(
    icon="fas fa-ellipsis-v"
    color="grey"
    flat
    dense
    round
    no-caps
    :ripple="false"
    style="width:40px;height:40px;margin: 4px;"
  )
    q-menu
      q-list(dense)
        q-item(
          v-if="account === assignee"
          clickable
          disable
          v-close-popup
          @click="editObject"
        )
          q-item-section(style="max-width: 20px;")
            q-icon(name="fas fa-pencil-alt" size="14px")
          q-item-section Modify
        q-item(
          v-if="account === assignee"
          clickable
        )
          q-popup-proxy(@before-show="newCommit = currCommit")
            .confirm.column.bg-white.q-pa-sm
              | If you adjust your assignment, your % commitment will be immediately
              | reflected on your next claim (no vote is necessary). Multiple adjustments
              | during the same claim period will be included in the calculation.
              .commit-group.q-mt-sm.q-px-sm.q-pb-sm
                .row.q-pt-xs.q-pb-md New % Commitment
                .row.q-mt-sm.q-px-md
                  q-slider(
                    v-model="newCommit"
                    :min="0"
                    :max="maxCommit"
                    :step="5"
                    label
                    :label-value="newCommit + '%'"
                    label-always
                    color="primary"
                  )
                .row.text-caption.justify-between
                  span 0%
                  span {{ maxCommit + '%' }}
              .row.flex.justify-between.q-mt-sm
                q-btn(
                  color="primary"
                  label="No"
                  dense
                  flat
                  v-close-popup="-1"
                )
                q-btn(
                  color="primary"
                  label="Yes"
                  dense
                  @click="onAdjustAssignment"
                  v-close-popup="-1"
                )
          q-item-section(style="max-width: 20px;")
            q-icon(name="fas fa-sliders-h" size="14px")
          q-item-section Adjust
        q-item(
          v-if="account !== assignee"
          clickable
        )
          q-popup-proxy
            .confirm.column.bg-white.q-pa-sm
              | This action will propose a suspension.
              | Are you sure you want to suspend this assignment?
              q-input(
                v-model="suspendReason"
                label="Reason"
              )
              .row.flex.justify-between.q-mt-sm
                q-btn(
                  color="primary"
                  label="No"
                  dense
                  flat
                  v-close-popup="-1"
                )
                q-btn(
                  color="primary"
                  label="Yes"
                  dense
                  @click="onSuspendAssignment"
                  v-close-popup="-1"
                )
          q-item-section(style="max-width: 20px;")
            q-icon(name="fas fa-ban" size="14px")
          q-item-section Suspend
        q-item(
          v-if="account === assignee"
          clickable
        )
          q-popup-proxy
            .confirm.column.bg-white.q-pa-sm
              | If you withdraw your assignment, it will be removed from the DHO
              | and claims will no longer be processed, effective from the period
              | you withdraw the assignment.
              | Are you sure you want to withdraw from this assignment?
              q-input(
                v-model="withdrawNotes"
                label="Notes"
              )
              .row.flex.justify-between.q-mt-sm
                q-btn(
                  color="primary"
                  label="No"
                  dense
                  flat
                  v-close-popup="-1"
                )
                q-btn(
                  color="primary"
                  label="Yes"
                  dense
                  @click="onWithdrawFromAssignment"
                  v-close-popup="-1"
                )
          q-item-section(style="max-width: 20px;")
            q-icon(name="fas fa-times" size="14px")
          q-item-section Withdraw
  top-right-icon(type="assignment" :menu="true")
  q-card-section.text-center.q-pb-sm.relative-position
    badge-assignments-stack.badge-stack(v-if="assignee" :username="assignee")
    q-img.avatar(
      v-if="profile && profile.publicData.avatar"
      :src="profile.publicData.avatar"
      @click="$router.push({ path: `/@${assignee}`})"
    )
    q-avatar.avatar(
      v-else
      size="150px"
      color="accent"
      text-color="white"
      @click="$router.push({ path: `/@${assignee}`})"
    )
      | {{ assignee.slice(0, 2).toUpperCase() }}
    .salary-bucket.bg-proposal(v-if="annualSalary") {{ getSalaryBucket(parseInt(annualSalary)) }}
  q-card-section
    .type(@click="showCardFullContent") {{ (profile && profile.publicData && profile.publicData.name) || assignee }}
    .title.text-italic(v-if="title !== roleTitle" @click="showCardFullContent") {{ title }}
    .title(@click="showCardFullContent") {{ roleTitle }}
    .date(v-if="startPhase") Started on {{ new Date (startPhase.startDate).toLocaleDateString() }}
  q-card-section(v-if="account === assignee" align="center")
    .text-body
      span.tip Visit your
      router-link.q-px-xs(:to="{ path: `/@${account}`}") Profile
      span.tip to claim or extend
  // q-card-actions.q-pa-lg.actions(v-if="account === assignee" align="center")
    .flex.justify-around.full-width
      q-btn(
        v-if="showClaim"
        label="Claim"
        color="assignment"
        :loading="claiming"
        rounded
        dense
        unelevated
        @click="onClaimAssignmentPayment"
      )
      q-btn(
        v-if="account === assignee && (isExpired || willExpireWithin3Votes)"
        label="Extend"
        color="orange"
        rounded
        dense
        unelevated
        @click="editObject"
      )
    .countdown.q-mt-sm(v-if="countdown !== '' && !isExpired")
      q-icon.q-mr-sm(name="fas fa-exclamation-triangle" size="sm")
      | Next claim in {{ countdown }}
</template>

<style lang="stylus" scoped>
.assignment
  width 300px
  border-radius 1rem
  margin 10px
.assignment:hover
  z-index 10
  box-shadow 0 8px 12px rgba(0,0,0,0.2), 0 9px 7px rgba(0,0,0,0.14), 0 7px 7px 7px rgba(0,0,0,0.12)
  .avatar, .salary-bucket
    z-index 110
.avatar
  margin-top 20px
  cursor pointer
  border-radius 50% !important
  width 150px
  height 150px
.salary-bucket
  position absolute
  bottom 10px
  right 80px
  color white
  font-size 28px
  font-weight 700
  border-radius 50%
  width 45px
.description
  white-space pre-wrap
  max-height 55px
  overflow auto
.type
  cursor pointer
  text-transform capitalize
  text-align center
  font-weight 800
  font-size 28px
.title
  cursor pointer
  text-align center
  font-size 20px
  color $body
  line-height 22px
.date
  margin-top 5px
  text-align right
  font-size 14px
  color $body
  line-height 22px
.actions
  button
    width 45%
.card-menu
  position absolute
  right 0
  top 7px
  width 20px
  z-index 110
  /deep/.q-focus-helper
    display none !important
.badge-stack
  top 40px
.confirm
  max-width 275px
  .commit-group
    background-color #EFEFEF
</style>

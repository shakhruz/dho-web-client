<script>
/**
 * A selectable 'radio button' which shows the title, salary and description of an archetype.
 */
export default {
  name: 'archetype-radio',
  components: {
    ButtonRadio: () => import('~/components/common/button-radio.vue')
  },

  props: {
    /**
     * Archetype object from backend
     */
    archetype: Object,
    /**
     * Whether this radio has been selected
     */
    selected: Boolean
  },

  // TODO: Move these methods to shared location
  methods: {
    description (archetype) {
      return archetype.details_description_s
    },

    minDeferred (archetype) {
      return archetype.details_minDeferredX100_i
    },
    minCommitment  (archetype) {
      return archetype.details_minTimeShareX100_i
    },
    salary (archetype) {
      return parseFloat(archetype.details_annualUsdSalary_a)
    },

    salaryBucket (archetype) {
      const amount = this.salary(archetype)
      if (amount <= 80000) {
        return 'B1'
      } else if (amount > 80000 && amount <= 100000) {
        return 'B2'
      } else if (amount > 100000 && amount <= 120000) {
        return 'B3'
      } else if (amount > 120000 && amount <= 140000) {
        return 'B4'
      } else if (amount > 140000 && amount <= 160000) {
        return 'B5'
      } else if (amount > 160000 && amount <= 180000) {
        return 'B6'
      } else if (amount > 180000) {
        return 'B7'
      }

      return null
    },

    title (archetype) {
      return archetype.details_title_s
    },

    selectArchetype () {
      this.$emit('click', {
        docId: this.archetype.docId,
        title: this.title(this.archetype),
        description: this.description(this.archetype),
        salary: this.salary(this.archetype),
        minDeferred: this.minDeferred(this.archetype),
        minCommitment: this.minCommitment(this.archetype),
        type: 'Role',
        salaryBucket: this.salaryBucket(this.archetype)
      })
    }
  }
}
</script>

<template lang="pug">
.archetype-radio
  button-radio(
    :iconText="salaryBucket(archetype)"
    :title="title(archetype)"
    :description="`${salary(archetype).toLocaleString()} USD Equivalent / Year, Minimum Deferred ${minDeferred(archetype)}%`"
    :selected="selected"
    @click="selectArchetype"
  )
</template>

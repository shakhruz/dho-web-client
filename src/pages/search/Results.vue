<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import ElasticSearch from '~/elasticSearch/elastic-search.js'
export default {
  name: 'page-search-results',
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    Result: () => import('./components/result.vue'),
    FilterWidget: () => import('~/components/filters/filter-widget.vue')
  },
  meta: {
    title: 'Search results'
  },
  computed: {
    ...mapState('search', ['search']),
    ...mapGetters('dao', ['selectedDao']),
    getPaginationText () {
      const total = this.results.total ? this.results.total.value : 0
      if (total === 0) {
        return 'No results found'
      }
      const lowerBound = this.params.from + 1
      let upperBound = this.params.from + this.params.size + 1
      if (upperBound > total) {
        upperBound = total
      }
      return lowerBound + '-' + upperBound + ' of ' + total
    },
    isLastPage () {
      const totalResults = this.results.total ? this.results.total.value : 0
      return this.params.from + this.params.size >= totalResults
    }
  },
  watch: {
    search: {
      async handler () {
        this.results = []
        this.params.from = 0
        this.params.size = 10
        await this.onSearch()
      },
      immediate: false
    },
    'selectedDao.docId': {
      async handler () {
        if (this.$route.query.q && this.search !== this.$route.query.q) {
          await this.setSearch(this.$route.query.q)
        }
        this.results = []
        this.params.from = 0
        this.params.size = 10
        await this.onSearch()
      },
      immediate: true
    },
    filters: {
      handler () {
        if (!this.filtersToEvaluate) {
          const someFilterIsTrue = this.filters.some(filter => filter.enabled && (filter.label !== this.filters[0].label))
          if (someFilterIsTrue && this.filters[0].enabled) {
            this.filters[0].enabled = false
          }
          this.filtersToEvaluate = JSON.parse(JSON.stringify(this.filters))
          return
        }
        if (!this.filtersToEvaluate[0].enabled && this.filters[0].enabled) {
          this.filters = this.filters.map(f => {
            if (f.label === this.filters[0].label) {
              return f
            }
            return { ...f, enabled: false }
          })
        } else {
          const someFilterIsTrue = this.filters.some(filter => filter.enabled && (filter.label !== this.filters[0].label))
          if (someFilterIsTrue && this.filters[0].enabled) {
            this.filters[0].enabled = false
          }
        }

        this.filtersToEvaluate = JSON.parse(JSON.stringify(this.filters))
        this.params.filter.queries = []
        if (this.filters[0].enabled) {
          this.params.filter.queries = [
            'Payout', 'Member', 'Assignbadge',
            'Assignment', 'Role', 'Badge',
            'Payout'
          ]
          this.params.from = 0
          this.params.size = 10
          this.onSearch()
        } else {
          this.params.filter.queries = []
          this.filters.forEach((filter) => {
            if (filter.enabled) {
              switch (filter.label) {
                case 'Members':
                  this.params.filter.queries.push('Member')
                  break
                case 'Recurring Activity':
                  this.params.filter.queries.push('Assignbadge', 'Assignment')
                  break
                case 'Organizational':
                  this.params.filter.queries.push('Role', 'Badge')
                  break
                case 'One Time Activity':
                  this.params.filter.queries.push('Payout')
                  break
              }
            }
          })
          this.params.from = 0
          this.params.size = 10
          this.onSearch()
        }
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      params: {
        from: 0,
        size: 10,
        fields: [
          'details_title_s', 'details_description_s',
          'system_nodeLabel_s', 'details_member_n'
        ],
        fuzziness: 'AUTO',
        filter: {
          queries: [
            'Payout', 'Member', 'Assignbadge',
            'Assignment', 'Role', 'Badge'
          ],
          fieldsDocType: ['type'],
          fieldsBelongs: ['edges.dao', 'edges.memberof', 'edges.applicantof', 'edges.payment'],
          ids: []
        }
      },
      optionArray: ['Sort by last added'],
      circleArray: ['All circles'],
      results: [],
      filters: [
        {
          label: 'All',
          enabled: true,
          filter: () => true
        },
        {
          label: 'Members',
          enabled: false,
          filter: (p) => p.__typename === 'Member'
        },
        {
          label: 'One Time Activity',
          enabled: false,
          filter: (p) => p.__typename === 'One time activity'
        },
        {
          label: 'Recurring Activity',
          enabled: false,
          filter: (p) => p.__typename === 'Recurring Activity'
        },
        {
          label: 'Organizational',
          enabled: false,
          filter: (p) => p.__typename === 'Organizational'
        }
      ],
      filtersToEvaluate: undefined
    }
  },
  methods: {
    ...mapMutations('search', ['setSearch']),
    onClick (document) {
      document.type === 'Member'
        ? this.$router.push({ name: 'profile', params: { username: document.system_nodeLabel_s } })
        : this.$router.push({ name: 'proposal-detail', params: { docId: document.docId } })
    },
    getIcon (type) {
      /* eslint-disable no-multi-spaces */
      switch (type) {
        case 'Member':      return 'far fa-user'
        case 'Assignbadge':     return 'far fa-calendar-alt'
        case 'Assignment':     return 'far fa-calendar-alt'
        case 'Role':        return 'far fa-user'
        case 'Badge':       return 'fas fa-award'
        case 'Payout':      return 'far fa-paper-plane'
        case 'Payment':     return 'far fa-paper-plane'
        default:              return ''
      }
    },
    async onSearch () {
      if (this.selectedDao.docId) {
        this.params.filter.ids = [this.selectedDao.docId]
        const _results = await ElasticSearch.search(this.search, this.params)
        // const _resultsAlphabetical = await this.sortAlphabetically(_results.hits)
        // _results.hits.hits = _resultsAlphabetical
        this.results = _results.hits
      }
    },
    async sortAlphabetically (array) {
      return array.hits.sort((a, b) => {
        const firstElement = a._source.details_title_s || a._source.system_nodeLabel_s
        const secondElement = b._source.details_title_s || b._source.system_nodeLabel_s
        if (firstElement < secondElement) {
          return -1
        }
        if (firstElement > secondElement) {
          return 1
        }
        return 0
      })
    },
    async onPrev () {
      this.params.from = this.params.from - this.params.size
      await this.onSearch()
    },
    async onNext () {
      this.params.from = this.params.from + this.params.size
      await this.onSearch()
    }

  }
}

</script>

<template lang="pug">
q-page.page-search-results
  .row.q-mt-sm
    .col-9.q-px-sm.q-py-md
      widget(:title="`${results.total ? results.total.value : 0} Results`" )
        div.cursor-pointer(v-for="result in results.hits" @click="onClick(result._source)")
          result(
            :type="result._source.type"
            :title="result._source.type !== 'Member' ? result._source.details_title_s : result._source.system_nodeLabel_s"
            :key="result.title"
            :icon ="getIcon(result._source.type)"
            :salary="result._source.details_annualUsdSalary_a"
            :compensation="result._source.details_voiceAmount_a"
            :status="result._source.details_state_s"
            :applicant="result._source.details_applicant_s"
            :highlights="result.highlight"
          )
        .row.justify-between.q-pt-sm
          q-btn(@click="onPrev()" :disable="!params.from" round unelevated class="round-circle" icon="fas fa-chevron-left" color="inherit" text-color="primary" size="sm" :ripple="false")
          .q-pt-sm {{  getPaginationText }}
          q-btn(@click="onNext()" :disable="isLastPage" round unelevated class="round-circle" icon="fas fa-chevron-right" color="inherit" text-color="primary" size="sm" :ripple="false")
    .col-3.q-pa-sm.q-py-md
      filter-widget.sticky(
        filterTitle="Search DHOs"
        :optionArray="optionArray"
        :circleArray="circleArray"
        :showToggle="false"
        :showViewSelector="false"
        :chipsFiltersLabel="'Results types'"
        :filters.sync="filters"
        :showTextFilter="false"
      )
</template>

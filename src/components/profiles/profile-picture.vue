<script>
import { mapActions } from 'vuex'

/**
 * Renders the individual's avatar or a placeholder
 */
export default {
  name: 'profile-picture',

  props: {
    url: String,
    // avatar: String,
    // name: String,
    username: String,
    textOnly: Boolean,
    showName: Boolean,
    showUsername: Boolean,
    size: {
      type: String,
      default: '200px'
    },
    tooltip: Boolean,
    underline: {
      type: Boolean,
      default: true
    },
    link: Boolean,
    badge: String,
    detail: String,
    limit: Boolean
  },

  data () {
    return {
      name: null,
      avatar: null,
      errorCount: 0
    }
  },

  computed: {
    nameTooltip () {
      return `${this.name ? `${this.name}<br />` : ''}@${this.username}`
    }
  },

  watch: {
    url: {
      handler: async function () {
        this.getAvatar()
      },
      immediate: true
    },
    username: {
      handler: async function () {
        this.getAvatar()
      },
      immediate: true
    }
  },

  methods: {
    ...mapActions('profiles', ['getPublicProfile']),

    reload () {
      this.getAvatar()
    },

    onImageError () {
      if (this.errorCount < 1) {
        this.getAvatar(true) // We could remove this if the resource TTL is removed on the server
      } else {
        this.avatar = undefined
      }
      this.errorCount++
    },

    async getAvatar (forceUpdate) {
      if (this.url) {
        this.avatar = this.url
        return
      }

      if (this.username) {
        this.avatar = null
        this.name = this.username
        this.errorCount = 0
        const profile = await this.getPublicProfile({ username: this.username, forceUpdate })
        if (profile) {
          this.avatar = profile.publicData.avatar
          this.name = profile.publicData.name || this.username
        }
      }
    },

    getNameAbbreviation () {
      if (this.name) return this.name.slice(0, 2).toUpperCase()
      if (this.username) return this.username.slice(0, 2).toUpperCase()
      return null
    },

    onClick () {
      if (this.link && this.username) {
        this.$router.push({ path: `@${this.username}` })
      }
    }
  }
}
</script>

<template lang="pug">
.row.items-center.no-wrap
  q-avatar(v-if="avatar && !textOnly"
    :size="size"
    :class="{ 'cursor-pointer': link && username, 'q-mr-md': showName }"
    @click="onClick"
  )
    q-img(:src="avatar" @error="onImageError")
      q-tooltip(v-if="tooltip"
          anchor="top middle"
          self="bottom middle"
          :content-style="{ 'font-size': '1em' }"
        )
          div(v-html="nameTooltip")
    q-badge(v-if="badge" floating rounded color="red" :label="badge")
  q-avatar(v-else
    color="secondary"
    text-color="white"
    :size="size"
    :class="{ 'cursor-pointer': link && username, 'q-mr-md': showName }"
    @click="onClick"
  ) {{ getNameAbbreviation() }}
    q-badge(v-if="badge" floating rounded color="red" :label="badge")
    q-tooltip(v-if="tooltip"
      anchor="top middle"
      self="bottom middle"
      :content-style="{ 'font-size': '1em' }"
    )
      div(v-html="nameTooltip")
  div.q-my-xs(v-if="showName || showUsername || detail")
    .h-b1.text-bold(v-if="showName" :class="{ 'one-line': limit}") {{ name }}
    .text-body2.text-italic.text-body(v-if="showUsername") {{ '@' + username }}
    .h-b3.text-italic.text-heading(v-if="detail") {{ detail }}
    slot(name="detail")
</template>

<style lang="stylus" scoped>
.one-line
  overflow: hidden
  display: -webkit-box
  -webkit-box-orient: vertical
  -webkit-line-clamp: 1
  max-width: 95px
</style>

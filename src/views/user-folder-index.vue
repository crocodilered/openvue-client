<template>
  <v-container>
    <loading-indicator v-model="loading"></loading-indicator>

    <v-layout v-if="!loading" wrap align-center>
      <v-flex xs12 sm6 order-xs2>
        <v-btn
          color="primary"
          depressed
          @click="applyPerformer"
          :disabled="availableFoldersCount === 0"
        >Взять дело для расшифровки</v-btn>
      </v-flex>
      <v-flex xs12 sm6 order-xs1>
        <p><big>Дел в очереди: {{ availableFoldersCount }}</big></p>
      </v-flex>
    </v-layout>

    <hr class="hidden-xs-only" style="margin:2em 0">

    <v-layout wrap>
      <v-flex v-if="folders1" xs12 sm6 order-sm1>
        <h2>В работе</h2>
        <ul class="folders">
          <li
            v-for="(o, i) in folders1"
            :key="`folders1-${i}`"
          >
            <router-link :to="`/folder2/${o.id}`">{{ o.title }}</router-link>
          </li>
        </ul>
      </v-flex>

      <v-flex v-if="folders2" xs12 sm6 order-sm3>
        <h2>На проверке</h2>
        <ul class="folders">
          <li
            v-for="(o, i) in folders2"
            :key="`folders2-${i}`"
          >
            {{ o.title }}
          </li>
        </ul>
      </v-flex>

      <v-flex v-if="folders3" xs12 sm6 order-sm2>
        <h2>Расшифровано</h2>
        <ul class="folders">
          <li
            v-for="(o, i) in folders3"
            :key="`folders3-${i}`"
          >
            {{ o.title }}
          </li>
        </ul>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
  import conf from '@/conf'
  import LoadingIndicator from '@/controls/LoadingIndicator.vue'

  const data = function () {
    return {
      loading: false,
      folders: [],
      availableFoldersCount: null
    }
  }

  const computed = {
    // Дела в работе
    folders1: function () {
      return this.getFoldersByStatus(1)
    },
    // Дела на проверке
    folders2: function () {
      return this.getFoldersByStatus(2)
    },
    // Дела расшифрованы
    folders3: function () {
      return this.getFoldersByStatus(3)
    },
  }

  const methods = {
    getFoldersByStatus: function (status) {
      let result = null
      if (this.folders) {
        const filtered = this.folders.filter(item => item.status === status)
        if (filtered.length > 0) result = filtered
      }
      return result
    },

    applyPerformer: async function () {
      const resp = await conf.req.post('/folder/apply_performer/')
      if (resp.data) {
        this.availableFoldersCount -= 1
        this.folders.push(resp.data)
      }
    }
  }

  export default {
    components: { LoadingIndicator },
    data,
    computed,
    methods,
    async created () {
      let resp
      this.loading = true
      // Load stats
      resp = await conf.req.post('/folder/')
      if (resp.errorCode === 0 ) {
        this.availableFoldersCount = resp.countAvailable
      }
      // Load folders list
      resp = await conf.req.post('/folder/list_by_user/')
      if (resp.errorCode === 0 && resp.data.length > 0 ) {
        this.folders = resp.data
      }
      this.loading = false
    }
  }
</script>

<style lang="scss">
  ul.folders {
    margin: 0;
    padding: 0;
    li {
      margin: 8px 0;
      list-style-type: none;
    }
  }
</style>

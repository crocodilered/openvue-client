<!--
  Import (register) folders from disk to database.
-->

<template>
  <v-container>
    <v-layout wrap>
      <v-flex xs12 sm6>
        <h1>Импорт дел</h1>
        <p>Дел загружено и не импортировано: {{ countPurgatory }}</p>
        <v-btn
          @click.prevent="importFolders"
          :loading="loading"
          :disabled="countPurgatory === 0"
          color="primary"
          depressed
        >Импортировать</v-btn>
      </v-flex>
    </v-layout>
    <v-snackbar
      v-model="messageStatus"
      color="succcess"
      vertical
    >
      Все отлично, данные импортированы.
      <v-btn
        flat
        @click="messageStatus = false"
      >Закрыть</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
  import conf from '@/conf'

  const data = function () {
    return {
      loading: false,
      messageStatus: false,
      countRegistered: null,
      countPurgatory: null
    }
  }

  const methods = {
    importFolders () {
      this.loading = true
      conf.req.post('/folder/import/')
        .then(() => {
          this.countPurgatory = 0
          this.messageStatus = true
        })
        .finally(() => (this.loading = false))
    }
  }

  export default {
    data,
    methods,
    async created () {
      // Load data
      const resp = await conf.req.post('/folder/')
      if (resp.errorCode === 0) {
        this.countPurgatory = resp.countPurgatory
      }
    }
  }
</script>

<style scoped>
  dt {
    font-size: 1.5rem;
  }
</style>

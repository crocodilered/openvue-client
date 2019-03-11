<!--
  View content of folder,
  list of transcripts,
  create new transcript
-->

<template>
  <v-container>
    <loading-indicator v-model="loading"></loading-indicator>
    <v-layout
      v-if="!loading && folder"
      align-center
      justify-center
      wrap
    >
      <v-flex xs12>
        <h1>{{ folder.title }}</h1>

        

      </v-flex>
      <v-flex xs12>
        <v-layout wrap>
          <v-flex
            xs12
            sm4
            align-self-center
            order-xs2
            order-sm1
          >
            <v-btn
              depressed
              outline
              color="secondary"
              :to="`/folder2/${folder.id}/formular/`"
            >
              <v-icon>add</v-icon>
              Создать формуляр
            </v-btn>
            <v-btn
              v-if="folder.formulars"
              depressed
              outline
              color="secondary"
              @click="doneDialogShow = true"
            >
              <v-icon>done_all</v-icon>
              Отправить на проверку
            </v-btn>
          </v-flex>
          <v-flex
            xs12
            sm8
            order-xs1
            order-sm2
          >
            <v-alert
              :value="true"
              color="info"
            >
              <p>
                <big><a
                  href="https://docs.google.com/document/d/140WmQYGaQQedXT80ieJgZpSQiBqsYl-fiBVeUshl_HY"
                  style="color: white;"
                >
                  Инструкция по вводу анкет
                </a></big>
              </p>
              <p>По окончании работы запишите страницу и нажмите на кнопку «Отправить на проверку».</p>
            </v-alert>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12>
        <h2>Созданные формуляры</h2>
        <ul v-if="folder.formulars">
          <li
            v-for="(o, i) in folder.formulars"
            :key="`formular-${i}`"
          >
            <a
              :href="formularUrl(o.title)"
              target="_blank"
            >
              {{ o.title }}
            </a>
          </li>
        </ul>
        <p v-else>
          Не создано ни одного Формуляра.
        </p>
      </v-flex>
      
      <v-flex xs12>
        <h2>Сканы страниц</h2>
        <div class="photos">
          <a
            target="_blank"
            v-for="(v, i) in photos"
            :key="`photo-${i}`"
            :href="v"
          >
            <img :src="v" />
          </a>
        </div>
      </v-flex>
    </v-layout>

    <!-- DONE dialog -->
    <v-dialog v-model="doneDialogShow" max-width="290">
      <v-card>
        <v-card-title class="headline">Вы уверены?</v-card-title>
        <v-card-text>
          Формуляры будут отправлены на проверку.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            flat="flat"
            @click="doneDialogShow = false"
          >
            Передумал
          </v-btn>
          <v-btn
            color="primary"
            flat="flat"
            :loading="doneDialogLoading"
            @click="doneDialogLoadingClick"
          >
            Отправить!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- /DONE dialog -->
  </v-container>
</template>

<script>
  import conf from '@/conf'
  import LoadingIndicator from '@/controls/LoadingIndicator.vue'

  export default {
    components: { LoadingIndicator },
    
    data () {
      return {
        doneDialogShow: false,
        doneDialogLoading: false,
        loading: false,
        folder: null,
        formulars: null
      }
    },

    computed: {
      photos: function () {
        if (this.folder && this.folder.photos) {
          return this.folder.photos.map(photo => `${conf.serverUrl}/folder/photo?f=${this.folder.title}&n=${photo}`)
        }
        return null
      }
    },

    methods: {
      formularUrl (title) {
        return conf.wikiUrl + title
      },

      async doneDialogLoadingClick () {
        this.folder.status = 2 // STATUS_REVIEW
        this.doneDialogLoading = true
        await conf.req.post('/folder/update/', { folder: this.folder })
        // TODO: deal with errors
        this.$router.push('/folder2')
      }
    },

    async created () {
      // Loading folder data
      this.loading = true
      let resp = await conf.req.post('/folder/get/', { id: this.$route.params.folder_id })
      if (resp.errorCode === 0) this.folder = resp.data
      this.loading = false
    }
  }
</script>

<style lang="scss">
  .photos {
    line-height: 0;
    margin-top: 20px;
    
    img {
      max-width: 200px;
      max-height: 200px;
      margin: 0 10px 10px 0;
    }
  }
</style>

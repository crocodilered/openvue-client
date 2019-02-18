<template>
  <v-container>
    <v-form
      ref="form"
      lazy-validation
      v-if="!formularCreated && !formularCreated && !createOrUpdateError"
      v-model="valid"
    >
      <loading-indicator v-model="loading1"></loading-indicator>
      <v-layout
        v-if="!loading1 && folder"
        wrap
      >
        <v-flex xs12>
          <h1>{{ folder.title }}</h1>
        </v-flex>
        <v-flex xs12 sm6 v-if="!formularUpdated && !formularCreated">
          <v-text-field
            v-model="title"
            :rules="titleRules"
            label="Заголовок"
            required
          ></v-text-field>

          <div
            v-if="found1"
            class="message"
          >
            <p>
              <b>Такая страница уже есть:</b>
              <a target="_blank" :href="`https://ru.openlist.wiki/${found1}`">{{ found1 }}</a>
            </p>
            <p>
              Введите другой заголовок для страницы или используйте найденную, если это уместно.
            </p>
          </div>

          <div
            v-if="found2"
            class="message"
          >
            <b>Найдено что-то похожее:</b>
            <ul>
              <li
                v-for="(v, i) in found2"
                :key="`found-like-${i}`"
              >
                <a target="_blank" :href="`https://ru.openlist.wiki/${v}`">{{ v }}</a>
              </li>
            </ul>
          </div>

          <v-btn
            v-if="!found1"
            :disabled="!valid"
            :loading="loading2"
            color="primary"
            @click="createFormular"
            depressed
          >
            {{ btnLabel }}
          </v-btn>

          <v-btn
            v-if="found1"
            :disabled="!valid"
            :loading="loading2"
            color="primary"
            @click="doUpdateFormular"
            depressed
          >
            Использовать найденную
          </v-btn>

        </v-flex>
      </v-layout>
    </v-form>

    <div v-if="formularCreated">
      <h1>Страница создана</h1>
      <p>Вы создали страницу <a :href="`${wikiUrl}${title}`">{{ title }}</a>, теперь можно начать заполнять формуляр. Удачи!</p>
      <v-btn
        v-if="folder"
        :to="`/folder2/${folder.id}`"
        flat
      >
        Вернуться к картинкам
      </v-btn>
    </div>

    <div v-if="formularUpdated">
      <h2>Страница обновлена</h2>
      <p>Вы обновили страницу <a :href="`${wikiUrl}${title}`">{{ title }}</a>, теперь можно начать заполнять формуляр. Удачи!</p>
      <v-btn
        v-if="folder"
        :to="`/folder2/${folder.id}`"
        flat
      >
        Вернуться к картинкам
      </v-btn>
    </div>

    <div v-if="createOrUpdateError">
      <h1>Ошибка какая-то</h1>
      <p>Все, что вы можете сделать, это обратиться к системному администратору. Ха-ха.</p>
      <v-btn
        v-if="folder"
        :to="`/folder2/${folder.id}`"
        flat
      >
        Вернуться к картинкам
      </v-btn>
    </div>
    

    <!-- Login to wiki dialog -->
    <v-dialog v-model="loginToWikiDialog.show" persistent max-width="400px">
      <v-card>
        <v-card-text>
          <v-container grid-list-md>
            <h2 class="headline">Openlist.wiki</h2>
            <p>Для создания и редактирования страницы необходимо войти на сайт openlist.wiki.</p>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="loginToWikiDialog.username" label="Имя учётной записи" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="loginToWikiDialog.password" label="Пароль" type="password" required></v-text-field>
              </v-flex>
            </v-layout>
            <p style="color: #900; font-size: 120%;" v-show="loginToWikiDialog.error">Не удается войти на сайт, возможно вы указали неверные логин/пароль.</p>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="loginToWikiDialog.show = false">Закрыть</v-btn>
          <v-btn color="blue darken-1" flat @click="loginToWiki" :loading="loginToWikiDialog.loading">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- /Login to wiki dialog -->

  </v-container>
</template>

<script>
  import conf from '@/conf'
  import LoadingIndicator from '@/controls/LoadingIndicator.vue'
  import { mapState } from 'vuex'
  
  const data = function () {
    return {
      loading1: false, // global
      loading2: false, // form
      loading3: false, // wiki login dialog
      folder: null,
      valid: false,
      title: '',
      found1: null, // Exact
      found2: null, // Just like
      titleRules: [ v => !!v || 'Обязательное поле' ],
      btnLabel: 'Создать',
      wikiUrl: conf.wikiUrl,

      createOrUpdate: null,
      createOrUpdateError: null,
      formularCreated: false,
      formularUpdated: false,

      csrfToken: null,

      loginToWikiDialog: {
        username: '',
        password: '',
        show: false,
        error: false,
        loading: false
      }
    }
  }

  const methods = {

    async loginToWiki () {
      const resp = await conf.req.post('/wiki/login', {
        username: this.loginToWikiDialog.username,
        password: this.loginToWikiDialog.password
      })
      if (resp.errorCode) {
        this.loginToWikiDialog.error = true
      } else {
        this.loginToWikiDialog.show = false
        if (this.createOrUpdate === 'CREATE') {
          this.doCreateFormular()
        } else if (this.createOrUpdate === 'UPDATE') {
          this.doUpdateFormular()
        }
      }
    },

    findSimilar: async function () {
      this.found1 = null
      this.found2 = null

      this.loading2 = true
      let resp = await conf.req.run('GET', conf.wikiApiUrl
        + '?action=opensearch&limit=1&namespace=0&format=json'
        + `&search=${this.title}`)
      this.loading2 = false

      if( resp && resp[1].length > 0 ) {
        // found something
        if (resp[0] === resp[1][0]) {
           // exactly found
          this.found1 = resp[1][0]
        } else {
           // something like this
          this.found2 = resp[1]
        }
      }
      return
    }, 

    async createFormular () {
      if (this.$refs.form.validate()) {
        await this.findSimilar()
        if (!this.found1 && !this.found2) {
          this.doCreateFormular()
        } else if (this.found2 && this.btnLabel === 'Создать все равно') {
          this.doCreateFormular()
        } else if (this.found2) {
          this.btnLabel = 'Создать все равно'
        }
      }
    },

    async retrieveCsrfToken () {
      // Retrieve a csrf token
      if (!this.csrfToken) {
        const resp = await conf.req.post('/wiki/csrf_token')
        if (resp && resp.token) {
          this.csrfToken = resp.token
        } else {
          // need to login
          this.loginToWikiDialog.show = true
        }
      }
    },

    async doUpdateFormular () {
      this.createOrUpdate = 'UPDATE'
      await this.retrieveCsrfToken()
      if (this.csrfToken) {
        this.loading2 = true
        const resp = await conf.req.post('/wiki/update_page', { folderId: this.folder.id, title: this.title })
        this.loading2 = false
        if (resp.errorCode) {
          this.createOrUpdateError = true
        } else {
          this.formularUpdated = true
        }
      }
    },

    async doCreateFormular () {
      this.createOrUpdate = 'CREATE'
      await this.retrieveCsrfToken()
      if (this.csrfToken) {
        // Create formular.
        this.loading2 = true
        const resp = await conf.req.post('/wiki/create_page', { folderId: this.folder.id, title: this.title })
        this.loading2 = false
        if (resp.errorCode) {
          this.createOrUpdateError = true
        } else {
          this.formularCreated = true
        }
      }
    }
  }

  const watch = {
    title: function () {
      this.found1 = null
      this.found2 = null
    }
  }

  export default {
    components: { LoadingIndicator },
    data,
    watch,
    methods,

    async created () {
      // Loading folder data
      this.loading1 = true
      let resp = await conf.req.post('/folder/get', { id: this.$route.params.folder_id })
      if (resp.errorCode === 0) this.folder = resp.data
      this.loading1 = false
    }
  }
</script>

<style lang="scss">
  .message {
    margin-bottom: 20px;
    border-left: 4px solid #c00;
    padding-left: 1em;

    b {
      display: block;
    }
  }
</style>

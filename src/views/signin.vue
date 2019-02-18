<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 lg6>
        <h1>Войти</h1>
        <p>Для начала работы необходимо ввести логин и пароль.</p>
        <form @submit.prevent="signIn">
          <v-text-field
            required autofocus
            browser-autocomplete="false"
            label="Логин"
            type="email"
            v-model="email"></v-text-field>
          <v-text-field
            required
            browser-autocomplete="false"
            label="Пароль"
            type="password"
            v-model="password"></v-text-field>
          <v-btn
            depressed
            color="primary"
            type="submit"
            :loading="loading"
          >
            Войти
          </v-btn>
        </form>
        <v-snackbar
          v-model="errorMessageStatus"
          color="error"
          vertical
        >
          <template v-if="errorCode == -1">Ошибка связи с сервером.</template>
          <template v-if="errorCode == 3">Логин / пароль не подходят.</template>
          <v-btn
            flat
            @click="errorMessageStatus = false"
          >Закрыть</v-btn>
        </v-snackbar>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import conf from '@/conf'
  import router from '@/router'

  const data = function () {
    return {
      loading: false,
      errorCode: 0,
      errorMessageStatus: false,
      email: '',
      password: ''
    }
  }

  const computed = {
    ...mapGetters([
      'isAuthenticated'
    ])
  }

  const methods = {
    signIn () {
      this.loading = true
      conf.req.post('/auth/sign_in/', { email: this.email, password: this.password })
        .then(resp => {
          if (resp.errorCode === 0) {
            conf.req.token = resp.token
            this.$store.dispatch('userSignIn', { token: resp.token, user: resp.user })
            router.gotoDefault()
          } else {
            this.showErrorMessage(resp.errorCode)
          }
        })
        .catch(() => this.showErrorMessage(-1))
        .finally(() => (this.loading = false))
    },
    showErrorMessage (errorCode) {
      this.errorCode = errorCode
      this.errorMessageStatus = true
    }
  }

  export default {
    data,
    computed,
    methods
  }

</script>

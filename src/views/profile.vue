<template>
  <v-container>
    <v-layout>
      <v-flex>
        <h1>Profile</h1>
        <p>Отчет по каждому редактору и вообще total.</p>
        <v-divider></v-divider>
        <p><v-btn depressed color="primary" @click="userSignOut">Выйти из системы</v-btn></p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import router from '@/router'

  const methods = {
    userSignOut () {
      this.$store.dispatch('userSignOut')
      router.push('/')
    }
  }

  export default {
    methods
  }
</script>

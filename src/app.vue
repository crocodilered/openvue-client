<template>
  <v-app>
    <v-navigation-drawer
      app dark
      v-model="drawerStatus"
      disable-resize-watcher
    >
      <v-list>
        <v-list-tile avatar>
          <v-list-tile-avatar tile>
            <img src="./assets/logo.png">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>
      <template v-if="isAuthenticated">
        <v-list>
          <!-- AUTH -->
          <v-list-tile
            v-for="(item, index) in appMenu"
            :key="'draw-auth' + index"
            :to="item.path"
          >
            <v-list-tile-action><v-icon>{{ item.icon }}</v-icon></v-list-tile-action>
            <v-list-tile-content><v-list-tile-title>{{ item.title }}</v-list-tile-title></v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-tile to="/profile">
            <v-list-tile-action><v-icon>face</v-icon></v-list-tile-action>
            <v-list-tile-content>Профиль</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </template>
      <template v-else>
        <v-list>
          <!-- ANONYM -->
          <v-list-tile to="/signin">
            <v-list-tile-action><v-icon>face</v-icon></v-list-tile-action>
            <v-list-tile-content><v-list-tile-title>Войти</v-list-tile-title></v-list-tile-content>
          </v-list-tile>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-toolbar app dark>
      <v-toolbar-side-icon
        @click.stop="drawerStatus = !drawerStatus"
        class="hidden-md-and-up"
      ></v-toolbar-side-icon>

      <!--img src="./assets/logo.png" id="toolbar-logo"-->

      <v-toolbar-title>Расшифровка</v-toolbar-title>

      <v-toolbar-items class="hidden-sm-and-down">
        <template v-if="isAuthenticated">
          <v-btn
            v-for="(item, index) in appMenu"
            :key="'menu-anon' + index"
            :to="item.path"
            flat
          >{{ item.title }}</v-btn>
        </template>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-sm-and-down">
        <template v-if="isAuthenticated">
          <v-btn icon to="/profile" title="Профиль">
            <v-icon>face</v-icon>
          </v-btn>
        </template>
        <template v-else>
          <v-btn icon to="/signin" title="Войти">
            <v-icon>lock</v-icon>
          </v-btn>
        </template>
      </v-toolbar-items>

    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>

    <footer>
      <code>isAuthenticated: {{ isAuthenticated }}</code>
    </footer>
  </v-app>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import router from '@/router'
  import TokenStorage from '@/libs/auth/token-storage'
  import conf from '@/conf'

  const data = function () {
    return {
      drawerStatus: false,
      title: 'Расшифровка'
    }
  }

  const computed = {
    ...mapGetters(['isAuthenticated']),
    ...mapState(['appMenu'])
  }

  export default {
    data,
    computed,
    async created () {
      // Try to autologin
      const token = TokenStorage.get()
      if (token) {
        const resp = await conf.req.post('/auth/')
        if (resp.errorCode === 0) {
          this.$store.dispatch('userSignIn', {
            token,
            user: resp.user
          })
          router.gotoDefault()
        } else {
          TokenStorage.del()
        }
      }
    }
  }
</script>

<style lang="scss">
  #app {
    p {
      margin: 16px 0;
    }
    #toolbar-logo {
      width: auto;
      height: 40px;
    }

    .v-toolbar__title {
      margin: 0 24px 0 0;
    }
    .v-alert, h1, h2, h3 {
      margin: 12px 0;
    }
    .v-btn {
      margin-left: 0;
    }
  }
</style>

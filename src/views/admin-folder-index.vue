<template>
  <v-container>
    <v-tabs v-model="tabModel">
      <v-tabs-slider></v-tabs-slider>
      <v-tab key="На проверку">На проверку</v-tab>
      <v-tab key="В работе">В работе</v-tab>
      <v-tab key="Очередь">Очередь</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabModel">
      <v-tab-item key="На проверку">
        <v-card flat>
          <v-card-text>
            <p>
              Чтобы отметить дело как проверенное, щелкните по строке.
            </p>
            <folder-table :folders="folders2" expand-mode="set-status-to-3"/>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item key="В работе">
        <v-card flat>
          <v-card-text>
            <folder-table :folders="folders1"/>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item key="Очередь">
        <v-card flat>
          <v-card-text>
            <folder-table :folders="folders0"/>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>

  </v-container>
</template>

<script>
  import conf from '@/conf'
  import FolderTable from '@/components/folder-table.vue'

  export default {
    components: { FolderTable },
    name: 'AdminFolderIndex',

    data () {
      return {
        tabModel: null,
        tabItems: ['На проверку', 'В работе', 'Очередь'],

        folders0: null, // На проверку
        folders1: null, // В работе
        folders2: null // Очередь
      }
    },

    async created () {
      // Load data
      const resp = await conf.req.post('/folder/list_by_user/')
      if (resp.data) {
        const folders = resp.data
        this.folders0 = folders.filter(item => item.status === 0)
        this.folders1 = folders.filter(item => item.status === 1)
        this.folders2 = folders.filter(item => item.status === 2)
      }
    }
  }
</script>

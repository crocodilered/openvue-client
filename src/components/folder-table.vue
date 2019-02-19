<template>
  <div v-if="folders_">
    <v-text-field
      v-model="search"
      label="Поиск дела"
      single-line
      clearable
    />

    <v-data-table
      :pagination.sync="pagination"
      :rows-per-page-items="[10, 25, 50]"
      rows-per-page-text="Строк на страницу"
      :headers="headers"
      :items="folders_"
      :search="search"
      must-sort
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <tr @click="props.expanded = !props.expanded">
          <td>{{ props.item.title }}</td>
          <td>{{ props.item.creator_name }}</td>
          <td>{{ props.item.performer_name }}</td>
          <td>{{ new Date(props.item.updated * 1000).toLocaleDateString() }}</td>
        </tr>
      </template>

      <template
        v-if="expandMode === 'set-status-to-3'"
        slot="expand"
        slot-scope="props"
      >
        <v-card flat class="expander">
          <v-card-text>
            <p><a :href="hrefToWiki(props.item.title)" target="_blank">{{ props.item.title }}</a></p>
            <v-switch
              label="Проверено, все ок"
              @click="updateFrolderStatus(props.item.id, 3)"
            />
          </v-card-text>
        </v-card>
      </template>

      <template slot="no-results">
        "{{ search }}" не найдено.
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import conf from '@/conf'
  export default {
    /**
     * expand-mode can be [null, 'set-status-to-3']
     * set-status-3 -- update folder status to 3
     */
    name: 'FoldersTable',
    props: ['folders', 'expand-mode'],

    data () {
      return {
        folders_: null,
        pagination: { sortBy: 'updated' },
        headers: [{
          text: 'Название',
          value: 'title'
        }, {
          text: 'Создатель',
          value: 'creator_name'
        }, {
          text: 'Исполнитель',
          value: 'performer_name'
        }, {
          text: 'Создано',
          value: 'updated'
        }],
        search: null
      }
    },

    watch: {
      folders: {
        immediate: true,
        handler (newVal) {
          this.folders_ = newVal
        }
      }
    },

    methods: {
      async updateFrolderStatus (folderId, status) {
        const found = this.folders_.filter(item => item.id === folderId)
        if (found) {
          const folder = found[0]
          folder.status = status
          const resp = await conf.req.post('/folder/update/', { folder })
          if (!resp.errorCode) {
            this.folders_ = this.folders_.filter(item => item.id !== folderId)
          }
        }
      },

      hrefToWiki (title) {
        return `${conf.wikiUrl}${title}`
      }
    }
  }
</script>

<style scoped>
  .expander {
    background-color: #eee;
  }

  .expander a {
    font-size: 110%;
  }
</style>

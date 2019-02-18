class NavigationProvider {
  constructor () {
    this.ADMIN = 1
    this.USER = 2
    this.ANONYMOUS = 3

    this.ITEMS = []

    this.ITEMS[this.ADMIN] = [{
      icon: 'cloud_queue',
      path: '/folder1',
      title: 'Дела',
      component: 'admin-folder-index'
    }, {
      icon: 'cloud_queue',
      path: '/report',
      title: 'Отчет',
      component: 'admin-report'
    }, {
      icon: 'import_export',
      path: '/import',
      title: 'Импорт',
      component: 'admin-folders-import'
    }]

    this.ITEMS[this.USER] = [
      {
        icon: 'filter',
        path: '/folder2',
        title: 'Дела в работе',
        component: 'user-folder-index'
      }, {
        path: '/folder2/:folder_id/',
        component: 'user-folder-view'
      }, {
        path: '/folder2/:folder_id/formular/',
        component: 'user-formular-create'
      }, {
        path: '/folder2/:folder_id/formular/:formular_id',
        component: 'user-formular-update'
      }
    ]

    this.ITEMS[this.ANONYMOUS] = []
  }

  guardUserRole (userRole) {
    let UserRoleWrongValueException = () => (this.code = 1)
    if (userRole !== this.ADMIN && userRole !== this.USER && userRole !== this.ANONYMOUS) {
      throw new UserRoleWrongValueException()
    }
  }

  /**
   * Generate app menu data
   * { icon: 'cloud_queue', path: '/report', title: 'Отчет' },
   */
  menu (userRole) {
    this.guardUserRole(userRole)
    return this.ITEMS[userRole]
  }

  /**
   * Generate router data
   * { path: '/report', component: 'Report', meta: { roles: [1] } },
   */
  routes () {
    let routes = []
    for (let i in this.ITEMS) {
      let subRoutes = this.ITEMS[i].map(route => {
        return {
          // TODO: append *component* key right here
          ...route,
          meta: { roles: [parseInt(i)] }
        }
      })
      routes = routes.concat(subRoutes)
    }
    return routes
  }
}

export default NavigationProvider

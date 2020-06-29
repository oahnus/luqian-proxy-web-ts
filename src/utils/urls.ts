const urls = {
  login: '/login',
  logout: '/logout',
  register: '/register',
  getUserInfo: '/userInfo',

  getAppList: '/appTable/list',
  genAppSecret: '/appTable/create',

  getProxyTableList: '/proxyTable/list',
  addProxyTable: '/proxyTable/add',
  updateProxyTable: '/proxyTable/update',
  delProxyTable: '/proxyTable/remove',
  checkDomainSize: '/proxyTable/domain/size',

  getMeasureReport: '/monitor/stat',

  signIn: '/acct/signIn',

  versionList: '/version/page',

  getDomainList: '/domain/list',
  createDomain: '/domain/create',
  changeDomainStatus: '/domain/status',
  updateDomain: '/domain/update'
}

export default urls

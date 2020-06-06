export class User {
  id: number
  username: string
  email?: string
  balance?: number
}

export class AppTable {
  id: number
  readonly appId: string
  name?: string
  appSecret: string
  sysUserId?: number
  createTime?: string
}
export class ProxyTable {
  id: number
  name?: string
  appId: string
  sysUserId?: number
  serviceAddr: string
  isRandom: boolean
  port?: number
  enable: boolean
  createTime?: string
  isUseDomain: boolean
  isHttps: boolean
  domainId?: number
  domain?: string
}

export class SysDomain {
  id: number
  domain: string
  name: string
  https: string
  port: number
}

export class Measure {
  id: number
  appId: string
  port: number
  outTrafficBytes: number
  inTrafficBytes: number
  date: string
  remainTraffic: number
}

export class StatItem {
  date: string
  name?: string
  inBytes: number
  outBytes: number
}

export enum StatUnit {
  B, KB, MB, GB
}

export class Statistics {
  dateStats: StatItem[]
  statUnit: string
  todayInBytes?: number
  todayOutBytes?: number
  todayConCount?: number
  trafficLimit?: number
  usedTraffic?: number
}

export class SysVersion {
  id: number
  version: string
  date: string
  url: string

  addJson: string
  uptJson: string
  delJson: string

  addList: string[]
  uptList: string[]
  delList: string[]
}
export class PageInfo<T> {
  pageNum: number
  pageSize: number
  isFirstPage: boolean
  isLastPage: boolean
  total: number
  list: T[]
}

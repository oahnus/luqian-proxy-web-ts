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

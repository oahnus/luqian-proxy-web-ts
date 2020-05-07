import {VuexModule, Module, Mutation, Action} from 'vuex-module-decorators'
import {User} from '@/types/domain'

@Module({
  namespaced: true,
  stateFactory: true
})
export default class AuthModule extends VuexModule {
  private inLogin: boolean = false
  private user: User

  get isLogin() {
    return this.inLogin || false
  }

  get userInfo() {
    return this.user
  }

  @Mutation
  public setIsLogin(state: boolean): void {
    this.inLogin = state;
  }

  @Mutation
  public setUserInfo(user: User): void {
    this.user = user
  }
}

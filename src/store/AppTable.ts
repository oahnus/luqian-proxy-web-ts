import {VuexModule, Module, Mutation, Action} from 'vuex-module-decorators'
import {AppTable} from '@/types/domain'

@Module({
  namespaced: true,
  stateFactory: true
})
export default class AppTableModule extends VuexModule {
  private appTableList: AppTable[]

  get appListGetter() {
    return this.appTableList
  }

  @Mutation
  public setAppList(appList: AppTable[]): void {
    this.appTableList = appList || [];
  }
}

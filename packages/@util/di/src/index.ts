import { DependencyContainer, InjectionToken } from 'tsyringe';

export class InjectorWrapper {
    constructor(private injector: DependencyContainer) {}
    resolve<T>(injectionToken: InjectionToken) {
        return this.injector.resolve<T>(injectionToken);
    }
}

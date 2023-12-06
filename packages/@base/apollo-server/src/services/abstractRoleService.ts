export abstract class AbstractRoleService {
    static readonly token = Symbol('ROLE_SERVICE');

    private loaded = false;
    private roleIdMapper: { [k: string]: number } = {};

    abstract selectRoles(): Promise<{ id: number; name: string }[]>;

    async getRoleIds(...roleNames: string[]) {
        if (!this.loaded) {
            await this.loadRole();
        }
        return roleNames.map((roleName) => this.roleIdMapper[roleName]);
    }

    private async loadRole() {
        const res = await this.selectRoles();
        this.roleIdMapper = {};
        for (const item of res) {
            this.roleIdMapper[item.name] = item.id;
        }
        this.loaded = true;
    }
}

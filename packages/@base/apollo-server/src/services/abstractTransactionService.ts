import { Knex } from 'knex';
import { Disposable } from 'tsyringe';

export abstract class AbstractTransactionService implements Disposable {
    static readonly token = Symbol('TRANSACTION_SERVICE');
    private transactionInfo?: { trx: Knex.Transaction; release: (err: boolean) => void };
    private err = false;

    abstract getTransaction(): Promise<{ trx: Knex.Transaction; release: (err: boolean) => void }>;

    async release() {
        if (this.transactionInfo) {
            this.transactionInfo.release(this.err);
        }
    }

    async getConn() {
        if (!this.transactionInfo) {
            this.transactionInfo = await this.getTransaction();
        }
        return this.transactionInfo.trx;
    }

    errorOccurred() {
        this.err = true;
    }
    async dispose() {
        await this.release();
    }
}

import { knexMigratorCli } from '@util/knex-migrator-cli';
import { knexClient } from '../transaction';

(async () =>
    await knexMigratorCli(knexClient, {
        directory: './src/migrations',
        extension: 'ts',
    }))();

import readline from 'node:readline/promises';
import process from 'process';
import { createColorize } from 'colorize-template';
import { Knex } from 'knex';
import pc from 'picocolors';
import yargsParser from 'yargs-parser';

const textData = [
    {
        name: 'make',
        short: 'm',
        desc: 'Creates a new migration.',
    },
    {
        name: 'latest',
        short: 'L',
        desc: 'Runs all migrations that have not yet been run.',
    },
    {
        name: 'rollback',
        short: 'R',
        desc: 'Rolls back the latest migration group.',
    },
    {
        name: 'up',
        short: 'U',
        desc: 'Runs the next chronological migration that has not yet be run.',
    },
    {
        name: 'down',
        short: 'D',
        desc: 'Undo the last migration that was run.',
    },
    {
        name: 'currentVersion',
        short: 'v',
        desc: 'Retrieves and returns the current migration version.',
    },
    {
        name: 'list',
        short: 'l',
        desc: 'Will return list of completed and pending migrations.',
    },
    {
        name: 'unlock',
        short: 'u',
        desc: 'Forcibly unlocks the migrations lock table, and ensures that there is only one row in it.',
    },
];

const ct = createColorize(pc);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
export async function knexMigratorCli(knexClient: Knex, config: Knex.MigratorConfig) {
    const argv = yargsParser(process.argv.slice(2));
    const cmd = argv._;
    console.log('');
    if ((cmd.length === 0 && argv.help) || cmd[0] === 'help' || cmd[0] === '?') {
        printHelp({
            usage: ct`{dim CLI} <COMMAND> [OPTIONS]`,
            description: 'Run knex migration API with CLI',
            commands: [
                {
                    command: ct`{dim [DEFAULT]}`,
                    description: 'Run the interactive CLI.',
                },
                ...textData.map((item) => ({
                    command: [item.short, item.name],
                    description: item.desc,
                })),
                {
                    command: ['help', '?'],
                    description: 'Show help information.',
                },
            ],
            options: [
                {
                    option: ['-h', '--help'],
                    description: 'Show help information.',
                },
            ],
        });
    } else if (cmd.length === 0) {
        await knexMigrationInteractive(knexClient, config);
    } else if (cmd[0] === 'make' || cmd[0] === 'm') {
        if (argv.help === true || argv.h === true) {
            printHelp({
                usage: [ct`{dim CLI} make [OPTIONS] <COMMAND>`, ct`{dim CLI} m [OPTIONS] <COMMAND>`],
                description: 'Creates a new migration.',
                options: [
                    {
                        option: ['-n', '-name'],
                        value: 'NAME',
                        description: 'Migration name to create.',
                    },
                    {
                        option: ['-h', '--help'],
                        description: 'Show help information.',
                    },
                ],
            });
        } else if (unknownOptions(cmd[0], argv, ['n', 'name', 'h', 'help'])) {
            /* empty */
        } else if (typeof argv['name'] === 'string') {
            await make(knexClient, config, argv['name']);
        } else if (typeof argv['n'] === 'string') {
            await make(knexClient, config, argv['n']);
        } else {
            await knexMigMakeInteractive(knexClient, config);
        }
    } else if (cmd[0] === 'latest' || cmd[0] === 'L') {
        if (argv.help === true || argv.h === true) {
            printHelp({
                usage: [ct`{dim CLI} latest [OPTIONS] <COMMAND>`, ct`{dim CLI} L [OPTIONS] <COMMAND>`],
                description: 'Runs all migrations that have not yet been run.',
                options: [
                    {
                        option: ['-h', '--help'],
                        description: 'Show help information.',
                    },
                ],
            });
        } else if (unknownOptions(cmd[0], argv, ['h', 'help'])) {
            /* empty */
        } else {
            await latest(knexClient, config);
        }
    } else if (cmd[0] === 'rollback' || cmd[0] === 'R') {
        if (argv.help === true || argv.h === true) {
            printHelp({
                usage: [ct`{dim CLI} rollback [OPTIONS] <COMMAND>`, ct`{dim CLI} R [OPTIONS] <COMMAND>`],
                description: 'Rolls back the latest migration group.',
                options: [
                    {
                        option: ['-a', '--all'],
                        description: 'all applied migrations will be rolled back.',
                    },
                    {
                        option: ['-h', '--help'],
                        description: 'Show help information.',
                    },
                ],
            });
        } else if (unknownOptions(cmd[0], argv, ['a', 'all', 'h', 'help'])) {
            /* empty */
        } else if (argv.all === true || argv.a === true) {
            await rollbackAll(knexClient, config);
        } else {
            await rollback(knexClient, config);
        }
    } else if (cmd[0] === 'up' || cmd[0] === 'U') {
        if (argv.help === true || argv.h === true) {
            printHelp({
                usage: [ct`{dim CLI} up [OPTIONS] <COMMAND>`, ct`{dim CLI} U [OPTIONS] <COMMAND>`],
                description: 'Runs the next chronological migration that has not yet be run.',
                options: [
                    {
                        option: ['-n', '-name'],
                        value: 'NAME',
                        description: ct`Runs the specified {cyan NAME} migration that has not yet be run.`,
                    },
                    {
                        option: ['-h', '--help'],
                        description: 'Show help information.',
                    },
                ],
            });
        } else if (unknownOptions(cmd[0], argv, ['n', 'name', 'h', 'help'])) {
            /* empty */
        } else if (typeof argv['name'] === 'string') {
            await up(knexClient, config, argv['name']);
        } else if (typeof argv['n'] === 'string') {
            await up(knexClient, config, argv['n']);
        } else {
            await up(knexClient, config);
        }
    } else if (cmd[0] === 'down' || cmd[0] === 'D') {
        if (argv.help === true || argv.h === true) {
            printHelp({
                usage: [ct`{dim CLI} down [OPTIONS] <COMMAND>`, ct`{dim CLI} D [OPTIONS] <COMMAND>`],
                description: 'Undo the last migration that was run.',
                options: [
                    {
                        option: ['-n', '-name'],
                        value: 'NAME',
                        description: ct`undo the specified {cyan NAME} migration that was run.`,
                    },
                    {
                        option: ['-h', '--help'],
                        description: 'Show help information.',
                    },
                ],
            });
        } else if (unknownOptions(cmd[0], argv, ['n', 'name', 'h', 'help'])) {
            /* empty */
        } else if (typeof argv['name'] === 'string') {
            await down(knexClient, config, argv['name']);
        } else if (typeof argv['n'] === 'string') {
            await down(knexClient, config, argv['n']);
        } else {
            await down(knexClient, config);
        }
    } else if (cmd[0] === 'currentVersion') {
        if (argv.help === true || argv.h === true) {
            printHelp({
                usage: [ct`{dim CLI} currentVersion [OPTIONS] <COMMAND>`, ct`{dim CLI} v [OPTIONS] <COMMAND>`],
                description: 'Retrieves and returns the current migration version.',
                options: [
                    {
                        option: ['-h', '--help'],
                        description: 'Show help information.',
                    },
                ],
            });
        } else if (unknownOptions(cmd[0], argv, ['h', 'help'])) {
            /* empty */
        } else {
            await currentVersion(knexClient, config);
        }
    } else if (cmd[0] === 'list' || cmd[0] === 'l') {
        if (argv.help === true || argv.h === true) {
            printHelp({
                usage: [ct`{dim CLI} list [OPTIONS] <COMMAND>`, ct`{dim CLI} l [OPTIONS] <COMMAND>`],
                description: 'Will return list of completed and pending migrations.',
                options: [
                    {
                        option: ['-h', '--help'],
                        description: 'Show help information.',
                    },
                ],
            });
        } else if (unknownOptions(cmd[0], argv, ['h', 'help'])) {
            /* empty */
        } else {
            await list(knexClient, config);
        }
    } else if (cmd[0] === 'unlock' || cmd[0] === 'u') {
        if (argv.help === true || argv.h === true) {
            printHelp({
                usage: [ct`{dim CLI} unlock [OPTIONS] <COMMAND>`, ct`{dim CLI} u [OPTIONS] <COMMAND>`],
                description:
                    'Forcibly unlocks the migrations lock table, and ensures that there is only one row in it.',
                options: [
                    {
                        option: ['-h', '--help'],
                        description: 'Show help information.',
                    },
                ],
            });
        } else if (unknownOptions(cmd[0], argv, ['h', 'help'])) {
            /* empty */
        } else {
            await unlock(knexClient, config);
        }
    } else {
        console.log(`> Unknown command ${Array.isArray(cmd) && cmd.length ? ct`{bold <${cmd[0]}>}` : ''}... `);
        console.log(ct`Try \'{dim CLI} -h\' for more information.`);
    }

    console.log('');
    process.exit(0);
}
async function make(knexClient: Knex, config: Knex.MigratorConfig, name: string) {
    console.log(`> Created Migration: ${await knexClient.migrate.make(name, config)}`);
}
async function latest(knexClient: Knex, config: Knex.MigratorConfig) {
    const [batchNo, log] = await knexClient.migrate.latest(config);
    if (log.length === 0) {
        console.log('> Already up to date.');
    } else {
        console.log(`> Batch ${batchNo} run: ${log.length} migrations`);
        for (const item of log) {
            console.log(` - ${item}`);
        }
    }
}
async function rollback(knexClient: Knex, config: Knex.MigratorConfig) {
    const [batchNo, log] = await knexClient.migrate.rollback(config);
    if (batchNo === 0) {
        console.log('> Already at the base migration.');
    } else {
        console.log(`> Batch ${batchNo} rolled back: ${log.length} migrations`);
        for (const item of log) {
            console.log(` - ${item}`);
        }
    }
}
async function rollbackAll(knexClient: Knex, config: Knex.MigratorConfig) {
    await knexClient.migrate.rollback(config, true);
    console.log('> All migrations have been rolled back.');
}
async function up(knexClient: Knex, config: Knex.MigratorConfig, name?: string) {
    const [batchNo, log] = await knexClient.migrate.up(name ? { ...config, name } : config);
    if (log.length === 0) {
        console.log('> Already up to date.');
    } else {
        console.log(`> Batch ${batchNo} ran the following migrations:`);
        for (const item of log) {
            console.log(` - ${item}`);
        }
    }
}
async function down(knexClient: Knex, config: Knex.MigratorConfig, name?: string) {
    const [batchNo, log] = await knexClient.migrate.down(name ? { ...config, name } : config);
    if (batchNo === 0) {
        console.log('> Already at the base migration.');
    } else {
        console.log(`> Batch ${batchNo} rolled back the following migrations:`);
        for (const item of log) {
            console.log(` - ${item}`);
        }
    }
}
async function currentVersion(knexClient: Knex, config: Knex.MigratorConfig) {
    console.log(`> Current Version: '${await knexClient.migrate.currentVersion(config)}'`);
}
async function list(knexClient: Knex, config: Knex.MigratorConfig) {
    {
        const [completed, newMigrations] = await knexClient.migrate.list(config);
        if (completed.length === 0) {
            console.log('> No Completed Migration files Found.');
        } else {
            console.log(`> Found ${completed.length} Completed Migration file/files.`);
            for (const item of completed) {
                console.log(` - ${item.name}`);
            }
        }

        console.log('\n');
        if (newMigrations.length === 0) {
            console.log('> No Pending Migration files Found.');
        } else {
            console.log(`> Found ${newMigrations.length} Pending Migration file/files.`);
            for (const item of newMigrations) {
                console.log(` - ${item.file}`);
            }
        }
    }
}
async function unlock(knexClient: Knex, config: Knex.MigratorConfig) {
    await knexClient.migrate.forceFreeMigrationsLock(config);
    console.log('> Successfully unlocked the migrations lock table');
}

function printHelp({
    usage,
    description,
    commands,
    options,
}: {
    usage: string | string[];
    description: string;
    commands?: Array<{ command: string | string[]; description: string }>;
    options?: Array<{
        option: string | string[];
        description: string;
        value?: string;
    }>;
}) {
    console.log(ct`{underline {bold Usage}}`);
    if (Array.isArray(usage)) {
        for (const item of usage) {
            console.log(`  ${item}`);
        }
    } else {
        console.log(`  ${usage}`);
    }
    console.log();
    console.log(ct`{underline {bold Description}}`);
    console.log(`  ${description}`);
    console.log();

    let maxTabWidth = 0;
    if (commands && commands.length > 0) {
        maxTabWidth = Math.max(
            (Math.floor(
                (commands.reduce(
                    (prev, cur) =>
                        Math.max(
                            prev,
                            Array.isArray(cur.command)
                                ? cur.command.reduce(
                                      (prev2, cur2) => prev2 + removeANSI(cur2).length,
                                      (cur.command.length - 1) * 2,
                                  )
                                : removeANSI(cur.command).length,
                        ),
                    0,
                ) +
                    2) /
                    8,
            ) +
                1) *
                8,
            maxTabWidth,
        );
    }
    if (options && options.length > 0) {
        maxTabWidth = Math.max(
            (Math.floor(
                (options.reduce(
                    (prev, cur) =>
                        Math.max(
                            prev,
                            (Array.isArray(cur.option)
                                ? cur.option.reduce(
                                      (prev2, cur2) => prev2 + removeANSI(cur2).length,
                                      (cur.option.length - 1) * 2,
                                  )
                                : removeANSI(cur.option).length) + (cur.value ? removeANSI(cur.value).length + 1 : 0),
                        ),
                    0,
                ) +
                    2) /
                    8,
            ) +
                1) *
                8,
            maxTabWidth,
        );
    }
    if (commands && commands.length > 0) {
        console.log(pc.underline(pc.bold('Commands')));
        for (const item of commands) {
            const commandWidth =
                (Array.isArray(item.command)
                    ? item.command.reduce((prev, cur) => prev + removeANSI(cur).length, (item.command.length - 1) * 2)
                    : removeANSI(item.command).length) + 2;
            console.log(
                `  ${
                    Array.isArray(item.command) ? item.command.map(pc.bold).join(', ') : pc.bold(item.command)
                }${'\t'.repeat(Math.ceil((maxTabWidth - commandWidth) / 8))} ${item.description}`,
            );
        }
        console.log();
    }
    if (options && options.length > 0) {
        console.log(pc.underline(pc.bold('Options')));
        for (const item of options) {
            const optionWidth =
                (Array.isArray(item.option)
                    ? item.option.reduce((prev, cur) => prev + removeANSI(cur).length, (item.option.length - 1) * 2)
                    : removeANSI(item.option).length) +
                (item.value ? removeANSI(item.value).length + 1 : 0) +
                2;
            console.log(
                `  ${Array.isArray(item.option) ? item.option.map(pc.bold).join(', ') : pc.bold(item.option)}${
                    item.value ? `=${ct`{cyan ${item.value}}`}` : ''
                }${'\t'.repeat(Math.ceil((maxTabWidth - optionWidth) / 8))} ${item.description}`,
            );
        }
        console.log();
    }
}

async function printInteractive(
    qText: string,
    data: Array<{ short: string[] | string; name: string; desc: string }>,
    defaultValue?: string,
): Promise<string | null> {
    console.log();
    const maxWidth = data.reduce(
        (prev, cur) => ({
            short: Math.max(
                prev.short,
                Array.isArray(cur.short)
                    ? cur.short.length -
                          1 +
                          cur.short.length * 2 +
                          cur.short.reduce((prev2, cur2) => prev2 + cur2.length, 0)
                    : cur.short.length,
            ),
            name: Math.max(prev.name, cur.name.length),
        }),
        {
            short: 0,
            name: 0,
        },
    );

    for (const item of data) {
        const shortArr = Array.isArray(item.short) ? item.short : [item.short];
        const shortWidth =
            shortArr.length - 1 + shortArr.length * 2 + shortArr.reduce((prev, cur) => prev + cur.length, 0);

        console.log(
            `${shortArr.map((item2) => ct`{underline [${item2}]}`).join(',')}${'\t'.repeat(
                Math.ceil((Math.ceil(maxWidth.short / 8) * 8 - shortWidth) / 8),
            )}${ct`{bold ${item.name}}`}${'\t'.repeat(
                Math.ceil((Math.ceil(maxWidth.name / 8) * 8 - item.name.length) / 8),
            )}${ct`{dim ${item.desc}}`}`,
        );
    }
    console.log();
    const inp = (await rl.question(`${qText} (!q to quit): `)).trim();
    if (inp === '!q') {
        return null;
    }
    console.log();

    if (defaultValue !== undefined && inp === '') {
        return defaultValue;
    }

    const selected = data.find((item) => inp === item.name || item.short.indexOf(inp) > -1);
    if (!selected) {
        console.log(ct`> {red Invalid input {bold "${inp}"}.}`);
        console.log();
        return await printInteractive(qText, data);
    }
    return selected.name;
}

async function knexMigrationInteractive(knexClient: Knex, config: Knex.MigratorConfig) {
    const data = textData.map((item, i) => ({
        short: [`${i + 1}`, item.short],
        name: item.name,
        desc: item.desc,
    }));

    const selected = await printInteractive('> Choose your action.', data);
    if (selected === null) {
        return;
    } else if (selected === 'make') {
        await knexMigMakeInteractive(knexClient, config);
    } else if (selected === 'latest') {
        await latest(knexClient, config);
    } else if (selected === 'rollback') {
        await knexMigRollbackInteractive(knexClient, config);
    } else if (selected === 'up') {
        await knexMigUpInteractive(knexClient, config);
    } else if (selected === 'down') {
        await knexMigDownInteractive(knexClient, config);
    } else if (selected === 'currentVersion') {
        await currentVersion(knexClient, config);
    } else if (selected === 'list') {
        await list(knexClient, config);
    } else if (selected === 'unlock') {
        await unlock(knexClient, config);
    }
    console.log();
    await knexMigrationInteractive(knexClient, config);
}

async function knexMigMakeInteractive(knexClient: Knex, config: Knex.MigratorConfig) {
    let fg = true;
    while (fg) {
        const name = (await rl.question('> Enter a name of migration to be created. (!q to quit): ')).trim();
        if (name === '!q') {
            fg = false;
        } else {
            await make(knexClient, config, name);
            console.log();
        }
    }
}
async function knexMigRollbackInteractive(knexClient: Knex, config: Knex.MigratorConfig) {}
async function knexMigUpInteractive(knexClient: Knex, config: Knex.MigratorConfig) {
    const [completed, newMigrations]: [Array<{ name: string }>, Array<{ file: string }>] =
        await knexClient.migrate.list(config);
    if (newMigrations.length === 0) {
        console.log(ct`> {bold Already up to date.}`);
        return;
    } else if (newMigrations.length === 1) {
        await up(knexClient, config);
        return;
    } else {
        const data = newMigrations.map(({ file }, i) => ({
            short: `${i + 1}`,
            name: file,
            desc: '',
        }));
        const selected = await printInteractive('> Select migration to run. (Default: 1)', data, newMigrations[0].file);
        if (selected) {
            console.log(selected);
            await up(knexClient, config, selected);
            await knexMigUpInteractive(knexClient, config);
        }
        return;
    }
}
async function knexMigDownInteractive(knexClient: Knex, config: Knex.MigratorConfig) {
    const [completed, newMigrations]: [Array<{ name: string }>, Array<{ file: string }>] =
        await knexClient.migrate.list(config);

    if (completed.length === 0) {
        console.log(ct`> {bold  Already at the base migration.}`);
        return;
    } else if (completed.length === 1) {
        await down(knexClient, config);
        return;
    } else {
        completed.reverse();
        const data = completed.map(({ name }, i) => ({
            short: `${i + 1}`,
            name,
            desc: '',
        }));
        const selected = await printInteractive('> Select migration to undo. (Default: 1)', data, completed[0].name);
        if (selected) {
            await down(knexClient, config, selected);
            await knexMigUpInteractive(knexClient, config);
        }
        return;
    }
}
function removeANSI(str: string) {
    return str.replace(/\x1B[@-_][0-?]*[ -/]*[@-~]/g, '');
}

function unknownOptions(cmd: string, argv: yargsParser.Arguments, options: string[]) {
    const unrecognizedOption = Object.keys(argv)
        .filter((key) => key !== '_' && key !== '--')
        .find((option) => options.indexOf(option) === -1);
    if (unrecognizedOption) {
        console.log(
            ct`> Unrecognized option '{bold ${unrecognizedOption.length === 1 ? '-' : '--'}${unrecognizedOption}'}`,
        );
        console.log(ct`Try \'{dim CLI} ${cmd} -h\' for more information.`);
        return true;
    }
    return false;
}

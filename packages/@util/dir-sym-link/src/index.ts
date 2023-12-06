import fsPm from 'fs/promises';
import { rimraf } from 'rimraf';
import yargsParser from 'yargs-parser';

const argv = yargsParser(process.argv.slice(2));
const target = argv['target'];
const path = argv['path'];
(async () => {
    await rimraf(path);
    await fsPm.mkdir(path, { recursive: true });
    await rimraf(path);
    await fsPm.symlink(target, path, 'dir');
})();

import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const mapRoot = path.resolve('src/lib/assets/maps');
let mapFileByName: Map<string, string> | undefined;

function getMapFileByName() {
	if (mapFileByName === undefined) {
		mapFileByName = new Map(
			globSync('src/lib/assets/maps/**/*.svg').map((file) => [path.basename(file, '.svg'), file])
		);
	}
	return mapFileByName;
}

export function getMapSvg(name: string) {
	const filename = name.endsWith('.svg') ? name.slice(0, -4) : name;
	if (/^[a-z0-9-]+$/i.test(filename) === false) {
		return undefined;
	}
	const file = getMapFileByName().get(filename);
	if (file === undefined || fs.existsSync(file) === false) {
		return undefined;
	}

	return fs.readFileSync(file, 'utf8');
}

export function getMapBasenames() {
	return [...getMapFileByName().keys()];
}

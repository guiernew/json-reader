import { readFile } from 'fs/promises';

let data = JSON.parse(await readFile("filename.json", "utf8"));
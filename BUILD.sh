npx tsc -p src/modules/rutt-etra/tsconfig.json --outDir dist/packages/@readymade/rutt-etra/esm2022 --declarationDir  dist/packages/@readymade/rutt-etra/typings 
npx rollup -c src/modules/rutt-etra/rollup.config.js
cp src/modules/rutt-etra/package.json dist/packages/@readymade/rutt-etra/package.json
cp src/modules/rutt-etra/LICENSE.txt dist/packages/@readymade/rutt-etra/LICENSE.txt
cp CHANGELOG.md dist/packages/@readymade/rutt-etra/CHANGELOG.md
cp README.md dist/packages/@readymade/rutt-etra/README.md


rm -rf dist/packages/@readymade/rutt-etra/fesm2022/typings

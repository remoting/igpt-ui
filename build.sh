#!/usr/bin/env sh
# 解析符号链接以获取脚本的实际路径
SCRIPT_PATH=$(readlink -f "$0")
# 获取脚本所在的目录
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")
# 切换到脚本所在的目录
cd "$SCRIPT_DIR" || exit

npm run build

export version=$(node -pe "const p=require('./package.json'); p.version;")

echo $version

cd dist

zip -r v$version.zip *

scp v$version.zip root@keeyuu.com:/data/website/app/version/

echo "build Success"

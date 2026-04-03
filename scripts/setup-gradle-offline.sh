#!/usr/bin/env bash
# 将本机已下载的 gradle-9.0.0-bin.zip 放入 Gradle Wrapper 缓存，避免再访问 services.gradle.org
# 用法: ./scripts/setup-gradle-offline.sh [/path/to/gradle-9.0.0-bin.zip]
# 默认: ~/Downloads/gradle-9.0.0-bin.zip

set -euo pipefail

ZIP="${1:-$HOME/Downloads/gradle-9.0.0-bin.zip}"
# 与 android/gradle/wrapper/gradle-wrapper.properties 中 distributionUrl 一致（去掉 properties 里的反斜杠转义）
URL='https://services.gradle.org/distributions/gradle-9.0.0-bin.zip'
HASH=$(printf '%s' "$URL" | shasum -a 256 | awk '{print $1}')
DEST="$HOME/.gradle/wrapper/dists/gradle-9.0.0-bin/$HASH"

if [[ ! -f "$ZIP" ]]; then
  echo "找不到文件: $ZIP"
  echo "用法: $0 [/path/to/gradle-9.0.0-bin.zip]"
  exit 1
fi

mkdir -p "$DEST"
# 未下完时的锁/临时文件会导致 Wrapper 仍尝试联网
rm -f "$DEST"/*.lck "$DEST"/*.part 2>/dev/null || true
cp -f "$ZIP" "$DEST/gradle-9.0.0-bin.zip"
echo "已复制到: $DEST/gradle-9.0.0-bin.zip"

# 若本机已有其它哈希子目录（Gradle 版本/算法差异），一并覆盖 zip，避免仍去下载
BASE="$HOME/.gradle/wrapper/dists/gradle-9.0.0-bin"
if [[ -d "$BASE" ]]; then
  for d in "$BASE"/*; do
    if [[ -d "$d" ]]; then
      cp -f "$ZIP" "$d/gradle-9.0.0-bin.zip" 2>/dev/null && echo "已同步: $d/"
    fi
  done
fi

echo ""
echo "下一步: cd android && ./gradlew assembleRelease"

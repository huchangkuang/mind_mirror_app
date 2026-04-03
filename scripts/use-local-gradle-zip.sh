#!/usr/bin/env bash
# 把 distributionUrl 改为本机 zip 的 file:// 地址，Gradle 不再访问 services.gradle.org
# 用法: ./scripts/use-local-gradle-zip.sh [/path/to/gradle-9.0.0-bin.zip]
# 默认: ~/Downloads/gradle-9.0.0-bin.zip

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ZIP="${1:-$HOME/Downloads/gradle-9.0.0-bin.zip}"
PROPS="$ROOT/android/gradle/wrapper/gradle-wrapper.properties"

if [[ ! -f "$PROPS" ]]; then
  echo "找不到 $PROPS ，请先执行: npm run android:prebuild"
  exit 1
fi
if [[ ! -f "$ZIP" ]]; then
  echo "找不到: $ZIP"
  exit 1
fi

export ZIP PROPS
python3 << 'PY'
import re
from pathlib import Path
import os

zip_path = Path(os.environ["ZIP"]).expanduser().resolve()
props_path = Path(os.environ["PROPS"])
if not zip_path.is_file():
    raise SystemExit(f"找不到 zip: {zip_path}")

uri = zip_path.as_uri()
line = "distributionUrl=file\\:" + uri[len("file:") :]

text = props_path.read_text(encoding="utf-8")
text, n = re.subn(r"^distributionUrl=.*$", line, text, count=1, flags=re.MULTILINE)
if n != 1:
    raise SystemExit("未能替换 distributionUrl")
if re.search(r"^validateDistributionUrl=", text, re.MULTILINE):
    text = re.sub(r"^validateDistributionUrl=.*$", "validateDistributionUrl=false", text, count=1, flags=re.MULTILINE)
else:
    text = text.rstrip() + "\nvalidateDistributionUrl=false\n"

props_path.write_text(text, encoding="utf-8")
print("已写入:", props_path)
print(line)
PY

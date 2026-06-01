// デプロイ: suumo.html を index.html に反映し、GitHub に push して Pages を更新する
import { $ } from "bun";

const URL = "https://chocominticeeeee.github.io/suumo/";

// suumo.html をルート公開用の index.html にコピー
await Bun.write("index.html", Bun.file("suumo.html"));

// 変更がなければ何もしない
const status = (await $`git status --porcelain`.text()).trim();
if (!status) {
  console.log("\n  変更はありません。デプロイをスキップしました。\n");
  process.exit(0);
}

// コミットメッセージ: 引数があればそれ、なければ日時
const msg = process.argv.slice(2).join(" ") || `更新 ${new Date().toLocaleString("ja-JP")}`;

await $`git add -A`;
await $`git commit -m ${msg}`;
await $`git push`;

console.log(`\n  デプロイ完了 🎉  反映まで数十秒〜1分ほどかかります`);
console.log(`  公開URL: ${URL}\n`);

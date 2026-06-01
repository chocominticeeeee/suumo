// 開発用サーバ: suumo.html をそのまま配信し、保存すると自動リロードする
import { watch } from "node:fs";

const FILE = "suumo.html";
const PORT = 3000;

// ブラウザに差し込むライブリロード用スクリプト
const liveReload = `
<script>
  (function () {
    const ws = new WebSocket("ws://" + location.host + "/__reload");
    ws.onmessage = () => location.reload();
    ws.onclose = () => setTimeout(() => location.reload(), 1000);
  })();
</script>`;

const clients = new Set<any>();

const server = Bun.serve({
  port: PORT,
  async fetch(req, server) {
    if (server.upgrade(req)) return;
    const html = await Bun.file(FILE).text();
    return new Response(html.replace("</body>", liveReload + "</body>"), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
  websocket: {
    open(ws) {
      clients.add(ws);
    },
    close(ws) {
      clients.delete(ws);
    },
    message() {},
  },
});

// ファイル変更を監視してリロードを通知
watch(FILE, () => {
  for (const ws of clients) ws.send("reload");
});

console.log(`\n  開発サーバ起動: http://localhost:${PORT}`);
console.log(`  ${FILE} を保存すると自動でリロードされます (Ctrl+C で終了)\n`);

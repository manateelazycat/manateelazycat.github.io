---
layout: post
title: 让 Pi Agent 的快捷键和 Codex 保持一致
categories: [AI]
---

已经习惯了 Codex 的快捷键了，把 Pi Agent 的快捷键也改成和 Codex 一样的。这样切换不同 AI 的时候，手指头的习惯可以保持一致。

#### Pi Agent 改快捷键的方法

新建 `~/.pi/agent/keybindings.json`，填入下面的内容：

```json
{
  "tui.input.submit": "enter",
  "tui.input.tab": "alt+h",
  "tui.editor.cursorUp": ["up", "ctrl+p"],
  "tui.editor.cursorDown": ["down", "ctrl+n"],
  "app.message.followUp": "tab",
  "app.interrupt": "ctrl+c",
  "app.clear": "ctrl+l"
}
```

#### 按键说明

1. Enter：提交消息（空闲时发送，忙碌时插队）
2. Alt+H：路径/文件自动补全
3. ↑ / Ctrl+P：光标上移（含历史浏览）
4. ↓ / Ctrl+N：光标下移（含历史浏览）
5. Tab：排队跟进消息（等当前任务完成后再执行）
6. Ctrl+C：中断当前操作
7. Ctrl+L：清空编辑区

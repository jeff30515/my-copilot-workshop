# 待辦清單 Web App

這是一個在 GitHub Copilot 實戰工作坊中完成的待辦清單 Web App，目標是建立一個可離線使用、可持久化資料的純前端應用程式。專案以 HTML、CSS 和原生 JavaScript 實作，提供清單管理與使用者體驗提升等基本功能。

## 線上展示

- GitHub Pages: https://jeff30515.github.io/my-copilot-workshop/

## 功能

- 新增待辦事項
- 以勾選框標記完成狀態
- 完成項目會顯示刪除線與淡化效果
- 刪除單筆待辦事項
- 即時顯示未完成數量（「未完成: N 項」）
- 當清單為空時顯示提示文字
- 支援深色模式切換，並記住使用者偏好
- 支援篩選：全部、未完成、已完成
- 提供清除所有已完成項目功能
- 使用 localStorage 保存資料，重新整理後不會遺失
- 忽略空白輸入，避免新增無效項目

## 技術

- 使用純 HTML、CSS、原生 JavaScript 建構
- 不使用任何前端框架或套件
- 不建立 `package.json`，亦不依賴 npm 安裝
- 不使用外部 CDN，確保可離線開啟
- 資料儲存在瀏覽器的 `localStorage`
- 使用 `:root` 定義 CSS 變數，維持主題與樣式的一致性

## 開發方式

這個專案是利用 GitHub Copilot Agent Mode、MCP，以及 `.github/prompts` 中的 agentic workflow 來完成的。開發過程中，AI 協助閱讀 GitHub issue、整理修正計畫、實作前端功能，並依照規範維持純前端、可離線運行和本地資料持久化的設計要求。

具體來說：

- GitHub Copilot Agent Mode 協助在 VS Code 中分析需求並生成實作內容
- MCP 能連結 GitHub 與 Microsoft Learn 等外部資源，讓專案開發更符合官方文件與 repo 內容
- `.github/prompts` 中的 prompt 定義了 issue 修正流程，讓 AI 能依序執行：讀 issue、提出計畫、修改程式、驗證、提交、建立 PR

這種方式有助於將需求、修正、驗證和協作流程更明確地串起來。

## 我學到什麼

- 如何用 GitHub Copilot 協助規劃與執行前端功能開發
- 如何將使用者需求轉成具體的 issue、修正步驟與驗證方式
- 了解 localStorage 在純前端專案中的實際用途與限制
- 學習如何在不引入套件的情況下，維持清晰的程式結構與可維護性
- 體驗以 issue-driven 的方式進行軟體開發與 PR 流程

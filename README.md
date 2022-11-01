### サーバの立ち上げ
```bash
yarn dev
```
### TypeScriptスタイルガイド
https://typescript-jp.gitbook.io/deep-dive/styleguide

### 参考にするべきディレクトリ構成（りあクト③P.81）
https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md
- おすすめ構成
```
src/
  components/
  	atoms/
    molecules/
    organisms/
    ecosystems/
    templates/
  	environments/
	features/
		awesome-feature/
      components/
      hooks/
      utils/
      assets/
  routes/
  providers/
  stores/
  hooks/
  utils/
  assets/
  domains/
    api/
    types/
    awesome-domain/
      api/
      types/
      constants.ts
		constants.ts
```

### うまくいっていな部分
- cssのlint
- vite.config.tsのエラー

### 参考
- りあクト！ 1章、4章、6章
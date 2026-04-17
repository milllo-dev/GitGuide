# Git 완전 정복

초심자(개발자 지망생)를 대상으로 한 Git 가이드 웹페이지입니다.

## 내용

- Git이란? (버전 관리 시스템 개념, Git vs GitHub)
- Git 설치 (Windows / macOS)
- 기본 커맨드 (`git init`, `add`, `commit`, `branch`, `switch`, `log`)
- 브랜치 & PR 워크플로우 (협업 흐름)
- 로컬 & 리모트 (`push`, `pull`, `clone`, `remote`)

## 로컬 실행

```bash
# 브라우저로 열기
open index.html

# 또는 로컬 서버 실행
python3 -m http.server 8080
```

## GitHub Pages 배포

1. 이 레포지토리를 GitHub에 push
2. Settings → Pages → Source: `main` 브랜치 `/` (root)
3. 배포 완료 후 `https://<username>.github.io/<repo-name>/` 접속

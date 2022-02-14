## COVID-19 alarm

> 전날 일일 코로나 확진자수를 카카오톡 메세지로 전송하는 서버

## Todos ✔️

- [x] : 주기적인 token refresh
- [x] : 나에게 메세지 하나 보내기
- [x] : 코로나 공공 API 인증
- [x] : cron job을 이용해 매일 주기적으로 돌게 만들기
- [x] : 로그추가
- [x] : 서버가 재시작 될수도 있기 때문에, refreshToken을 디비에 저장해야함
- [x] : Oracle Cloud 배포
- [x] : 정확한 데이터를 가지고 오기 위해 Puppeteer 크롤링한 데이터로 변경
- [x] : 친구에게 전송
- [ ] : typescript
- [ ] : 데이터 주기적으로 저장

## to run this project..

> 사실 개인적인 용도로 만든 프로젝트라, 토큰을 수동으로 발급해서 사용중 사용하려면 토큰 발급이 필요 😂

1. Kakao developer 에 등록이 되어있는 상태에서 **clientId** (Javascsript)를 이용해서 토큰을 발급해야함.
2. 발급된 토큰 중 **refresh_token**만 따로 저장
3. https://github.com/dhlife09/Corona-19-API 여기서 **API Key** 발급
4. node (필수) && docker나 mysql 로컬 서버가 필요
5. memo.md 내의 방법을 참고하여 mysql 서버 쉘 키고 Configs 테이블 만들어 refreshToken 을 데이터베이스에 추가
6. 아래의 스크립트를 참고하여 프로젝트를 구성

```shell
cd <your directory> 
git clone <this project URL>
cd covid_alarm
npm i
docker compose up -d (if you have a Docker in your local machine)
npm run start:dev (development mode)
```

6. build & deploy

- **맨 처음 배포**

```shell
npm run build && pm2 start dist/ecosystem.config.js --env production && pm2 save
```

- **후에 수정 후 배포 등 (predeploy 스크립트가 포함 되어 있는 과정)**

```shell
npm run deploy
```
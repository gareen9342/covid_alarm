### mysql 원격 접속

docker container 띄우고 컨테이너 안쪽으로 들어가서 실행해야 한다.

```shell
docker exec - it < CONTAINER_ID > /bin/bash

mysql -u root -p // 접속

ALTER USER 'root' @'%' IDENTIFIED WITH mysql_native_password by 'yourpassword';

FLUSH PRIVILEGES;

```

### mocha test and exit terminal

https://stackoverflow.com/questions/50372866/mocha-not-exiting-after-test

- `--exit` 스크립트 추가함(열려있는 입력 스트림 무시하고 터미널을 끔)
- 만약, 해당 프로세스상 스트림을 정상 종료하고 싶다면. fs 모듈이나 해당 스트림 건드려야함

재밌는 걸 발견 : https://www.npmjs.com/package/why-is-node-running
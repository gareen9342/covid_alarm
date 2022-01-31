mysql 원격 접속

docker container 띄우고 컨테이너 안쪽으로 들어가서 실행해야 한다.

```shell
docker exec - it < CONTAINER_ID > /bin/bash

mysql -u root -p // 접속

ALTER USER 'root' @'%' IDENTIFIED WITH mysql_native_password by 'yourpassword';

FLUSH PRIVILEGES;

```
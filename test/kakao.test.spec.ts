import supertest from 'supertest'
import assert from "assert"
import app from '../app'


const req = supertest(app)

describe('health check', () => {

  it('health check', (done) => {
    req.get('/')
        .expect(200)
        .expect("body", (err, res) => {
          console.log(res.text)
          done()
        })
  })
  // TODO : 404 및 에러 핸들러 세분화 처리
})

describe("친구 목록 받아오기", () => {
  it("친구 목록 받아오기 체크", (done) => {

    req.post("/kakao/friends")
        .expect(200, (err, res) => {
          if (err) {
            done(err)
          } else {
            // console.log(res.body.resultCode)
            // TODO : assert typing
            assert(res.body.resultCode === 0)
            done()
          }
        })
  })
})

describe("메세지 보내기", () => {
  it("정상작동 테스트", (done) => {
    req.post("/message")
        .expect(200, (err, res) => {
          if (err) {
            done(err)
          } else {
            assert(res.body.resultCode === 0)
            done()
          }
        })
  })

})
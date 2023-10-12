import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../index.js'; 
import { connectToMongoDB } from '../data/mongooseController.js';

const expect = chai.expect;

chai.use(chaiHttp);

let dbConnection;

before(async () => {
  try {
    dbConnection = await connectToMongoDB();
    console.log('Connected to db');
  } catch (err) {
    console.log(err);
  }
});

const connectToDB = async () => {
  try {
    await connectToMongoDB()
    console.log('Connected to db');
  } catch (err) {
    console.log(err);
  }
}

connectToDB()

describe('Test Server', () => {
  it('should return status 200 on /api/ endpoint', (done) => {
    chai.request(server)
      .get('/api/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe("Authentication API", () => {
  let authToken;

  // Test the login route
  describe("/POST login", () => {
    it("it should login a user and return a token", (done) => {
      const credentials = {
        username: "Felix.Macedo",
        password: "UfrMrt5uMST5zlh",
      };

      chai
        .request(server)
        .post("/api/auth/login")
        .send(credentials)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("message");
          authToken = res.body.message;
          done();
        });
    });
  });

  //test route guards
  describe("Route Guards", () => {
    describe("User Route Guard", () => {
      it("should allow a request that has user permission", (done) => {
        chai
          .request(server)
          .get("/api/models/service")
          .set('Authorization', `Bearer ${authToken}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });          
      })
    })

  describe("Lab Route Guard", () => {
    const id = '65232767d8ef8741ee0ab6f9'
    it("should allow a token that has the lab permission", (done) =>{
      chai
        .request(server)
        .get(`/api/models/lab/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        })
      })
  })
  });
  
  // Test the logout route
  describe("/POST logout", () => {
    it("it should logout a user", (done) => {
      const logoutData = {
        token: authToken,
      };

      chai
        .request(server)
        .post("/api/auth/logout")
        .send(logoutData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("message").eql("logout successfully");
          done();
        });
    });
  });

});


import request from "supertest";
import { SimpleGateway } from "@/SimpleGateway";
import { apikey, NewUser, user } from "@/schema/schema";

let app: SimpleGateway;
beforeAll(() => {
  app = new SimpleGateway({ testing: true });
  app.start();
});
describe("Gateway", () => {
  it("gateway should be instance of SimpleGateway", () => {
    expect(app).toBeInstanceOf(SimpleGateway);
  });

  describe("/api/", () => {
    describe("/api/hello", () => {
      it("GET > Hello! (200)", async () => {
        const res = await request(app.app).get("/api/hello");
        expect(res).toMatchObject({
          statusCode: 200,
          text: "Hello!",
        });
      });

      it("POST > Hello! (200)", async () => {
        const res = await request(app.app).post("/api/hello");
        expect(res).toMatchObject({
          statusCode: 200,
          text: "Hello!",
        });
      });
    });

    describe("/api/accounts", () => {
      it("/create should create an account", () => {
        return request(app.app)
          .post("/api/accounts/create")
          .send({
            username: "supertestuser",
            password: "supertestpassword",
          } as NewUser)
          .expect(200)
          .expect("Content-Type", "text/html; charset=utf-8");
      });

      it("/create should not allow duplicate accounts", () => {
        return request(app.app)
          .post("/api/accounts/create")
          .send({
            username: "supertestuser",
            password: "supertestpassword2",
          } as NewUser)
          .expect(500)
          .expect("Content-Type", "text/html; charset=utf-8");
      });

      it("/create should require username and password ", () => {
        return request(app.app)
          .post("/api/accounts/create")
          .send({
            username: "",
            password: "",
          } as NewUser)
          .expect(500)
          .expect("Content-Type", "text/html; charset=utf-8");
      });
      it("/login should be status code 200 on successful login ", () => {
        return request(app.app)
          .post("/api/accounts/login")
          .send({
            username: "supertestuser",
            password: "supertestpassword",
          } as NewUser)
          .expect(200)
          .expect("Got Valid Credentials: supertestuser");
      });

      it("/login should be status code 403 on fail login ", () => {
        return request(app.app)
          .post("/api/accounts/login")
          .send({
            username: "supertestuser",
            password: "wrongpassword",
          } as NewUser)
          .expect(403);
      });
    });
  });
});

afterAll(async () => {
  await app.dbClient.db.delete(user);
  await app.dbClient.db.delete(apikey);
  //Testing
  await app.stop();
});

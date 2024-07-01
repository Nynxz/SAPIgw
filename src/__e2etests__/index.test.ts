import request from "supertest";
import { SimpleGateway } from "../SimpleGateway";

describe("/api/hello", () => {
  let app: SimpleGateway;
  beforeAll(() => {
    app = new SimpleGateway({ testing: true });
    app.start();
  });

  it("GET: should return Hello! (200)", async () => {
    const res = await request(app.app).get("/api/hello");
    expect(res.text).toBe("Hello!");
    expect(res.statusCode).toBe(200);
  });

  it("POST: should return Hello! (200)", async () => {
    const res = await request(app.app).post("/api/hello");
    expect(res.text).toBe("Hello!");
    expect(res.statusCode).toBe(200);
  });
  afterAll(() => {
    app.server?.close();
  });
});

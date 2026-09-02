import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../src/app";
import { User } from "../src/model/user.model";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test_jwt_secret_123";
  process.env.REFRESH_TOKEN_SECRET = "test_refresh_secret_456";

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("Authentication Routes Integration Tests", () => {
  const testUser = {
    name: "John Doe",
    email: "john@example.com",
    password: "Password123!",
  };

  describe("POST /user/signup", () => {
    it("should successfully register a new user and return access token & user info", async () => {
      const res = await request(app).post("/user/signup").send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.user.email).toBe(testUser.email.toLowerCase());
      expect(res.body.user.name).toBe(testUser.name);
      expect(res.body.user.password).toBeUndefined();

      // Verify user is saved in DB with hashed password
      const savedUser = await User.findOne({ email: testUser.email });
      expect(savedUser).not.toBeNull();
      expect(savedUser?.password).not.toBe(testUser.password);
    });

    it("should reject signup with an existing email", async () => {
      await request(app).post("/user/signup").send(testUser);
      const res = await request(app).post("/user/signup").send(testUser);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.msg).toContain("already exists");
    });

    it("should reject signup when password is shorter than 8 characters", async () => {
      const res = await request(app).post("/user/signup").send({
        name: "Short Pass",
        email: "short@example.com",
        password: "123",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /user/signin", () => {
    beforeEach(async () => {
      await request(app).post("/user/signup").send(testUser);
    });

    it("should login successfully with valid credentials", async () => {
      const res = await request(app).post("/user/signin").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.accessToken).toBeDefined();
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should reject login with wrong password", async () => {
      const res = await request(app).post("/user/signin").send({
        email: testUser.email,
        password: "WrongPassword!",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.msg).toBe("Invalid email or password");
    });

    it("should reject login for non-existent email", async () => {
      const res = await request(app).post("/user/signin").send({
        email: "nonexistent@example.com",
        password: testUser.password,
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("JWT Protected Route Rejection", () => {
    it("should reject access to protected /todo/all-todo without token", async () => {
      const res = await request(app).get("/todo/all-todo");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.msg).toContain("No token provided");
    });

    it("should reject access with an invalid token", async () => {
      const res = await request(app)
        .get("/todo/all-todo")
        .set("Authorization", "Bearer invalid_token_12345");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /user/refresh", () => {
    it("should refresh access token using valid refresh token cookie", async () => {
      const signupRes = await request(app).post("/user/signup").send(testUser);
      const cookies = signupRes.headers["set-cookie"];

      const res = await request(app)
        .post("/user/refresh")
        .set("Cookie", cookies);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.accessToken).toBeDefined();
    });
  });
});

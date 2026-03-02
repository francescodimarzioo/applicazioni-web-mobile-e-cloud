import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/UserModel.js";
import Expense from "../models/ExpenseModel.js";

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/testdb");
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  await User.deleteMany();
  await Expense.deleteMany();
});

describe("AUTH TESTS", () => {

  test("Registrazione utente", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Mario",
      email: "mario@test.com",
      password: "123456"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("mario@test.com");
  });

  test("Login corretto genera token", async () => {
    await request(app).post("/auth/register").send({
      name: "Mario",
      email: "mario@test.com",
      password: "123456"
    });

    const res = await request(app).post("/auth/login").send({
      email: "mario@test.com",
      password: "123456"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

  test("Login con password errata", async () => {
    await request(app).post("/auth/register").send({
      name: "Mario",
      email: "mario@test.com",
      password: "123456"
    });

    const res = await request(app).post("/auth/login").send({
      email: "mario@test.com",
      password: "wrongpassword"
    });

    expect(res.statusCode).toBe(401);
  });

});

describe("EXPENSES TESTS", () => {

  beforeEach(async () => {
    await request(app).post("/auth/register").send({
      name: "Mario",
      email: "mario@test.com",
      password: "123456"
    });

    const res = await request(app).post("/auth/login").send({
      email: "mario@test.com",
      password: "123456"
    });

    token = res.body.token;
  });

  test("Accesso a /expenses senza token", async () => {
    const res = await request(app).get("/expenses");
    expect(res.statusCode).toBe(401);
  });

  test("Creazione spesa con token valido", async () => {
    const res = await request(app)
      .post("/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Cena",
        amount: 60,
        paidBy: "Mario",
        participants: ["Mario", "Luigi"]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.description).toBe("Cena");
    expect(res.body.splitAmount).toBe(30);
  });

});
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const Workout = require("../models/Workout");
describe("GET /api/workouts", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    // Clear the database before each test
    await Workout.deleteMany({});
    // Insert test data
    const testWorkout = new Workout({
      title: "Test Workout",
      date: "2023-01-01",
      workout: "Run 5km",
    });
    await testWorkout.save();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should return 200 and an array of workouts", async () => {
    const res = await request(app).get("/api/workouts");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("Test Workout");
  });
});

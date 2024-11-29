import mongoose from "mongoose";

const MONGO_DB_URL = `mongodb://localhost:27017/ecommerce`;

interface ITest {
  name: string;
}

const TestSchema = new mongoose.Schema<ITest>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Test = mongoose.model<ITest>("Test", TestSchema);

describe("Test MongoDB", () => {
  let connection: mongoose.Mongoose;
  beforeAll(async () => {
    connection = await mongoose.connect(MONGO_DB_URL);
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it("should connect to mongo db", async () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
  it("should create a new document", async () => {
    const test = new Test({ name: "test" });
    await test.save();
    expect(test.isNew).toBe(false);
  });

  it("should find a document", async () => {
    const test = await Test.findOne({ name: "test" });
    expect(test).toBeDefined();
  });
});

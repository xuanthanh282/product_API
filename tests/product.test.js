const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});
console.log("MONGO_URI =", process.env.MONGO_URI);
const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../src/app");
const Product = require("../src/models/Product");

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000
    });

    console.log("MongoDB test connected");
}, 15000);

afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
        await Product.deleteMany({});
    }
});

afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
}, 15000);

describe("Product API", () => {

    test("Healthcheck should return UP", async () => {
        const response = await request(app)
            .get("/health");

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("UP");
    });

    test("Create product", async () => {
        const response = await request(app)
            .post("/api/products")
            .send({
                pid: "P001",
                pname: "Laptop Dell",
                price: 15000000,
                quantity: 10
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.pid).toBe("P001");
    });

    test("Get all products", async () => {
        await Product.create({
            pid: "P001",
            pname: "Laptop Dell",
            price: 15000000,
            quantity: 10
        });

        const response = await request(app)
            .get("/api/products");

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    });

    test("Get product by pid", async () => {
        await Product.create({
            pid: "P001",
            pname: "Laptop Dell",
            price: 15000000,
            quantity: 10
        });

        const response = await request(app)
            .get("/api/products/P001");

        expect(response.statusCode).toBe(200);
        expect(response.body.pid).toBe("P001");
    });

    test("Update product", async () => {
        await Product.create({
            pid: "P001",
            pname: "Laptop Dell",
            price: 15000000,
            quantity: 10
        });

        const response = await request(app)
            .put("/api/products/P001")
            .send({
                pname: "Laptop Dell Updated",
                price: 16000000,
                quantity: 20
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.quantity).toBe(20);
    });

    test("Delete product", async () => {
        await Product.create({
            pid: "P001",
            pname: "Laptop Dell",
            price: 15000000,
            quantity: 10
        });

        const response = await request(app)
            .delete("/api/products/P001");

        expect(response.statusCode).toBe(200);
        expect(response.body.message)
            .toBe("Product deleted successfully");
    });

});
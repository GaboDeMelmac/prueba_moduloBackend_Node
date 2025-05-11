const request = require("supertest");
const app = require("../index");

describe("Operaciones CRUD de cafes", () => {
  // 1. GET /cafes - debe devolver status 200 y un arreglo con al menos 1 objeto
  it("GET /cafes responde con status 200 y un arreglo con al menos un café", async () => {
    const res = await request(app).get("/cafes");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(typeof res.body[0]).toBe("object");
  });

  // 2. DELETE /cafes/:id - con un id que no existe debe responder 404
  it("DELETE /cafes/:id con id inexistente debe responder con status 404", async () => {
    const res = await request(app)
      .delete("/cafes/999")
      .set("Authorization", "Bearer token"); // Simula header con token

    expect(res.statusCode).toBe(404);
  });

  // 3. POST /cafes - debe agregar un café y devolver status 201
  it("POST /cafes agrega un nuevo café y responder con status 201", async () => {
    const newCafe = {
      id: Date.now(), // Genera ID único para evitar colisiones
      nombre: "Latte",
    };

    const res = await request(app).post("/cafes").send(newCafe);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining(newCafe)])
    );
  });

  // 4. PUT /cafes/:id - debe devolver 400 si los ids no coinciden
  it("PUT /cafes/:id debe responder con status 400 si el id de params y body no coinciden", async () => {
    const cafeActualizado = {
      id: 999,
      nombre: "Espresso Doble",
    };

    const res = await request(app).put("/cafes/1").send(cafeActualizado);

    expect(res.statusCode).toBe(400);
  });
});

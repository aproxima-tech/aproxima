import app from "../src/index"

describe("Test the application", () => {
  it("Should return 200 response", async () => {
    const res = await app.request("http://localhost/");
    expect(res.status).toBe(200);
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(data).toEqual({ status: 'ok '});
  });
});

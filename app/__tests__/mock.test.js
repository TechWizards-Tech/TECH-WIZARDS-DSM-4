import { fetchData } from "../utils/fetchData";

// Simula comportamento externo
jest.mock("../utils/fetchData", () => ({
  fetchData: jest.fn(() => Promise.resolve({ ok: true }))
}));

describe("Mocking example", () => {
  it("should mock fetchData and return ok=true", async () => {
    const data = await fetchData();

    expect(data.ok).toBe(true);
    expect(fetchData).toHaveBeenCalled();
  });
});

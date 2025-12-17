import { generatePassword, checkBreach } from "@/lib/passwordUtils";

describe("generatePassword", () => {
  test("returns a string of default length 12", () => {
    const password = generatePassword();
    expect(typeof password).toBe("string");
    expect(password).toHaveLength(12);
  });

  test("returns a string of custom length", () => {
    const password = generatePassword(20);
    expect(password).toHaveLength(20);
  });

  test("uses only allowed characters", () => {
    const password = generatePassword(50);
    const allowedChars = /^[A-Za-z0-9!@#$%^&*()_+]+$/;

    expect(password).toMatch(allowedChars);
  });
});

const {
  TWO_WEEKS_IN_MILLISECONDS,
  TWO_HOUR_IN_MILLISECONDS,
} = require("../src/constants/jwtContants");

describe("jwtContants Constants", () => {
  test("TWO_WEEKS_IN_MILLISECONDS가 알맞게 계산되어야 한다.", () => {
    const expectedValue = 14 * 24 * 60 * 60 * 1000;
    expect(TWO_WEEKS_IN_MILLISECONDS).toBe(expectedValue);
  });

  test("TWO_HOUR_IN_MILLISECONDS가 알맞게 계산되어야 한다.", () => {
    const expectedValue = 2 * 60 * 60 * 1000;
    expect(TWO_HOUR_IN_MILLISECONDS).toBe(expectedValue);
  });
});

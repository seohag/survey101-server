const ERROR_PATTERNS = require("../constants/error");

describe("ERROR_PATTERNS", () => {
  it("NOT_AUTHORIZED 에러 패턴이 올바른지 확인해야 한다", () => {
    const error = ERROR_PATTERNS.NOT_AUTHORIZED;
    expect(error).toHaveProperty("status", 401);
    expect(error).toHaveProperty("message", "Unauthorized");
    expect(error).toHaveProperty("messageForUser", "엑세스 권한이 없습니다");
  });

  it("PAGE_NOT_FOUND 에러 패턴이 올바른지 확인해야 한다", () => {
    const error = ERROR_PATTERNS.PAGE_NOT_FOUND;
    expect(error).toHaveProperty("status", 404);
    expect(error).toHaveProperty("message", "Page Is Not Found");
    expect(error).toHaveProperty(
      "messageForUser",
      "요청하신 페이지는 존재하지 않습니다",
    );
  });

  it("INTERNAL_SERVER_ERROR 에러 패턴이 올바른지 확인해야 한다", () => {
    const error = ERROR_PATTERNS.INTERNAL_SERVER_ERROR;
    expect(error).toHaveProperty("status", 500);
    expect(error).toHaveProperty("message", "Internal Server Error");
    expect(error).toHaveProperty(
      "messageForUser",
      "서버 오류가 발생하였습니다",
    );
  });

  it("BAD_REQUEST 에러 패턴이 올바른지 확인해야 한다", () => {
    const error = ERROR_PATTERNS.BAD_REQUEST;
    expect(error).toHaveProperty("status", 400);
    expect(error).toHaveProperty("message", "Bad Request");
    expect(error).toHaveProperty("messageForUser", "잘못된 요청입니다");
  });
});

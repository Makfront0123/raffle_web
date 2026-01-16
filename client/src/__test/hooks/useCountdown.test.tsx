import * as dateUtils from "@/app/utils/formatDate";
jest.mock("@/app/utils/formatDate", () => ({
  getTimeRemaining: jest.fn(),
  formatCountdown: jest.fn(),
}));

import { renderHook } from "@testing-library/react";
import { useCountdown } from "@/hook/useCountdown";

describe("useCountdown", () => {
  it("actualiza el tiempo cada segundo usando getTimeRemaining", () => {
    (dateUtils.getTimeRemaining as jest.Mock).mockReturnValue({
      total: 60000,
      days: 0,
      hours: 0,
      minutes: 1,
      seconds: 0,
    });

    (dateUtils.formatCountdown as jest.Mock).mockReturnValue("01:00");

    const { result } = renderHook(() => useCountdown("2030-01-01"));

    expect(result.current).toBe("01:00");
    expect(dateUtils.getTimeRemaining).toHaveBeenCalled();
  });
});

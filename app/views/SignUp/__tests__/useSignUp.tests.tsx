import { renderHook, act } from "@testing-library/react";
import useSignUp from "@/app/views/SignUp/useSignUp";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

function buildResponse(
  ok: boolean,
  body: unknown,
  status = ok ? 200 : 400,
): Response {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

beforeEach(() => {
  jest.clearAllMocks();
  // Clear cookies between tests
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
  });
});

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------
describe("initial state", () => {
  it("returns empty strings and false/null defaults", () => {
    const { result } = renderHook(() => useSignUp());

    expect(result.current.login).toBe("");
    expect(result.current.email).toBe("");
    expect(result.current.password).toBe("");
    expect(result.current.confirmPassword).toBe("");
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBeNull();
    expect(result.current.passwordsMatch).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// passwordsMatch
// ---------------------------------------------------------------------------
describe("passwordsMatch", () => {
  it("is false when only password is set", () => {
    const { result } = renderHook(() => useSignUp());
    act(() => result.current.setPassword("secret"));
    expect(result.current.passwordsMatch).toBe(false);
  });

  it("is false when passwords differ", () => {
    const { result } = renderHook(() => useSignUp());
    act(() => {
      result.current.setPassword("abc");
      result.current.setConfirmPassword("xyz");
    });
    expect(result.current.passwordsMatch).toBe(false);
  });

  it("is true when both fields are non-empty and equal", () => {
    const { result } = renderHook(() => useSignUp());
    act(() => {
      result.current.setPassword("secret123");
      result.current.setConfirmPassword("secret123");
    });
    expect(result.current.passwordsMatch).toBe(true);
  });

  it("is false when both fields are empty strings", () => {
    const { result } = renderHook(() => useSignUp());
    expect(result.current.passwordsMatch).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// handleSubmit — password mismatch (no fetch call)
// ---------------------------------------------------------------------------
describe("handleSubmit — password mismatch", () => {
  it("sets error and does not call fetch when passwords do not match", async () => {
    const { result } = renderHook(() => useSignUp());

    act(() => {
      result.current.setLogin("alice");
      result.current.setEmail("alice@example.com");
      result.current.setPassword("abc");
      result.current.setConfirmPassword("xyz");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.error).toBe("Passwords do not match.");
    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.current.isSubmitting).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// handleSubmit — successful registration
// ---------------------------------------------------------------------------
describe("handleSubmit — success", () => {
  it("calls fetch with correct payload, stores cookies, and redirects", async () => {
    const responseBody = {
      accessToken: "tok-access",
      refreshToken: "tok-refresh",
    };
    mockFetch.mockResolvedValueOnce(buildResponse(true, responseBody));

    const { result } = renderHook(() => useSignUp());

    act(() => {
      result.current.setLogin("alice");
      result.current.setEmail("alice@example.com");
      result.current.setPassword("secret123");
      result.current.setConfirmPassword("secret123");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    // fetch call
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    // Without NEXT_PUBLIC_MEMORATOR_BE_API_URL set, the hook falls back to the
    // relative proxy route. In CI/integration the full URL would end in /users/register.
    expect(url).toMatch(/\/users\/register|\/api\/auth\/sign-up/);
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body as string)).toEqual({
      login: "alice",
      email: "alice@example.com",
      password: "secret123",
    });

    // state
    expect(result.current.success).toBe(
      "Account created successfully. Redirecting...",
    );
    expect(result.current.error).toBeNull();
    expect(result.current.password).toBe("");
    expect(result.current.confirmPassword).toBe("");
    expect(result.current.isSubmitting).toBe(false);

    // cookies
    expect(document.cookie).toContain("accessToken");
    expect(document.cookie).toContain("refreshToken");

    // redirect
    expect(mockPush).toHaveBeenCalledWith("/home");
  });

  it("trims whitespace from login and email before sending", async () => {
    mockFetch.mockResolvedValueOnce(buildResponse(true, {}));

    const { result } = renderHook(() => useSignUp());

    act(() => {
      result.current.setLogin("  alice  ");
      result.current.setEmail("  alice@example.com  ");
      result.current.setPassword("pass");
      result.current.setConfirmPassword("pass");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.login).toBe("alice");
    expect(body.email).toBe("alice@example.com");
  });
});

// ---------------------------------------------------------------------------
// handleSubmit — API error responses
// ---------------------------------------------------------------------------
describe("handleSubmit — API errors", () => {
  it("sets error from response message field when !res.ok", async () => {
    mockFetch.mockResolvedValueOnce(
      buildResponse(false, { message: "Email already taken" }, 409),
    );

    const { result } = renderHook(() => useSignUp());
    act(() => {
      result.current.setLogin("alice");
      result.current.setEmail("taken@example.com");
      result.current.setPassword("pass");
      result.current.setConfirmPassword("pass");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.error).toBe("Email already taken");
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("falls back to error field when message is absent", async () => {
    mockFetch.mockResolvedValueOnce(
      buildResponse(false, { error: "Invalid input" }, 422),
    );

    const { result } = renderHook(() => useSignUp());
    act(() => {
      result.current.setLogin("alice");
      result.current.setEmail("alice@example.com");
      result.current.setPassword("pass");
      result.current.setConfirmPassword("pass");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.error).toBe("Invalid input");
  });

  it("uses generic fallback error message when body has no message/error", async () => {
    mockFetch.mockResolvedValueOnce(buildResponse(false, {}, 500));

    const { result } = renderHook(() => useSignUp());
    act(() => {
      result.current.setLogin("alice");
      result.current.setEmail("alice@example.com");
      result.current.setPassword("pass");
      result.current.setConfirmPassword("pass");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.error).toBe("Sign up failed. Please try again.");
  });

  it("handles non-JSON error body gracefully with fallback message", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.reject(new SyntaxError("not json")),
    } as unknown as Response);

    const { result } = renderHook(() => useSignUp());
    act(() => {
      result.current.setLogin("alice");
      result.current.setEmail("alice@example.com");
      result.current.setPassword("pass");
      result.current.setConfirmPassword("pass");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.error).toBe("Sign up failed. Please try again.");
  });
});

// ---------------------------------------------------------------------------
// handleSubmit — network error
// ---------------------------------------------------------------------------
describe("handleSubmit — network error", () => {
  it("sets network error when fetch rejects", async () => {
    mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    const { result } = renderHook(() => useSignUp());
    act(() => {
      result.current.setLogin("alice");
      result.current.setEmail("alice@example.com");
      result.current.setPassword("pass");
      result.current.setConfirmPassword("pass");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.error).toBe("Network error. Please try again.");
    expect(result.current.isSubmitting).toBe(false);
    expect(mockPush).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// handleSubmit — isSubmitting lifecycle
// ---------------------------------------------------------------------------
describe("handleSubmit — isSubmitting lifecycle", () => {
  it("resets isSubmitting to false after success", async () => {
    mockFetch.mockResolvedValueOnce(buildResponse(true, {}));

    const { result } = renderHook(() => useSignUp());
    act(() => {
      result.current.setLogin("alice");
      result.current.setEmail("alice@example.com");
      result.current.setPassword("pass");
      result.current.setConfirmPassword("pass");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.isSubmitting).toBe(false);
  });

  it("resets isSubmitting to false after error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("oops"));

    const { result } = renderHook(() => useSignUp());
    act(() => {
      result.current.setLogin("alice");
      result.current.setEmail("alice@example.com");
      result.current.setPassword("pass");
      result.current.setConfirmPassword("pass");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.isSubmitting).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// handleSubmit — clears previous error/success on re-submit
// ---------------------------------------------------------------------------
describe("handleSubmit — clears stale state on re-submit", () => {
  it("clears previous error before each attempt", async () => {
    mockFetch
      .mockRejectedValueOnce(new Error("first failure"))
      .mockResolvedValueOnce(buildResponse(true, {}));

    const { result } = renderHook(() => useSignUp());
    act(() => {
      result.current.setLogin("alice");
      result.current.setEmail("alice@example.com");
      result.current.setPassword("pass");
      result.current.setConfirmPassword("pass");
    });

    const fakeEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>;

    // First submit — triggers network error
    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });
    expect(result.current.error).toBe("Network error. Please try again.");

    // Second submit — should succeed and clear the previous error
    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(
      "Account created successfully. Redirecting...",
    );
  });
});

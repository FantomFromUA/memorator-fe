import { renderHook, act } from "@testing-library/react";
import useSignIn from "@/app/views/SignIn/useSignIn";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

function buildResponse(ok: boolean, body: unknown, status = ok ? 200 : 400): Response {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

beforeEach(() => {
  jest.clearAllMocks();
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
    const { result } = renderHook(() => useSignIn());

    expect(result.current.identifier).toBe("");
    expect(result.current.password).toBe("");
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// handleSubmit — successful sign-in
// ---------------------------------------------------------------------------
describe("handleSubmit — success", () => {
  it("calls fetch with correct payload, stores cookies, and redirects to /home", async () => {
    const responseBody = { accessToken: "tok-access", refreshToken: "tok-refresh" };
    mockFetch.mockResolvedValueOnce(buildResponse(true, responseBody));

    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.setIdentifier("alice");
      result.current.setPassword("secret123");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    // fetch called once
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toMatch(/\/users\/login|\/api\/auth\/sign-in/);
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body as string)).toEqual({
      identifier: "alice",
      password: "secret123",
    });

    // success state
    expect(result.current.success).toBe("Signed in successfully. Redirecting...");
    expect(result.current.error).toBeNull();
    expect(result.current.password).toBe("");
    expect(result.current.isSubmitting).toBe(false);

    // cookies stored
    expect(document.cookie).toContain("accessToken");
    expect(document.cookie).toContain("refreshToken");

    // redirect
    expect(mockPush).toHaveBeenCalledWith("/home");
  });

  it("trims whitespace from identifier before sending", async () => {
    mockFetch.mockResolvedValueOnce(buildResponse(true, {}));

    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.setIdentifier("  alice  ");
      result.current.setPassword("pass");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.identifier).toBe("alice");
  });

  it("accepts an email as identifier", async () => {
    mockFetch.mockResolvedValueOnce(buildResponse(true, {}));

    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.setIdentifier("alice@example.com");
      result.current.setPassword("pass");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.identifier).toBe("alice@example.com");
  });

  it("does not clear identifier after success", async () => {
    mockFetch.mockResolvedValueOnce(buildResponse(true, {}));

    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.setIdentifier("alice");
      result.current.setPassword("pass");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    // only password is cleared, identifier is kept
    expect(result.current.identifier).toBe("alice");
    expect(result.current.password).toBe("");
  });
});

// ---------------------------------------------------------------------------
// handleSubmit — API error responses
// ---------------------------------------------------------------------------
describe("handleSubmit — API errors", () => {
  it("sets error from response message field when !res.ok", async () => {
    mockFetch.mockResolvedValueOnce(
      buildResponse(false, { message: "Invalid credentials" }, 401),
    );

    const { result } = renderHook(() => useSignIn());
    act(() => {
      result.current.setIdentifier("alice");
      result.current.setPassword("wrong");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.error).toBe("Invalid credentials");
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("falls back to error field when message is absent", async () => {
    mockFetch.mockResolvedValueOnce(
      buildResponse(false, { error: "Account not found" }, 404),
    );

    const { result } = renderHook(() => useSignIn());
    act(() => {
      result.current.setIdentifier("ghost");
      result.current.setPassword("pass");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.error).toBe("Account not found");
  });

  it("uses generic fallback when body has no message or error", async () => {
    mockFetch.mockResolvedValueOnce(buildResponse(false, {}, 500));

    const { result } = renderHook(() => useSignIn());
    act(() => {
      result.current.setIdentifier("alice");
      result.current.setPassword("pass");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.error).toBe("Sign in failed. Please try again.");
  });

  it("handles non-JSON error body gracefully with fallback message", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.reject(new SyntaxError("not json")),
    } as unknown as Response);

    const { result } = renderHook(() => useSignIn());
    act(() => {
      result.current.setIdentifier("alice");
      result.current.setPassword("pass");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.error).toBe("Sign in failed. Please try again.");
  });
});

// ---------------------------------------------------------------------------
// handleSubmit — network error
// ---------------------------------------------------------------------------
describe("handleSubmit — network error", () => {
  it("sets network error when fetch rejects", async () => {
    mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    const { result } = renderHook(() => useSignIn());
    act(() => {
      result.current.setIdentifier("alice");
      result.current.setPassword("pass");
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

    const { result } = renderHook(() => useSignIn());
    act(() => {
      result.current.setIdentifier("alice");
      result.current.setPassword("pass");
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

    const { result } = renderHook(() => useSignIn());
    act(() => {
      result.current.setIdentifier("alice");
      result.current.setPassword("pass");
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
// handleSubmit — clears stale state on re-submit
// ---------------------------------------------------------------------------
describe("handleSubmit — clears stale state on re-submit", () => {
  it("clears previous error before each new attempt", async () => {
    mockFetch
      .mockRejectedValueOnce(new Error("first failure"))
      .mockResolvedValueOnce(buildResponse(true, {}));

    const { result } = renderHook(() => useSignIn());
    act(() => {
      result.current.setIdentifier("alice");
      result.current.setPassword("pass");
    });

    const fakeEvent = { preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });
    expect(result.current.error).toBe("Network error. Please try again.");

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe("Signed in successfully. Redirecting...");
  });

  it("clears previous success before a new attempt", async () => {
    mockFetch
      .mockResolvedValueOnce(buildResponse(true, {}))
      .mockResolvedValueOnce(buildResponse(false, { message: "Session expired" }, 401));

    const { result } = renderHook(() => useSignIn());
    act(() => {
      result.current.setIdentifier("alice");
      result.current.setPassword("pass");
    });

    const fakeEvent = { preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });
    expect(result.current.success).toBe("Signed in successfully. Redirecting...");

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });
    expect(result.current.success).toBeNull();
    expect(result.current.error).toBe("Session expired");
  });
});

import "server-only";
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = [new URL(request.url).origin];
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      allowed.push(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin);
    } catch {
      /* Invalid deployment URL is not trusted. */
    }
  }
  return !!origin && allowed.includes(origin);
}
export async function readJson(
  request: Request,
  maximum = 32768,
): Promise<unknown> {
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  )
    throw new HttpError(415, "JSON required");
  if (Number(request.headers.get("content-length") || 0) > maximum)
    throw new HttpError(413, "Request too large");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "Missing body");
  const parts: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximum) {
        await reader.cancel();
        throw new HttpError(413, "Request too large");
      }
      parts.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const part of parts) {
      bytes.set(part, offset);
      offset += part.byteLength;
    }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(400, "Invalid JSON");
  } finally {
    reader.releaseLock();
  }
}

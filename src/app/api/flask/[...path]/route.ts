import { NextRequest, NextResponse } from "next/server";

const PY_BASE =
  process.env.NEXT_PUBLIC_PYTHON_API_URL?.replace(/\/$/, "") ||
  process.env.PYTHON_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:5555";
const PY_PREFIX = (process.env.NEXT_PUBLIC_PYTHON_API_PREFIX || process.env.PYTHON_API_PREFIX || "").replace(/\/$/, "");

async function forward(req: NextRequest, pathSegs: string[]) {
  const urlPath = `/${pathSegs.join("/")}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const init: RequestInit = {
      method: req.method,
      cache: "no-store",
      signal: controller.signal,
      headers: {},
    };
    // Pass JSON body for methods that can have body
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      const contentType = req.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const body = await req.json().catch(() => ({}));
        init.headers = { "Content-Type": "application/json" };
        init.body = JSON.stringify(body);
      }
    }
    // Build candidate URLs in order of preference
    const candidates = [
      `${PY_BASE}${PY_PREFIX}${urlPath}`,
      `${PY_BASE}${urlPath}`,
      `${PY_BASE}/api${urlPath}`,
    ];
    let res = await fetch(candidates[0], init);
    if (res.status === 404) {
      for (let i = 1; i < candidates.length; i++) {
        const tryRes = await fetch(candidates[i], init);
        if (tryRes.status !== 404) {
          res = tryRes;
          break;
        }
        res = tryRes;
      }
    }
    const text = await res.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { message: text };
    }
    // Include debug info on 404 to speed up setup
    if (res.status === 404) {
      return NextResponse.json(
        { error: "Flask returned 404", tried: candidates, upstreamStatus: res.status, upstreamBody: data },
        { status: 404 }
      );
    }
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    const isAbort = e?.name === "AbortError";
    return NextResponse.json(
      { error: isAbort ? "Flask timeout" : (e?.message || "Flask error") },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(req, params.path);
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(req, params.path);
}

export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(req, params.path);
}

export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(req, params.path);
}



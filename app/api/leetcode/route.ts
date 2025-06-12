import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Request to LeetCode API:", JSON.stringify(body, null, 2));

    if (!body.query) {
      return NextResponse.json(
        { error: "Missing query in request body" },
        { status: 400 },
      );
    }

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Origin: "https://leetcode.com",
        Referer: "https://leetcode.com/",
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "x-csrftoken": "dummy-csrf-token",
      },
      body: JSON.stringify({
        query: body.query,
        variables: body.variables || {},
        operationName: body.operationName || null,
      }),
    });

    const responseText = await response.text();

    console.log(`LeetCode API Response (${response.status}):`, responseText);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `LeetCode API returned ${response.status}`,
          details: responseText,
        },
        { status: response.status },
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        {
          error: "Failed to parse LeetCode API response as JSON",
          details: responseText,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying request to LeetCode:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch data from LeetCode API",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

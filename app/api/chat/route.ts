import { NextRequest, NextResponse } from 'next/server'

const CIA_API_URL =
  process.env.NEXT_PUBLIC_CIA_API_URL ||
  'https://qhojuiets3.execute-api.us-east-1.amazonaws.com/test-dt-il-ai-cloud-agent/chat'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const response = await fetch(CIA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const responseText = await response.text()

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Upstream API failed with status ${response.status}`,
          details: responseText,
        },
        { status: response.status }
      )
    }

    // Try to return JSON, fall back to plain text
    try {
      const json = JSON.parse(responseText)
      return NextResponse.json(json)
    } catch {
      return new NextResponse(responseText, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Proxy request failed', details: message },
      { status: 500 }
    )
  }
}

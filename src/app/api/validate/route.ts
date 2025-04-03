// 提供一个 API 路由服务 /api/validate，接受 POST 提交 initData 信息
import { NextRequest, NextResponse } from "next/server"
import {
  validate,
  parse,
  isSignatureInvalidError,
  isExpiredError,
  isSignatureMissingError,
  isAuthDateInvalidError,
} from "@telegram-apps/init-data-node"

const secretToken = process.env.BOT_TOKEN || ""
export async function POST(request: NextRequest) {
  try {
    // Get the request body (initData from Telegram)
    const body = await request.json()
    const { initData } = body
    // Here you would add your validation logic
    // For example, verify the hash and check if the data is valid
    validate(initData, secretToken)
    // For now, just return the received data
    return NextResponse.json({
      success: true,
      message: "Data received",
      data: parse(initData, true).user || {},
    })
  } catch (error) {
    console.error("Validation error:", error)
    if (isSignatureInvalidError(error)) {
      return NextResponse.json(
        { success: false, message: "Signature is invalid" },
        { status: 400 }
      )
    } else if (isExpiredError(error)) {
      return NextResponse.json(
        { success: false, message: "Signature is expired" },
        { status: 400 }
      )
    } else if (isSignatureMissingError(error)) {
      return NextResponse.json(
        { success: false, message: "Signature is missing" },
        { status: 400 }
      )
    } else if (isAuthDateInvalidError(error)) {
      return NextResponse.json(
        { success: false, message: "Auth date is invalid" },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, message: "Validation failed" },
      { status: 400 }
    )
  }
}

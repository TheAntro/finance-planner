import "server-only"
import { cache } from "react"
import { getAccessToken, getAccessTokenRSC } from "@logto/next/server-actions"
import { logtoConfig, apiResource } from "./logto-config"

export const getApiToken = () => getAccessToken(logtoConfig(), apiResource())

export const getApiTokenRSC = cache(() =>
  getAccessTokenRSC(logtoConfig(), apiResource()),
)

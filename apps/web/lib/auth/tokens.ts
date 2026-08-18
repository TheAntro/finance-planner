import "server-only"
import { getAccessToken, getAccessTokenRSC } from "@logto/next/server-actions"
import { logtoConfig, apiResource } from "./logto-config"

export const getApiToken = () => getAccessToken(logtoConfig(), apiResource())

export const getApiTokenRSC = () =>
  getAccessTokenRSC(logtoConfig(), apiResource())

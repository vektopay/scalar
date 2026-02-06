import type { OpenAPIV3, OpenAPIV3_1 } from '@vektopay/openapi-types'

type ServerVariable = OpenAPIV3.ServerVariableObject | OpenAPIV3_1.ServerVariableObject

export type ServerVariables = {
  [variable: string]: ServerVariable
}

export type ServerVariableValues = {
  [variable: string]: string
}

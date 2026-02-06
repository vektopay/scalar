import { Type } from '@vektopay/typebox'

export const XVariableSchema = Type.Object({
  'x-variable': Type.Optional(Type.String()),
})

export type XVariable = {
  'x-variable'?: string
}

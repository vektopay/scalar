export {
  /** @deprecated Please use isDefined from \@vektopay/helpers/array/is-defined instead */
  isDefined,
} from '@vektopay/helpers/array/is-defined'
export {
  /** @deprecated Please use json2xml from \@vektopay/helpers/file/json2xml instead */
  json2xml,
} from '@vektopay/helpers/file/json2xml'
export {
  /** @deprecated Please use canMethodHaveBody from \@vektopay/helpers/http/can-method-have-body instead */
  canMethodHaveBody,
} from '@vektopay/helpers/http/can-method-have-body'
export {
  /** @deprecated Please use REQUEST_METHODS from \@vektopay/helpers/http/http-methods instead */
  REQUEST_METHODS,
  /** @deprecated Please use getHttpMethodInfo from \@vektopay/helpers/http/http-info instead */
  getHttpMethodInfo,
} from '@vektopay/helpers/http/http-info'
export {
  /** @deprecated Please use HttpStatusCode from \@vektopay/helpers/http/http-status-codes instead */
  type HttpStatusCode,
  /** @deprecated Please use HttpStatusCodes from \@vektopay/helpers/http/http-status-codes instead */
  type HttpStatusCodes,
  /** @deprecated Please use httpStatusCodes from \@vektopay/helpers/http/http-status-codes instead */
  httpStatusCodes,
} from '@vektopay/helpers/http/http-status-codes'
export {
  /** @deprecated Please use isHttpMethod from \@vektopay/helpers/http/is-http-method instead */
  isHttpMethod,
} from '@vektopay/helpers/http/is-http-method'
export {
  /** @deprecated Please use objectKeys from \@vektopay/helpers/object/object-keys instead */
  objectKeys as getObjectKeys,
} from '@vektopay/helpers/object/object-keys'
export {
  /** @deprecated Please use findVariables from \@vektopay/helpers/regex/find-variables instead */
  findVariables,
} from '@vektopay/helpers/regex/find-variables'
export {
  /** @deprecated Please use REGEX from \@vektopay/helpers/regex/regex-helpers instead */
  REGEX,
} from '@vektopay/helpers/regex/regex-helpers'
export {
  /** @deprecated Please use replaceVariables from \@vektopay/helpers/regex/replace-variables instead */
  replaceVariables,
} from '@vektopay/helpers/regex/replace-variables'
export {
  /** @deprecated Please use camelToTitleWords from \@vektopay/helpers/string/camel-to-title instead */
  camelToTitleWords,
} from '@vektopay/helpers/string/camel-to-title'
export {
  /** @deprecated Please use capitalize from \@vektopay/helpers/string/capitalize instead */
  capitalize,
} from '@vektopay/helpers/string/capitalize'
/**
 * @deprecated These helpers are being phased out. Please import directly from @vektopay/helpers instead.
 * For example: import { createHash } from '\@vektopay/helpers/string/create-hash'
 */
export {
  /** @deprecated Please use createHash from \@vektopay/helpers/string/create-hash instead */
  createHash,
} from '@vektopay/helpers/string/create-hash'
export {
  /** @deprecated Please use iterateTitle from \@vektopay/helpers/string/iterate-title instead */
  iterateTitle,
} from '@vektopay/helpers/string/iterate-title'
export {
  /** @deprecated Please use ensureProtocol from \@vektopay/helpers/url/ensure-protocol instead */
  ensureProtocol,
} from '@vektopay/helpers/url/ensure-protocol'
export {
  /** @deprecated Please use isLocalUrl from \@vektopay/helpers/url/is-local-url instead */
  isLocalUrl,
} from '@vektopay/helpers/url/is-local-url'
export {
  /** @deprecated Please use isRelativePath from \@vektopay/helpers/url/is-relative-path instead */
  isRelativePath,
} from '@vektopay/helpers/url/is-relative-path'
export {
  /** @deprecated Please use isValidUrl from \@vektopay/helpers/url/is-valid-url instead */
  isValidUrl,
} from '@vektopay/helpers/url/is-valid-url'
export {
  /** @deprecated Please use makeUrlAbsolute from \@vektopay/helpers/url/make-url-absolute instead */
  makeUrlAbsolute,
} from '@vektopay/helpers/url/make-url-absolute'
export {
  /** @deprecated Please use combineUrlAndPath from \@vektopay/helpers/url/merge-urls instead */
  combineUrlAndPath,
  /** @deprecated Please use mergeSearchParams from \@vektopay/helpers/url/merge-urls instead */
  mergeSearchParams,
  /** @deprecated Please use mergeUrls from \@vektopay/helpers/url/merge-urls instead */
  mergeUrls,
} from '@vektopay/helpers/url/merge-urls'

export { fetchDocument } from './fetch-document'
export { type FetchWithProxyFallbackOptions, fetchWithProxyFallback } from './fetch-with-proxy-fallback'
export { normalizeMimeType } from './normalize-mime-type'
export { normalizeMimeTypeObject } from './normalize-mime-type-object'
export { getOperationStability, getOperationStabilityColor, isOperationDeprecated } from './operation-stability'
export { formatJsonOrYamlString, isJsonString, json, parseJsonOrYaml, transformToJson, yaml } from './parse'
export { prettyPrintJson, replaceCircularDependencies } from './pretty-print-json'
export { schemaModel } from './schema-model'
export { getServersFromDocument } from './servers'
export { shouldIgnoreEntity } from './should-ignore-entity'

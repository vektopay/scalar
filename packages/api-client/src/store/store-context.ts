import type { Cookie } from '@vektopay/oas-utils/entities/cookie'
import type { Environment } from '@vektopay/oas-utils/entities/environment'
import type { Collection, Request, RequestExample, SecurityScheme, Server, Tag } from '@vektopay/oas-utils/entities/spec'
import type { Workspace } from '@vektopay/oas-utils/entities/workspace'
import type { Mutators } from '@vektopay/object-utils/mutator-record'

export type StoreContext = {
  collections: Record<string, Collection>
  collectionMutators: Mutators<Collection>
  //
  tags: Record<string, Tag>
  tagMutators: Mutators<Tag>
  //
  requests: Record<string, Request>
  requestMutators: Mutators<Request>
  //
  requestExamples: Record<string, RequestExample>
  requestExampleMutators: Mutators<RequestExample>
  //
  cookies: Record<string, Cookie>
  cookieMutators: Mutators<Cookie>
  //
  environments: Record<string, Environment>
  environmentMutators: Mutators<Environment>
  //
  servers: Record<string, Server>
  serverMutators: Mutators<Server>
  //
  securitySchemes: Record<string, SecurityScheme>
  securitySchemeMutators: Mutators<SecurityScheme>
  //
  workspaces: Record<string, Workspace>
  workspaceMutators: Mutators<Workspace>
}

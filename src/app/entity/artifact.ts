export class Template {
  displayFields: string;
  domainTemplateId: string;
  fields: Array<Fields>;
  id: string;
  name: string;
  tenantId: string;
}

export class Fields {
  Name: string;
  key: string;
}

export class ArtifactDetails {
  data: Array<Data>;
  templateId: string;
  tenantId: string;
  id: string;
  changes: Array<object>;
  artifactMetadata: Array<object>;
  status: string;
}

export class Data{
    name : string;
}

export class Changes{
    name: number;
}

export class ArtifactMetadata {
  artifactTemplateName: string;
  artifactTemplateId: string;
  previousArtifactDataId: string;
  user: Array<User>;
  timestamp: string;
  version: number;
  artifactDataId: string;
}

export class User {
  tenantId: string;
  userId: string;
  name: string;
  publicKey : string;
}

export class BToken{
  token: string;
}

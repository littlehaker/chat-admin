type ResourceBuilder = (t: AdminDSLResource) => void;
type AdminBuilder = (t: AdminDSL) => void;

export class AdminDSL {
  resources: AdminDSLResource[];

  constructor(callback: AdminBuilder) {
    this.resources = [];
    callback(this);
  }

  resource(resourceName: string, callback: ResourceBuilder) {
    const resource = new AdminDSLResource(resourceName, callback);
    this.resources.push(resource);
    return resource;
  }
}

export class AdminDSLResource {
  resourceName: string;
  fields: AdminDSLField[];

  constructor(resourceName: string, callback: ResourceBuilder) {
    this.resourceName = resourceName;
    this.fields = [];
    this.actions = [];
    this.bulkActions = [];
    callback(this);
  }

  pagination(sizes) {
    this.paginationSizes = sizes;
  }

  field(name, options = {}) {
    this.fields.push(new AdminDSLField(name, options));
  }

  numberField(name, options = {}) {
    this.fields.push(new AdminDSLNumberField(name, options));
  }

  booleanField(name, options = {}) {
    this.fields.push(new AdminDSLBooleanField(name, options));
  }

  enumField(name, values, options = {}) {
    this.fields.push(new AdminDSLEnumField(name, values, options));
  }

  rowAction(name, options = {}, handler) {
    this.actions.push({
      name,
      options,
      handler,
    });
  }

  bulkAction(name) {
    this.bulkActions.push({ name });
  }
}

export enum AdminDSLFieldType {
  TEXT = "text",
  ENUM = "enum",
  BOOLEAN = "boolean",
  NUMBER = "number",
}

export class AdminDSLField {
  type = AdminDSLFieldType.TEXT;
  name: string;
  options: any;

  constructor(name: string, options?: any) {
    this.name = name;
    this.options = options;
  }
}

class AdminDSLNumberField extends AdminDSLField {
  constructor(name: string, options?: any) {
    super(name, options);
    this.type = AdminDSLFieldType.NUMBER;
  }
}

class AdminDSLBooleanField extends AdminDSLField {
  constructor(name: string, options?: any) {
    super(name, options);
    this.type = AdminDSLFieldType.BOOLEAN;
  }
}

interface EnumItem {
  label: string;
  value: any;
}
class AdminDSLEnumField extends AdminDSLField {
  enums: EnumItem[];

  constructor(name: string, enums: EnumItem[], options?: any) {
    super(name, options);
    this.type = AdminDSLFieldType.ENUM;
    this.enums = enums;
  }
}

export function admin(callback: (a: AdminDSL) => void) {
  return new AdminDSL(callback);
}

class AdminDSL {
  constructor(callback) {
    this.resources = [];
    callback(this);
  }

  resource(resourceName, config) {
    const resource = new AdminDSLResource(resourceName, config);
    this.resources.push(resource);
    return resource;
  }
}

class AdminDSLResource {
  constructor(resourceName, config) {
    this.resourceName = resourceName;
    this.fields = [];
    this.actions = [];
    this.bulkActions = [];
    this.config = config(this);
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
  constructor(name: string, options: any) {
    this.name = name;
    this.options = options;
  }
}

class AdminDSLNumberField extends AdminDSLField {
  constructor(name: string, options: any) {
    super(name, options);
    this.type = AdminDSLFieldType.NUMBER;
  }
}

class AdminDSLBooleanField extends AdminDSLField {
  constructor(name: string, options: any) {
    super(name, options);
    this.type = AdminDSLFieldType.BOOLEAN;
  }
}

class AdminDSLEnumField extends AdminDSLField {
  constructor(name, values, options) {
    super(name, options);
    this.type = AdminDSLFieldType.ENUM;
    this.values = values;
  }
}

export function admin(callback: (a: AdminDSL) => void) {
  return new AdminDSL(callback);
}

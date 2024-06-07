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
  paginationSizes: number[];
  fields: AdminDSLField[];
  iconName?: string;

  constructor(resourceName: string, callback: ResourceBuilder) {
    this.resourceName = resourceName;
    this.fields = [];
    this.paginationSizes = [10, 25, 50, 100];
    this.actions = [];
    this.bulkActions = [];
    callback(this);
  }

  icon(iconName: string) {
    this.iconName = iconName;
  }

  pagination(sizes: number[]) {
    this.paginationSizes = sizes;
  }

  field(name: string, options = {}) {
    this.fields.push(new AdminDSLField(name, options));
  }

  numberField(name: string, options = {}) {
    this.fields.push(new AdminDSLNumberField(name, options));
  }

  booleanField(name: string, options = {}) {
    this.fields.push(new AdminDSLBooleanField(name, options));
  }

  dateField(name: string, options = {}) {
    this.fields.push(new AdminDSLDateField(name, options));
  }

  enumField(name: string, values: AdminDSLEnumItem[], options = {}) {
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
  DATE = "date",
}

export interface AdminDSLFieldOption {
  editable: boolean;
  filterable: boolean;
}

export class AdminDSLField {
  type = AdminDSLFieldType.TEXT;
  name: string;
  options: AdminDSLFieldOption;

  constructor(name: string, options?: any) {
    this.name = name;
    this.options = options;
  }
}

export class AdminDSLNumberField extends AdminDSLField {
  constructor(name: string, options?: any) {
    super(name, options);
    this.type = AdminDSLFieldType.NUMBER;
  }
}

export class AdminDSLDateField extends AdminDSLField {
  constructor(name: string, options?: any) {
    super(name, options);
    this.type = AdminDSLFieldType.DATE;
  }
}

export class AdminDSLBooleanField extends AdminDSLField {
  constructor(name: string, options?: any) {
    super(name, options);
    this.type = AdminDSLFieldType.BOOLEAN;
  }
}

export interface AdminDSLEnumItem {
  label: string;
  value: any;
}
export class AdminDSLEnumField extends AdminDSLField {
  enums: AdminDSLEnumItem[];

  constructor(name: string, enums: AdminDSLEnumItem[], options?: any) {
    super(name, options);
    this.type = AdminDSLFieldType.ENUM;
    this.enums = enums;
  }
}

export function admin(callback: (a: AdminDSL) => void) {
  return new AdminDSL(callback);
}

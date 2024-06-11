type ResourceBuilder = (t: AdminDSLResource) => void;
type AdminBuilder = (t: AdminDSL) => void;

function makeProxy<T extends object>(_this: T): T {
  return new Proxy(_this, {
    get: function (target: T, property: string) {
      if (typeof (target as any)[property] === "undefined") {
        return function () {
          console.warn(`Method ${property} is not implemented.`);
        };
      } else {
        return (target as any)[property];
      }
    },
  });
}

export class AdminDSL {
  resources: AdminDSLResource[];

  constructor(callback: AdminBuilder) {
    this.resources = [];
    callback(makeProxy(this));
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
  renderTitle: (record: any) => string = (record: any) =>
    record.title || record.name || record.id;
  iconName?: string;

  constructor(resourceName: string, callback: ResourceBuilder) {
    this.resourceName = resourceName;
    this.fields = [];
    this.paginationSizes = [10, 25, 50, 100];
    callback(makeProxy(this));
  }

  icon(iconName: string) {
    this.iconName = iconName;
  }

  pagination(sizes: number[]) {
    this.paginationSizes = sizes;
  }

  field(name: string, options: AdminDSLFieldOptions = {}) {
    this.fields.push(new AdminDSLField(name, options));
  }

  richTextField(name: string, options: AdminDSLFieldOptions = {}) {
    this.fields.push(new AdminDSLRichTextField(name, options));
  }

  numberField(name: string, options: AdminDSLFieldOptions = {}) {
    this.fields.push(new AdminDSLNumberField(name, options));
  }

  booleanField(name: string, options: AdminDSLFieldOptions = {}) {
    this.fields.push(new AdminDSLBooleanField(name, options));
  }

  dateField(name: string, options: AdminDSLFieldOptions = {}) {
    this.fields.push(new AdminDSLDateField(name, options));
  }

  enumField(
    name: string,
    values: AdminDSLEnumItem[],
    options: AdminDSLFieldOptions = {}
  ) {
    this.fields.push(new AdminDSLEnumField(name, values, options));
  }

  referenceField(
    name: string,
    reference: string,
    options: AdminDSLFieldOptions = {}
  ) {
    this.fields.push(new AdminDSLReferenceField(name, reference, options));
  }

  // TODO: custom methods to render resource title
  title(temp: string) {
    this.renderTitle = () => temp;
  }
}

export enum AdminDSLFieldType {
  TEXT = "text",
  RICH_TEXT = "rich_text",
  ENUM = "enum",
  BOOLEAN = "boolean",
  NUMBER = "number",
  DATE = "date",
  REFERENCE = "reference",
}

export interface AdminDSLFieldOptions {
  editable?: boolean;
  filterable?: boolean;
  icon?: string;
}

export class AdminDSLField {
  type = AdminDSLFieldType.TEXT;
  name: string;
  options: AdminDSLFieldOptions;

  constructor(name: string, options?: AdminDSLFieldOptions) {
    this.name = name;
    this.options = options || {};
  }
}

export class AdminDSLRichTextField extends AdminDSLField {
  constructor(name: string, options?: any) {
    super(name, options);
    this.type = AdminDSLFieldType.RICH_TEXT;
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

export class AdminDSLReferenceField extends AdminDSLField {
  reference: string;
  constructor(name: string, reference: string, options?: any) {
    super(name, options);
    this.type = AdminDSLFieldType.REFERENCE;
    this.reference = reference;
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

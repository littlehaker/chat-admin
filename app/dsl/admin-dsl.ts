class AdminConfig {
  constructor() {
    this.config = {
      pagination: [],
      columns: [],
      rowActions: [],
      bulkActions: [],
    };
  }

  pagination(options) {
    this.config.pagination = options;
  }

  field(accessorKey, options = {}) {
    this.config.columns.push({ type: "text", accessorKey, ...options });
  }

  enumField(accessorKey, enums, options = {}) {
    this.config.columns.push({ type: "enum", accessorKey, enums, ...options });
  }

  rowAction(label, options = {}, callback = null) {
    this.config.rowActions.push({ label, ...options, callback });
  }

  bulkAction(label, options = {}) {
    this.config.bulkActions.push({ label, ...options });
  }

  getConfig() {
    return this.config;
  }
}

export function admin(callback) {
  const t = new AdminConfig();
  callback(t);
  return t.getConfig();
}

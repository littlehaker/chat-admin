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

  field(name, options = {}) {
    this.config.columns.push({ type: "text", name, ...options });
  }

  enumField(name, enums, options = {}) {
    this.config.columns.push({ type: "enum", name, enums, ...options });
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

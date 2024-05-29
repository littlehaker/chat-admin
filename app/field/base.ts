export class FieldMeta {
  renderFilter?: (config, props) => JSX.Element;
  allowFilter?: boolean;
  mock?: (config) => any;
  render(config, value, row) {
    return value;
  }
}

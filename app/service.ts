import axios from "axios";
import { AdminDSL, admin } from "./dsl/admin-dsl";

const url = "http://localhost:6767";

export const exampleDSL = `
admin((a) => {
  a.resource("posts", (t) => {
    t.pagination([2, 10, 20]);
    t.icon("Highlight");  // Icon name from material-ui

    t.field("id", { editable: false }); // id is normally uneditable
    t.field("title", { filterable: true });
    t.field("body");
    t.numberField("score");
    t.referenceField("author", "users", { icon: "Person" }); // a reference to another resource
    t.booleanField("completed", { label: "Completed", editable: false });
    t.enumField(
      "priority",
      [
        { label: "High", value: "high" },
        { label: "Medium", value: "medium", variant: "secondary" },
      ],
      { filterable: true }
    );

    // ...
  });

  a.resource("users", (t) => {
    t.icon("Person");

    t.field("id", { editable: false });
    t.field("name");
    t.enumField("gender", [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
    ]);

    // ...
  });
});
`;

const typeDef = `
type ResourceBuilder = (t: AdminDSLResource) => void;
type AdminBuilder = (t: AdminDSL) => void;

interface AdminDSLFieldOptions {
  editable?: boolean;
  filterable?: boolean;
  icon?: string;
}

class AdminDSL {
  constructor(callback: AdminBuilder)
  resource(resourceName: string, callback: ResourceBuilder)
}

class AdminDSLResource {
  constructor(resourceName: string, callback: ResourceBuilder)
  icon(iconName: string)
  pagination(sizes: number[])
  field(name: string, options: AdminDSLFieldOptions = {})
  richTextField(name: string, options: AdminDSLFieldOptions = {})
  numberField(name: string, options: AdminDSLFieldOptions = {})
  booleanField(name: string, options: AdminDSLFieldOptions = {})
  dateField(name: string, options: AdminDSLFieldOptions = {})
  enumField(name: string, values: AdminDSLEnumItem[], options: AdminDSLFieldOptions = {})
  referenceField(name: string, reference: string, options: AdminDSLFieldOptions = {})
}

admin(callback: AdminBuilder)
`;

const systemPrompt = `
You are a js expert.

There is a DSL to create a view to manage resources, which follow the following types

======= start ========
${typeDef}
======= end ========

This is an example of creating an admin application to manage posts and users
======= start ========
${exampleDSL}
======= end ========

Use this DSL to make admin application I want. Only respond the code in this DSL and the advices, don't respond anything else!!!
`;

function extractSubstring(str: string, prefix: string, suffix: string) {
  var start = str.indexOf(prefix);
  var end = str.indexOf(suffix, start + prefix.length);
  if (start !== -1 && end !== -1) {
    return str.substring(start + prefix.length, end);
  } else {
    return str;
  }
}

export function buildDSL(code: string) {
  const fn = new Function(
    "admin",
    "advice",
    // `return ${code.replace(/^[\n]+/, "")}`
    code
  );

  let adminDsl: AdminDSL = new AdminDSL(() => {});
  function _admin(callback: (a: AdminDSL) => void) {
    adminDsl = admin(callback);
  }

  let advices: string[] = [];
  function _advice(args: string[]) {
    advices = args;
  }
  fn(_admin, _advice);
  return { dsl: adminDsl, advices };
}

export function testDSL(code: string) {
  try {
    buildDSL(code);
    return true;
  } catch {
    return false;
  }
}

export function normalize(code: string) {
  const prefix = "======= start ========";
  const suffix = "======= end ========";
  return extractSubstring(extractSubstring(code, prefix, suffix), "```", "```");
}

export async function generateCode(prompt: string, prevResult?: string) {
  let _prompt;
  if (prevResult) {
    _prompt = `
The previous DSL is like below
======= start ========
${prevResult}
======= end ========

My new requirements based on the previous DSL is
${prompt}

Don't modify any resource or any fields that I didn't mentioned!!!
`;
  } else {
    _prompt = prompt;
  }
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: _prompt },
  ];
  const { data } = await axios.post(
    url,
    {
      messages,
      model: "gpt-3.5-turbo",
      max_tokens: 2048,
      temperature: 0,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return data;
}

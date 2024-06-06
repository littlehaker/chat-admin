import axios from "axios";

const url = "http://localhost:6767";

const systemPrompt = `
You are a js expert.

There is a DSL to create a view to manage resources

======= start ========
admin((a) => {
  a.resource("posts", (t) => {
    t.pagination([2, 10, 20]);

    t.field("id");
    t.field("title", { filterable: true });
    t.field("body");
    t.numberField("score");
    t.booleanField("completed", { label: "Completed", editable: false });
    t.enumField(
      "priority",
      [
        { label: "High", value: "high" },
        { label: "Medium", value: "medium", variant: "secondary" },
      ],
      { filterable: true }
    );

    t.rowAction("Edit");
    t.rowAction("Delete", { confirmText: "Want to delete?" }, (row) => {
      console.log("Deleting row:", row);
    });

    t.bulkAction("Delete");
    t.bulkAction("Download");
  });
});
======= end ========

Use this DSL to satisfy my requirements. Only response the code without anything else.
`;

function extractSubstring(str: string, prefix: string, suffix: string) {
  var start = str.indexOf(prefix);
  var end = str.indexOf(suffix);
  if (start !== -1 && end !== -1) {
    return str.substring(start + prefix.length, end);
  } else {
    return str;
  }
}

export function normalize(code: string) {
  const prefix = "======= start ========";
  const suffix = "======= end ========";
  return extractSubstring(code, prefix, suffix);
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

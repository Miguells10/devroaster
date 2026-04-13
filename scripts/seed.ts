/**
 * Seed script — popula o banco com ~100 roasts e seus issues.
 * Uso: npm run db:seed
 */

import { config } from "dotenv";

config({ path: ".env.local" });

import { faker } from "@faker-js/faker";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { NewRoast, NewRoastIssue } from "../src/db/schema";
import { roastIssues, roasts } from "../src/db/schema";

// ---------------------------------------------------------------------------
// Constantes dos enums (espelham o schema)
// ---------------------------------------------------------------------------

const LANGUAGES = [
	"javascript",
	"typescript",
	"python",
	"rust",
	"go",
	"java",
	"kotlin",
	"swift",
	"css",
	"html",
	"sql",
	"bash",
	"php",
	"ruby",
	"csharp",
	"cpp",
] as const;

const SEVERITIES = ["critical", "warning", "good"] as const;

const _ISSUE_TYPES = [
	"naming",
	"logic",
	"security",
	"performance",
	"style",
	"architecture",
	"tech_debt",
	"best_practice",
	"other",
] as const;

// ---------------------------------------------------------------------------
// Snippets de código ruins por linguagem (para o realismo do roast)
// ---------------------------------------------------------------------------

const CODE_SNIPPETS: Record<string, string[]> = {
	javascript: [
		`var data = [];
for (var i = 0; i < 1000; i++) {
  for (var j = 0; j < 1000; j++) {
    data.push(i * j);
  }
}
console.log(data)`,
		`function getUserData(id) {
  var result = null;
  $.ajax({
    url: '/api/user/' + id,
    async: false,
    success: function(data) { result = data; }
  });
  return result;
}`,
		`function calculate(a, b, c, d, e, f, g) {
  if (a) {
    if (b) {
      if (c) {
        if (d) {
          if (e) {
            return f + g;
          }
        }
      }
    }
  }
}`,
		`var password = "admin123";
var apiKey = "sk-1234567890abcdef";
var dbUrl = "postgres://root:root@localhost/prod";

fetch('/api/data?key=' + apiKey + '&pass=' + password);`,
		`function updateUser(id, name, email, age, city, phone, role, active) {
  db.query('UPDATE users SET name="' + name + '" WHERE id=' + id);
}`,
	],
	typescript: [
		`function processData(data: any): any {
  const result: any = {};
  for (const key in data) {
    result[key] = (data as any)[key]!;
  }
  return result as any;
}`,
		`// @ts-ignore
const value = someUndefinedFunction();
// @ts-nocheck
const config = require('./config');`,
		`interface User {
  id: any;
  name: any;
  data: any;
  meta: any;
}

function doStuff(x: any, y: any): any {
  return x as any;
}`,
		`class UserService {
  public db: any;
  public cache: any;
  public logger: any;

  constructor() {
    this.db = require('pg');
    this.cache = {};
    this.logger = console;
  }

  async getUser(id: any) {
    return await (this.db as any).query('SELECT * FROM users WHERE id = ' + id);
  }
}`,
	],
	python: [
		`import os, sys, json, requests, time, random

data = []
for i in range(10000):
    for j in range(10000):
        data.append(i+j)

print(data)`,
		`password = "super_secret_123"
api_key = "AIza-1234567890"

def get_user(id):
    query = "SELECT * FROM users WHERE id = " + str(id)
    return db.execute(query)`,
		`class god_class:
    def __init__(self):
        self.users = []
        self.products = []
        self.orders = []
        self.db = None
        self.cache = None
        self.logger = None
        self.email_service = None
        self.payment_service = None

    def do_everything(self, user, product, order):
        pass`,
		`def calculate(l):
    r = 0
    for i in l:
        r = r + i
    return r / len(l)

x = [1,2,3,4,5]
print(calculate(x))`,
		`try:
    result = dangerous_function()
except:
    pass`,
	],
	go: [
		`func main() {
    data, err := fetchData()
    if err != nil { }
    process(data)
}`,
		`func getUserByID(id string) User {
    query := "SELECT * FROM users WHERE id = " + id
    rows, _ := db.Query(query)
    var user User
    rows.Scan(&user)
    return user
}`,
		`var globalCounter int = 0
var globalUsers []User
var globalConfig map[string]string

func init() {
    globalCounter = 0
    globalUsers = []User{}
    globalConfig = map[string]string{}
}`,
	],
	java: [
		`public class Main {
    public static void main(String[] args) {
        ArrayList list = new ArrayList();
        for (int i = 0; i < list.size(); i++) {
            Object obj = list.get(i);
            System.out.println((String)obj);
        }
    }
}`,
		`public String buildQuery(String userId) {
    return "SELECT * FROM users WHERE id = '" + userId + "'";
}`,
		`public class GodObject {
    private Database db;
    private Cache cache;
    private Logger logger;
    private EmailService email;
    private PaymentService payment;
    private InventoryService inventory;
    private UserService users;
    private ReportService reports;

    public void doEverything() {}
    public void processOrder() {}
    public void sendEmail() {}
    public void updateInventory() {}
}`,
	],
	sql: [
		`SELECT *
FROM users u, orders o, products p, categories c
WHERE u.id = o.user_id
AND o.product_id = p.id
AND p.category_id = c.id;`,
		`UPDATE users SET password = 'newpassword123' WHERE 1=1;`,
		`SELECT *
FROM users
WHERE name LIKE '%' + @search + '%'
  OR email LIKE '%' + @search + '%'
  OR phone LIKE '%' + @search + '%'`,
		`DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
-- fixes the bug lol`,
	],
	php: [
		`<?php
$query = "SELECT * FROM users WHERE username='" . $_GET['user'] . "'";
$result = mysql_query($query);
$row = mysql_fetch_array($result);
echo $row['password'];`,
		`<?php
error_reporting(0);
$pass = "admin";
if($_POST['password'] == $pass) {
    $_SESSION['admin'] = true;
}`,
	],
	rust: [
		`fn main() {
    let mut v = Vec::new();
    for i in 0..1000000 {
        v.push(i.to_string());
    }
    println!("{}", v.len());
}`,
		`fn process(data: &Vec<String>) -> String {
    let mut result = String::new();
    for item in data {
        result = result + item + ",";
    }
    result
}`,
	],
	css: [
		`.container {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    z-index: 99999 !important;
    display: block !important;
}`,
		`* {
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
}

div { display: flex !important; }
span { display: inline !important; }
p { display: block !important; }`,
	],
	bash: [
		`#!/bin/bash
rm -rf /
echo "done"`,
		`#!/bin/bash
PASSWORD="secret123"
DB_HOST="prod-db.internal"
DB_USER="root"
DB_PASS="rootpassword"
curl -X POST http://api.internal/data -d "pass=$PASSWORD"`,
		`#!/bin/bash
for f in *.log; do
    cat $f >> all_logs.txt
done
rm *.log
chmod 777 /var/www/html`,
	],
	csharp: [
		`public string GetUser(string id) {
    string query = "SELECT * FROM Users WHERE Id = " + id;
    SqlCommand cmd = new SqlCommand(query, connection);
    return cmd.ExecuteScalar().ToString();
}`,
		`catch (Exception e)
{
    // TODO: handle this later
}`,
	],
	cpp: [
		`int main() {
    int* arr = new int[100];
    for (int i = 0; i <= 100; i++) {
        arr[i] = i;
    }
    return 0;
}`,
		`char* getName() {
    char name[50];
    strcpy(name, "local variable");
    return name;
}`,
	],
	kotlin: [
		`fun processUsers(users: List<User?>?) {
    users!!.forEach { user ->
        println(user!!.name!!)
    }
}`,
		`var globalState = mutableListOf<Any>()
var isReady = false
var currentUser: User? = null`,
	],
	swift: [
		`func processData() {
    let data = fetchData()!
    let result = data["key"]! as! String
    let number = Int(result)!
    print(number)
}`,
		`class ViewController: UIViewController {
    var timer: Timer?
    override func viewDidLoad() {
        super.viewDidLoad()
        timer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { _ in
            self.doExpensiveWork()
        }
    }
}`,
	],
	html: [
		`<html>
<head></head>
<body>
<div id="1div">
  <DIV STYLE="COLOR: RED; FONT-SIZE: 24PX">
    <table width="100%">
      <tr><td>&nbsp;&nbsp;&nbsp;Hello&nbsp;&nbsp;&nbsp;</td></tr>
    </table>
  </DIV>
</div>
<script>
  document.getElementById("1div").onclick = eval;
</script>
</body></html>`,
	],
	ruby: [
		`def get_user(id)
  User.find_by("id = #{id}")
end`,
		`$global_users = []
$global_config = {}

def process
  $global_users.each do |user|
    $global_config[user] = user
  end
end`,
	],
};

// ---------------------------------------------------------------------------
// Roast summaries (gerados pela "IA")
// ---------------------------------------------------------------------------

const ROAST_SUMMARIES = [
	"This code is a masterpiece of chaos. The developer clearly has a vendetta against future maintainers.",
	"Congratulations. You've somehow made SQL injection look intentional. That's a skill, honestly.",
	"The nested ifs go so deep, archaeologists would need to dig to find the logic.",
	"This is what happens when you learn to code from a blog post written in 2009.",
	"The variable names are so cryptic, they qualify as classified government information.",
	"Someone copy-pasted from Stack Overflow and forgot to read past the first answer.",
	"This is not technical debt. This is technical bankruptcy with intent to commit fraud.",
	"The error handling strategy here is 'hope for the best'. Bold choice. Wrong, but bold.",
	"The author clearly learned about global variables and decided: MORE IS MORE.",
	"This code will run perfectly. Once. Then never speak of it again.",
	"I've seen spaghetti that was less twisted than this logic.",
	"Every senior dev reviewing this just felt a chill down their spine.",
	"The cyclomatic complexity of this function is higher than the author's confidence should be.",
	"This is the coding equivalent of using a sledgehammer to hang a picture frame.",
	"Whoever wrote this clearly skipped the chapter on separation of concerns. And security. And naming.",
	"The performance implications of this code are so bad, it could crash a server in a meeting about crashing servers.",
	"This would fail a code review at a company that doesn't do code reviews.",
	"The git blame for this file reads like a list of people who have since changed careers.",
	"Future developers will look at this and question their career choices.",
	"This code doesn't just smell — it has an aroma that haunts you.",
];

// ---------------------------------------------------------------------------
// Issue templates (title + description por tipo)
// ---------------------------------------------------------------------------

const ISSUE_TEMPLATES: Record<
	string,
	{ title: string; description: string }[]
> = {
	naming: [
		{
			title: "Variable name 'x' explains nothing",
			description:
				"Single-letter variable names are acceptable only in loop counters. Using them for business logic is a passive-aggressive attack on your teammates.",
		},
		{
			title: "'data' is not a name, it's a cry for help",
			description:
				"Everything in programming is data. Naming a variable 'data' is like naming your dog 'animal'. Be specific.",
		},
		{
			title: "Function named 'doStuff' does too much stuff",
			description:
				"A function named 'doStuff' is a red flag. What stuff? Which stuff? Why this stuff? Name it after what it actually does.",
		},
	],
	security: [
		{
			title: "SQL Injection vulnerability — hardcoded string concatenation",
			description:
				"String concatenation in SQL queries is a fast track to a data breach. Use parameterized queries, prepared statements, or an ORM.",
		},
		{
			title: "Hardcoded credentials detected",
			description:
				"Passwords and API keys hardcoded in source code will end up in git history forever. Use environment variables and a secrets manager.",
		},
		{
			title: "eval() usage detected — remote code execution risk",
			description:
				"Using eval() with user input is the software equivalent of handing a stranger your house keys. Just don't.",
		},
	],
	performance: [
		{
			title: "O(n²) nested loop on large dataset",
			description:
				"This nested loop runs in quadratic time. On a 1000-element array, that's 1,000,000 operations. Consider a Set or Map for O(n) lookups.",
		},
		{
			title: "N+1 query problem",
			description:
				"Querying the database inside a loop creates N+1 queries. Use a JOIN or batch fetch to retrieve all data in a single query.",
		},
		{
			title: "SELECT * fetching unnecessary columns",
			description:
				"SELECT * transfers all columns across the network. Be explicit about which columns you need — your DBA will thank you.",
		},
	],
	logic: [
		{
			title: "Empty catch block silences all errors",
			description:
				"Catching exceptions and doing nothing is worse than not catching them at all. At minimum, log the error. Ideally, handle it.",
		},
		{
			title: "Synchronous HTTP request blocks the event loop",
			description:
				"Using async:false in AJAX blocks the entire browser UI thread. Use async/await or callbacks instead.",
		},
		{
			title: "Division by zero risk — no length check before division",
			description:
				"If the input array is empty, dividing by len(l) will throw a ZeroDivisionError. Always validate inputs before computation.",
		},
	],
	style: [
		{
			title: "Excessive use of !important in CSS",
			description:
				"Overriding every style with !important is a symptom of fighting your own CSS. Increase specificity properly instead.",
		},
		{
			title: "WAY too many function parameters (7+)",
			description:
				"A function with 7+ parameters is trying to do too many things. Group related parameters into an object/struct.",
		},
		{
			title: "Deep nesting (5+ levels) makes logic unreadable",
			description:
				"Deeply nested conditionals are hard to read and test. Apply early returns or guard clauses to flatten the structure.",
		},
	],
	architecture: [
		{
			title: "God class doing too many unrelated things",
			description:
				"A class that handles users, products, orders, emails, AND payments violates the Single Responsibility Principle. Break it apart.",
		},
		{
			title: "Global mutable state creates hidden coupling",
			description:
				"Global variables create invisible dependencies between unrelated parts of the code. Pass state explicitly via parameters or dependency injection.",
		},
	],
	tech_debt: [
		{
			title: "// TODO: handle this later (found in production code)",
			description:
				"'Later' never comes. TODOs in production code are promises you made to your future self that you will not keep.",
		},
		{
			title: "Commented-out DROP TABLE in migration file",
			description:
				"Leaving destructive SQL commented out in a migration is a ticking time bomb. Delete it or document why it's there.",
		},
	],
	best_practice: [
		{
			title: "Using `var` instead of `const`/`let`",
			description:
				"var is function-scoped and hoisted, which leads to subtle bugs. Use const by default, let when reassignment is needed.",
		},
		{
			title: "No error handling on async operations",
			description:
				"Ignoring errors from async functions means silent failures. Always handle the error case, even if it's just logging.",
		},
		{
			title: "Force-unwrapping optionals without any safety check",
			description:
				"Using ! to force-unwrap optionals will crash your app at runtime if the value is nil. Use optional binding or provide a default.",
		},
	],
	other: [
		{
			title: "chmod 777 on web directory is a security disaster",
			description:
				"Setting 777 permissions on a web-accessible directory allows any process on the server to read, write, and execute files there.",
		},
		{
			title: "rm -rf / in a shell script",
			description:
				"This deletes the entire filesystem. There is no undo. This is not a code smell — this is arson.",
		},
	],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pickRandom<T>(arr: readonly T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomN<T>(arr: readonly T[], n: number): T[] {
	const shuffled = [...arr].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, n);
}

function getCodeSnippet(lang: string): string {
	const snippets = CODE_SNIPPETS[lang] ?? CODE_SNIPPETS.javascript;
	return pickRandom(snippets);
}

function buildCodePreview(code: string): string {
	const oneLiner = code.replace(/\s+/g, " ").trim();
	return oneLiner.slice(0, 120);
}

function randomScore(mode: "honest" | "sarcastic"): string {
	// Distribuição enviesada para baixo (leaderboard de vergonha)
	const base = faker.number.float({ min: 1.0, max: 8.5, fractionDigits: 2 });
	const sarcasm_penalty = mode === "sarcastic" ? 0.5 : 0;
	return Math.max(1, base - sarcasm_penalty).toFixed(2);
}

function buildIssues(roastId: string, lang: string): NewRoastIssue[] {
	const count = faker.number.int({ min: 2, max: 5 });
	const typeKeys = pickRandomN(Object.keys(ISSUE_TEMPLATES), count);

	return typeKeys.map((type, idx) => {
		const templates = ISSUE_TEMPLATES[type];
		const template = pickRandom(templates);
		const snippets = CODE_SNIPPETS[lang] ?? CODE_SNIPPETS.javascript;
		const codeSnippet = pickRandom(snippets);
		const linesInSnippet = codeSnippet.split("\n").length;
		const lineStart = faker.number.int({
			min: 1,
			max: Math.max(1, linesInSnippet - 2),
		});

		return {
			roastId,
			severity: pickRandom(SEVERITIES),
			type: type as NewRoastIssue["type"],
			title: template.title,
			description: template.description,
			codeBefore: faker.datatype.boolean(0.7)
				? codeSnippet.split("\n").slice(0, 3).join("\n")
				: null,
			codeAfter: faker.datatype.boolean(0.6)
				? `// fixed version\n${codeSnippet.split("\n")[0]?.replace("var", "const") ?? ""}`
				: null,
			lineStart,
			lineEnd: lineStart + faker.number.int({ min: 0, max: 3 }),
			sortOrder: idx,
		};
	});
}

// ---------------------------------------------------------------------------
// Main seed
// ---------------------------------------------------------------------------

async function main() {
	const pool = new Pool({ connectionString: process.env.DATABASE_URL });
	const db = drizzle(pool, { casing: "snake_case" });

	console.log("🌱 Starting seed...\n");

	// Limpa dados existentes
	await db.delete(roastIssues);
	await db.delete(roasts);
	console.log("🗑️  Cleared existing data");

	const TOTAL_ROASTS = 100;
	const insertedRoasts: { id: string; language: string }[] = [];

	// Insere roasts em batches de 20
	const BATCH_SIZE = 20;
	for (let batch = 0; batch < TOTAL_ROASTS / BATCH_SIZE; batch++) {
		const roastBatch: NewRoast[] = Array.from({ length: BATCH_SIZE }, () => {
			const lang = pickRandom(LANGUAGES);
			const mode = pickRandom(["honest", "sarcastic"] as const);
			const code = getCodeSnippet(lang);
			const lines = code.split("\n");

			return {
				code,
				language: lang as NewRoast["language"],
				roastMode: mode,
				score: randomScore(mode),
				summary: pickRandom(ROAST_SUMMARIES),
				codePreview: buildCodePreview(code),
				charCount: code.length,
				lineCount: lines.length,
				sessionId: faker.string.uuid(),
				createdAt: faker.date.between({
					from: new Date("2025-01-01"),
					to: new Date(),
				}),
			};
		});

		const result = await db.insert(roasts).values(roastBatch).returning({
			id: roasts.id,
			language: roasts.language,
		});

		insertedRoasts.push(...result);
		process.stdout.write(
			`  ✅ Batch ${batch + 1}/${TOTAL_ROASTS / BATCH_SIZE} — ${result.length} roasts inserted\n`,
		);
	}

	// Insere issues para cada roast
	console.log("\n🔥 Inserting roast issues...");
	let totalIssues = 0;
	for (const { id, language } of insertedRoasts) {
		const issues = buildIssues(id, language);
		await db.insert(roastIssues).values(issues);
		totalIssues += issues.length;
	}

	console.log(`\n✅ Seed complete!`);
	console.log(`   Roasts:       ${insertedRoasts.length}`);
	console.log(`   Roast Issues: ${totalIssues}`);
	console.log(
		`   Avg issues/roast: ${(totalIssues / insertedRoasts.length).toFixed(1)}`,
	);

	await pool.end();
}

main().catch((err) => {
	console.error("❌ Seed failed:", err.message);
	process.exit(1);
});

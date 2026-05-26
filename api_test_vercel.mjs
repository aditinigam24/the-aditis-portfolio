// api_test_vercel.mjs
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

if (fs.existsSync(path.resolve("src/.env"))) {
  dotenv.config({ path: path.resolve("src/.env") });
} else {
  dotenv.config();
}

import jerryHandler from './api/jerry.js';
import sendEmailHandler from './api/send-email.js';

function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(obj) {
      this.body = obj;
      return this;
    },
    send(str) {
      this.body = str;
      return this;
    }
  };
  return res;
}

async function runVercelTests() {
  console.log("--- RUNNING VERCEL SERVERLESS TESTS ---");

  // Test 1: Invalid Method (GET on jerry.js)
  console.log("\nTest 1: Method validation on Jerry (GET)");
  const req1 = { method: 'GET', url: '/api/jerry' };
  const res1 = mockRes();
  await jerryHandler(req1, res1);
  console.log('Status:', res1.statusCode);
  console.log('Body:', res1.body);

  // Test 2: Missing Fields on send-email.js (POST)
  console.log("\nTest 2: Missing fields on send-email");
  const req2 = { method: 'POST', url: '/api/send-email', body: {} };
  const res2 = mockRes();
  await sendEmailHandler(req2, res2);
  console.log('Status:', res2.statusCode);
  console.log('Body:', res2.body);

  // Test 3: Invalid Email on send-email.js (POST)
  console.log("\nTest 3: Invalid email on send-email");
  const req3 = {
    method: 'POST',
    url: '/api/send-email',
    body: {
      name: 'Test',
      email: 'not-an-email',
      question: 'Subject',
      message: 'Hello world'
    }
  };
  const res3 = mockRes();
  await sendEmailHandler(req3, res3);
  console.log('Status:', res3.statusCode);
  console.log('Body:', res3.body);

  console.log("\n--- VERCEL TESTS COMPLETED ---");
}

runVercelTests().catch(console.error);

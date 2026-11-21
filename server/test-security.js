const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING ADMIN SECURITY & CREDENTIALS TEST SUITE ===');

  // Step 1: Login with initial credentials
  console.log('\n[TEST 1] Logging in as initial admin (admin@hilubricant.com)...');
  let loginRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: 'admin@hilubricant.com',
    password: 'Admin@123456'
  });

  if (loginRes.status !== 200 || !loginRes.data.token) {
    console.error('FAILED Initial Login:', loginRes);
    process.exit(1);
  }
  let token = loginRes.data.token;
  console.log('SUCCESS: Logged in! Admin name:', loginRes.data.user.name);

  // Step 2: Get Account Info
  console.log('\n[TEST 2] Fetching account info (GET /api/admin/settings/account)...');
  let accRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/settings/account',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Status:', accRes.status);
  console.log('Account Info:', accRes.data);
  if (accRes.status !== 200 || !accRes.data.account?.email || accRes.data.account?.password !== undefined) {
    console.error('FAILED Account Info check (password leaked or missing email)');
    process.exit(1);
  }
  console.log('SUCCESS: Account info returned safely without exposing password/hash.');

  // Step 3: Test Email validation & Wrong password
  console.log('\n[TEST 3] Testing Change Email with wrong password...');
  let wrongPassEmailRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/settings/email',
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }, {
    newEmail: 'newadmin@hilubricant.com',
    confirmEmail: 'newadmin@hilubricant.com',
    currentPassword: 'WrongPassword123!'
  });
  console.log('Wrong Password Status:', wrongPassEmailRes.status, 'Message:', wrongPassEmailRes.data.message);
  if (wrongPassEmailRes.status !== 401) {
    console.error('FAILED: Should reject wrong password with 401');
    process.exit(1);
  }
  console.log('SUCCESS: Wrong password correctly rejected with 401.');

  // Step 4: Test Change Email with correct password
  console.log('\n[TEST 4] Updating Email to admin-updated@hilubricant.com...');
  let updateEmailRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/settings/email',
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }, {
    newEmail: 'admin-updated@hilubricant.com',
    confirmEmail: 'admin-updated@hilubricant.com',
    currentPassword: 'Admin@123456'
  });
  console.log('Update Email Status:', updateEmailRes.status, 'Response:', updateEmailRes.data);
  if (updateEmailRes.status !== 200) {
    console.error('FAILED to update email');
    process.exit(1);
  }
  console.log('SUCCESS: Email updated and session invalidated.');

  // Step 5: Verify Old Token is Invalidated
  console.log('\n[TEST 5] Verifying old token is invalidated...');
  let oldTokenCheck = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/settings/account',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Old Token Account Request Status:', oldTokenCheck.status);
  if (oldTokenCheck.status !== 401) {
    console.error('FAILED: Old token was NOT invalidated!');
    process.exit(1);
  }
  console.log('SUCCESS: Old token correctly rejected with 401.');

  // Step 6: Verify Login with old email fails
  console.log('\n[TEST 6] Verifying old email login fails...');
  let oldEmailLogin = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: 'admin@hilubricant.com',
    password: 'Admin@123456'
  });
  console.log('Old Email Login Status:', oldEmailLogin.status);
  if (oldEmailLogin.status === 200) {
    console.error('FAILED: Old email should not be able to log in!');
    process.exit(1);
  }
  console.log('SUCCESS: Old email login rejected.');

  // Step 7: Verify Login with new email succeeds
  console.log('\n[TEST 7] Logging in with new email (admin-updated@hilubricant.com)...');
  let newEmailLogin = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: 'admin-updated@hilubricant.com',
    password: 'Admin@123456'
  });
  if (newEmailLogin.status !== 200) {
    console.error('FAILED: Login with updated email failed:', newEmailLogin);
    process.exit(1);
  }
  token = newEmailLogin.data.token;
  console.log('SUCCESS: Logged in with new email! Token acquired.');

  // Step 8: Test Password Complexity Requirements
  console.log('\n[TEST 8] Testing Password Complexity Requirements...');
  const invalidPasswords = [
    { p: 'short1!', reason: 'Too short (<12)' },
    { p: 'alllowercase123!', reason: 'No uppercase' },
    { p: 'ALLUPPERCASE123!', reason: 'No lowercase' },
    { p: 'NoNumbersHereAtAll!', reason: 'No digit' },
    { p: 'NoSpecialCharacters12345', reason: 'No special character' }
  ];

  for (const test of invalidPasswords) {
    let failPassRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/settings/password',
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }, {
      currentPassword: 'Admin@123456',
      newPassword: test.p,
      confirmPassword: test.p
    });
    console.log(`Testing [${test.reason}]: status ${failPassRes.status} (msg: ${failPassRes.data.message})`);
    if (failPassRes.status !== 400) {
      console.error(`FAILED: ${test.reason} was not rejected! Status:`, failPassRes.status);
      process.exit(1);
    }
  }
  console.log('SUCCESS: All complexity criteria strictly enforced.');

  // Step 9: Change Password with valid 12+ char complex password
  console.log('\n[TEST 9] Changing password to complex password "NewSecureAdmin@2026!"...');
  let changePassRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/settings/password',
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }, {
    currentPassword: 'Admin@123456',
    newPassword: 'NewSecureAdmin@2026!',
    confirmPassword: 'NewSecureAdmin@2026!'
  });
  console.log('Change Password Status:', changePassRes.status, 'Response:', changePassRes.data);
  if (changePassRes.status !== 200) {
    console.error('FAILED to change password:', changePassRes);
    process.exit(1);
  }
  console.log('SUCCESS: Password changed and all sessions invalidated.');

  // Step 10: Verify login with old password fails
  console.log('\n[TEST 10] Verifying old password fails...');
  let oldPassLogin = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: 'admin-updated@hilubricant.com',
    password: 'Admin@123456'
  });
  console.log('Old Password Login Status:', oldPassLogin.status);
  if (oldPassLogin.status === 200) {
    console.error('FAILED: Old password still works!');
    process.exit(1);
  }
  console.log('SUCCESS: Old password correctly rejected.');

  // Step 11: Verify login with new password succeeds
  console.log('\n[TEST 11] Logging in with new password "NewSecureAdmin@2026!"...');
  let newPassLogin = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: 'admin-updated@hilubricant.com',
    password: 'NewSecureAdmin@2026!'
  });
  if (newPassLogin.status !== 200) {
    console.error('FAILED: Login with new password failed:', newPassLogin);
    process.exit(1);
  }
  token = newPassLogin.data.token;
  console.log('SUCCESS: Login with new password succeeded!');

  // Step 12: Test Terminate All Sessions endpoint
  console.log('\n[TEST 12] Testing Terminate All Active Sessions (POST /api/admin/settings/logout-all)...');
  let logoutAllRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/settings/logout-all',
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Logout All Status:', logoutAllRes.status, 'Response:', logoutAllRes.data);
  if (logoutAllRes.status !== 200) {
    console.error('FAILED Terminate all sessions:', logoutAllRes);
    process.exit(1);
  }
  console.log('SUCCESS: Sessions terminated.');

  // Step 13: Revert credentials back to default admin@hilubricant.com / Admin@123456
  console.log('\n[TEST 13] Reverting credentials back to default (admin@hilubricant.com / Admin@123456)...');
  // Re-login after logout-all
  let reloginRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: 'admin-updated@hilubricant.com',
    password: 'NewSecureAdmin@2026!'
  });
  token = reloginRes.data.token;

  // Revert Email
  let revEmailRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/settings/email',
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }, {
    newEmail: 'admin@hilubricant.com',
    confirmEmail: 'admin@hilubricant.com',
    currentPassword: 'NewSecureAdmin@2026!'
  });
  console.log('Revert Email Status:', revEmailRes.status);

  // Log in with reverted email
  let revertEmailLogin = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: 'admin@hilubricant.com',
    password: 'NewSecureAdmin@2026!'
  });
  token = revertEmailLogin.data.token;

  // Revert Password to Admin@123456 (12 chars)
  let revPassRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/settings/password',
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }, {
    currentPassword: 'NewSecureAdmin@2026!',
    newPassword: 'Admin@123456',
    confirmPassword: 'Admin@123456'
  });
  console.log('Revert Password Status:', revPassRes.status);

  // Final check: Login with original default credentials
  let finalLogin = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: 'admin@hilubricant.com',
    password: 'Admin@123456'
  });

  if (finalLogin.status !== 200) {
    console.error('FAILED final verification with default credentials:', finalLogin);
    process.exit(1);
  }
  console.log('SUCCESS: Final login verified with admin@hilubricant.com / Admin@123456');

  // Step 14: Check security on unauthenticated access
  console.log('\n[TEST 14] Verifying unauthenticated request to /api/admin/settings/account is blocked...');
  let unauthRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/settings/account',
    method: 'GET'
  });
  console.log('Unauthenticated access status:', unauthRes.status);
  if (unauthRes.status !== 401) {
    console.error('FAILED: Unauthenticated request should be 401!');
    process.exit(1);
  }

  console.log('\n======================================================');
  console.log('🎉 ALL 14 SECURITY & CREDENTIAL TESTS PASSED PERFECTLY!');
  console.log('Default credentials ready: admin@hilubricant.com / Admin@123456');
  console.log('======================================================');
}

runTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});

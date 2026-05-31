const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, 'public', 'assets', 'images', 'screenshots');

// Ensure directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  console.log('Created screenshot directory:', SCREENSHOT_DIR);
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Smooth scroll helper to force lazy loaded images to compile/load
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 60);
    });
  });
  // Scroll back to the top
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(2500); // Wait for things to settle
}

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Set 60-second default timeout to survive Next.js route compilation & DB cold starts
  page.setDefaultNavigationTimeout(60000);
  await page.setViewport({ width: 1280, height: 900 });

  try {
    // === 1. HOME PAGE ===
    console.log('Capturing Home Page (with lazy loaded images)...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'load' });
    await delay(2000);
    await autoScroll(page);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'home.png') });

    // === 2. PRODUCT DETAIL PAGE ===
    console.log('Capturing Product Details Page...');
    await page.goto(`${BASE_URL}/product/polo-sporting-stretch-shirt`, { waitUntil: 'load' });
    await delay(1500);
    await autoScroll(page);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'product-detail.png') });

    // === 3. SEARCH PAGE ===
    console.log('Capturing Search Catalog Page...');
    await page.goto(`${BASE_URL}/search`, { waitUntil: 'load' });
    await delay(1500);
    await autoScroll(page);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'search.png') });

    // === 4. PUBLIC AUTH PAGES ===
    console.log('Capturing Sign In Page...');
    await page.goto(`${BASE_URL}/auth/signin`, { waitUntil: 'load' });
    await delay(1500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'signin.png') });

    console.log('Capturing Sign Up Page...');
    await page.goto(`${BASE_URL}/auth/signup`, { waitUntil: 'load' });
    await delay(1500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'signup.png') });

    // === 5. LOG IN AS REGULAR USER ===
    console.log('Logging in as regular user...');
    await page.goto(`${BASE_URL}/auth/signin`, { waitUntil: 'load' });
    await page.type('#email', 'user@example.com');
    await page.type('#password', '123456');
    
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'load', timeout: 30000 }).catch(() => console.log('Login redirect wait timed out...'))
    ]);
    console.log('Logged in successfully as user!');
    await delay(3000);

    // === 6. WRITE A REVIEW MODAL ===
    console.log('Opening and capturing Write a Review Dialog...');
    await page.goto(`${BASE_URL}/product/polo-sporting-stretch-shirt`, { waitUntil: 'load' });
    await delay(2000);
    
    // Scroll down to the Customer Reviews section
    await page.evaluate(() => {
      const reviewHeader = Array.from(document.querySelectorAll('h2, h3, div')).find(el => el.textContent.includes('Reviews'));
      if (reviewHeader) {
        reviewHeader.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo(0, document.body.scrollHeight / 1.5);
      }
    });
    await delay(2000);

    // Click "Write a Review"
    const writeReviewBtn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(b => b.textContent.includes('Write a Review'));
    });

    if (writeReviewBtn && writeReviewBtn.asElement()) {
      await writeReviewBtn.asElement().click();
      console.log('Clicked "Write a Review", waiting for dialog to open...');
      await delay(2000);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'write-review-modal.png') });
      
      // Close the review dialog (press Escape)
      await page.keyboard.press('Escape');
      await delay(1000);
    } else {
      console.log('Warning: "Write a Review" button not found.');
    }

    // === 7. ADD PRODUCT TO CART ===
    console.log('Adding product to cart...');
    const cartAdditionResult = await page.evaluate(() => {
      // Look for plus quantity button if already exists
      const plusBtn = Array.from(document.querySelectorAll('button')).find(b => b.querySelector('svg.lucide-plus') || b.innerHTML.includes('lucide-plus') || b.textContent.includes('+'));
      if (plusBtn) {
        plusBtn.click();
        return "Incremented existing cart item quantity";
      }
      
      // Look for standard AddToCart button
      const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('AddToCart') || b.textContent.includes('Add To Cart'));
      if (addBtn) {
        addBtn.click();
        return "Added item to cart";
      }
      return "No cart button found";
    });
    console.log('Cart Action Result:', cartAdditionResult);
    await delay(3000);

    console.log('Navigating to Cart Page...');
    await page.goto(`${BASE_URL}/cart`, { waitUntil: 'load' });
    await delay(2500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'cart.png') });

    // === 8. CHECKOUT - SHIPPING ===
    console.log('Navigating to Shipping Address Page...');
    await page.goto(`${BASE_URL}/shipping-address`, { waitUntil: 'load' });
    await delay(2500);
    
    // Type in Full Name because seeded DB user address is missing fullName
    console.log('Filling in Full Name to pass validation...');
    await page.type('input[placeholder="Enter your full name"]', 'John Doe');
    await delay(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'shipping-address.png') });

    // Click submit/continue on shipping address by text matching
    const addressSubmit = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(b => b.textContent.includes('Continue'));
    });
    if (addressSubmit && addressSubmit.asElement()) {
      await addressSubmit.asElement().click();
      console.log('Submitted shipping address via Continue button, waiting for redirect...');
      await delay(4000);
    } else {
      console.log('Warning: Continue button not found on shipping page.');
    }

    // === 9. CHECKOUT - PAYMENT METHOD (SELECT STRIPE) ===
    console.log('Navigating to Payment Method Page...');
    await page.goto(`${BASE_URL}/payment-method`, { waitUntil: 'load' });
    await delay(2000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'payment-method.png') });

    // Select Stripe radio button
    console.log('Selecting Stripe as payment method...');
    const stripeSelected = await page.evaluate(() => {
      const stripeRadio = document.querySelector('button[role="radio"][value="Stripe"]') || 
                           document.querySelector('button[value="Stripe"]');
      if (stripeRadio) {
        stripeRadio.click();
        return true;
      }
      const labels = Array.from(document.querySelectorAll('label'));
      const stripeLabel = labels.find(l => l.textContent.includes('Stripe'));
      if (stripeLabel) {
        stripeLabel.click();
        return true;
      }
      return false;
    });
    console.log('Stripe selection result:', stripeSelected);
    await delay(1500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'payment-method-selected.png') });

    const paymentSubmit = await page.$('button[type="submit"]');
    if (paymentSubmit) {
      await paymentSubmit.click();
      console.log('Submitted payment method, waiting for redirect...');
      await delay(4000);
    }

    // === 10. CHECKOUT - PLACE ORDER ===
    console.log('Navigating to Place Order Page...');
    await page.goto(`${BASE_URL}/place-order`, { waitUntil: 'load' });
    await delay(5000); // Give plenty of time for compilation & loaders
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'place-order.png') });

    console.log('Clicking Place Order button natively...');
    const orderPlaced = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent.includes('Place Order'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    console.log('Place Order button clicked natively:', orderPlaced);
    await delay(9000); // Wait for order database write and Stripe init to complete
    
    // Parse order ID from the redirected URL
    const currentUrl = page.url();
    let orderId = currentUrl.split('/order/')[1]?.split('?')[0];
    console.log('Detected Order ID:', orderId);

    // === 11. ORDER DETAILS (WITH STRIPE FORM) ===
    console.log('Capturing Order Details Page...');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'order-details.png') });

    // === 12. STRIPE PAYMENT SUCCESS PAGE ===
    if (orderId) {
      console.log('Navigating to Stripe Payment Success Page (Mocked)...');
      await page.goto(`${BASE_URL}/order/${orderId}/stripe-payment-success?payment_intent=mock_success`, { waitUntil: 'load' });
      await delay(3500);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'payment-success.png') });
    } else {
      console.log('Skipping Payment Success Page screenshot (No orderId detected).');
    }

    // === 13. USER DASHBOARDS ===
    console.log('Capturing User Profile Page...');
    await page.goto(`${BASE_URL}/user/profile`, { waitUntil: 'load' });
    await delay(2500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'user-profile.png') });

    console.log('Capturing User Orders Page...');
    await page.goto(`${BASE_URL}/user/orders`, { waitUntil: 'load' });
    await delay(2500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'user-orders.png') });

    // === 14. NATIVE NEXTAUTH LOG OUT ===
    console.log('Logging out regular user via NextAuth native endpoint...');
    await page.goto(`${BASE_URL}/api/auth/signout`, { waitUntil: 'load' });
    await delay(2000);
    
    // Find the Sign out button in the form and click it to invalidate session
    const signOutBtn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(b => b.textContent.includes('Sign out') || b.textContent.includes('Sign Out'));
    });
    if (signOutBtn && signOutBtn.asElement()) {
      await signOutBtn.asElement().click();
      console.log('Clicked native sign out button, waiting for redirect...');
      await delay(5000); // Give 5 full seconds to settle
    } else {
      console.log('Warning: NextAuth sign out button not found, clearing cookies as fallback...');
      const cookies = await page.cookies();
      for (let cookie of cookies) {
        await page.deleteCookie(cookie);
      }
      await delay(3000);
    }

    // === 15. LOG IN AS ADMINISTRATOR ===
    console.log('Logging in as administrator...');
    await page.goto(`${BASE_URL}/auth/signin`, { waitUntil: 'load' });
    await delay(3500); // Give plenty of time to render
    await page.type('#email', 'admin@example.com');
    await page.type('#password', '123456');
    
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'load', timeout: 30000 }).catch(() => console.log('Admin login redirect wait timed out...'))
    ]);
    await delay(4000);

    // === 16. ADMIN OVERVIEW & PANELS ===
    console.log('Capturing Admin Overview...');
    await page.goto(`${BASE_URL}/admin/overview`, { waitUntil: 'load' });
    await delay(3500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'admin-overview.png') });

    console.log('Capturing Admin Products...');
    await page.goto(`${BASE_URL}/admin/products`, { waitUntil: 'load' });
    await delay(2500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'admin-products.png') });

    console.log('Capturing Admin Orders...');
    await page.goto(`${BASE_URL}/admin/orders`, { waitUntil: 'load' });
    await delay(2500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'admin-orders.png') });

    console.log('Capturing Admin Users...');
    await page.goto(`${BASE_URL}/admin/users`, { waitUntil: 'load' });
    await delay(2500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'admin-users.png') });

    console.log('All screenshots captured successfully!');
  } catch (error) {
    console.error('Error during screenshot generation:', error);
  } finally {
    console.log('Closing browser...');
    await browser.close();
  }
}

run();

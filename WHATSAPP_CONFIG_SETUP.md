# WhatsApp Configuration Setup

## Step 1: Backend Configuration (.env)

Add these variables to your `.backend/.env` file:

```env
# WhatsApp Configuration
WHATSAPP_ADMIN_PHONE=919876543210
WHATSAPP_BUSINESS_NAME=Costume Rental Co
WHATSAPP_PICKUP_DEADLINE=24 hours
WHATSAPP_GOOGLE_REVIEW_LINK=https://maps.app.goo.gl/YOUR_BUSINESS_LINK

# Queue Configuration (for Phase 2+)
QUEUE_CONNECTION=database
```

## Step 2: Frontend Configuration (.env.local)

Create `frontend/.env.local` file (or add to existing `.env`):

```env
VITE_API_URL=https://costume-rental-system.onrender.com/api
VITE_WHATSAPP_ADMIN_PHONE=919876543210
```

## Step 3: Configure Admin WhatsApp Number

**Important**: Phone number format must be:
- Country code + phone number (no + or spaces)
- Examples:
  - India: 919876543210
  - US: 12125551234
  - UK: 441234567890

To find your WhatsApp number:
1. Open WhatsApp
2. Click your profile picture
3. Tap "About"
4. Your WhatsApp number is displayed at the top

## Step 4: Verify Backend Services

Ensure the following directory exists:
```
backend/app/Services/WhatsApp/
```

The service file should be:
```
backend/app/Services/WhatsApp/WhatsAppMessageService.php
```

## Step 5: Verify Frontend Service

Ensure the following file exists:
```
frontend/src/services/whatsappService.js
```

## Step 6: Verify Updated Components

Check these files are updated:
```
frontend/src/pages/customer/Cart.jsx
```

## Step 7: Test the Integration

### Local Testing:

1. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Start Backend:**
   ```bash
   cd backend
   php artisan serve
   ```

3. **Test Flow:**
   - Go to Cart page
   - Add items
   - Enter name and phone
   - Click "Send Request via WhatsApp"
   - Verify WhatsApp opens with pre-filled message

### Manual WhatsApp Testing:

To test without opening WhatsApp app:
1. Click the generated link manually
2. Check that phone number is correct
3. Verify message text is properly formatted

## Step 8: Deployment

### For Render/Heroku:

1. **Update Backend Environment Variables** in dashboard:
   - Add `WHATSAPP_ADMIN_PHONE`
   - Add `WHATSAPP_BUSINESS_NAME`
   - Add other WhatsApp config variables

2. **Update Frontend Environment Variables** in deployment config:
   - Add `VITE_WHATSAPP_ADMIN_PHONE`
   - Add `VITE_API_URL`

3. **Redeploy:**
   ```bash
   git push  # or your deployment trigger
   ```

## Troubleshooting

### Problem: WhatsApp link returns 404

**Solution**: 
- Verify phone number format (no +, no spaces)
- Check country code is correct
- Ensure WhatsApp is installed on your device

### Problem: Message text is truncated or garbled

**Solution**:
- Check that `urlencode()` is being used in backend
- Verify `encodeURIComponent()` is being used in frontend
- Test with shorter message first

### Problem: Phone number not recognized

**Solution**:
- Verify the format matches wa.me requirements
- Try removing country code and using local format
- Check with your phone provider for correct number format

## Next Steps

- Phase 1 Complete: Customers can submit requests via WhatsApp ✅
- Phase 2: Set up automated backend notifications (see main guide)
- Phase 3: Implement lifecycle messaging

---

For more details, refer to [WHATSAPP_INTEGRATION_GUIDE.md](../WHATSAPP_INTEGRATION_GUIDE.md)

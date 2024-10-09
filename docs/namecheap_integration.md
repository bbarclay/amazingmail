# Namecheap Integration Guide for AmazingMail

## Overview
This guide provides instructions for integrating Namecheap domain registration and email account setup with AmazingMail.

## Prerequisites
- Namecheap account
- API access enabled on your Namecheap account
- API key and username from Namecheap

## Integration Steps

1. **Enable API Access**
   - Log in to your Namecheap account
   - Go to Profile > Tools > API Access
   - Enable API access and whitelist your server's IP address

2. **Obtain API Credentials**
   - Retrieve your API key and username from the Namecheap dashboard

3. **Configure Environment Variables**
   Add the following to your `.env` file:
   ```
   NAMECHEAP_API_USER=your_namecheap_username
   NAMECHEAP_API_KEY=your_namecheap_api_key
   NAMECHEAP_API_ENDPOINT=https://api.namecheap.com/xml.response
   ```

4. **Install Namecheap API Client**
   ```bash
   npm install namecheap-api
   ```

5. **Initialize Namecheap Client**
   ```javascript
   import NamecheapAPI from 'namecheap-api';

   const namecheap = new NamecheapAPI({
     user: process.env.NAMECHEAP_API_USER,
     key: process.env.NAMECHEAP_API_KEY,
     ip: 'your_server_ip_address',
     sandbox: false // Set to true for testing
   });
   ```

6. **Implement Domain Registration**
   ```javascript
   async function registerDomain(domainName) {
     try {
       const result = await namecheap.domains.create({
         DomainName: domainName,
         Years: 1
       });
       console.log('Domain registered successfully:', result);
     } catch (error) {
       console.error('Failed to register domain:', error);
     }
   }
   ```

7. **Set Up Email Hosting**
   ```javascript
   async function setupEmailHosting(domainName) {
     try {
       const result = await namecheap.emails.purchaseHosting({
         DomainName: domainName,
         Type: 'Professional' // Or 'Basic' depending on your needs
       });
       console.log('Email hosting set up successfully:', result);
     } catch (error) {
       console.error('Failed to set up email hosting:', error);
     }
   }
   ```

8. **Create Email Account**
   ```javascript
   async function createEmailAccount(domainName, emailAddress, password) {
     try {
       const result = await namecheap.emails.createAccount({
         DomainName: domainName,
         EmailAddress: emailAddress,
         Password: password
       });
       console.log('Email account created successfully:', result);
     } catch (error) {
       console.error('Failed to create email account:', error);
     }
   }
   ```

9. **Test Integration**
   - Create test functions to verify domain registration and email setup
   - Use Namecheap's sandbox environment for testing before going live

## Best Practices
- Use environment variables for sensitive information
- Implement proper error handling and logging
- Regularly check for API updates from Namecheap

## Troubleshooting
- Verify API credentials and IP whitelist
- Check Namecheap API status and documentation
- Ensure sufficient funds in your Namecheap account

## Support
For additional assistance, contact Namecheap support or AmazingMail support at support@amazingmail.com.

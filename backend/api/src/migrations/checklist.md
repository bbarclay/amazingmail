# Migration File Review Checklist

For each TypeScript migration file, perform the following tasks:

1. **Look for Improvements**
   - Review the code for potential improvements in logic, structure, or performance.
   - Ensure the code is clean and follows a consistent style.

2. **Debug**
   - Check for syntax errors or logical bugs.
   - Verify that the migration scripts execute as expected without errors.

3. **Ensure Proper Indexes**
   - Identify fields that might be searched on in a UI setting.
   - Ensure these fields have appropriate indexes to optimize query performance.

4. **Use TypeScript Best Practices**
   - Ensure type safety by using interfaces or types where appropriate.
   - Avoid using the `any` type unless absolutely necessary.
   - Use modern TypeScript features and syntax.

5. **Documentation**
   - Ensure the migration file is well-documented with comments explaining complex logic or decisions.

6. **Testing**
   - If possible, write tests to verify the migration logic.
   - Ensure the migration can be rolled back if necessary.

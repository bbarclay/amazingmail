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

## Migration Files Checklist

- [ ] 1660000000001-CreateUsersTable.ts
- [ ] 1660000000002-CreateOrganizationsTable.ts
- [ ] 1660000000002-CreateOrganizationsTable_Updated.ts
- [ ] 1660000000003-CreateTeamsTable.ts
- [ ] 1660000000003-CreateTeamsTable_Updated.ts
- [ ] 1660000000004-CreateRolesTable.ts
- [ ] 1660000000004-CreateRolesTable_Updated.ts
- [ ] 1660000000005-CreatePermissionsTable.ts
- [ ] 1660000000005-CreatePermissionsTable_Updated.ts
- [ ] 1660000000006-CreateUserRolesTable.ts
- [ ] 1660000000006-CreateUserRolesTable_Updated.ts
- [ ] 1660000000007-CreateRolePermissionsTable.ts
- [ ] 1660000000007-CreateRolePermissionsTable_Updated.ts
- [ ] 1660000000008-CreateApiKeysTable.ts
- [ ] 1660000000008-CreateApiKeysTable_Updated.ts
- [ ] 1660000000009-CreateConnectedAccountsTable.ts
- [ ] 1660000000009-CreateConnectedAccountsTable_Updated.ts
- [ ] 1660000000010-CreateActivityLogsTable.ts
- [ ] 1660000000010-CreateActivityLogsTable_Updated.ts
- [ ] 1660000000011-CreateAuditLogsTable.ts
- [ ] 1660000000011-CreateAuditLogsTable_Updated.ts
- [ ] 1660000000012-CreateNotificationsTable.ts
- [ ] 1660000000012-CreateNotificationsTable_Updated.ts
- [ ] 1660000000013-CreateDomainsTable.ts
- [ ] 1660000000013-CreateDomainsTable_Updated.ts
- [ ] 1660000000014-CreateCampaignsTable.ts
- [ ] 1660000000014-CreateCampaignsTable_Updated.ts
- [ ] 1660000000015-CreateTemplatesTable.ts
- [ ] 1660000000016-CreateSubscriptionsTable.ts
- [ ] 1660000000017-CreatePaymentsTable.ts
- [ ] 1660000000018-CreateLeadsTable.ts
- [ ] 1660000000019-CreateIntegrationsTable.ts
- [ ] 1660000000020-CreateWebhooksTable.ts
- [ ] 1660000000021-CreateReportsTable.ts
- [ ] 1660000000022-CreateEmailTrackingTable.ts
- [ ] 1660000000023-CreateSupportTicketsTable.ts
- [ ] 1660000000024-CreateAttachmentsTable.ts
- [ ] 1660000000025-CreateEmailsTable.ts
- [ ] 1660000000026-CreateSettingsTable.ts
- [ ] 1660000000027-CreateProjectsTable.ts
- [ ] 1660000000028-CreateAnalyticsTable.ts
- [ ] 1660000000029-CreateNotificationsPreferencesTable.ts
- [ ] 1660000000030-CreateLogsTable.ts
- [ ] 1660000000031-CreateFileStorageTable.ts
- [ ] 1660000000032-CreateTagsTable.ts
- [ ] 1660000000033-CreateEmailTemplatesTable.ts
- [ ] 1660000000034-CreateNotificationsLogsTable.ts
- [ ] 1660000000035-CreateAuditTrailTable.ts
- [ ] 1660000000036-CreateMultiTenancyTable.ts
- [ ] 1660000000037-CreateRateLimitsTable.ts
- [ ] 1660000000038-CreateSSOProvidersTable.ts
- [ ] 1660000000039-CreateOAuthTokensTable.ts
- [ ] 1660000000040-CreateFeedbackTable.ts
- [ ] 1660000000041-CreateBillingHistoryTable.ts
- [ ] 1660000000042-CreateAuditEventsTable.ts
- [ ] 1660000000043-CreateAPIUsageTable.ts
- [ ] 1660000000044-CreateBackupTable.ts
- [ ] 1660000000045-CreateNotificationsChannelsTable.ts
- [ ] 1660000000046-CreateEmailDeliveriesTable.ts
- [ ] 1660000000047-CreateAPIKeysUsageTracking.ts
- [ ] 1660000000048-CreateSessionTable.ts

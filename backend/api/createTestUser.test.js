const createTestUser = require('./createTestUser');

describe('createTestUser', () => {
  it('should create a test user successfully', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    await createTestUser();
    expect(consoleSpy).toHaveBeenCalledWith('Test user created successfully.');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Email: barclaybrandon@hotmail.com'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Password:'));
    consoleSpy.mockRestore();
  });

  it('should handle errors when creating a test user', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');
    const mockSupabase = {
      auth: {
        admin: {
          createUser: jest.fn().mockRejectedValue(new Error('Test error'))
        }
      }
    };
    jest.mock('@supabase/supabase-js', () => ({
      createClient: () => mockSupabase
    }));

    await createTestUser();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating test user:', 'Test error');
    consoleErrorSpy.mockRestore();
  });
});

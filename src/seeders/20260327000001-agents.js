'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('agents', [
      {
        full_name: 'Admin User',
        email: 'admin@realestate.com',
        phone: '0400000001',
        license_number: 'LIC-ADMIN-001',
        is_admin: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        full_name: 'Alice Smith',
        email: 'alice@realestate.com',
        phone: '0400000002',
        license_number: 'LIC-001',
        is_admin: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        full_name: 'Bob Jones',
        email: 'bob@realestate.com',
        phone: '0400000003',
        license_number: 'LIC-002',
        is_admin: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('agents', null, {});
  },
};

const resourceConfigs = {
  owners: {
    table: 'owner',
    id: 'owner_id',
    fields: ['full_name', 'phone', 'email', 'address', 'license_number', 'license_status'],
  },
  officers: {
    table: 'officer',
    id: 'officer_id',
    fields: ['name', 'badge_number', 'assigned_area'],
  },
  vehicles: {
    table: 'vehicle',
    id: 'vehicle_id',
    fields: ['registration_number', 'owner_id', 'vehicle_type', 'model', 'color', 'is_blacklisted'],
  },
  'violation-types': {
    table: 'violation_type',
    id: 'violation_type_id',
    fields: ['violation_name', 'base_fine'],
  },
  violations: {
    table: 'violation',
    id: 'violation_id',
    fields: ['vehicle_id', 'officer_id', 'violation_type_id', 'violation_date', 'location', 'status'],
  },
  fines: {
    table: 'fine',
    id: 'fine_id',
    fields: ['violation_id', 'amount', 'issued_date', 'due_date'],
  },
  payments: {
    table: 'payment',
    id: 'payment_id',
    fields: ['fine_id', 'amount_paid', 'payment_date', 'payment_method'],
  },
  blacklist: {
    table: 'blacklist',
    id: 'blacklist_id',
    fields: ['vehicle_id', 'reason', 'blacklisted_date'],
  },
};

module.exports = resourceConfigs;

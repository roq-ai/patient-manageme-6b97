interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
  ownerAbilities: string[];
  customerAbilities: string[];
  getQuoteUrl: string;
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Administrator'],
  customerRoles: ['Customer'],
  tenantRoles: ['Administrator', 'Doctor', 'Nurse'],
  tenantName: 'Hospital',
  applicationName: 'Patient Management Application',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
  customerAbilities: [
    'Manage personal user information',
    'View doctor and nurse details',
    'Book appointments',
    'View personal appointment details',
  ],
  ownerAbilities: [
    'Manage user information',
    'Manage hospital information',
    'Manage patient records',
    'Manage appointments',
  ],
  getQuoteUrl: 'https://app.roq.ai/proposal/7ebeadc7-c122-4eac-9fe3-ed225f002a44',
};

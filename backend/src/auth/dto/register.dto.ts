export class RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  companyName: string;
  companySlug: string;
  phoneNumber?: string;
  modules?: string[]; // Modules à activer (par défaut LANDING_PAGE)
}

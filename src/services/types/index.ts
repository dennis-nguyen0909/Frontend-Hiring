export interface LoginData {
    username: string;
    password: string;
  }
  
  export interface RegisterData {
    full_name: string;
    email: string;
    password: string;
    role:string;
    username?:string;
    company_name?:string;
    website?:string;
    location?:string;
    description?:string;
  }
  

export interface VerifyCode {
    id:string;
    code_id:string;
}

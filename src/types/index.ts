export interface IBackendRes<T> {
    error?:string | string[];
    message:string;
    statusCode:number | string;
    data?:T;
  }
  
  export interface ILogin {
    user:{
      user_id:string;
      name:string;
      email:string;
    }
    access_token:string;
  }

  export type Meta = {
    count: number,
    current_page: number,
    per_page: number,
    total: number,
    total_pages: number
  }

  export interface SkillEmployerFormData {
    user_id: string
    name: string
    description?: string;
  }
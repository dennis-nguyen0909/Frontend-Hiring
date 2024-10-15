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
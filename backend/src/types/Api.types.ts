export interface ApiSuccess<T> {
   
    statusCode: number;
    data?: T;
    message: string;

}

export interface ApiFailure {
    
    statusCode: number;
    message: string;
    errors?: unknown;
    stack?:string 
}
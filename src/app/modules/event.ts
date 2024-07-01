export interface IEvent {
    Id:string; 
    Title : string; 
    isOffline: boolean; 
    City: string;
    Address: string;
    isCertificateProvided: boolean;
    isPaid: boolean;
    Tech:string;
    Date: Date;
    Logo:string;
    ShortDescription:string;
    Description?:string; 
}



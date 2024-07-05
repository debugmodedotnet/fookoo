export interface IPrevEvents {
    Date: Date;
    Day: number;
    Delegates: number;
    Description: string;
    Location: string;
    PhotosLink: string;
    Speakers: number;
    SummaryVideoId: string;
    Talks: number;
    Title: string;
    VideosLink: string;
    SpeakersCollection?: ISpeaker[];
    SponsorsCollection?: ISponsor[];
}

interface ISpeaker {
    Image: string;
    LinkedIn: string;
}

interface ISponsor {
    Image: string;
    Link: string;
}
declare module Model {
    export const enum Confirmation {
        NotSure = 0,
        Yes = 1,
        No = 2,
        NoWay = 3
    }
}

declare module Model {
    interface Member {
        id: number;
        name: string;
        email: string;
        cluster: string;
        confirmed: Model.Confirmation;
    }
    interface Meeting {
        name: string,
        place: string;
        startDate: Date,
        endDate: Date,
        members: Member[],
        summary: MeetingSummary
    }
    interface MeetingSummary {
        totalMembers: number;
        totalConfirmed: number;
        totalRefused: number;
    }
}
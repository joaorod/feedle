import * as mongoose from "mongoose";
require( './db' );

export class Repository {
    
    private static initialState: Model.Meeting =
    {
        name: "TypeScript - JavaScript that Scales!",
        place: "Farfetch - Lionesa - Stairs",
        startDate: new Date(2017, 5, 26, 16, 30, 0, 0),
        endDate: new Date(2017, 5, 26, 17, 30, 0, 0),
        members: [],
        summary: {
            totalConfirmed: 0,
            totalMembers: 0,
            totalRefused: 0
        }
    };
    
    public async getMeeting() {
        return await Repository.readData();
    }

    public async addMember(member: Model.Member) {
        if (!this.isValidMember(member)) throw "invalid member";
        const meeting = await Repository.readData();
        member.id = Repository.newId(meeting.members);
        meeting.members.push(member);
        meeting.summary = this.computeSummary(meeting.members);
        await Repository.saveData(meeting);
        return member.id;
    }

    public async updateMember(member: Model.Member) {
        if (!this.isValidMember(member)) throw "invalid member";
        const meeting = await Repository.readData();
        meeting.members = meeting.members.map(m => m.id == member.id ? member : m);
        meeting.summary = this.computeSummary(meeting.members);
        await Repository.saveData(meeting);
    }

    public async deleteMember(id: number) {
        const meeting = await Repository.readData();
        meeting.members = meeting.members.filter(m => m.id !== id);
        meeting.summary = this.computeSummary(meeting.members);
        await Repository.saveData(meeting);
    }  
    private isValidMember(member: Model.Member)
    {
        return (!!member) && (!!member.name);
    }
    private static newId(members: Model.Member[])
    {

        let id = members.map(p => p.id)
            .reduce((a, b) => Math.max(a, b), 0);
        console.log(id);
        return (id || 0) + 1;
    }
    private computeSummary(members: Model.Member[]) : Model.MeetingSummary {
        return {
            totalMembers: members.length,
            totalConfirmed: members.filter(p => p.confirmed === Model.Confirmation.Yes).length,
            totalRefused: members.filter(p => p.confirmed === Model.Confirmation.No
                                           || p.confirmed === Model.Confirmation.NoWay).length,
        };
    }

    private static readData(): Promise<Model.Meeting> {
        return new Promise((res, rej) => {
            mongoose.model('Meeting').find((dberr, dbres) =>
            {
                if (dberr) { 
                   rej(dberr);
                }
                else {
                    var rv = Repository.initialState;
                    if (dbres.length > 0)
                    {
                        rv = (dbres[0] as any).data;
                    }    
                    res(rv);
                }        
            })    
        });
    }

    private static saveData(data: Model.Meeting): Promise<{}> {
        return new Promise((res, rej) => {
            mongoose.model('Meeting')
                .update({ id: 1 }, { id: 1, data },{upsert: true, setDefaultsOnInsert: true}, (err) => {
                if (err)
                    rej(err);
                else
                    res();
            });
        });
    }
}



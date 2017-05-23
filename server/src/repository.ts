import * as mongoose from "mongoose";
require( './db' );

export class Repository {

    //This is static so it will not be stored
    private static meetingBase: Model.Meeting =
    {
        name: "TypeScript - JavaScript that scales!",
        place: "Farfetch - Lionesa - Stairs",
        startDate: Repository.dateToGMT(new Date(2017, 5, 26, 16, 30, 0, 0)),
        endDate: Repository.dateToGMT(new Date(2017, 5, 26, 17, 30, 0, 0)),
        members: [],
        summary: {
            totalConfirmed: 0,
            totalMembers: 0,
            totalRefused: 0
        }
    };
    
    public static dateToGMT(date:Date)
    {
        return new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
    }

    public async getMeeting() {
        var rv = Repository.meetingBase;
        rv.members = await Repository.readMembers();     
        rv.summary = Repository.computeSummary(rv.members);
        return rv;
    }

    public async addMember(member: Model.Member) {
        if (!this.isValidMember(member)) throw "invalid member";
        var id = await Repository.saveMember(member);
        return id;
    }

    public async updateMember(member: Model.Member) {
        if (!this.isValidMember(member)) throw "invalid member";        
        await Repository.saveMember(member);
    }
   
    private isValidMember(member: Model.Member)
    {
        return (!!member) && (!!member.name);
    }
   
    private static computeSummary(members: Model.Member[]) : Model.MeetingSummary {
        return {
            totalMembers: members.length,
            totalConfirmed: members.filter(p => p.confirmed === Model.Confirmation.Yes).length,
            totalRefused: members.filter(p => p.confirmed === Model.Confirmation.No
                                           || p.confirmed === Model.Confirmation.NoWay).length,
        };
    }

    private static readMembers(): Promise<Model.Member[]> {
        return new Promise((res, rej) => {
            mongoose.model('Member')
                .find((dberr, dbres) =>
            {
                if (dberr) { 
                   rej(dberr);
                }
                else {
                    const members = dbres.map(p=>(p as any)) as Model.Member[];
                    res(members);
                }        
            })    
        });
    }

    private static saveMember(member: Model.Member): Promise<{}> {
        if (!member.id)
        {
            member.id = new mongoose.mongo.ObjectID().toHexString();
        }    
        return new Promise((res, rej) => {
            mongoose.model('Member')
                .update({ id: member.id  },  member ,{upsert: true, setDefaultsOnInsert: true}, (err,doc) => {
                if (err)
                    rej(err);
                else
                {
                    res(member.id)
                }
            });
        });
    }
}



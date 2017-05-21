import * as fs from "fs";
export class Repository {
    private static dataFile: string = 'meeting.json';
    private static initialState: Model.Meeting =
    {
        name: "TypeScript - JavaScript that Scales!",
        place: "Farfetch - Lionesa",
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
        const meeting = await Repository.readData();
        member.id = Repository.newId(meeting.members);
        meeting.members.push(member);
        meeting.summary = this.computeSummary(meeting.members);
        await Repository.saveData(meeting);
        return member.id;
    }

    public async updateMember(member: Model.Member) {
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
            fs.readFile(Repository.dataFile, 'utf8', (err, data) => {
                if (err)
                    if (err.code === "ENOENT") { //File Not found
                        res(Repository.initialState);
                    }
                    else {
                        rej(err);
                    }    
                else
                    res(JSON.parse(data));
            });
        });
    }

    private static saveData(data: Model.Meeting): Promise<{}> {
        return new Promise((res, rej) => {
            fs.writeFile(Repository.dataFile, JSON.stringify(data), { encoding: 'utf8' }, (err) => {
                if (err)
                    rej(err);
                else
                    res();
            });
        });
    }
}



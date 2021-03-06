import * as React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Config } from "./config";
import MemberSummary from './memberSummary';
import MemberList from './memberList';
import MemberForm from './memberForm';
import TsSeparator from './tsSeparator';
const apiBaseUrl = "/api/meeting";

import Game from './game/game';

interface IAppState {
    meeting: Model.Meeting,
    editingMember: Model.Member
}
class App extends React.Component<{}, IAppState> {
    constructor() {
        super();
        this.state = {
            meeting: {
                members: [],
                summary: {}
            },
            editingMember: null
        } as any;
    }

    public render() {
        var meeting = this.state.meeting;
        //FIX this Wrong time Zone!: var dateStr = this.dateToString(meeting.startDate) + "-" + this.dateToString(meeting.endDate) + " GMT";
        //HACK -ignore server data!!
        var dateStr = "Friday, 26th May 2017 16:30-17:30"

        return (
            <div>
                <h1>Event registration</h1>
                <div className="row">
                    <div className="col col-md-6 col-sm-6">
                        <h4>{meeting.name}</h4>
                        <p><i className="fa fa-lg fa-map-marker text-primary" /> {meeting.place}</p>
                        <p><i className="fa fa-lg fa-clock-o text-primary" /> {dateStr} </p>
                    </div>
                    <div className="col col-md-6 col-sm-6">
                        <MemberSummary summary={meeting.summary} />
                    </div>
                </div>
                <div className="row">
                     <div className="col col-md-6 col-sm-6">
                        <MemberList members={meeting.members} editMember={this.editMember.bind(this)} />
                     </div>
                        <div className="col col-md-6 col-sm-6">                    
                        <MemberForm addOrUpdateMember={this.addOrUpdateMember.bind(this)} member={this.state.editingMember} />
                    </div>    
                </div>
                <TsSeparator />

                <Game players={meeting.members} />
                
            </div>
        );
    }

    public componentWillMount() {
        this.reloadAll();
    }
    private editMember(member: Model.Member = null) {
        var newState = {
            ...this.state,
            editingMember: { ...member }
        }
        this.setState(newState);
    }
    private addOrUpdateMember(member: Model.Member) {
        member = { ...member };
        if (member.id) {
            axios.put(apiBaseUrl, member)
                .then((res) => {
                    this.editMember();
                    this.reloadAll();
                    alert("Thank you for updating your data!")
                })
                .catch((err) => {
                    alert(err);
                });
        }
        else {
            axios.post(apiBaseUrl, member)
                .then((res) => {
                    this.editMember();
                    this.reloadAll();
                    alert("Thank you for registering.");
                })
                .catch((err) => {
                    alert(err);
                });
        }
    }

    private reloadAll() {
        return axios.get(apiBaseUrl)
            .then((res) => {
                var newState = {
                    ...this.state
                };
                newState.meeting = res.data as Model.Meeting;
                newState.meeting.startDate = new Date(newState.meeting.startDate);
                newState.meeting.endDate = new Date(newState.meeting.endDate);

                newState.editingMember = null
                this.setState(newState);
            })
            .catch((err) => {
                alert(err);
            });
    }

    private dateToString(dt: Date) {
        return dt && (dt.toLocaleDateString('en-GB') + " " + dt.toLocaleTimeString('en-GB'))
    }
}

export default App;
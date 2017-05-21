import * as React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Config } from "./config";
const apiBaseUrl = "/api/meeting";

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
        var dateStr = this.dateToString(meeting.startDate) + "-" + this.dateToString(meeting.endDate);
        return (
            <div className="container">
                <h3>{meeting.name}</h3>
                <div className="row">
                    <div className="col col-md-8 col-sm-8">
                        <p><i className="fa fa-lg fa-map-marker text-primary" /> {meeting.place}</p>
                        <p><i className="fa fa-lg fa-clock-o text-primary" /> {dateStr} </p>
                    </div>
                    <div className="col col-md-4 col-sm-4">
                        <MemberSumary summary={meeting.summary} />
                    </div>
                </div>

                <MemberList members={meeting.members} editMember={this.editMember.bind(this)} />

                <MemberForm addOrUpdateMember={this.addOrUpdateMember.bind(this)} member={this.state.editingMember} />

            </div>
        );
    }

    protected componentWillMount() {
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
                    alert("Successfully updated!")
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
                    alert("Successfully added with Id:" + res.data);
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

class MemberList extends React.Component<{ members: Model.Member[], editMember: (m: Model.Member) => any }, any>
{
    public render() {
        var items = this.props.members.map(p => (<MemberItem key={p.id} member={p} editMember={this.props.editMember} />))
        return (
            <div className="container">
                <h4>Members</h4>
                <div className="list-group">
                    {items}
                </div>
            </div>
        );
    }
}

class MemberItem extends React.Component<{ member: Model.Member, editMember: (m: Model.Member) => any }, any>
{
    public render() {
        const member = this.props.member;
        const className = "list-group-item list-group-item-action " +
            (member.confirmed === Model.Confirmation.Yes
                ? "list-group-item-success"
                : member.confirmed === Model.Confirmation.No
                    ? "list-group-item-warning" : "")

        return (
            <a href="#" className={className} >
                <div style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
                    <button className="btn btn-default btn-xs fa fa-pencil" data-toggle="tooltip" title="Edit!"
                        onClick={() => { this.props.editMember(member); }} />
                    <span> <i className="fa fa-lg fa-user-circle-o text-primary" /> {member.name}</span>
                    <button className="btn btn-danger btn-xs fa fa-trash-o pull-right" data-toggle="tooltip" title="Delete" />
                </div>
            </a >

        );
    }
}
class MemberSumary extends React.Component<{ summary: Model.MeetingSummary }, any>
{
    public render() {
        const summary = this.props.summary;
        return (
            <div className="alert alert-info">
                <p>Confirmed : <strong className="pull-right">{summary.totalConfirmed}</strong></p>
                <p>Refused : <strong className="pull-right">{summary.totalRefused}</strong></p>
                <p>Total : <strong className="pull-right">{summary.totalMembers}</strong></p>
            </div>
        );
    }
}
interface IMemberFormProps {
    member: Model.Member;
    addOrUpdateMember: (member: Model.Member) => any
}

class MemberForm extends React.Component<IMemberFormProps, { editingMember: Model.Member }>
{
    constructor() {
        super();
        this.state = ({
            editingMember: this.memberDefault()
        }) as any;
    }

    protected componentWillReceiveProps(newProps: IMemberFormProps) {
        this.setState({ editingMember: { ...newProps.member||this.memberDefault() } });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? (target.checked === true
                ? Model.Confirmation.Yes
                : (target.checked === false
                    ? Model.Confirmation.No
                    : Model.Confirmation.NotSure))
            : target.value;
        const name = target.name;

        var newState = { ...this.state, editingMember: { ...this.state.editingMember } }
        newState.editingMember[name] = value;

        this.setState(newState);
    }
    componentDidMount() {
        const element = ReactDOM.findDOMNode(this);
        const chkbox = element.querySelector('.js-chk') as HTMLInputElement;
        chkbox.indeterminate = this.state.editingMember.confirmed === Model.Confirmation.NotSure;
    }
    public render() {
        var member = this.state.editingMember;
        return (
            <div className="container">
                <h4>Register</h4>
                <div className="panel panel-default">
                    <div className="panel-body">
                        <div className="form-inline">

                            <label className="sr-only" htmlFor="inlineFormInput">Name</label>
                            <input type="text" className="form-control mb-2 mr-sm-2 mb-sm-0" id="inlineFormInput" placeholder="Name"
                                name="name" value={member.name} onChange={this.handleInputChange.bind(this)} />

                            <label className="sr-only" htmlFor="inlineFormInputGroup">Email</label>
                            <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                                <div className="input-group-addon">@</div>
                                <input type="email" className="form-control" id="inlineFormInputGroup" placeholder="Email"
                                    name="email" value={member.email} onChange={this.handleInputChange.bind(this)} />
                            </div>


                            <div className="input-group mb-4 mr-sm-4 mb-sm-0">
                                <label className="form-check-label">
                                    <input type="checkbox" className="form-check-input js-chk" name="confirmed" checked={(this.state.editingMember.confirmed === Model.Confirmation.Yes)} onChange={this.handleInputChange.bind(this)} />
                                    I'll be there
                            </label>
                            </div>
                            <button className="input-group mb-2 mr-sm-2 mb-sm-0 btn btn-primary" onClick={() => { this.props.addOrUpdateMember(this.state.editingMember); }}>Submit</button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    private memberDefault(): Model.Member {
        var rv = {
            id: 0,
            name: '',
            email: '',
            confirmed: Model.Confirmation.NotSure
        };
        return rv;
    }
}


export default App;
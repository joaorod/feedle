import * as React from 'react';

class MemberList extends React.Component<{ members: Model.Member[], editMember: (m: Model.Member) => any }, any>
{
    public render() {
        var items = this.props.members.map(p => (<MemberItem key={p.id} member={p} editMember={this.props.editMember} />))
        return (
            <div>
                <h4>Audience</h4>
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
        
        const className2 = "pull-right fa fa-lg " +
            (member.confirmed === Model.Confirmation.Yes
                ? "fa-check text-success"
                : member.confirmed === Model.Confirmation.No
                    ? "fa-times text-danger" : "fa-question")
        return (
            <div  className={className} >
                <div style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
                    <a href="#register_now" className="btn btn-default btn-xs fa fa-pencil" data-toggle="tooltip" title="Edit!"
                        onClick={() => { this.props.editMember(member); }} />
                    <span> <i className="fa fa-lg fa-user-circle-o text-primary" /> {member.name}</span>
                    <i className={className2}  />
                </div>
            </div >

        );
    }
}
export default MemberList;
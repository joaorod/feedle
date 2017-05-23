import * as React from 'react';


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
        this.setState({ editingMember: { ...newProps.member || this.memberDefault() } });
    }

    resetForm() {
        var newState = { ...this.state, editingMember: this.memberDefault() }
        this.setState(newState);
    }

    changeConfirmed(value: Model.Confirmation) {
        var newState = { ...this.state, editingMember: { ...this.state.editingMember } }
        newState.editingMember.confirmed = value;

        this.setState(newState);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        var newState = { ...this.state, editingMember: { ...this.state.editingMember } }
        newState.editingMember[name] = value;

        this.setState(newState);
    }


    public render() {
        var member = this.state.editingMember;
        var confirmed = this.state.editingMember.confirmed;

        return (
            <div>
                <h4 id="register_now">Register</h4>
                <div className="panel panel-default">
                    <div className="panel-body">
                        <form>
                            <div className="form-group">
                                <input type="text" className="form-control mb-2 mr-sm-2 mb-sm-0" placeholder="name" required
                                    name="name" value={member.name} onChange={this.handleInputChange.bind(this)} />
                            </div>

                            <div className="form-group">
                                <input type="email" className="form-control mb-2 mr-sm-2 mb-sm-0" placeholder="email (optional)"
                                    name="email" value={member.email} onChange={this.handleInputChange.bind(this)} />
                            </div>

                            <div className="form-group">
                                <input type="text" className="form-control mb-2 mr-sm-2 mb-sm-0" placeholder="cluster (optional)"
                                    name="cluster" value={member.cluster} onChange={this.handleInputChange.bind(this)} />
                            </div>

                            <div className="form-group">
                                <div className="btn-group btn-group-justified" data-toggle="buttons">
                                    <div className="btn-group">
                                        <button type="button"
                                            className={"btn " + (confirmed === Model.Confirmation.Yes ? "btn-success active" : "")}
                                            onClick={() => this.changeConfirmed(Model.Confirmation.Yes)}>
                                            <i className="fa fa-lg fa-smile-o" ></i> Confirm
                                        </button>
                                    </div>
                                    <div className="btn-group">
                                        <button type="button"
                                            className={"btn " + ((confirmed == null) || (confirmed === Model.Confirmation.NotSure) ? "btn-warning active" : "")}
                                            onClick={() => this.changeConfirmed(Model.Confirmation.NotSure)}>
                                            <i className="fa fa-lg fa-meh-o" ></i> Maybe
                                        </button>
                                    </div>
                                    <div className="btn-group">
                                        <button type="button"
                                            className={"btn " + (confirmed === Model.Confirmation.No ? "btn-danger active" : "")}
                                            onClick={() => this.changeConfirmed(Model.Confirmation.No)}>
                                            <i className="fa fa-lg fa-frown-o" ></i> Decline
                                        </button>
                                    </div>

                                </div>
                            </div>
                            <hr />
                            <div className="center">
                                <div className="pull-right">
                                    <button type="button" className="btn btn-primary"
                                        onClick={() => { this.props.addOrUpdateMember(this.state.editingMember); }}>
                                        <i className="fa fa-paper-plane" aria-hidden="true"></i> Submit</button>

                                    <button type="button" className="btn btn-default" style={{marginLeft:"20px"}}
                                        onClick={() => { this.resetForm(); }}>
                                        <i className="fa fa-undo" aria-hidden="true"></i> Clear</button>
                                </div>
                            </div>    
                        </form>

                    </div>
                </div>
            </div>
        );
    }

    private memberDefault(): Model.Member {
        var rv = {
            id: null,
            name: '',
            email: '',
            confirmed: Model.Confirmation.Yes,
            cluster:''
        };
        return rv;
    }
}
export default MemberForm;
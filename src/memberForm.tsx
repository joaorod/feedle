import * as React from 'react';
import ReactDOM from 'react-dom';

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

    handleChkChange(value:Model.Confirmation) {
        var newState = { ...this.state, editingMember: { ...this.state.editingMember } }
        newState.editingMember.confirmed = value;

        this.setState(newState);
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
            <div>
                <h4>Register</h4>
                <div className="panel panel-default">
                    <div className="panel-body">
                        <form>
                            <div className="form-group">
                                
                                <input type="text" className="form-control mb-2 mr-sm-2 mb-sm-0" id="inlineFormInput" placeholder="Name"
                                    name="name" value={member.name} onChange={this.handleInputChange.bind(this)} />
                            </div>
                            <div className="form-group">
                                <input type="email" className="form-control" id="inlineFormInputGroup" placeholder="Email (optional)"
                                    name="email" value={member.email} onChange={this.handleInputChange.bind(this)} />
                            </div>
                            
                            <div className="form-group">
                                <label className="form-check-label">Will you be there : </label>
                                <div className="btn-group" data-toggle="buttons">
                                    <label className="btn btn-success active">
                                        <i className="fa fa-smile-o" ></i>
                                        <input type="checkbox" checked={(this.state.editingMember.confirmed === Model.Confirmation.Yes)} onChange={this.handleChkChange.bind(Model.Confirmation.Yes)} /> Yes
                                    </label>
                                    <label className="btn btn-warning">
                                         <i className="fa fa-meh-o" ></i>
                                        <input type="checkbox" checked={(this.state.editingMember.confirmed == null)||(this.state.editingMember.confirmed === Model.Confirmation.NotSure)} onChange={this.handleChkChange.bind(Model.Confirmation.NotSure)}/> Maybe
                                    </label>
                                    <label className="btn btn-danger">
                                        <i className="fa fa-frown-o" ></i>
                                        <input type="checkbox" checked={(this.state.editingMember.confirmed === Model.Confirmation.No)} onChange={this.handleChkChange.bind(Model.Confirmation.No)} /> No
                                    </label>
                                </div>
                            </div>
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input style={{marginLeft:10}} type="checkbox" className="form-check-input js-chk" name="confirmed" checked={(this.state.editingMember.confirmed === Model.Confirmation.Yes)} onChange={this.handleInputChange.bind(this)} />
                                    <span style={{marginLeft:10}}>I'll be there</span>
                                </label>
                            </div>

                            <button type="button" className="input-group mb-2 mr-sm-2 mb-sm-0 btn btn-primary" onClick={() => { this.props.addOrUpdateMember(this.state.editingMember); }}>Submit</button>
                        </form>

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
export default MemberForm;
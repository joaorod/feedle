import * as React from 'react';
class MemberSummary extends React.Component<{ summary: Model.MeetingSummary }, any>
{
    public render() {
        const summary = this.props.summary;
        return (
             <div className="panel">
                <div className="panel-body">
                    <p style={{marginBottom:"5px"}}>Registered : <strong className="pull-right">{summary.totalMembers}</strong></p>
                    <p style={{marginBottom:"5px"}}>Confirmed : <strong className="pull-right">{summary.totalConfirmed}</strong></p>
                    <p style={{marginBottom:"5px"}}>Declined : <strong className="pull-right">{summary.totalRefused}</strong></p>
                </div>
            </div>    
        );
    }
}
export default MemberSummary;
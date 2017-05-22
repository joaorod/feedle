import * as React from 'react';
class MemberSummary extends React.Component<{ summary: Model.MeetingSummary }, any>
{
    public render() {
        const summary = this.props.summary;
        return (
            <div className="alert alert-info">
                <p>Registered : <strong className="pull-right">{summary.totalMembers}</strong></p>
                <p>Confirmed : <strong className="pull-right">{summary.totalConfirmed}</strong></p>
                <p>Declined : <strong className="pull-right">{summary.totalRefused}</strong></p>
            </div>
        );
    }
}
export default MemberSummary;
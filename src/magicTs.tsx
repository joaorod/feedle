import * as React from 'react';

class Winner {
    constructor(public id: string, public name: string) {
    }
}

interface IMagicTsState {
    winners: Winner[],
    candidate: Winner
}
class MagicTs extends React.Component<{ meeting: Model.Meeting }, IMagicTsState>
{
    constructor() {
        super();
        this.state = {
            winners: [],
            candidate: null
        };
    }
    public render() {
        var items = this.state.winners.map(p => (<MagicTsWinner key={p.id} winner={p} />))
        var winners = (items.length !== 0) &&
            (<div>
                <h4>Winners</h4>
                <div className="list-group">
                    {items}
                </div>
            </div>
            );
        var buttonContent = (!this.state.candidate)
            ? (<span> <i className="fa fa-magic fa-lg"></i> do you feel lucky ?</span>)
            : (<span> <i className="fa fa-circle-o-notch fa-spin  fa-fw"></i> {this.state.candidate.name}</span>);

        return (
            <div className="panel">
            <div className="panel-body">
                <button className="btn btn-lg btn-primary center-block" onClick={() => { this.findWinner() }}>
                    {buttonContent}
                </button>

                <div className="center-block">
                    {winners}
                </div>
            </div>
            </div>    
        );
    }
    
    private findWinner(i: number=0) {
        setTimeout(() => {
            var allWinners = this.state.winners;
            var maybeWinner = this.findCandidate();
            if (!!maybeWinner) {
                if (i < 20) {
                    this.findWinner(i + 1);
                }
                else {
                    allWinners.push(maybeWinner);
                    maybeWinner = null;
                }
                this.setState({ ...this.state, winners: allWinners, candidate: maybeWinner })
            }
            else {
                alert('No more candidates!');
            }
        }, (i + 1)*10);
    }

    private findCandidate() {
        var candidates = this.props.meeting.members
            .filter(p => p.confirmed === Model.Confirmation.Yes);
        var winners = this.state.winners;
        if (winners.length >= candidates.length) {
            return null;
        }

        var canMember: Model.Member;
        do {
            const winnerIdx = Math.floor(Math.random() * candidates.length);

            canMember = candidates[winnerIdx];
            let existingWinner = winners.find(p => p.id === canMember.id);
            var duplicated = (existingWinner != null);
        } while (duplicated)

        var candidate = new Winner(canMember.id, canMember.name);

        return candidate;
    }
}

class MagicTsWinner extends React.Component<{ winner: Winner }, any>
{
    public render() {
        const winner = this.props.winner;
        return (
            <div className="alert alert-info" role="alert">
                <h4>
                    <span> <img src="/_theme/img/tshirt.png" width={64} /> {winner.name}</span>
                </h4>
            </div>
        );
    }
}
export default MagicTs;

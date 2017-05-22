import * as React from 'react';

class Winner {
    constructor(public id: number, public name: string) {
    }
}

interface IMagicTsState {
    winners: Winner[],
    maybeWinner: Winner
}
class MagicTs extends React.Component<{ meeting: Model.Meeting }, IMagicTsState>
{
    constructor() {
        super();
        this.state = {
            winners: [],
            maybeWinner: null
        };
    }
    public render() {
        var items = this.state.winners.map(p => (<MagicTsWinner key={p.id} winner={p} />))
        var winners = (items.length !== 0) &&
            (<div>
                <h4>Winners!</h4>
                <div className="list-group">
                    {items}
                </div>
            </div>
            );
        var buttonContent = (!this.state.maybeWinner)
            ? (<span> <i className="fa fa-magic fa-lg"></i> TypeScript is Magic!</span>)
            : (<span> <i className="fa fa-circle-o-notch fa-spin  fa-fw"></i> {this.state.maybeWinner.name}</span>);

        return (
            <div>
                <button className="btn btn-lg btn-info center-block" onClick={() => { this.DoMagic() }}>
                    {buttonContent}
                </button>

                <div className="row">
                    <div className="col col-md-8">
                        <div className="list-group">
                            {winners}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    private DoMagic() {
        this.FindWinner(0);
    }
    private FindWinner(i: number) {
        setTimeout(() => {
            var allWinners = this.state.winners;
            var maybeWinner = this.findWinner();
            if (!!maybeWinner) {
                if (i < 120) {
                    this.FindWinner(i + 1);
                }
                else {
                    allWinners.push(maybeWinner);
                    maybeWinner = null;
                }
                this.setState({ ...this.state, winners: allWinners, maybeWinner: maybeWinner })
            }
            else {
                alert('No more candidates!');
            }
        }, (i + 1));
    }

    private findWinner() {
        var candidates = this.props.meeting.members.filter(p => p.confirmed === Model.Confirmation.Yes);
        var winners = this.state.winners;
        if (winners.length >= candidates.length) {
            return null;
        }

        do {
            var winnerIdx = Math.floor(Math.random() * candidates.length);

            var winMember = candidates[winnerIdx];
            var existingWinner = winners.find(p => p.id === winMember.id);
            var duplicated = (existingWinner != null);
        } while (duplicated)

        var winner = new Winner(winMember.id, winMember.name);

        return winner;
    }
}
class MagicTsWinner extends React.Component<{ winner: Winner }, any>
{
    public render() {
        const winner = this.props.winner;
        return (
            <a href="#" className="list-group-item list-group-item-action list-group-item-success" >
                <div style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
                    <h4>
                        <span> <i className="fa fa-2x fa-trophy text-danger" /> {winner.name}</span>
                    </h4>
                </div>
            </a >

        );
    }
}
export default MagicTs;

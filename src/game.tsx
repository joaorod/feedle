import React, { Component, SFC }  from 'react';

interface Player extends Model.Member
{

}
class GameRun {
    constructor(public player: Player) {
    }
}
const GameRunBox: SFC<{ gameRun: GameRun }> = (props) =>
    <div className="alert alert-info">
        <h4>
            <span>
                <img src="/_theme/img/tshirt.png" width={64} /> {props.gameRun.player.name}
            </span>
        </h4>
    </div>;
    
interface IGameState {
    gameRuns: GameRun[],
    candidate: Player
}
class Game extends Component<{ players: Player[] }, IGameState>
{
    constructor() {
        super();
        this.state = {
            gameRuns: [],
            candidate: null
        };
    }
    public render() {
        var items = this.state.gameRuns.map(p => (<GameRunBox key={p.player.id} gameRun={p} />))
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
            var gameRuns = this.state.gameRuns;
            var candidate = this.findCandidate();
            if (!!candidate) {
                if (i < 20) {
                    this.findWinner(i + 1);
                }
                else {
                    gameRuns.push(new GameRun(candidate));
                    candidate = null;
                }
                this.setState({ ...this.state, winners: gameRuns, candidate: candidate })
            }
            else {
                alert('No more candidates!');
            }
        }, (i + 1)*10);
    }

    private findCandidate() {
        var candidates = this.props.players
                            .filter(p => p.confirmed === Model.Confirmation.Yes);
        var gameRuns = this.state.gameRuns;

        if (gameRuns.length >= candidates.length) {
            return null; //no more candidates!
        }

        var candidate: Player;
        do {
            const rndIdx = Math.floor(Math.random() * candidates.length);

            candidate = candidates[rndIdx];

            var isDuplicated = !!gameRuns.find(p => p.player.id === candidate.id);
        } while (isDuplicated)

        return candidate;
    }
}

export default Game;

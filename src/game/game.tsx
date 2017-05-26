import React, { Component, SFC } from 'react';
import { Player, GameRun, Engine } from './engine';

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

    private findWinner() {
        var engine = new Engine(this.props.players, this.state.gameRuns);
        
        engine.onChanged = (player, isFinal) => {
            if (!!player) {
                const gameRuns = this.state.gameRuns;
                if (isFinal) {
                    gameRuns.push(new GameRun(player));
                }
                this.setState({ ...this.state, gameRuns, candidate: isFinal ? null : player })
            }
            else {
                alert('No more candidates!');
            }
        };

        engine.findWinner();        

    }

}

export default Game;

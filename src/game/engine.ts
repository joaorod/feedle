import React, { Component, SFC } from 'react';

export interface Player extends Model.Member {

}
export class GameRun {
    constructor(public player: Player) {
    }
}

export type onChangedHandler = (player: Player, isFinal?: boolean) => any;

export class Engine {

    private _onChanged: onChangedHandler;
    public get onChanged(): onChangedHandler {
        return this._onChanged;
    }
    public set onChanged(v: onChangedHandler) {
        this._onChanged = v;
    }

    constructor(private players: Player[],
        private gameRuns: GameRun[]) {
    }

    public findWinner() {
        return this.goFindWinner();
    }

    private goFindWinner(i: number = 0) {
        setTimeout(() => {
            var gameRuns = this.gameRuns;
            var candidate = this.findCandidate();
            if (!!candidate) {
                if (i < 30) {
                    this.onChanged(candidate);
                    this.goFindWinner(i + 1);
                }
                else {
                    this.onChanged(candidate, true);
                }
            }
            else {
                this.onChanged(null);
            }
        }, (i + 1) * 10);
    }

    private delay(t: number) {
        return new Promise((resolve) => { setTimeout(resolve, t) });
    }

    private findCandidate() {
        var candidates = this.players
            .filter(p => p.confirmed === Model.Confirmation.Yes);
        var gameRuns = this.gameRuns;

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

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
require('./db');
class Repository {
    getMeeting() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Repository.readData();
        });
    }
    addMember(member) {
        return __awaiter(this, void 0, void 0, function* () {
            const meeting = yield Repository.readData();
            member.id = Repository.newId(meeting.members);
            meeting.members.push(member);
            meeting.summary = this.computeSummary(meeting.members);
            yield Repository.saveData(meeting);
            return member.id;
        });
    }
    updateMember(member) {
        return __awaiter(this, void 0, void 0, function* () {
            const meeting = yield Repository.readData();
            meeting.members = meeting.members.map(m => m.id == member.id ? member : m);
            meeting.summary = this.computeSummary(meeting.members);
            yield Repository.saveData(meeting);
        });
    }
    deleteMember(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const meeting = yield Repository.readData();
            meeting.members = meeting.members.filter(m => m.id !== id);
            meeting.summary = this.computeSummary(meeting.members);
            yield Repository.saveData(meeting);
        });
    }
    static newId(members) {
        let id = members.map(p => p.id)
            .reduce((a, b) => Math.max(a, b), 0);
        console.log(id);
        return (id || 0) + 1;
    }
    computeSummary(members) {
        return {
            totalMembers: members.length,
            totalConfirmed: members.filter(p => p.confirmed === 1).length,
            totalRefused: members.filter(p => p.confirmed === 2
                || p.confirmed === 3).length,
        };
    }
    static readData() {
        return new Promise((res, rej) => {
            mongoose.model('Meeting').find((dberr, dbres) => {
                if (dberr) {
                    rej(dberr);
                }
                else {
                    var rv = Repository.initialState;
                    if (dbres.length > 0) {
                        rv = dbres[0].data;
                    }
                    res(rv);
                }
            });
        });
    }
    static saveData(data) {
        return new Promise((res, rej) => {
            mongoose.model('Meeting')
                .update({ id: 1 }, { id: 1, data }, { upsert: true, setDefaultsOnInsert: true }, (err) => {
                if (err)
                    rej(err);
                else
                    res();
            });
        });
    }
}
Repository.initialState = {
    name: "TypeScript - JavaScript that Scales!",
    place: "Farfetch - Lionesa",
    startDate: new Date(2017, 5, 26, 16, 30, 0, 0),
    endDate: new Date(2017, 5, 26, 17, 30, 0, 0),
    members: [],
    summary: {
        totalConfirmed: 0,
        totalMembers: 0,
        totalRefused: 0
    }
};
exports.Repository = Repository;
//# sourceMappingURL=repository.js.map
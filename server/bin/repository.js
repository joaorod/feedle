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
            var rv = Repository.meetingBase;
            rv.members = yield Repository.readMembers();
            rv.summary = Repository.computeSummary(rv.members);
            return rv;
        });
    }
    addMember(member) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isValidMember(member))
                throw "invalid member";
            return yield Repository.saveMember(member);
        });
    }
    updateMember(member) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isValidMember(member))
                throw "invalid member";
            yield Repository.saveMember(member);
        });
    }
    isValidMember(member) {
        return (!!member) && (!!member.name);
    }
    static computeSummary(members) {
        return {
            totalMembers: members.length,
            totalConfirmed: members.filter(p => p.confirmed === 1).length,
            totalRefused: members.filter(p => p.confirmed === 2
                || p.confirmed === 3).length,
        };
    }
    static readMembers() {
        return new Promise((res, rej) => {
            mongoose.model('Member')
                .find((dberr, dbres) => {
                if (dberr) {
                    rej(dberr);
                }
                else {
                    const members = dbres.map(p => p);
                    res(members);
                }
            });
        });
    }
    static saveMember(member) {
        if (!member.id) {
            member.id = new mongoose.mongo.ObjectID().toHexString();
        }
        return new Promise((res, rej) => {
            mongoose.model('Member')
                .update({ id: member.id }, member, { upsert: true, setDefaultsOnInsert: true }, (err, doc) => {
                if (err)
                    rej(err);
                else {
                    res(member.id);
                }
            });
        });
    }
}
Repository.meetingBase = {
    name: "TypeScript - JavaScript that scales!",
    place: "Farfetch - Lionesa - Stairs",
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